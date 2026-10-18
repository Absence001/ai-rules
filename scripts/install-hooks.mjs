#!/usr/bin/env node
// install-hooks — раскладывает хуки ai-rules по обоим рантаймам.
//
//   node scripts/install-hooks.mjs            установить / обновить
//   node scripts/install-hooks.mjs --remove   убрать хуки ai-rules, остальное не трогая
//   node scripts/install-hooks.mjs --dry-run  показать, что будет записано
//
// Цели: ~/.codex/hooks.json (Codex) и ~/.claude/settings.json (Claude Code).
// Обе — per-machine, в git не уезжают; в репозитории живут только сами скрипты.
//
// Идемпотентность: наши записи узнаются по пути к scripts/ внутри команды.
// При переустановке они вычищаются и пишутся заново, чужие — сохраняются как есть.
// JSON мержится, не перезаписывается: в settings.json лежат mcpServers и плагины.

import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const SCRIPTS = dirname(fileURLToPath(import.meta.url));
const posix = (p) => p.replaceAll("\\", "/");
const script = (name) => posix(join(SCRIPTS, name));

const REMOVE = process.argv.includes("--remove");
const DRY = process.argv.includes("--dry-run");

// Признак «наша» запись: команда ссылается на скрипт из этого каталога.
const MARKER = posix(SCRIPTS);
const isOurs = (entry) => {
  // Пути в уже записанном JSON могут быть с обратными слэшами и экранированием
  // («C:\\Users\\...\\scripts»), наши — с прямыми. Нормализуем обе стороны,
  // иначе переустановка не узнаёт свою же запись и плодит дубль.
  const probe = JSON.stringify(entry || {}).replaceAll("\\\\", "/").replaceAll("\\", "/");
  return probe.includes(MARKER) || probe.includes("ai-rules/scripts");
};

// ── что ставим ───────────────────────────────────────────────────────────────
// Claude Code: exec-форма (command + args) — не идёт через шелл, поэтому
// не ломается на путях Windows с пробелами и кириллицей.
const claudeHooks = {
  PreToolUse: [{
    matcher: "Bash",
    hooks: [{ type: "command", command: "node", args: [join(SCRIPTS, "guard-hook.mjs")], timeout: 10, statusMessage: "guard-hook" }],
  }],
  PostToolUse: [{
    matcher: "*",
    hooks: [{ type: "command", command: "node", args: [join(SCRIPTS, "observe.mjs")], timeout: 10 }],
  }, {
    matcher: "Write|Edit|MultiEdit",
    hooks: [{ type: "command", command: "node", args: [join(SCRIPTS, "anti-slop-check.mjs")], timeout: 10 }],
  }],
  UserPromptSubmit: [{
    hooks: [
      { type: "command", command: "node", args: [join(SCRIPTS, "observe.mjs")], timeout: 10 },
      { type: "command", command: "node", args: [join(SCRIPTS, "routing-hint.mjs")], timeout: 10 },
    ],
  }],
  SessionStart: [{
    hooks: [{ type: "command", command: "node", args: [join(SCRIPTS, "inject-instincts.mjs")], timeout: 10 }],
  }],
  Stop: [{
    hooks: [{ type: "command", command: "node", args: [join(SCRIPTS, "delivery-gate.mjs")], timeout: 10 }],
  }],
};

// Codex: exec-форма не документирована, поэтому строкой команды.
// Прямые слэши — node понимает их на Windows, и это снимает вопрос экранирования.
const codexHooks = {
  PreToolUse: [{
    matcher: ".*",
    hooks: [{ type: "command", command: `node "${script("guard-hook.mjs")}"`, timeout: 10 }],
  }],
  PostToolUse: [{
    matcher: ".*",
    hooks: [
      { type: "command", command: `node "${script("observe.mjs")}"`, timeout: 10 },
      // имя инструмента правки у Codex другое (apply_patch) — фильтр по расширению внутри скрипта
      { type: "command", command: `node "${script("anti-slop-check.mjs")}"`, timeout: 10 },
    ],
  }],
  UserPromptSubmit: [{
    hooks: [
      { type: "command", command: `node "${script("observe.mjs")}"`, timeout: 10 },
      { type: "command", command: `node "${script("routing-hint.mjs")}"`, timeout: 10 },
    ],
  }],
  SessionStart: [{
    matcher: ".*",
    hooks: [{ type: "command", command: `node "${script("inject-instincts.mjs")}"`, timeout: 10 }],
  }],
  Stop: [{
    hooks: [{ type: "command", command: `node "${script("delivery-gate.mjs")}"`, timeout: 10 }],
  }],
};

// ── слияние ──────────────────────────────────────────────────────────────────
function mergeHooks(existing, ours) {
  const out = { ...(existing || {}) };
  const events = new Set([...Object.keys(out), ...Object.keys(ours)]);
  for (const ev of events) {
    const kept = (out[ev] || []).filter((group) => {
      const inner = (group.hooks || []).filter((h) => !isOurs(h));
      if (inner.length === 0) return false;   // группа была целиком наша
      group.hooks = inner;                     // чужие записи в группе сохраняем
      return true;
    });
    const added = REMOVE ? [] : (ours[ev] || []);
    if (kept.length === 0 && added.length === 0) delete out[ev];
    else out[ev] = [...kept, ...added];
  }
  return out;
}

function readJson(path) {
  if (!existsSync(path)) return null;
  try { return JSON.parse(readFileSync(path, "utf8")); } catch {
    console.error(`[install-hooks] ОШИБКА: ${path} — невалидный JSON, не трогаю его`);
    return undefined; // отличаем «сломан» от «нет файла»
  }
}

function writeJson(path, data) {
  if (DRY) { console.log(`\n--- ${path} ---\n${JSON.stringify(data, null, 2)}`); return; }
  mkdirSync(dirname(path), { recursive: true });
  const tmp = `${path}.tmp-${process.pid}`;
  writeFileSync(tmp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  renameSync(tmp, path);
}

let failed = false;

// Claude Code — хуки внутри settings.json рядом с mcpServers и плагинами
{
  const path = join(homedir(), ".claude", "settings.json");
  const cur = readJson(path);
  if (cur === undefined) failed = true;
  else {
    const settings = cur || {};
    const merged = mergeHooks(settings.hooks, claudeHooks);
    if (Object.keys(merged).length === 0) delete settings.hooks;
    else settings.hooks = merged;
    writeJson(path, settings);
    console.log(`[install-hooks] ${REMOVE ? "убрано из" : "OK"} ${path}`);
  }
}

// Codex — отдельный hooks.json
{
  const path = join(homedir(), ".codex", "hooks.json");
  const cur = readJson(path);
  if (cur === undefined) failed = true;
  else {
    const conf = cur || {};
    const merged = mergeHooks(conf.hooks, codexHooks);
    if (Object.keys(merged).length === 0) delete conf.hooks;
    else conf.hooks = merged;
    writeJson(path, conf);
    console.log(`[install-hooks] ${REMOVE ? "убрано из" : "OK"} ${path}`);
    if (!REMOVE && !DRY) {
      console.log("[install-hooks] Codex требует подтвердить хуки: запусти /hooks в Codex CLI.");
      console.log("[install-hooks] Доверие привязано к хешу — после каждого изменения скриптов подтверждать заново.");
    }
  }
}

if (!REMOVE && !DRY) {
  console.log("[install-hooks] Claude Code читает хуки на старте — перезапусти сессию.");
}

process.exit(failed ? 1 : 0);

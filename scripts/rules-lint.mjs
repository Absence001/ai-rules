#!/usr/bin/env node
// rules-lint — линтер для системы правил ai-rules.
// Модель правил заимствована из Ctxlint / agnix / compass (см. RULES-GOVERNANCE.md, Lineage #L1).
// Без внешних зависимостей (boring tech). Запуск: node scripts/rules-lint.mjs [--fix-report]
//
// Проверки:
//   R1 stale-ref     — все ссылки на .md-файлы разрешаются в реальный файл
//   R2 stale-command — команды, ссылающиеся на скрипты/файлы репо, существуют
//   R3 max-lines     — файлы правил > MAX_LINES (bloat)
//   R4 secret        — hardcoded API-ключи/токены в правилах
//   R5 skill-shape   — skills/* в kebab-case, есть SKILL.md с name/description
//   R6 sync-drift    — ~/.codex/AGENTS.md совпадает с источником (AGENTS.md + codex/AGENTS.md)

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const MAX_LINES = 220;          // порог bloat (Ctxlint: >200 «почти всегда bloat»)
const TOKEN_WARN = 6000;        // грубая оценка токенов на файл

// ── сбор файлов ────────────────────────────────────────────────────────────
const IGNORE_DIRS = new Set([".git", "node_modules", "archive", "assets"]);

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (IGNORE_DIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

const allFiles = walk(ROOT);
const allRel = allFiles.map((f) => relative(ROOT, f).replaceAll("\\", "/"));
const relSet = new Set(allRel);
const byBasename = new Map();
for (const r of allRel) {
  const b = basename(r);
  if (!byBasename.has(b)) byBasename.set(b, []);
  byBasename.get(b).push(r);
}

// ── накопление находок ───────────────────────────────────────────────────────
const findings = [];
function add(level, rule, file, msg) {
  findings.push({ level, rule, file, msg });
}

// ── разрешение ссылки на файл (учитывает непоследовательный стиль путей) ──────
// Возвращает: {ok} | {ambiguous:[...]} | {missing:true}
function resolveRef(ref) {
  let r = ref.replace(/^\.\//, "").replace(/^@/, "").replace(/^memory-bank\//, "");
  // 1) точный путь от корня
  if (relSet.has(ref.replace(/^@/, "")) || relSet.has(r)) return { ok: true };
  // 2) под memory-bank/
  if (relSet.has(`memory-bank/${r}`)) return { ok: true };
  // 3) по basename (уникально?)
  const hits = byBasename.get(basename(r)) || [];
  if (hits.length === 1) return { ok: true };
  if (hits.length > 1) {
    // если хвост пути совпадает с одним из hits — считаем ok
    if (hits.some((h) => h.endsWith(r))) return { ok: true };
    return { ambiguous: hits };
  }
  return { missing: true };
}

// ── allowlist: выходные артефакты пайплайна (создаются в целевом проекте,
//    их НЕ должно быть в репо правил — это output, а не правила) ──────────────
const PIPELINE_ARTIFACTS = new Set([
  "brief.md", "srgid.md", "research.md", "ia.md", "design-system.md",
  "screens.md", "prototype.md", "craft-audit.md", "project-state.md",
]);
// известные псевдо-refs (имена токенов и т.п., оканчивающиеся на .md, но не файлы)
const NON_FILE_TOKENS = new Set(["radius.md"]);

function isPipelineArtifact(ref) {
  const b = basename(ref);
  return PIPELINE_ARTIFACTS.has(b) && (ref.startsWith("artifacts/") || ref.startsWith("./artifacts/") || !ref.includes("/"));
}
function isExternalPath(ref) {
  return /^(~\/|RULES_ROOT|%USERPROFILE%|[A-Za-z]:[\\/]|@?ai-rules\/)/.test(ref);
}

// ── источники, которые линтуем (правила, не артефакты проектов) ──────────────
const LINT_TARGETS = allRel.filter(
  (r) =>
    (r.endsWith(".md") &&
      !r.startsWith("artifacts/") &&
      !r.startsWith("templates/") && // шаблоны линтуем мягче (ниже)
      r !== "README.md") ||
    r === "AGENTS.md" ||
    r === "rules-index.md",
);

// множество путей, которые вообще похожи на внутренние ссылки (оканчиваются .md)
const REF_RE = /`([^`]+?\.md)`|\]\(([^)]+?\.md)(?:#[^)]*)?\)|@([A-Za-z0-9/_.:-]+\.md)|\[\[([^\]]+?)\]\]/g;

for (const rel of LINT_TARGETS) {
  const abs = join(ROOT, rel);
  const text = readFileSync(abs, "utf8");
  const lines = text.split(/\r?\n/);

  // R1 stale-ref
  let m;
  REF_RE.lastIndex = 0;
  while ((m = REF_RE.exec(text))) {
    let ref = m[1] || m[2] || m[3] || m[4];
    if (!ref) continue;
    if (m[4] && !ref.endsWith(".md")) ref = `${ref}.md`; // [[wikilink]] → wikilink.md
    if (/^https?:\/\//.test(ref)) continue;               // внешние URL — не наши
    if (ref.includes("<") || ref.includes("*")) continue; // плейсхолдеры вроде <topic>.md
    if (isPipelineArtifact(ref)) continue;                // output пайплайна — не в репо правил
    if (isExternalPath(ref)) continue;                    // ~/.codex, RULES_ROOT — внешнее разрешение
    if (NON_FILE_TOKENS.has(ref)) continue;               // имя токена, не файл
    const res = resolveRef(ref);
    // path-ref со слэшем — строгая ошибка; bare-ref — предупреждение (по природе неоднозначен)
    const missLevel = ref.includes("/") ? "error" : "warn";
    if (res.missing) add(missLevel, "R1 stale-ref", rel, `нет файла для ссылки: ${ref}`);
    else if (res.ambiguous)
      add("warn", "R1 stale-ref", rel, `неоднозначная ссылка ${ref} → ${res.ambiguous.join(", ")}`);
  }

  // R3 max-lines / token-budget
  // max-lines — сигнал bloat ТОЛЬКО в паре с тяжестью по токенам (строки без токенов = не проблема).
  const approxTokens = Math.round(text.length / 4);
  if (lines.length > MAX_LINES && approxTokens > TOKEN_WARN)
    add("warn", "R3 max-lines", rel, `${lines.length} строк / ~${approxTokens} токенов — длинный И тяжёлый, дробить`);
  else if (approxTokens > TOKEN_WARN)
    add("warn", "R3 token-budget", rel, `~${approxTokens} токенов — тяжёлый файл, дробить?`);

  // R4 secret
  const SECRET_RE = /(sk-[A-Za-z0-9]{16,}|AIza[0-9A-Za-z_-]{20,}|ghp_[A-Za-z0-9]{20,}|(?:api[_-]?key|token|secret|password)\s*[:=]\s*['"][^'"]{12,}['"])/gi;
  lines.forEach((ln, i) => {
    if (SECRET_RE.test(ln)) add("error", "R4 secret", `${rel}:${i + 1}`, `возможный секрет в правилах`);
  });
}

// R2 stale-command — команды, ссылающиеся на файлы репо (scripts/*, *.bat)
for (const rel of LINT_TARGETS) {
  const text = readFileSync(join(ROOT, rel), "utf8");
  const CMD_RE = /`[^`]*?(scripts\/[A-Za-z0-9._-]+|[A-Za-z0-9._-]+\.(?:bat|mjs|sh|py))[^`]*?`/g;
  let m;
  while ((m = CMD_RE.exec(text))) {
    const target = m[1];
    const cand = target.includes("/") ? target : null;
    if (cand && !relSet.has(cand) && !existsSync(join(ROOT, cand)))
      add("warn", "R2 stale-command", rel, `команда ссылается на несуществующий файл: ${cand}`);
  }
}

// R5 skill-shape
const skillsDir = join(ROOT, "skills");
if (existsSync(skillsDir)) {
  for (const name of readdirSync(skillsDir)) {
    const p = join(skillsDir, name);
    if (!statSync(p).isDirectory()) continue;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name))
      add("error", "R5 skill-shape", `skills/${name}`, `имя skill не в kebab-case`);
    const skillMd = join(p, "SKILL.md");
    if (!existsSync(skillMd)) {
      add("error", "R5 skill-shape", `skills/${name}`, `нет SKILL.md`);
      continue;
    }
    const fm = readFileSync(skillMd, "utf8").slice(0, 600);
    if (!/name\s*:/.test(fm)) add("error", "R5 skill-shape", `skills/${name}/SKILL.md`, `нет поля name во frontmatter`);
    if (!/description\s*:/.test(fm))
      add("error", "R5 skill-shape", `skills/${name}/SKILL.md`, `нет поля description во frontmatter`);
  }
}

// R6 sync-drift — снимок Codex vs источник (покрытие по строкам: надёжнее substring)
try {
  const codexSnap = join(homedir(), ".codex", "AGENTS.md");
  if (existsSync(codexSnap)) {
    const snapLines = new Set(
      readFileSync(codexSnap, "utf8").replace(/\r\n/g, "\n").split("\n").map((l) => l.trim()).filter((l) => l.length > 8),
    );
    // RULES_ROOT намеренно подставляется машинным путём в sync-rules.bat — не drift
    const isSubstituted = (l) => /RULES_ROOT\s*=|`?~\/ai-rules`?\s*=|домашней директории/.test(l);
    const checkPart = (relPath) => {
      const src = readFileSync(join(ROOT, relPath), "utf8").replace(/\r\n/g, "\n").split("\n").map((l) => l.trim());
      const meaningful = src.filter((l) => l.length > 8 && !isSubstituted(l));
      const missing = meaningful.filter((l) => !snapLines.has(l));
      if (missing.length > 2) { // небольшой буфер на склейки echo в .bat; выше — реальный drift
        add("error", "R6 sync-drift", "~/.codex/AGENTS.md",
          `снимок отстал от ${relPath}: ${missing.length} строк источника отсутствуют — запусти sync-rules.bat`);
      }
    };
    checkPart("AGENTS.md");
    checkPart("codex/AGENTS.md");
  } else {
    add("warn", "R6 sync-drift", "~/.codex/AGENTS.md", `снимок Codex не найден — sync-rules.bat не запускался?`);
  }
} catch (e) {
  add("warn", "R6 sync-drift", "~/.codex/AGENTS.md", `не удалось проверить: ${e.message}`);
}

// ── отчёт ────────────────────────────────────────────────────────────────────
const errors = findings.filter((f) => f.level === "error");
const warns = findings.filter((f) => f.level === "warn");

const order = { error: 0, warn: 1 };
findings.sort((a, b) => order[a.level] - order[b.level] || a.rule.localeCompare(b.rule));

if (findings.length === 0) {
  console.log("rules-lint: чисто ✓  (0 ошибок, 0 предупреждений)");
} else {
  for (const f of findings) {
    const tag = f.level === "error" ? "ERR " : "warn";
    console.log(`  [${tag}] ${f.rule.padEnd(16)} ${f.file}\n         ${f.msg}`);
  }
  console.log(`\nrules-lint: ${errors.length} ошибок, ${warns.length} предупреждений (просканировано ${LINT_TARGETS.length} файлов правил)`);
}

process.exit(errors.length > 0 ? 1 : 0);

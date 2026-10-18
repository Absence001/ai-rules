import { test, before } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmp, runHook, runCli, context } from "./helpers.mjs";

const DATA = tmp("ai-rules-learn-");
const PROJ = tmp("ai-rules-proj-"); // не git-репозиторий → scope global
const ENV = { AI_RULES_LEARNING_DIR: DATA };

let lib;
before(async () => {
  process.env.AI_RULES_LEARNING_DIR = DATA;
  lib = await import("../lib/learning.mjs");
});

// ── библиотека ───────────────────────────────────────────────────────────────

test("инстинкт: serialize → parse без потерь, включая значения с двоеточием", () => {
  const meta = { id: "x", trigger: "когда: нужен компонент", action: "проверить DS", domain: "design-system", confidence: 0.7, scope: "project" };
  const parsed = lib.parseInstinct(lib.serializeInstinct(meta, "## Evidence\n\n- раз"));
  assert.equal(parsed.meta.trigger, "когда: нужен компонент");
  assert.equal(parsed.meta.confidence, 0.7);
  assert.match(parsed.body, /Evidence/);
});

test("затухание: −0.1 за каждые 60 дней молчания, не ниже нуля", () => {
  const now = Date.parse("2026-10-18T00:00:00Z");
  assert.equal(lib.decayed({ confidence: 0.8, updated: "2026-10-18" }, now), 0.8);
  assert.equal(lib.decayed({ confidence: 0.8, updated: "2026-06-10" }, now), 0.6); // 130 дней → 2 шага
  assert.equal(lib.decayed({ confidence: 0.1, updated: "2025-01-01" }, now), 0);
});

test("extractFiles: пути из полей Claude и из патча Codex", () => {
  assert.deepEqual(lib.extractFiles({ file_path: "a.tsx" }), ["a.tsx"]);
  assert.deepEqual(lib.extractFiles({ edits: [{ file_path: "b.css" }] }), ["b.css"]);
  const patch = "*** Begin Patch\n*** Update File: src/Card.tsx\n@@\n-x\n+y\n*** Add File: artifacts/ia.md\n+hi\n*** End Patch";
  assert.deepEqual(lib.extractFiles({ input: patch }).sort(), ["artifacts/ia.md", "src/Card.tsx"]);
  assert.deepEqual(lib.extractFiles({ command: ["apply_patch", patch] }).sort(), ["artifacts/ia.md", "src/Card.tsx"]);
});

test("enforceConfig: по умолчанию всё предупреждает; env перекрывает; ENFORCE=off гасит всё", () => {
  const saved = { ...process.env };
  try {
    delete process.env.AI_RULES_ENFORCE; delete process.env.AI_RULES_DELIVERY_GATE;
    assert.deepEqual(lib.enforceConfig(), { antislop: "warn", routingHint: "warn", deliveryGate: "warn" });
    process.env.AI_RULES_DELIVERY_GATE = "block";
    assert.equal(lib.enforceConfig().deliveryGate, "block");
    process.env.AI_RULES_ENFORCE = "off";
    assert.deepEqual(lib.enforceConfig(), { antislop: "off", routingHint: "off", deliveryGate: "off" });
  } finally { process.env = saved; process.env.AI_RULES_LEARNING_DIR = DATA; }
});

// ── observe ──────────────────────────────────────────────────────────────────

test("observe: stdout всегда пуст (на UserPromptSubmit он ушёл бы в контекст модели)", () => {
  const r = runHook("observe.mjs", { hook_event_name: "UserPromptSubmit", cwd: PROJ, session_id: "s1", prompt: "не надо плодить компонент" }, ENV);
  assert.equal(r.status, 0);
  assert.equal(r.stdout, "");
});

test("observe: патч Codex — файлы записаны, а код патча в наблюдения не попадает", () => {
  const patch = "*** Begin Patch\n*** Update File: src/Secret.tsx\n+const token = 'SECRET_CODE_LINE'\n*** End Patch";
  runHook("observe.mjs", { hook_event_name: "PostToolUse", cwd: PROJ, session_id: "s1", tool_name: "apply_patch", tool_input: { command: ["apply_patch", patch] } }, ENV);
  const obs = readFileSync(join(DATA, "global", "observations.jsonl"), "utf8");
  assert.match(obs, /src\/Secret\.tsx/);
  assert.doesNotMatch(obs, /SECRET_CODE_LINE/);
});

// ── инстинкты: CLI + инжект ──────────────────────────────────────────────────

test("инстинкт растёт подтверждениями, инжектится от 0.7, гаснет от опровержения", () => {
  const add = ["add", "--id", "reuse-first", "--trigger", "когда нужен компонент", "--action", "сначала проверить DS", "--domain", "design-system", "--scope", "global"];
  assert.equal(runCli("instincts.mjs", add, ENV, PROJ).status, 0);
  const inject = () => context(runHook("inject-instincts.mjs", { hook_event_name: "SessionStart", cwd: PROJ }, ENV).stdout);

  assert.equal(inject(), "", "0.3 — ниже порога, не инжектится");
  for (let i = 0; i < 4; i++) runCli("instincts.mjs", ["reinforce", "reuse-first"], ENV, PROJ);
  assert.match(inject(), /сначала проверить DS/, "0.7 — инжектится");
  // вне git-репо каталоги «проекта» и global совпадают — инстинкт не должен удваиваться
  assert.equal(inject().split("сначала проверить DS").length - 1, 1, "инжектится ровно один раз");

  runCli("instincts.mjs", ["correct", "reuse-first"], ENV, PROJ);
  assert.equal(inject(), "", "после опровержения 0.4 — снова ниже порога");
});

test("ставший правилом инстинкт больше не инжектится", () => {
  for (let i = 0; i < 6; i++) runCli("instincts.mjs", ["reinforce", "reuse-first"], ENV, PROJ);
  const draft = runCli("instincts.mjs", ["draft-rule", "reuse-first"], ENV, PROJ);
  assert.match(draft.stdout, /design-system-core\.md/);
  assert.match(draft.stdout, /сначала проверить DS/);

  const bad = runCli("instincts.mjs", ["mark-promoted", "reuse-first", "memory-bank/нет-такого.md"], ENV, PROJ);
  assert.notEqual(bad.status, 0, "несуществующий файл правил отклоняется");

  const ok = runCli("instincts.mjs", ["mark-promoted", "reuse-first", "memory-bank/design-system/design-system-core.md"], ENV, PROJ);
  assert.equal(ok.status, 0);
  assert.equal(context(runHook("inject-instincts.mjs", { hook_event_name: "SessionStart", cwd: PROJ }, ENV).stdout), "");
});

test("неизвестный домен отклоняется", () => {
  const r = runCli("instincts.mjs", ["add", "--id", "x", "--trigger", "t", "--action", "a", "--domain", "code-style"], ENV, PROJ);
  assert.notEqual(r.status, 0);
});

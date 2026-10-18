// Ф3: anti-slop-check, routing-hint, delivery-gate.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmp, runHook, context, ROOT } from "./helpers.mjs";
import { detect } from "../anti-slop-check.mjs";
import { parseIndex, match } from "../routing-hint.mjs";
import { evaluate } from "../delivery-gate.mjs";

const DATA = tmp("ai-rules-enf-");
const ENV = { AI_RULES_LEARNING_DIR: DATA };
const ids = (css) => detect(css).map((h) => h.id).sort();

// ── anti-slop: сигналы ───────────────────────────────────────────────────────

test("anti-slop ловит признаки из anti-slop-audit.md", () => {
  assert.ok(ids(".a{transition: all 300ms}").includes("transition-all"));
  assert.ok(ids(".a{transition: width 200ms}").includes("animate-size"));
  assert.ok(ids(".a{transform: scale(0)}").includes("scale-zero"));
  assert.ok(ids(".a{color:#000}").includes("pure-black"));
  assert.ok(ids('<p class="text-black">').includes("pure-black"));
  assert.ok(ids(".a{transition: transform 200ms ease-in}").includes("ease-in"));
  assert.ok(ids("<h1>Lorem ipsum</h1>").includes("placeholder-content"));
  assert.ok(ids("<button>Submit</button>").includes("generic-cta"));
  assert.ok(ids(".a{outline:none}").includes("outline-none"));
});

// Регрессия #L7: правила, которые первоисточники прямо рекомендуют, ругаться не должны.
test("anti-slop НЕ ругается на то, что рекомендуют MIFB и Эмиль", () => {
  assert.ok(!ids('<img class="outline outline-1 -outline-offset-1 outline-black/10">').includes("pure-black"), "обводка картинки");
  assert.ok(!ids('<div class="border border-black/10">').includes("pure-black"), "прозрачная рамка");
  assert.ok(!ids(".a{outline: 1px solid oklch(0 0 0 / 0.1)}").includes("pure-black"));
  assert.ok(!ids(".a{box-shadow: 0 0 0 1px #0000001a}").includes("pure-black"), "8-значный hex с альфой");
  assert.ok(!ids(".a{transition: transform 300ms ease-in-out}").includes("ease-in"), "ease-in-out законен");
  assert.ok(!ids(".a{transform: scale(0.95)}").includes("scale-zero"));
  assert.ok(!ids(".a{outline:none} .a:focus-visible{outline:2px solid}").includes("outline-none"), "есть замена");
});

test("reduced motion: смена цвета не требует обработки, перемещение — требует", () => {
  assert.ok(!ids(".row:hover{background-color:red; transition: background-color 100ms ease-out}").includes("reduced-motion"));
  assert.ok(ids(".a{transition: transform 200ms ease-out}").includes("reduced-motion"));
  assert.ok(!ids(".a{transition: transform 200ms ease-out} @media (prefers-reduced-motion: reduce){.a{transition:none}}").includes("reduced-motion"));
});

test("anti-slop как хук: предупреждает один раз на файл и сигнал за сессию", () => {
  const dir = tmp("ai-rules-ui-");
  writeFileSync(join(dir, "Card.css"), ".card{transition: all 300ms}");
  const input = { hook_event_name: "PostToolUse", cwd: dir, session_id: "s1", tool_name: "Edit", tool_input: { file_path: "Card.css" } };
  assert.match(context(runHook("anti-slop-check.mjs", input, ENV).stdout), /transition: all/);
  assert.equal(runHook("anti-slop-check.mjs", input, ENV).stdout, "", "повтор не тратит токены");
});

test("anti-slop молчит на не-фронтенд файлах и при AI_RULES_ANTISLOP=off", () => {
  const dir = tmp("ai-rules-ui-");
  writeFileSync(join(dir, "a.css"), ".a{transition: all 1s}");
  const base = { hook_event_name: "PostToolUse", cwd: dir, session_id: "s2", tool_name: "Edit" };
  assert.equal(runHook("anti-slop-check.mjs", { ...base, tool_input: { file_path: "notes.md" } }, ENV).stdout, "");
  assert.equal(runHook("anti-slop-check.mjs", { ...base, tool_input: { file_path: "a.css" } }, { ...ENV, AI_RULES_ANTISLOP: "off" }).stdout, "");
});

// ── routing-hint ─────────────────────────────────────────────────────────────

const rows = parseIndex(readFileSync(join(ROOT, "rules-index.md"), "utf8"));
const types = (p) => match(rows, p).map((r) => r.type);

test("routing: таблица rules-index.md разбирается", () => {
  assert.ok(rows.length >= 20, `строк: ${rows.length}`);
});

test("routing: тип задачи определяется по русским и английским триггерам", () => {
  assert.deepEqual(types("сделай анализ конкурентов для доставки"), ["Research (SRGID)"]);
  assert.deepEqual(types("почини баг, не работает после деплоя"), ["Bug / code diagnostics"]);
  assert.deepEqual(types("надо собрать токены и компоненты дизайн-системы").slice(0, 1), ["Design system / tokens"]);
  assert.ok(types("анимация модалки дёргается").includes("Движение / анимация"));
});

test("routing: молчит на болтовне", () => {
  assert.deepEqual(types("привет, как дела у тебя сегодня"), []);
});

test("routing как хук: явный вызов скилла и повтор за сессию — тишина", () => {
  const ask = (prompt, session = "r1") => runHook("routing-hint.mjs", { hook_event_name: "UserPromptSubmit", session_id: session, prompt }, ENV).stdout;
  assert.match(context(ask("сделай анализ конкурентов для доставки")), /Research/);
  assert.equal(ask("ещё анализ конкурентов, теперь по ценам"), "", "тот же тип в той же сессии");
  assert.equal(ask("$srgid-research анализ конкурентов", "r2"), "", "явный вызов скилла");
});

// ── delivery-gate ────────────────────────────────────────────────────────────

test("delivery-gate: артефакт изменён без project-state — stale", () => {
  const obs = [{ kind: "tool", session: "s", files: ["C:\\p\\artifacts\\brief.md"] }];
  assert.equal(evaluate(obs, "s").stale, true);
  assert.equal(evaluate([...obs, { kind: "tool", session: "s", target: "artifacts/project-state.md" }], "s").stale, false);
  assert.equal(evaluate(obs, "другая-сессия").stale, false);
});

test("delivery-gate как хук: warn → сообщение, повтор — тишина, block → блок, stop_hook_active — тишина", () => {
  const proj = tmp("ai-rules-pipe-");
  mkdirSync(join(proj, "artifacts"));
  writeFileSync(join(proj, "artifacts", "project-state.md"), "# state");
  const edit = (session) => runHook("observe.mjs", {
    hook_event_name: "PostToolUse", cwd: proj, session_id: session, tool_name: "Edit",
    tool_input: { file_path: join(proj, "artifacts", "ia.md") },
  }, ENV);
  const stop = (session, env = {}, extra = {}) =>
    runHook("delivery-gate.mjs", { hook_event_name: "Stop", cwd: proj, session_id: session, ...extra }, { ...ENV, ...env }).stdout;

  edit("g1");
  assert.match(JSON.parse(stop("g1")).systemMessage, /ia\.md/);
  assert.equal(stop("g1"), "", "по тому же набору файлов второй раз не сообщает");

  edit("g2");
  assert.equal(JSON.parse(stop("g2", { AI_RULES_DELIVERY_GATE: "block" })).decision, "block");
  assert.equal(stop("g3", { AI_RULES_DELIVERY_GATE: "block" }, { stop_hook_active: true }), "", "защита от цикла");
});

test("delivery-gate молчит вне проектов пайплайна", () => {
  const plain = tmp("ai-rules-plain-");
  runHook("observe.mjs", { hook_event_name: "PostToolUse", cwd: plain, session_id: "p1", tool_name: "Edit", tool_input: { file_path: join(plain, "artifacts", "x.md") } }, ENV);
  assert.equal(runHook("delivery-gate.mjs", { hook_event_name: "Stop", cwd: plain, session_id: "p1" }, ENV).stdout, "");
});

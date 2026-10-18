// install-hooks пишет в домашние конфиги — тест подменяет домашний каталог на временный.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmp, runCli } from "./helpers.mjs";

const HOME = tmp("ai-rules-home-");
const ENV = { USERPROFILE: HOME, HOME };
const claudeFile = join(HOME, ".claude", "settings.json");
const codexFile = join(HOME, ".codex", "hooks.json");
const read = (f) => JSON.parse(readFileSync(f, "utf8"));
const count = (f, needle) => JSON.stringify(read(f)).split(needle).length - 1;

mkdirSync(join(HOME, ".claude"));
writeFileSync(claudeFile, JSON.stringify({
  mcpServers: { figma: { command: "figma-mcp" } },
  hooks: { PreToolUse: [{ matcher: "Bash", hooks: [{ type: "command", command: "my-own-hook" }] }] },
}));

test("ставит все хуки в оба рантайма", () => {
  assert.equal(runCli("install-hooks.mjs", [], ENV).status, 0);
  for (const f of [claudeFile, codexFile]) {
    const events = Object.keys(read(f).hooks).sort();
    assert.deepEqual(events, ["PostToolUse", "PreToolUse", "SessionStart", "Stop", "UserPromptSubmit"]);
    for (const s of ["guard-hook", "observe", "inject-instincts", "anti-slop-check", "routing-hint", "delivery-gate"]) {
      assert.ok(count(f, `${s}.mjs`) >= 1, `${s} в ${f}`);
    }
  }
});

test("чужое сохраняется: mcpServers и собственный хук пользователя", () => {
  const s = read(claudeFile);
  assert.equal(s.mcpServers.figma.command, "figma-mcp");
  assert.ok(JSON.stringify(s.hooks).includes("my-own-hook"));
});

test("идемпотентно: повторная установка не плодит дублей", () => {
  runCli("install-hooks.mjs", [], ENV);
  runCli("install-hooks.mjs", [], ENV);
  assert.equal(count(claudeFile, "guard-hook.mjs"), 1);
  assert.equal(count(codexFile, "guard-hook.mjs"), 1);
  assert.equal(count(claudeFile, "observe.mjs"), 2); // PostToolUse + UserPromptSubmit
});

test("--remove убирает только своё", () => {
  assert.equal(runCli("install-hooks.mjs", ["--remove"], ENV).status, 0);
  assert.equal(count(claudeFile, "ai-rules"), 0);
  assert.ok(JSON.stringify(read(claudeFile)).includes("my-own-hook"));
  assert.equal(read(claudeFile).mcpServers.figma.command, "figma-mcp");
});

test("битый JSON не перезаписывается", () => {
  const home2 = tmp("ai-rules-home-");
  mkdirSync(join(home2, ".claude"));
  writeFileSync(join(home2, ".claude", "settings.json"), "{ сломано");
  const r = runCli("install-hooks.mjs", [], { USERPROFILE: home2, HOME: home2 });
  assert.notEqual(r.status, 0);
  assert.equal(readFileSync(join(home2, ".claude", "settings.json"), "utf8"), "{ сломано");
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { runHook } from "./helpers.mjs";

// Опасные строки собираются по частям: тест-файл сам не должен выглядеть как опасная команда.
const R = "r" + "m -rf ";
const RF = "r" + "m -fr ";
const run = (command) => runHook("guard-hook.mjs", { tool_name: "Bash", tool_input: { command } }).status;

const BLOCK = [
  R + "/", R + "/*", R + "~", R + "~/", R + "$HOME",
  R + "/c/", R + "/c/*", RF + "/", R + "--no-preserve-root /",
  "git reset --hard", "git push --force origin main", "git commit --no-verify -m x",
  "git commit --amend", "mkfs.ext4 /dev/sda1", "dd if=/dev/zero of=/dev/sda",
];

// Регрессия #L5: в Git Bash на Windows абсолютный путь начинается с «/» —
// удаление конкретной папки по полному пути блокироваться не должно.
const ALLOW = [
  R + "/c/Users/sfxy3/AppData/Local/Temp/ai-rules-learning-test",
  R + "./build", R + "node_modules", R + "~/projects/old-thing/dist",
  "git push --force-with-lease", "git commit -m 'feat: x'", "git reset --soft HEAD~1",
  "git status --short", "npm run build", "node scripts/instincts.mjs status",
  "mkdir -p /c/Users/sfxy3/ai-rules/skills/distill/agents",
];

for (const c of BLOCK) test(`блокирует: ${c}`, () => assert.equal(run(c), 2));
for (const c of ALLOW) test(`пропускает: ${c}`, () => assert.equal(run(c), 0));

test("рантайм-агностичен: проверяет команду в любом инструменте (Codex)", () => {
  const status = runHook("guard-hook.mjs", { tool_name: "shell", tool_input: { command: "git reset --hard" } }).status;
  assert.equal(status, 2);
});

test("без команды — не мешает", () => {
  assert.equal(runHook("guard-hook.mjs", { tool_name: "Edit", tool_input: { file_path: "a.ts" } }).status, 0);
  assert.equal(runHook("guard-hook.mjs", "не json").status, 0);
});

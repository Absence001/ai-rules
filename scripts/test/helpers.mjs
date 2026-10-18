// Общие помощники тестов. Каждый тест-процесс работает в своём временном каталоге
// данных обучения — реальные наблюдения и инстинкты пользователя не трогаются.

import { execFileSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

export const SCRIPTS = join(dirname(fileURLToPath(import.meta.url)), "..");
export const ROOT = join(SCRIPTS, "..");

export function tmp(prefix = "ai-rules-test-") {
  return mkdtempSync(join(tmpdir(), prefix));
}

// Запустить хук как это делает рантайм: JSON в stdin, смотрим exit code и stdout.
export function runHook(script, input, env = {}) {
  try {
    const stdout = execFileSync("node", [join(SCRIPTS, script)], {
      input: typeof input === "string" ? input : JSON.stringify(input),
      env: { ...process.env, ...env },
      stdio: ["pipe", "pipe", "pipe"],
      encoding: "utf8",
    });
    return { status: 0, stdout, stderr: "" };
  } catch (e) {
    return { status: e.status, stdout: e.stdout || "", stderr: e.stderr || "" };
  }
}

export function runCli(script, args, env = {}, cwd = undefined) {
  try {
    const stdout = execFileSync("node", [join(SCRIPTS, script), ...args], {
      env: { ...process.env, ...env }, cwd, stdio: ["ignore", "pipe", "pipe"], encoding: "utf8",
    });
    return { status: 0, stdout };
  } catch (e) {
    return { status: e.status, stdout: (e.stdout || "") + (e.stderr || "") };
  }
}

export function context(stdout) {
  if (!stdout.trim()) return "";
  return JSON.parse(stdout).hookSpecificOutput?.additionalContext || "";
}

#!/usr/bin/env node
// observe — хук наблюдения за сессией (PostToolUse + UserPromptSubmit).
// Пишет компактные наблюдения в observations.jsonl текущего проекта.
//
// Контракт: ВСЕГДА exit 0 и ВСЕГДА пустой stdout.
// На UserPromptSubmit stdout попадает в контекст модели как developer context,
// поэтому печатать нельзя ничего. Наблюдение не имеет права влиять на сессию.
//
// Приватность: сохраняем промпты и ЦЕЛИ инструментов (путь, голова команды),
// но никогда не содержимое файлов и не вывод инструментов.

import { appendObservation, detectProject, registerProject, readStdin, extractFiles } from "./lib/learning.mjs";

const MAX_PROMPT = 2000;
const MAX_TARGET = 300;

function targetOf(toolName, input) {
  if (!input || typeof input !== "object") return "";
  const t =
    input.file_path || input.path || input.notebook_path ||
    input.command || input.pattern || input.url || "";
  const s = Array.isArray(t) ? t.join(" ") : String(t);
  // Codex может передать патч через command[] — это код, а не цель. Не храним.
  if (s.includes("*** Begin Patch")) return "";
  return s.slice(0, MAX_TARGET);
}

function ok(response) {
  if (response == null) return null;
  if (typeof response === "object") {
    if (typeof response.success === "boolean") return response.success;
    if (response.error || response.is_error) return false;
  }
  return null;
}

try {
  const raw = await readStdin();
  if (!raw.trim()) process.exit(0);

  let input;
  try { input = JSON.parse(raw); } catch { process.exit(0); }

  const event = input.hook_event_name || "";
  const project = detectProject(input.cwd);
  registerProject(project);

  if (event === "UserPromptSubmit") {
    const prompt = String(input.prompt || "").slice(0, MAX_PROMPT);
    if (prompt) {
      appendObservation(project, {
        kind: "prompt",
        session: input.session_id || "",
        text: prompt,
      });
    }
  } else {
    // PostToolUse (и всё остальное, что повесили на этот скрипт)
    const tool = input.tool_name || "";
    if (tool) {
      const files = extractFiles(input.tool_input);
      appendObservation(project, {
        kind: "tool",
        session: input.session_id || "",
        tool,
        // у apply_patch цели нет в полях — берём первый файл из патча
        target: targetOf(tool, input.tool_input) || files[0] || "",
        ...(files.length ? { files } : {}),
        ok: ok(input.tool_response),
      });
    }
  }
} catch {
  // проглатываем всё: наблюдение никогда не ломает рабочую сессию
}

process.exit(0);

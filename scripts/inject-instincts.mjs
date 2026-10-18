#!/usr/bin/env node
// inject-instincts — SessionStart-хук: подмешивает выученные инстинкты в контекст.
//
// Контракт общий для Codex и Claude Code:
//   stdout JSON { hookSpecificOutput: { hookEventName: "SessionStart", additionalContext } }
// Пусто — если инстинктов нет. exit всегда 0.
//
// Инжектим только то, что заслужило доверие: confidence (с учётом затухания) >= 0.7.
// Лимит — чтобы не съедать контекст: это token economy, а не свалка.

import { detectProject, listInstincts, decayed, CONFIDENCE, readStdin } from "./lib/learning.mjs";

const MAX_INJECTED = Number(process.env.AI_RULES_MAX_INSTINCTS || 8);
const THRESHOLD = Number(process.env.AI_RULES_INSTINCT_THRESHOLD || CONFIDENCE.STRONG);

try {
  const raw = await readStdin();
  let input = {};
  try { input = JSON.parse(raw || "{}"); } catch { input = {}; }

  const project = detectProject(input.cwd);
  const ranked = listInstincts(project)
    // ставший правилом инстинкт уже раздаётся через memory-bank — второй раз не платим токенами
    .filter((i) => !i.meta.promoted_to)
    .map((i) => ({ ...i, effective: decayed(i.meta) }))
    .filter((i) => i.effective >= THRESHOLD)
    // проектные вперёд глобальных при равной уверенности: они конкретнее
    .sort((a, b) => (b.effective - a.effective) || (a.scope === "project" ? -1 : 1))
    .slice(0, MAX_INJECTED);

  if (ranked.length === 0) process.exit(0);

  const lines = ranked.map((i) => {
    const m = i.meta;
    const tag = i.scope === "global" ? "global" : "проект";
    return `- **${m.trigger}** → ${m.action}  _(${m.domain}, ${i.effective.toFixed(2)}, ${tag})_`;
  });

  const context = [
    "## Выученные инстинкты",
    "",
    "Правила, выведенные из прошлых сессий этого проекта. Применяй их как правила проекта.",
    "Если инстинкт противоречит явной инструкции пользователя — побеждает пользователь,",
    "и это расхождение само станет материалом для пересмотра инстинкта.",
    "",
    ...lines,
    "",
    `_Источник: цикл обучения ai-rules. Разбор и правка — \`node scripts/instincts.mjs\`._`,
  ].join("\n");

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: context,
    },
  }));
} catch {
  // молча: отсутствие инжекта не должно мешать старту сессии
}

process.exit(0);

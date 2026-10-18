#!/usr/bin/env node
// routing-hint — UserPromptSubmit-хук: превращает rules-index.md из рекомендации в механизм.
//
// До этого token economy держалась на дисциплине модели: «прочитай 1–3 файла по индексу»
// никто не проверял (D3 в artifacts/upgrade-proposal-v3.md). Хук определяет тип задачи по
// триггерам и подсказывает, что читать и что НЕ грузить.
//
// Источник триггеров — сама таблица rules-index.md, читается при каждом запуске.
// Своего списка у хука нет: иначе он разъехался бы с индексом (тот же урок, что #L7).
//
// Режим: только подсказка (additionalContext), никогда не блокирует.
// Тишина по умолчанию: подсказка только при уверенном совпадении и один раз на тип за сессию.
// При ничьей трёх и более типов — молчит: это Layer 3 («спросить»), не дело хука.
//
// Отключить: AI_RULES_ROUTING_HINT=off или AI_RULES_ENFORCE=off.

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  readStdin, enforceConfig, emitContext, loadSessionState, saveSessionState,
} from "./lib/learning.mjs";

const INDEX = join(dirname(fileURLToPath(import.meta.url)), "..", "rules-index.md");
const MIN_PROMPT = 12;

const clean = (s) => s.replace(/\*\*/g, "").replace(/[«»"']/g, "").trim();
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Строки таблицы маршрутизации: | **Тип** | триггеры | intent | читать | артефакты | не читать |
export function parseIndex(text) {
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    if (!/^\|\s*\*\*/.test(line)) continue;
    const cells = line.split("|").map((c) => c.trim());
    // cells[0] — пусто до первой черты
    if (cells.length < 7) continue;
    const type = clean(cells[1]);
    const triggers = cells[2]
      .split(/[,/]/)
      .map((t) => clean(t).toLowerCase())
      .filter((t) => t.length >= 2);
    if (!type || triggers.length === 0) continue;
    rows.push({ type, triggers, read: cells[4], skip: cells[6] });
  }
  return rows;
}

// Совпадение по границам слова. Для однословных кириллических триггеров от 6 букв —
// грубый стемминг (отрезаем 2 последние буквы): «конкуренты» ловит «конкурентов».
function triggerRegex(t) {
  const single = !/\s/.test(t);
  const cyr = /[а-яё]/i.test(t);
  if (single && cyr && t.length >= 6) {
    return new RegExp(`(?<![\\p{L}\\p{N}])${esc(t.slice(0, -2))}\\p{L}*`, "iu");
  }
  return new RegExp(`(?<![\\p{L}\\p{N}])${esc(t)}(?![\\p{L}\\p{N}])`, "iu");
}

export function match(rows, prompt) {
  const scored = rows
    .map((r) => ({ ...r, hits: r.triggers.filter((t) => triggerRegex(t).test(prompt)) }))
    .filter((r) => r.hits.length > 0)
    .sort((a, b) => b.hits.length - a.hits.length);
  if (scored.length === 0) return [];
  const top = scored[0].hits.length;
  const leaders = scored.filter((r) => r.hits.length === top);
  return leaders.length <= 2 ? leaders : []; // 3+ равных — неясно, молчим
}

async function main() {
  if (enforceConfig().routingHint === "off") return;

  const raw = await readStdin();
  let input;
  try { input = JSON.parse(raw || "{}"); } catch { return; }

  const prompt = String(input.prompt || "");
  // явный вызов скилла или команды — маршрут уже выбран пользователем
  if (prompt.length < MIN_PROMPT || /^\s*[/$]/.test(prompt)) return;

  let rows;
  try { rows = parseIndex(readFileSync(INDEX, "utf8")); } catch { return; }

  const state = loadSessionState("routing", input.session_id);
  const seen = new Set(state.entry?.seen || []);
  const hits = match(rows, prompt).filter((r) => !seen.has(r.type));
  if (hits.length === 0) return;

  for (const r of hits) seen.add(r.type);
  saveSessionState(state, input.session_id, { seen: [...seen] });

  const lines = hits.map((r) =>
    `- **${r.type}** (по: ${r.hits.join(", ")}) — читать: ${r.read}. Не грузить: ${r.skip}.`);
  emitContext("UserPromptSubmit", [
    "routing (rules-index.md): похоже на задачу —",
    ...lines,
    "Если тип определён неверно — игнорируй подсказку и следуй запросу.",
  ].join("\n"));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(() => {}).finally(() => process.exit(0));
}

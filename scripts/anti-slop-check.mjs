#!/usr/bin/env node
// anti-slop-check — PostToolUse-хук: детерминированная проверка фронтенд-правки
// на признаки «AI-look» из memory-bank/craft/anti-slop-audit.md.
//
// Модель — ECC scripts/hooks/design-quality-check.js. Отличие: сигналы взяты из НАШЕГО
// anti-slop-audit.md (у ECC — дженерик-набор), и только те, что ловятся надёжно.
// Типографику «на глаз», визуальный ритм и иерархию регуляркой не поймать —
// это остаётся за скиллом craft-audit.
//
// Режим: ТОЛЬКО предупреждает (additionalContext), никогда не блокирует.
// Эвристика на регулярках не имеет права останавливать работу.
// Повтор: одно и то же предупреждение по файлу в сессии не повторяется — это токены.
//
// Отключить: AI_RULES_ANTISLOP=off или AI_RULES_ENFORCE=off.

import { readFileSync, existsSync } from "node:fs";
import { resolve, isAbsolute, join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  readStdin, extractFiles, enforceConfig, emitContext,
  loadSessionState, saveSessionState,
} from "./lib/learning.mjs";

const FRONTEND = /\.(tsx|jsx|css|scss|sass|less|html|vue|svelte|astro)$/i;
const MAX_FILE = 512 * 1024;

// [id, regex, сообщение, раздел anti-slop-audit.md]
// Каждый сигнал — конкретное правило из таблиц, а не вкусовщина.
export const SIGNALS = [
  ["transition-all", /\btransition\s*:\s*all\b|\btransition-all\b/i,
    "`transition: all` — анимирует всё подряд, включая layout; скрытые поломки. Перечисли свойства явно", "Motion"],
  ["animate-size", /\btransition(?:-property)?\s*:[^;{}]*\b(?:width|height|top|left|margin|padding)\b|animate=\{\{[^}]*\b(?:width|height)\s*:/i,
    "Анимация width/height/top/left/margin/padding — пересчёт layout каждый кадр. Надёжно дёшево — transform/opacity", "Motion"],
  // `ease-in`, но не `ease-in-out` (тот законен для движения по экрану)
  ["ease-in", /\bease-in\b(?!-)/,
    "`ease-in` на UI — старт с задержкой ровно тогда, когда пользователь смотрит. Нужен ease-out или кастомная кривая (Эмиль)", "Motion"],
  ["scale-zero", /scale\(\s*0\s*\)|scale:\s*0(?![.\d])|\bscale-0\b/i,
    "Старт с `scale(0)` — объект «телепортируется». Начинай с ~0.95 + opacity", "Motion"],
  ["bounce", /\banimate-bounce\b|\bease-?(?:out-)?(?:elastic|bounce)\b/i,
    "Bounce/elastic без причины — generic-AI-look", "Motion"],
  // Только непрозрачный чёрный: `border-black/10`, `oklch(0 0 0 / .1)`, `#0000001a` — это
  // прозрачные нейтральные слои, которые MIFB прямо рекомендует для обводок и теней.
  ["pure-black", /#000000\b(?![0-9a-f])|#000\b(?![0-9a-f])|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)|\b(?:text|bg|border)-black(?![\w/-])/i,
    "Непрозрачный #000 для текста или поверхности — жёстко. Почти-чёрный из токенов (прозрачные обводки и тени — можно)", "Color"],
  ["ai-gradient", /from-(?:purple|violet|indigo|fuchsia)-\d{2,3}[^"'`]*to-(?:blue|purple|indigo|pink|cyan)-\d{2,3}|linear-gradient\([^)]*(?:purple|violet|#[89a][0-9a-f]{2}[ef][0-9a-f]{2})[^)]*(?:blue|#[0-9a-f]{2}[0-9a-f]{2}[ef][0-9a-f])/i,
    "Дефолтный фиолетово-синий градиент — самый узнаваемый признак AI-look", "Color"],
  ["generic-shadow", /0\s+2px\s+4px\s+rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0?\.1\s*\)/i,
    "Дефолтная тень `0 2px 4px rgba(0,0,0,.1)` — generic. Тени из системы elevation", "Layout"],
  ["placeholder-content", /\blorem ipsum\b|\bjohn doe\b|\bjane doe\b|\bacme(?: inc| corp)?\b/i,
    "Заглушечный контент (Lorem / John Doe / Acme) — экран не закончен", "Content"],
  ["generic-cta", />\s*(?:Submit|OK|Click here|Нажмите здесь)\s*</,
    "Безликий CTA (Submit / OK / Click here) — назови действие: «Сохранить черновик»", "Content"],
  ["outline-none", /\boutline\s*:\s*(?:none|0)\b|\boutline-none\b/i,
    "outline убран — проверь, что есть замена через :focus-visible", "Components"],
  ["small-body", /font-size\s*:\s*(?:1[0-5]|[0-9])px/i,
    "font-size < 16px — если это body text на web, нечитаемо", "Typography"],
];

// Сигналы, которые зависят от отсутствия «лечения» в том же файле.
function suppressed(id, text) {
  if (id === "outline-none") return /focus-visible/i.test(text);
  return false;
}

// Отдельно: ПЕРЕМЕЩЕНИЕ без prefers-reduced-motion.
// Смену цвета и opacity не считаем: при reduced motion их как раз положено оставлять
// («fewer and gentler, not zero» — Эмиль, apple-design, MIFB).
function missingReducedMotion(text) {
  const hasMovement =
    /@keyframes|\banimation\s*:|\bmotion\.\w+|\banimate-(?!none\b)\w+|\btransition-transform\b|\btransition(?:-property)?\s*:[^;{}]*\btransform\b/i.test(text);
  const handled = /prefers-reduced-motion|useReducedMotion|\bmotion-(?:reduce|safe):/i.test(text);
  return hasMovement && !handled;
}

export function detect(text) {
  const hits = [];
  for (const [id, re, msg, section] of SIGNALS) {
    if (re.test(text) && !suppressed(id, text)) hits.push({ id, msg, section });
  }
  if (missingReducedMotion(text)) {
    hits.push({
      id: "reduced-motion",
      msg: "Есть перемещение, но нет `prefers-reduced-motion` в этом файле — проверь, что оно уважено (глобально или здесь): убрать перемещение, оставить opacity и цвет",
      section: "Motion",
    });
  }
  return hits;
}

async function main() {
  if (enforceConfig().antislop === "off") return;

  const raw = await readStdin();
  let input;
  try { input = JSON.parse(raw || "{}"); } catch { return; }

  const cwd = input.cwd || process.cwd();
  const files = extractFiles(input.tool_input).filter((f) => FRONTEND.test(f));
  if (files.length === 0) return;

  const state = loadSessionState("antislop", input.session_id);
  const seen = new Set(state.entry?.seen || []);
  const report = [];

  for (const f of files) {
    const abs = isAbsolute(f) ? f : resolve(join(cwd, f));
    if (!existsSync(abs)) continue;
    let text;
    try { text = readFileSync(abs, "utf8"); } catch { continue; }
    if (text.length > MAX_FILE) continue;

    const fresh = detect(text).filter((h) => !seen.has(`${f}::${h.id}`));
    if (fresh.length === 0) continue;
    for (const h of fresh) seen.add(`${f}::${h.id}`);
    report.push(`**${f}**`, ...fresh.map((h) => `- ${h.msg} _(${h.section})_`));
  }

  if (report.length === 0) return;
  saveSessionState(state, input.session_id, { seen: [...seen] });

  emitContext("PostToolUse", [
    "## anti-slop: признаки AI-look в правке",
    "",
    ...report,
    "",
    "Это эвристика, не вердикт: если решение осознанное — оставь и продолжай.",
    "Правила — `memory-bank/craft/anti-slop-audit.md`. Полный аудит экрана — скилл `craft-audit`.",
  ].join("\n"));
}

// Запуск как хук — только когда скрипт вызван напрямую, а не импортирован тестом.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(() => {}).finally(() => process.exit(0));
}

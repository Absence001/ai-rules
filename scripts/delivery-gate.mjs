#!/usr/bin/env node
// delivery-gate — Stop-хук: артефакты пайплайна изменены, а project-state.md — нет.
//
// Decision Lineage держался на честном слове (D5 в artifacts/upgrade-proposal-v3.md):
// агент правит brief.md / ia.md / screens.md, а «Следующий шаг» и Lineage в
// project-state.md остаются прежними — и следующая сессия поднимает устаревший контекст.
// Модель — ECC skills/delivery-gate; условие переделано: не «тесты прошли»,
// а «артефакты менялись → состояние проекта обновлено».
//
// Срабатывает только в проектах пайплайна (есть artifacts/project-state.md).
// Что менялось в сессии — берёт из наблюдений observe.mjs, поэтому без него слеп.
//
// Режимы (AI_RULES_DELIVERY_GATE или config.json → enforce.deliveryGate):
//   warn  (по умолчанию) — сообщение пользователю, работа не останавливается
//   block — агент получает причину и продолжает, пока не обновит project-state.md
//   off   — выключен
// Повторно по тому же набору файлов не срабатывает. stop_hook_active — защита от цикла.

import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  readStdin, enforceConfig, detectProject, readObservations,
  loadSessionState, saveSessionState,
} from "./lib/learning.mjs";

const norm = (p) => String(p || "").replaceAll("\\", "/");
const STATE_RE = /(?:^|\/)artifacts\/project-state\.md$/i;
const ARTIFACT_RE = /(?:^|\/)artifacts\/[^/]+\.md$/i;

export function evaluate(observations, sessionId) {
  const files = new Set();
  for (const o of observations) {
    if (o.kind !== "tool" || o.session !== sessionId) continue;
    for (const f of (o.files && o.files.length ? o.files : [o.target])) {
      const n = norm(f);
      if (ARTIFACT_RE.test(n)) files.add(n);
    }
  }
  const touchedState = [...files].some((f) => STATE_RE.test(f));
  const artifacts = [...files].filter((f) => !STATE_RE.test(f)).sort();
  return { artifacts, touchedState, stale: artifacts.length > 0 && !touchedState };
}

async function main() {
  const mode = enforceConfig().deliveryGate;
  if (mode === "off") return;

  const raw = await readStdin();
  let input;
  try { input = JSON.parse(raw || "{}"); } catch { return; }
  if (input.stop_hook_active) return; // уже продолжаем из-за хука — не зацикливаемся

  const cwd = input.cwd || process.cwd();
  const project = detectProject(cwd);
  const root = project.root || cwd;
  if (!existsSync(join(root, "artifacts", "project-state.md"))) return;

  const { artifacts, stale } = evaluate(readObservations(project, 5000), input.session_id);
  if (!stale) return;

  const state = loadSessionState("delivery-gate", input.session_id);
  const sig = artifacts.join("|");
  if (state.entry?.sig === sig) return;
  saveSessionState(state, input.session_id, { sig });

  const names = artifacts.map((a) => a.split("/").pop()).join(", ");
  const reason =
    `Изменены артефакты пайплайна (${names}), но artifacts/project-state.md не обновлён. ` +
    "Допиши в Decision Lineage решения этой сессии и обнови «Сейчас идёт» / «Следующий шаг» — " +
    "иначе следующая сессия поднимет устаревший контекст.";

  if (mode === "block") {
    process.stdout.write(JSON.stringify({ decision: "block", reason }));
  } else {
    process.stdout.write(JSON.stringify({ systemMessage: `delivery-gate: ${reason}` }));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(() => {}).finally(() => process.exit(0));
}

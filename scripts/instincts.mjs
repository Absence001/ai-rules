#!/usr/bin/env node
// instincts — CLI управления выученными инстинктами.
//
//   node scripts/instincts.mjs status              показать инстинкты текущего проекта + global
//   node scripts/instincts.mjs observations [N]    последние N наблюдений (по умолчанию 40)
//   node scripts/instincts.mjs add                 добавить/обновить инстинкт (флаги ниже)
//   node scripts/instincts.mjs reinforce <id>      подтвердить: +уверенность
//   node scripts/instincts.mjs correct <id>        опровергнуть: −уверенность
//   node scripts/instincts.mjs promote [id]        проект → global (кандидаты: >=0.9 в 2+ проектах)
//   node scripts/instincts.mjs prune               удалить выдохшиеся (effective <= 0)
//   node scripts/instincts.mjs projects            известные проекты
//   node scripts/instincts.mjs draft-rule <id>     черновик правила для memory-bank (ничего не пишет)
//   node scripts/instincts.mjs mark-promoted <id> <memory-bank/путь.md>
//                                                  отметить, что инстинкт стал правилом —
//                                                  после этого он больше не инжектится
//
// add-флаги: --id --trigger --action --domain --scope=project|global
//
// Инстинкты НИКОГДА не становятся правилами автоматически — промоушен в memory-bank
// делает пользователь через ревью. См. memory-bank/meta/learning-loop.md.

import { existsSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  dataRoot, detectProject, projectDir, listInstincts, writeInstinct,
  readObservations, parseInstinct, decayed, today, DOMAINS, CONFIDENCE,
} from "./lib/learning.mjs";

const [, , cmd = "status", ...rest] = process.argv;
const project = detectProject(process.cwd());
const RULES_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Куда по умолчанию ложится правило каждого домена
const RULE_TARGETS = {
  "research": "discovery/srgid-research-core.md",
  "ia": "ia-flow/ia-rules.md",
  "design-system": "design-system/design-system-core.md",
  "craft": "craft/craft-core.md",
  "figma": "design-system/figma-code-parity.md",
  "frontend": "platforms/frontend-implementation-rules.md",
  "pipeline": "meta/pipeline-orchestration.md",
  "communication": "meta/operating-principles.md",
};

const STOP = new Set(["когда", "если", "нужно", "надо", "сначала", "потом", "чтобы", "этот", "этого", "только", "через", "перед", "после"]);
function significant(text) {
  return [...new Set(text.toLowerCase().split(/[^\p{L}\p{N}-]+/u).filter((w) => w.length >= 5 && !STOP.has(w)))];
}

function flag(name, fallback = "") {
  const hit = rest.find((a) => a.startsWith(`--${name}=`));
  if (hit) return hit.slice(name.length + 3);
  const idx = rest.indexOf(`--${name}`);
  return idx >= 0 && rest[idx + 1] && !rest[idx + 1].startsWith("--") ? rest[idx + 1] : fallback;
}

function bar(v) {
  const n = Math.max(0, Math.min(10, Math.round(v * 10)));
  return "█".repeat(n) + "·".repeat(10 - n);
}

function clamp(v) {
  return Math.max(0, Math.min(1, Math.round(v * 100) / 100));
}

function findById(id) {
  return listInstincts(project).find((i) => i.meta.id === id);
}

function adjust(id, delta, { correction = false } = {}) {
  const hit = findById(id);
  if (!hit) { console.error(`не найден инстинкт: ${id}`); process.exit(1); }
  const m = { ...hit.meta };
  m.confidence = clamp((Number(m.confidence) || 0) + delta);
  m.updated = today();
  if (correction) m.corrections = (Number(m.corrections) || 0) + 1;
  else m.observations = (Number(m.observations) || 0) + 1;
  const body = correction
    ? `${hit.body.trim()}\n- ${today()} — опровергнут пользователем`
    : `${hit.body.trim()}\n- ${today()} — подтверждён`;
  writeInstinct(project, m, body);
  console.log(`${id}: confidence → ${m.confidence.toFixed(2)}`);
}

switch (cmd) {
  case "status": {
    const all = listInstincts(project);
    console.log(`проект: ${project.name} (${project.id})`);
    console.log(`данные: ${dataRoot()}\n`);
    if (all.length === 0) {
      console.log("Инстинктов пока нет. Поработай с включёнными хуками, затем — скилл distill.");
      break;
    }
    for (const scope of ["project", "global"]) {
      const group = all.filter((i) => i.scope === scope);
      if (group.length === 0) continue;
      console.log(`── ${scope} (${group.length}) ──`);
      for (const i of group.sort((a, b) => decayed(b.meta) - decayed(a.meta))) {
        const eff = decayed(i.meta);
        const stale = eff < Number(i.meta.confidence) ? ` ↓с ${Number(i.meta.confidence).toFixed(2)}` : "";
        const promoted = i.meta.promoted_to ? `  → правило: ${i.meta.promoted_to}` : "";
        const live = !i.meta.promoted_to && eff >= CONFIDENCE.STRONG ? "✓" : " ";
        console.log(`${live} ${bar(eff)} ${eff.toFixed(2)}${stale}  ${i.meta.id}  [${i.meta.domain}]${promoted}`);
        console.log(`     ${i.meta.trigger} → ${i.meta.action}`);
      }
      console.log("");
    }
    console.log(`✓ = инжектится в сессию (>= ${CONFIDENCE.STRONG})`);
    break;
  }

  case "observations": {
    const n = Number(rest[0]) || 40;
    const obs = readObservations(project, n);
    if (obs.length === 0) { console.log("наблюдений нет — хуки не подключены или сессий ещё не было"); break; }
    for (const o of obs) {
      if (o.kind === "prompt") console.log(`[${o.ts.slice(0, 16)}] 💬 ${o.text.replace(/\s+/g, " ").slice(0, 160)}`);
      else console.log(`[${o.ts.slice(0, 16)}] 🔧 ${o.tool}${o.ok === false ? " ✗" : ""}  ${o.target}`);
    }
    console.log(`\nвсего показано: ${obs.length}`);
    break;
  }

  case "add": {
    const id = flag("id");
    const trigger = flag("trigger");
    const action = flag("action");
    const domain = flag("domain", "pipeline");
    const scope = flag("scope", "project");
    if (!id || !trigger || !action) {
      console.error("нужны --id, --trigger, --action (опционально --domain, --scope)");
      process.exit(1);
    }
    if (!DOMAINS.includes(domain)) {
      console.error(`--domain должен быть одним из: ${DOMAINS.join(", ")}`);
      process.exit(1);
    }
    const existing = findById(id);
    const meta = {
      id, trigger, action, domain,
      confidence: existing ? clamp((Number(existing.meta.confidence) || 0) + 0.1) : CONFIDENCE.TENTATIVE,
      scope,
      project_id: scope === "global" ? "" : project.id,
      project_name: scope === "global" ? "" : project.name,
      created: existing?.meta.created || today(),
      updated: today(),
      observations: (Number(existing?.meta.observations) || 0) + 1,
      corrections: Number(existing?.meta.corrections) || 0,
    };
    const body = existing
      ? `${existing.body.trim()}\n- ${today()} — наблюдение подтвердило паттерн`
      : `## Evidence\n\n- ${today()} — выведен из наблюдений сессии`;
    const path = writeInstinct(project, meta, body);
    console.log(`${existing ? "обновлён" : "создан"}: ${path}  (confidence ${meta.confidence.toFixed(2)})`);
    break;
  }

  case "reinforce": adjust(rest[0], +0.1); break;
  case "correct":   adjust(rest[0], -0.3, { correction: true }); break;

  case "promote": {
    const id = rest.find((a) => !a.startsWith("--"));
    // кандидат: один и тот же id встречается в 2+ проектах со средней уверенностью >= 0.9
    const projectsRoot = join(dataRoot(), "projects");
    const counts = new Map();
    if (existsSync(projectsRoot)) {
      for (const p of readdirSync(projectsRoot)) {
        const dir = join(projectsRoot, p, "instincts");
        if (!existsSync(dir)) continue;
        for (const f of readdirSync(dir)) {
          if (!f.endsWith(".md")) continue;
          const parsed = parseInstinct(readFileSync(join(dir, f), "utf8"));
          if (!parsed) continue;
          const key = parsed.meta.id;
          const acc = counts.get(key) || { n: 0, sum: 0, sample: parsed };
          acc.n += 1; acc.sum += Number(parsed.meta.confidence) || 0;
          counts.set(key, acc);
        }
      }
    }
    const candidates = [...counts.entries()]
      .filter(([k, v]) => v.n >= 2 && v.sum / v.n >= CONFIDENCE.CERTAIN && (!id || k === id));

    if (candidates.length === 0) {
      console.log("кандидатов нет (нужно: один id в 2+ проектах со средней уверенностью >= 0.9)");
      break;
    }
    for (const [key, v] of candidates) {
      const m = { ...v.sample.meta, scope: "global", project_id: "", project_name: "", updated: today() };
      m.confidence = clamp(v.sum / v.n);
      writeInstinct(project, m, `${v.sample.body.trim()}\n- ${today()} — промоутирован в global (встречен в ${v.n} проектах)`);
      console.log(`→ global: ${key} (${m.confidence.toFixed(2)}, проектов: ${v.n})`);
    }
    console.log("\nСледующий шаг — ревью и перенос в memory-bank/ вручную, если правило того стоит.");
    break;
  }

  case "prune": {
    let n = 0;
    for (const i of listInstincts(project)) {
      if (decayed(i.meta) <= 0) { rmSync(i.path); console.log(`удалён (выдохся): ${i.meta.id}`); n += 1; }
    }
    console.log(n ? `\nудалено: ${n}` : "выдохшихся инстинктов нет");
    break;
  }

  case "projects": {
    const file = join(dataRoot(), "projects.json");
    if (!existsSync(file)) { console.log("проектов пока нет"); break; }
    const reg = JSON.parse(readFileSync(file, "utf8"));
    for (const [id, p] of Object.entries(reg)) {
      const dir = join(dataRoot(), "projects", id, "instincts");
      const count = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".md")).length : 0;
      console.log(`${id}  ${String(count).padStart(3)} инстинктов  ${p.name}  (${p.last_seen})`);
    }
    break;
  }

  case "draft-rule": {
    const id = rest[0];
    const hit = id && findById(id);
    if (!hit) { console.error(`не найден инстинкт: ${id || "(id не указан)"}`); process.exit(1); }
    const m = hit.meta;
    const eff = decayed(m);
    const target = RULE_TARGETS[m.domain] || "meta/operating-principles.md";
    const targetAbs = join(RULES_ROOT, "memory-bank", target);

    console.log(`Инстинкт: ${m.id}  (${m.domain}, уверенность ${eff.toFixed(2)}, scope ${hit.scope})`);
    console.log(`Цель:     memory-bank/${target}\n`);
    if (m.promoted_to) console.log(`⚠ Уже перенесён в ${m.promoted_to}.\n`);
    if (eff < CONFIDENCE.CERTAIN) {
      console.log(`⚠ Уверенность ${eff.toFixed(2)} ниже порога промоушена ${CONFIDENCE.CERTAIN}. Переносить рано.\n`);
    }

    console.log("──── черновик для вставки ────");
    console.log(`- **${m.trigger}** → ${m.action}`);
    console.log(`  *Выведено из сессий: инстинкт \`${m.id}\`, подтверждений ${m.observations || 0}, ` +
      `опровержений ${m.corrections || 0}, ${today()}.*`);
    console.log("──────────────────────────────\n");

    // возможные дубли: строки цели, где встречаются те же значимые слова
    if (existsSync(targetAbs)) {
      const words = significant(`${m.trigger} ${m.action}`);
      const lines = readFileSync(targetAbs, "utf8").split(/\r?\n/);
      const near = lines
        .map((l, i) => ({ i: i + 1, l, n: words.filter((w) => l.toLowerCase().includes(w)).length }))
        .filter((x) => x.n >= 2)
        .sort((a, b) => b.n - a.n)
        .slice(0, 5);
      if (near.length) {
        console.log("Возможно, уже есть похожее правило — сверь перед вставкой:");
        for (const x of near) console.log(`  ${target}:${x.i}  ${x.l.trim().slice(0, 110)}`);
        console.log("");
      }
    }

    console.log("Перед вставкой ответь «да» на все три:");
    console.log("  1. Правило объяснимо без ссылки на историю наблюдений?");
    console.log("  2. Не противоречит первоисточникам (движение и детали — скиллы Эмиля/MIFB, AGENTS.md)?");
    console.log("  3. Это не дубль существующего правила?");
    console.log(`\nПосле вставки: node scripts/instincts.mjs mark-promoted ${m.id} memory-bank/${target}`);
    break;
  }

  case "mark-promoted": {
    const [id, rulePath] = rest;
    const hit = id && findById(id);
    if (!hit || !rulePath) {
      console.error("использование: mark-promoted <id> <memory-bank/путь.md>");
      process.exit(1);
    }
    const rel = rulePath.replaceAll("\\", "/").replace(/^\.?\//, "");
    if (!rel.startsWith("memory-bank/") || !existsSync(join(RULES_ROOT, rel))) {
      console.error(`нет такого файла правил: ${rel} (ожидается путь внутри memory-bank/)`);
      process.exit(1);
    }
    const meta = { ...hit.meta, promoted_to: rel, updated: today() };
    writeInstinct(project, meta, `${hit.body.trim()}\n- ${today()} — перенесён в правило ${rel}`);
    console.log(`${id}: стал правилом в ${rel}. Больше не инжектится — правило раздаётся через sync-rules.bat.`);
    break;
  }

  default:
    console.error(`неизвестная команда: ${cmd}\nдоступно: status, observations, add, reinforce, correct, promote, prune, projects, draft-rule, mark-promoted`);
    process.exit(1);
}

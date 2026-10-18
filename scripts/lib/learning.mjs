// learning.mjs — общая библиотека цикла обучения ai-rules.
// Без внешних зависимостей (boring tech) и без Python: python3 на целевой машине
// — это WindowsApps-stub, который молча ничего не делает (см. RULES-GOVERNANCE #L4).
//
// Модель заимствована из ECC continuous-learning-v2 (инстинкты + confidence + scope),
// переработана: Node вместо bash+python, без фонового демона (он не выживает на
// нативной Windows), домены — под продуктово-дизайнерский пайплайн, а не под код.

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  existsSync, mkdirSync, readFileSync, writeFileSync,
  readdirSync, renameSync, statSync, appendFileSync,
} from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

// ── где живут данные обучения ────────────────────────────────────────────────
// Вне репозитория правил: наблюдения приватны и не версионируются.
export function dataRoot() {
  const override = (process.env.AI_RULES_LEARNING_DIR || "").trim();
  if (override) return override;
  const localAppData = (process.env.LOCALAPPDATA || "").trim();
  if (localAppData) return join(localAppData, "ai-rules-learning");
  const xdg = (process.env.XDG_DATA_HOME || "").trim();
  if (xdg) return join(xdg, "ai-rules-learning");
  return join(homedir(), ".local", "share", "ai-rules-learning");
}

export function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
  return p;
}

// ── определение проекта ──────────────────────────────────────────────────────
// Приоритет: git remote (переносим между машинами) → путь репозитория → global.
export function detectProject(cwd) {
  const dir = cwd && existsSync(cwd) ? cwd : process.cwd();
  const git = (args) => {
    try {
      return execFileSync("git", ["-C", dir, ...args], {
        encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 3000,
      }).trim();
    } catch { return ""; }
  };

  const remote = git(["remote", "get-url", "origin"]);
  const top = git(["rev-parse", "--show-toplevel"]);

  if (!remote && !top) return { id: "global", name: "global", root: "", remote: "" };

  // нормализуем remote: ssh/https, с .git и без — один и тот же проект
  const key = remote
    ? remote.replace(/^git@([^:]+):/, "https://$1/").replace(/\.git$/, "").toLowerCase()
    : top.toLowerCase();

  const id = createHash("sha256").update(key).digest("hex").slice(0, 12);
  const name = (top || key).split(/[\\/]/).filter(Boolean).pop() || "project";
  return { id, name, root: top, remote };
}

export function projectDir(project) {
  return project.id === "global"
    ? ensureDir(join(dataRoot(), "global"))
    : ensureDir(join(dataRoot(), "projects", project.id));
}

// ── реестр проектов (hash → человекочитаемое имя) ────────────────────────────
export function registerProject(project) {
  if (project.id === "global") return;
  const file = join(ensureDir(dataRoot()), "projects.json");
  let reg = {};
  try { reg = JSON.parse(readFileSync(file, "utf8")); } catch { reg = {}; }
  const prev = reg[project.id] || {};
  reg[project.id] = {
    name: project.name,
    root: project.root || prev.root || "",
    remote: project.remote || prev.remote || "",
    first_seen: prev.first_seen || today(),
    last_seen: today(),
  };
  atomicWrite(file, `${JSON.stringify(reg, null, 2)}\n`);
}

// ── наблюдения ───────────────────────────────────────────────────────────────
const MAX_OBS_BYTES = 5 * 1024 * 1024;

export function appendObservation(project, record) {
  const dir = projectDir(project);
  const file = join(dir, "observations.jsonl");
  try {
    if (existsSync(file) && statSync(file).size > MAX_OBS_BYTES) {
      const archive = ensureDir(join(dir, "observations.archive"));
      renameSync(file, join(archive, `observations-${Date.now()}.jsonl`));
    }
    appendFileSync(file, `${JSON.stringify({ ts: new Date().toISOString(), ...record })}\n`, "utf8");
  } catch {
    // наблюдение — вспомогательная функция; она никогда не ломает рабочую сессию
  }
}

export function readObservations(project, limit = 2000) {
  const file = join(projectDir(project), "observations.jsonl");
  if (!existsSync(file)) return [];
  const lines = readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean);
  return lines.slice(-limit).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}

// ── инстинкты ────────────────────────────────────────────────────────────────
// Хранятся как .md с плоским frontmatter: грепаются и правятся руками,
// парсятся без YAML-зависимости.

export const DOMAINS = [
  "research", "ia", "design-system", "craft",
  "figma", "frontend", "pipeline", "communication",
];

export const CONFIDENCE = {
  TENTATIVE: 0.3,   // предлагается, не навязывается
  MODERATE: 0.5,    // применяется, когда релевантно
  STRONG: 0.7,      // авто-применяется; порог инжекта в сессию
  CERTAIN: 0.9,     // ядро поведения; порог промоушена в правила
};

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function parseInstinct(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return null;
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-z_]+):\s*(.*)$/i);
    if (!kv) continue;
    let v = kv[2].trim().replace(/^["'](.*)["']$/, "$1");
    meta[kv[1]] = /^-?\d+(\.\d+)?$/.test(v) ? Number(v) : v;
  }
  return { meta, body: m[2] };
}

export function serializeInstinct(meta, body) {
  const order = [
    "id", "trigger", "action", "domain", "confidence", "scope",
    "project_id", "project_name", "created", "updated", "observations", "corrections",
  ];
  const keys = [...order.filter((k) => k in meta), ...Object.keys(meta).filter((k) => !order.includes(k))];
  const fm = keys.map((k) => {
    const v = meta[k];
    const needsQuote = typeof v === "string" && /[:#]/.test(v);
    return `${k}: ${needsQuote ? JSON.stringify(v) : v}`;
  }).join("\n");
  return `---\n${fm}\n---\n\n${body.trim()}\n`;
}

function instinctDirFor(project, scope) {
  const base = scope === "global" ? join(dataRoot(), "global") : projectDir(project);
  return ensureDir(join(base, "instincts"));
}

export function listInstincts(project) {
  const out = [];
  for (const scope of ["project", "global"]) {
    const dir = instinctDirFor(project, scope);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      if (!f.endsWith(".md")) continue;
      const path = join(dir, f);
      const parsed = parseInstinct(readFileSync(path, "utf8"));
      if (parsed) out.push({ ...parsed, path, scope });
    }
  }
  return out;
}

export function writeInstinct(project, meta, body) {
  const dir = instinctDirFor(project, meta.scope || "project");
  const path = join(dir, `${meta.id}.md`);
  atomicWrite(path, serializeInstinct(meta, body));
  return path;
}

// Затухание: инстинкт, который давно не подтверждался, теряет уверенность.
export function decayed(meta, asOf = Date.now()) {
  const updated = Date.parse(`${meta.updated || meta.created || today()}T00:00:00Z`);
  if (Number.isNaN(updated)) return Number(meta.confidence) || 0;
  const days = Math.floor((asOf - updated) / 86400000);
  const steps = Math.floor(days / 60); // -0.1 за каждые 60 дней молчания
  return Math.max(0, Math.round(((Number(meta.confidence) || 0) - steps * 0.1) * 100) / 100);
}

function atomicWrite(path, content) {
  const tmp = `${path}.tmp-${process.pid}`;
  writeFileSync(tmp, content, "utf8");
  renameSync(tmp, path);
}

// ── чтение stdin хука ────────────────────────────────────────────────────────
export function readStdin(maxBytes = 1024 * 1024) {
  return new Promise((resolve) => {
    let raw = "";
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(raw); } };
    // хук никогда не должен подвешивать сессию
    const timer = setTimeout(finish, 4000);
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (c) => {
      raw += c;
      if (raw.length > maxBytes) { raw = raw.slice(0, maxBytes); clearTimeout(timer); finish(); }
    });
    process.stdin.on("end", () => { clearTimeout(timer); finish(); });
    process.stdin.on("error", () => { clearTimeout(timer); finish(); });
  });
}

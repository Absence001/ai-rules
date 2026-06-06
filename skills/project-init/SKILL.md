---
name: project-init
status: active
description: Bootstrap a new project from ai-rules. Default mode creates only ./artifacts/project-state.md (Material Passport) — global rules are read from RULES_ROOT. Local CLAUDE.md / AGENTS.md / memory-bank/ are NOT created by default. They are created only when user explicitly requests a local override (e.g. "сделай локальные правила", "local override", "стандарт проекта зафиксировать локально"). Use when starting a brand new project folder, when no project-state.md exists yet, or when user says "новый проект", "kickoff", "let's start a new project".
trigger_keywords:
  ru: ["новый проект", "создать проект", "bootstrap", "scaffold", "стартуем", "init", "kickoff"]
  en: ["new project", "bootstrap", "scaffold", "init", "kickoff", "start project"]
intent: |
  User wants to start a new project in a fresh folder. Project lacks artifacts/project-state.md.
  Default behavior: create only project-state.md, keep rules global. Activate also when user
  is unsure how to start.
task_type: outcome-gradable
related_skills: [product-brief, pipeline-control]
data_access_level: raw
---

# Project Init

Bootstrap нового проекта из шаблонов ai-rules. **Default = global-only:** локально создаётся только `artifacts/project-state.md`. Локальные `CLAUDE.md` / `AGENTS.md` / `memory-bank/` создаются **только по явному запросу пользователя** как conscious local override.

## Initial Response (обязательно при первом вызове)

При активации — сразу:

> «Активирован project-init. Bootstrap нового проекта из ai-rules.
>
> **По умолчанию (global-only):** создам только `./artifacts/project-state.md`. Глобальные правила (`AGENTS.md`, `CLAUDE.md`, `memory-bank/`) живут в `RULES_ROOT = ~/ai-rules` и грузятся автоматически через `~/.claude/CLAUDE.md` и `~/.codex/AGENTS.md` — копировать их в проект не нужно.
>
> Мне нужно знать:
> 1. **Имя проекта**
> 2. **Путь** — где создавать (или текущая папка?)
> 3. **Тип проекта** — лендинг / mobile app / SaaS / DS / другое
> 4. **Стек** (по умолчанию Lee Robinson defaults)
> 5. **Figma файл** — есть ссылка?
>
> Если **нужны локальные `CLAUDE.md` / `AGENTS.md`** (project-specific override правил) — скажи явно: «сделай локальные правила» или «нужен local override». По умолчанию я их **не создаю**.»

## Когда триггерится

- Пустая папка / папка без `artifacts/project-state.md`
- Пользователь говорит «новый проект», «давай начнём», «kickoff»

## Default mode (global-only) — основной режим

### Что читать

1. **`RULES_ROOT/templates/project-state.md`** — Material Passport шаблон
2. **`RULES_ROOT/AGENTS.md`** — context для понимания global-only policy

### Что создать

В корне проекта:

```
<project>/
└── artifacts/
    └── project-state.md       ← из templates/project-state.md (заполнен)
```

**Это всё.** `CLAUDE.md`, `AGENTS.md`, `memory-bank/` локально **не создаются** — они уже доступны глобально через `RULES_ROOT`.

### Заполнить переменные

| Placeholder | Значение |
|---|---|
| `[PROJECT_NAME]` | имя проекта |
| `[YYYY-MM-DD]` | сегодняшняя дата |
| `[SHA]` | `git rev-parse --short HEAD` в `RULES_ROOT` |
| Тип / стек / Figma | по ответам пользователя |
| Цель (outcome) | `[TBD — заполнить после product-brief]` |

### Первая Lineage entry

```markdown
| 1 | <today> | Project bootstrapped (default global-only mode) | Claude (project-init skill) | RULES_ROOT@<SHA>/templates/project-state.md | artifacts/project-state.md | Run product-brief skill to gather brief |
```

### Acknowledge

> «Готово. Структура создана:
> - `<project>/artifacts/project-state.md`
>
> Глобальные правила грузятся автоматически из `RULES_ROOT = ~/ai-rules` (`AGENTS.md` + `claude/CLAUDE.md` + `codex/AGENTS.md` + `memory-bank/`). Текущий ai-rules commit: `<SHA>`.
>
> **Next step:** активируй `product-brief` skill — соберём бриф (4-6 вопросов одним раундом).»

## Local override mode — только по явному запросу

### Когда триггерится

Только если пользователь **явно** говорит одно из:
- «сделай локальные правила»
- «local override»
- «зафиксировать стандарт проекта локально»
- «нужны project-specific rules»
- «копируй CLAUDE.md / AGENTS.md в проект»

Любая другая формулировка → **уточнить**, нужен ли override (не создавать без подтверждения).

### Что создать (override mode)

```
<project>/
├── CLAUDE.md                  ← из templates/CLAUDE.md (override для Claude)
├── AGENTS.md                  ← из templates/AGENTS.md (override для Codex)
└── artifacts/
    └── project-state.md       ← из templates/project-state.md
```

Опционально (только если нужны project-specific правила, отличные от global):

```
<project>/
└── memory-bank/              ← project-specific overrides ТОЛЬКО для тем где default global rules недостаточны
    └── <category>/
        └── <file>.md
```

### Lineage entry (override mode)

```markdown
| 1 | <today> | Project bootstrapped with local override | Claude + User explicit request | User said: "<точная формулировка>" | CLAUDE.md, AGENTS.md, artifacts/project-state.md | Run product-brief skill |
```

В колонке «Provenance» **обязательно** зафиксировать явную фразу пользователя — это conscious decision.

### Acknowledge (override mode)

> «Готово. Структура создана с **local override**:
> - `<project>/CLAUDE.md` (override Claude rules)
> - `<project>/AGENTS.md` (override Codex rules)
> - `<project>/artifacts/project-state.md`
>
> ⚠️ Local override активен. Глобальные правила работают как **fallback**. Любое изменение global rules в `RULES_ROOT` **не** применится автоматически — нужно вручную синхронизировать.
>
> **Next step:** активируй `product-brief` skill.»

## Anti-Patterns

| Pattern (WRONG) | Why it fails | Correct (RIGHT) |
|---|---|---|
| Создать `CLAUDE.md` + `AGENTS.md` по умолчанию | Конфликт с global-only policy. Drift между global и local. Скрытые forks правил | Default — только `artifacts/project-state.md` |
| Создать локальный `memory-bank/` без явного override запроса | Тот же drift риск | Только когда пользователь явно сказал «нужны project-specific rules» |
| Угадать что пользователь хочет override | Скрытое решение, не зафиксированное в Lineage | Спросить явно или применить default |
| Не зафиксировать ai-rules SHA | Project не знает на какую версию правил рассчитан | Обязательный `git rev-parse --short HEAD` в Lineage / project-state |
| Не создать первую Lineage entry | Pipeline-control не увидит откуда продолжить | Entry «Project bootstrapped» обязательна |
| Не сказать пользователю next step | Зависает между skills | Явный handoff: «Активируй product-brief» |
| Override mode без явной фразы пользователя в Lineage | Не понятно почему override | Зафиксировать точную фразу в provenance |

## Outcome

### Default mode
- 1 файл создан: `artifacts/project-state.md`
- ai-rules SHA зафиксирован в project-state
- Первая Lineage entry — `Project bootstrapped (default global-only mode)`
- Пользователю дана команда на next step (обычно `product-brief`)

### Override mode (only on explicit request)
- 3 файла созданы: `CLAUDE.md`, `AGENTS.md`, `artifacts/project-state.md`
- ai-rules SHA зафиксирован
- Lineage entry содержит **точную фразу пользователя** в provenance
- Acknowledge включает warning что local override активен

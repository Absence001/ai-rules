---
name: project-init
status: active
description: Bootstrap a new project from ai-rules templates. Use when starting a brand new project folder, when no project-state.md exists yet, or when user says "новый проект", "kickoff", "let's start a new project". Scaffolds CLAUDE.md + AGENTS.md + artifacts/project-state.md from templates, fills in project name / type / stack / ai-rules commit SHA, and prepares pipeline for first stage (brief).
trigger_keywords:
  ru: ["новый проект", "создать проект", "bootstrap", "scaffold", "стартуем", "init", "kickoff"]
  en: ["new project", "bootstrap", "scaffold", "init", "kickoff", "start project"]
intent: |
  User wants to start a new project in a fresh folder. Project lacks any of:
  CLAUDE.md / AGENTS.md / artifacts/project-state.md. Activate also when user
  is unsure how to start.
task_type: outcome-gradable
related_skills: [product-brief, pipeline-control]
data_access_level: raw
---

# Project Init

Bootstrap нового проекта из шаблонов ai-rules. Идея из danjdewhurst/story-skills `story-init`.

## Initial Response (обязательно при первом вызове)

При активации — сразу:

> «Активирован project-init. Bootstrap нового проекта из ai-rules templates.
>
> Мне нужно знать:
> 1. **Имя проекта** (например `prayd-landing`, `claude-orchestrator-craft`)
> 2. **Путь** — где создавать (или текущая папка?)
> 3. **Тип проекта** — лендинг / mobile app / SaaS / DS / другое
> 4. **Стек** (если уже решён — React + Next.js + Tailwind по умолчанию Lee Robinson, или твой)
> 5. **Figma файл** — есть ссылка?
>
> После твоих ответов:
> - Создам `CLAUDE.md`, `AGENTS.md`, `artifacts/project-state.md` из templates
> - Заполню всё, кроме того что ты ещё не знаешь (помечу `[TBD]`)
> - Зафиксирую SHA текущего ai-rules коммита (так что project знает на какую версию правил рассчитан)
> - Дам команду на следующий шаг — обычно `product-brief`.»

## Когда триггерится

- Пустая папка / папка без `CLAUDE.md`
- Пользователь говорит «новый проект», «давай начнём», «kickoff»
- Существует `CLAUDE.md` но нет `artifacts/project-state.md`

## Что читать

1. **`RULES_ROOT/templates/CLAUDE.md`** — шаблон для Claude
2. **`RULES_ROOT/templates/AGENTS.md`** — шаблон для Codex
3. **`RULES_ROOT/templates/project-state.md`** — Material Passport шаблон

## Порядок

### 1. Сбор информации (один раунд)

Спросить пользователя:

| Поле | Если не знает |
|---|---|
| Имя проекта | Обязательно. Без него файлы не валидируются |
| Путь к папке | Если не указан — текущая `cwd` |
| Тип проекта | `[TBD]` если не уверен — заполним после brief |
| Стек | По умолчанию Lee Robinson: Next.js + TS + Tailwind + shadcn/ui |
| Figma файл | `[TBD]` если ещё нет |

### 2. Получить current ai-rules SHA

```bash
cd C:/Users/PC/ai-rules && git rev-parse --short HEAD
```

Этот SHA пойдёт в каждый template (так проект знает версию правил).

### 3. Создать файлы

В корне проекта:

```
<project>/
├── CLAUDE.md                  ← из templates/CLAUDE.md (заполнен)
├── AGENTS.md                  ← из templates/AGENTS.md (заполнен)
└── artifacts/
    └── project-state.md       ← из templates/project-state.md (Material Passport, заполнен)
```

**Заполнить переменные:**

| Placeholder | Значение |
|---|---|
| `[PROJECT_NAME]` | имя проекта |
| `[YYYY-MM-DD]` | сегодняшняя дата |
| `[SHA]` | git rev-parse --short HEAD из ai-rules |
| Тип / стек / Figma | по ответам |
| Цель (outcome) | `[TBD — заполнить после product-brief]` |

### 4. Первая Lineage entry

В `project-state.md` раздел 4 — первая запись:

```markdown
| 1 | <today> | Project bootstrapped | Claude (project-init skill) | RULES_ROOT@<SHA> templates | CLAUDE.md, AGENTS.md, artifacts/project-state.md | Run product-brief skill to gather brief |
```

### 5. Acknowledge и handoff

Сказать пользователю:

> «Готово. Структура создана:
> - `<project>/CLAUDE.md`
> - `<project>/AGENTS.md`
> - `<project>/artifacts/project-state.md`
>
> ai-rules commit: `<SHA>` (если правила обновятся — `git pull` в ai-rules, project знает на какую версию рассчитан).
>
> **Next step:** активируй `product-brief` skill — соберём бриф (4-6 вопросов одним раундом).»

## Anti-Patterns

| Pattern (WRONG) | Why it fails | Correct (RIGHT) |
|---|---|---|
| Создать все файлы пустыми | Не bootstrap, а скелет | Заполнить из templates с подстановкой переменных |
| Не зафиксировать ai-rules SHA | Project не знает на какую версию правил рассчитан | Обязательный `git rev-parse --short HEAD` |
| Не создать первую Lineage entry | Pipeline-control не увидит откуда продолжить | Entry «Project bootstrapped» обязательна |
| Скопировать `memory-bank/` локально в новый проект | Дубль, drift | `RULES_ROOT/memory-bank/` остаётся source of truth, project ссылается |
| Не сказать пользователю next step | Зависает между skills | Явный handoff: «Активируй product-brief» |
| Заполнить `[TBD]` для всех полей | Не bootstrap, а пустой template | Заполнить что известно, `[TBD]` только для реально неизвестных |

## Outcome

- 3 файла созданы (`CLAUDE.md`, `AGENTS.md`, `artifacts/project-state.md`)
- Все известные поля заполнены, неизвестные — `[TBD]`
- ai-rules SHA зафиксирован
- Первая Lineage entry в project-state.md
- Пользователю дана команда на next step (обычно `product-brief`)

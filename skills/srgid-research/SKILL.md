---
name: srgid-research
status: active
description: Run the SRGID research methodology (Scope/Reality/Gap/Impact/Decision) before any product or design decision. Use when user requests research, analysis, competitive review, audience study, or when SRGID is explicitly mentioned. This is the core analytical framework — never skip to Decision before S/R/G/I are complete.
trigger_keywords:
  ru: ["research", "ресерч", "анализ", "конкуренты", "аналоги", "аудитория", "SRGID", "продуктовый анализ", "discovery"]
  en: ["research", "competitive analysis", "audience research", "SRGID", "discovery", "product analysis"]
intent: |
  User wants product-grade analysis before solution. Even if "research" not said,
  activate when user proposes a solution without explaining the problem (Reality + Gap missing).
task_type: outcome-gradable
related_skills: [product-brief, ia-design, pipeline-control]
data_access_level: raw
---

# SRGID Research

**SRGID — собственная методология пользователя.** Это core analytical framework. Никогда не trogать структуру — только следовать.

## Initial Response (обязательно при первом вызове)

При активации без конкретного контекста — сразу ответить:

> «Активирован srgid-research. Это core analytical framework — нельзя переходить к Decision до S/R/G/I.
>
> Прежде чем стартовать, мне нужно:
> 1. **Brief или контекст** — есть `artifacts/brief.md` или формулировка задачи?
> 2. **Какой метод первичен** — Landscape (конкуренты), Feedback (отзывы / интервью), Journey (сценарий) или Deep (несколько источников)?
> 3. **Уровень глубины** — быстрый анализ или полный SRGID с research.md?
>
> Перед поиском я покажу **карту исследовательских вопросов** (что узнать, зачем, где, надёжность). Каждое утверждение помечу: факт / наблюдение / гипотеза. Каждый источник — уровень доверия (высокий / средний / низкий).»

## Что такое SRGID

| Буква | Что | Без чего не идти дальше |
|---|---|---|
| **S** — Scope | Что это за задача на самом деле? Тип, границы, участники | Без S нельзя начать R |
| **R** — Reality | Что реально происходит сейчас? Что видит пользователь? | Без R нельзя найти Gap |
| **G** — Gap | Где разрыв между текущим и желаемым? Симптом vs причина | Без G нельзя оценить Impact |
| **I** — Impact | Влияние на user / бизнес / процесс. Метрики | Без I нельзя оправдать Decision |
| **D** — Decision | Только после S/R/G/I. Продуктовый вектор. Не UI | — |

## Когда триггерится

- Любой research / анализ / discovery запрос
- Пользователь предлагает решение, но не объяснил Reality + Gap
- Перед IA / design / implementation если нет `artifacts/srgid.md`

## Что читать

1. **Сначала:** `./artifacts/project-state.md`
2. **Затем (по необходимости):**
   - `RULES_ROOT/memory-bank/discovery/srgid-research-core.md` — методология
   - `RULES_ROOT/memory-bank/discovery/srgid-methods.md` — методы (Landscape / Feedback / Journey / Deep)
   - `RULES_ROOT/memory-bank/discovery/sources-trust.md` — уровни доверия источникам
   - Для глубокого контекста — `RULES_ROOT/memory-bank/discovery/context-research.md`

## Порядок

1. **Карта исследовательских вопросов** перед поиском (что узнать, зачем, где, надёжность).
2. **S** — переформулировать задачу. Не доверять исходной формулировке.
3. **R** — зафиксировать текущую реальность. Факт vs гипотеза.
4. **G** — найти разрыв. Симптом ≠ причина.
5. **I** — оценить значимость. Метрики где возможно.
6. **D** — продуктовый вектор. **Не UI**, не «как выглядит».
7. Записать `./artifacts/srgid.md` + `./artifacts/research.md`.
8. Lineage entry в `project-state.md`.

## Уровни доверия источникам

| Уровень | Что |
|---|---|
| **Высокий** | Прямой бриф / интерфейс / метрики / официальная докуменация |
| **Средний** | Отраслевые паттерны / конкуренты / публичные отчёты |
| **Низкий** | Предположения / непроверенные интерпретации / маркетинговые заявления |

Каждый вывод — с указанием уровня доверия.

## Anti-Patterns

| Pattern (WRONG) | Why it fails | Correct (RIGHT) |
|---|---|---|
| Пропустить S → сразу R | Анализируем не ту задачу | S всегда первой |
| Reality без отделения факт / гипотеза | Гипотезы превращаются в факты | Каждое утверждение помечено |
| Gap без причины — только симптом | Лечим симптом, причина остаётся | Симптом → причина (5 Whys) |
| Decision до Impact | Решение без оснований | I обязательно до D |
| Research как список ссылок | Это не анализ | Список тем → синтез → выводы |
| Делать решение раньше D | Скачем сразу в UI | Финальная stage gate перед UI |

## Outcome

- `artifacts/srgid.md` со всеми 5 буквами и явным разделением факт/гипотеза
- `artifacts/research.md` с источниками и уровнями доверия
- Lineage entry в `project-state.md`
- Готовность к IA / design

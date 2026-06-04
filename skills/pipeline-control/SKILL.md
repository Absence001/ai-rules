---
name: pipeline-control
status: active
description: Meta-skill for orchestrating the product pipeline (brief → SRGID → research → IA → DS → screens → prototype → craft audit). Use when starting a new pipeline, checking stage gates, deciding what skill to invoke next, or handling cross-stage decisions. Enforces stage gates (no skipping), artifact contracts, and Lineage updates in project-state.md.
trigger_keywords:
  ru: ["pipeline", "пайплайн", "оркестрация", "следующий шаг", "что дальше", "stage gate", "где мы"]
  en: ["pipeline", "orchestration", "next step", "what's next", "stage gate", "where are we"]
intent: |
  User asks about overall workflow, where in the pipeline they are, what to do next,
  or wants to coordinate multiple stages. Activate also at start of a new project session
  to load context from project-state.md and decide the next skill to invoke.
task_type: outcome-gradable
related_skills: [product-brief, srgid-research, ia-design, design-system, craft-audit]
data_access_level: raw
---

# Pipeline Control

Мета-skill. Управляет переходами между этапами.

## Initial Response (обязательно при первом вызове)

При активации без конкретного вопроса — сразу:

> «Активирован pipeline-control. Сначала ориентируюсь по проекту:
>
> 1. **Читаю `./artifacts/project-state.md`** (если есть) — где остановились, текущий этап, последняя Decision Lineage entry.
> 2. Если `project-state.md` нет — это **bootstrap**. Запущу `project-init` skill.
> 3. **Pipeline status:**
>    - Какой этап завершён? (есть ли `brief.md` / `srgid.md` / `research.md` / `ia.md` / `design-system.md` / `screens.md` / `prototype.md` / `craft-audit.md`)
>    - Где мы сейчас?
>    - Какой следующий skill активировать (по Skill routing table ниже)?
>
> Stage gates: нельзя пропускать. Если xотим override — фиксирую в Lineage как `assumption: user override`.»

## Когда триггерится

- Старт новой сессии в существующем проекте (orient via project-state)
- Вопрос «что дальше», «где мы», «следующий шаг»
- Координация между несколькими skills
- Конфликт между этапами

## Что читать

1. **Сначала (всегда):** `./artifacts/project-state.md` — current state
2. **Затем:**
   - `RULES_ROOT/memory-bank/meta/pipeline-orchestration.md` — этапы + stage gates
   - `RULES_ROOT/memory-bank/meta/artifact-contracts.md` — что должно быть в каждом artifact
   - `RULES_ROOT/memory-bank/meta/operating-principles.md` — meta-принципы

## Pipeline (8 этапов)

```
1. Brief         → ./artifacts/brief.md
2. SRGID         → ./artifacts/srgid.md
3. Research      → ./artifacts/research.md
4. IA            → ./artifacts/ia.md
5. Design System → ./artifacts/design-system.md
6. Screens       → ./artifacts/screens.md
7. Prototype     → ./artifacts/prototype.md
8. Craft Audit   → ./artifacts/craft-audit.md
```

## Stage gates (нельзя пропускать)

| Без чего | Не идти к |
|---|---|
| `brief.md` | research (кроме явного quick analysis) |
| `srgid.md` | design strategy |
| `research.md` | финальной IA |
| `ia.md` | screens как финальные |
| `design-system.md` | flow на «системной» базе |

## Skill routing по этапу

| Текущий этап | Какой skill вызывать |
|---|---|
| Старт проекта (пусто) | `product-brief` |
| После brief.md | `srgid-research` |
| После research.md | `ia-design` |
| После ia.md | `design-system` (если новая DS) или `screenshot-to-code` (если есть референс) |
| Mobile target | `mobile-design` |
| После screens.md | `frontend-impl` (если код) |
| Polish | `craft-audit` |
| Bug | `code-diagnostics` |

## Workflow patterns (Anthropic)

Наш pipeline — **prompt chaining**:

```
Brief → SRGID → Research → IA → DS → Screens → Prototype → Craft
```

Каждый этап — отдельный chained step. Stage gate = checkpoint.

Внутри этапа — **autonomous agent loop** (агент работает свободно).

См. Anthropic Building Effective Agents для full taxonomy (chaining / routing / parallelization / orchestrator-workers / evaluator-optimizer).

## Decision Lineage protocol

После значимого решения — **обязательно** запись в `project-state.md` раздел 4. **7 колонок** (включая `Next action` — baton для следующей сессии):

```markdown
| # | Дата | Решение | Кем | Почему (provenance) | Artifact | Next action |
|---|---|---|---|---|---|---|
| 5 | 2026-06-04 | Используем 3-tier tokens | Claude | RULES_ROOT/memory-bank/design-system/design-system-core.md | artifacts/design-system.md | Завести primitive/semantic слои в Figma Variables |
```

**Правила:**
- **Append-only.** Override через новую запись «Override #N: ...».
- `Provenance` обязательно — ссылка на artifact / rule / явный запрос пользователя.
- `Next action` — конкретное действие для следующей сессии (паттерн baton из jezweb/design-loop). Без него resumption деградирует.
- Если решение отброшено позже — добавь запись в раздел `4a. What Didn't Work` с конкретной причиной.

## Reset boundary

Если контекст потерян / новая сессия:
1. Прочитать `project-state.md` полностью.
2. Найти последнюю Lineage entry → откуда продолжить.
3. Заполнить раздел 10 Reset Boundary с указанием.

## Anti-Patterns

| Pattern (WRONG) | Why it fails | Correct (RIGHT) |
|---|---|---|
| Пропустить SRGID и сразу IA | Анализируем не ту задачу | Stage gate: нет srgid.md → не идти |
| Сделать DS до IA | DS обслуживает IA | Сначала IA, потом DS |
| Craft перед screens | Polish без content | Craft после функционального |
| Не обновить Lineage | Resumption невозможен | Обязательно после значимого |
| Override без записи в Lineage | Lose history | Override = новая запись «Override #N» |
| Sleep на pipeline («сделаю всё сразу») | Drift между этапами | Каждый этап → артефакт → next |

## Outcome

- Pipeline state ясен (где мы, что дальше)
- Stage gate выполнен / спрошен override
- Lineage entry создан
- Следующий skill определён
- `project-state.md` актуален (раздел 3 — этап, 11 — последнее изменение)

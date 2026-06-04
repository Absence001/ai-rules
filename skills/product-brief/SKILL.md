---
name: product-brief
status: active
description: Expand a vague request into a structured product brief. Use when user provides a 1-3 line request without a proper spec, when starting a new project (kickoff), or when explicit Brief/ТЗ is needed before further work. Asks 4-6 clarifying questions in one round, then writes artifacts/brief.md per artifact contract.
trigger_keywords:
  ru: ["бриф", "ТЗ", "новый проект", "kickoff", "начнём проект", "сделай бриф"]
  en: ["brief", "kickoff", "new project", "let's start", "project brief"]
intent: |
  User wants to formalize a request into a structured brief before any implementation.
  Activate even if exact keywords missing but request is vague (<3 sentences, no clear scope/audience/goals).
task_type: outcome-gradable
related_skills: [srgid-research, pipeline-control]
data_access_level: raw
---

# Product Brief

Раскрытие расплывчатого запроса в структурированный бриф. Используется до research, IA, design.

## Initial Response (обязательно при первом вызове)

При активации без конкретного контекста — сразу ответить:

> «Активирован product-brief. Прежде чем расширять запрос — мне нужно понять контекст одним раундом из 4-6 вопросов:
> 1. **Аудитория и контекст** — кто будет пользоваться, в какой ситуации?
> 2. **Бизнес-цели** — outcome (не output): что должно случиться у пользователя/в метриках?
> 3. **Ограничения** — стек, время, бюджет, что нельзя менять?
> 4. **Fail criteria** — когда проект считается провалом?
> 5. **Метрики успеха** — как поймём что получилось?
> 6. (При необходимости) Специфика домена / ЦА.
>
> Если ответ «не знаю» — пометим как открытый вопрос, не выдумываем. После ответов — короткое резюме 3-5 пунктов, затем `artifacts/brief.md`.»

## Когда триггерится

- Запрос < 3 строк без аудитории / цели / ограничений
- Пользователь явно говорит «бриф», «ТЗ», «новый проект», «kickoff»
- Старт нового проекта (есть `templates/CLAUDE.md` но пустой `project-state.md`)

## Что читать

1. **Сначала:** `./artifacts/project-state.md` (если есть) — текущее состояние
2. **Затем:** `RULES_ROOT/memory-bank/discovery/brief-expander.md` — порядок brief expansion
3. **Контракт:** `RULES_ROOT/memory-bank/meta/artifact-contracts.md` — структура `brief.md`

## Порядок

1. **Не дополнять запрос самостоятельно.** Не угадывать «наверное хочет landing page».
2. Задать **4-6 вопросов одним раундом** по приоритету:
   - Аудитория и контекст
   - Бизнес-цели (outcome > output — см. `meta/operating-principles.md`)
   - Ограничения (стек, время, бюджет)
   - Fail criteria (когда проект провален?)
   - Метрики успеха
3. После ответов — короткое резюме 3-5 пунктов.
4. Если контекст слабый — следующий раунд.
5. Когда достаточно — записать `./artifacts/brief.md`.
6. Зафиксировать в `project-state.md` Lineage entry: «Brief approved».

## Anti-Patterns

| Pattern (WRONG) | Why it fails | Correct (RIGHT) |
|---|---|---|
| Угадать что хочет пользователь | Output вместо outcome, потом переделывать | 4-6 вопросов одним раундом |
| Задать вопрос — ждать ответ — задать второй вопрос | Долго, утомляет пользователя | Все вопросы одним сообщением |
| Принять «не знаю» как ответ и идти дальше | Гипотезы превращаются в факты | Пометить как открытый вопрос, не выдумывать |
| Сразу писать `brief.md` без roundtrip | Не учтены unknowns | Roundtrip → резюме → запись |
| Brief в формате «что сделаем» | Output, не outcome | «Что должно случиться» — outcome (Cagan) |

## Outcome (что должно случиться после Skill)

- Структурированный `./artifacts/brief.md` по контракту
- Lineage entry в `project-state.md`
- Открытые вопросы помечены явно
- Готовность к следующему этапу (SRGID или research)

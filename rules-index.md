# Rules Index

**Цель:** короткий маршрутизатор для token economy. Грузи только то что нужно для типа задачи.

`RULES_ROOT = ~/ai-rules` (см. `AGENTS.md`).

Все пути — относительно `RULES_ROOT/memory-bank/`.

## Routing — 3 уровня (Claude использует Skills, Codex использует этот файл)

> Skills для Claude — это **layer 1+2 в одном** (keywords + intent через description). Для Codex (нет Skills) — используется этот файл напрямую как layer 1, **intent column** даёт layer 2.

| Layer | Что | Кому |
|---|---|---|
| **Layer 1 — Keywords** | Точное слово из триггеров → match | Claude через Skills `trigger_keywords`, Codex через keywords здесь |
| **Layer 2 — Intent** | Запрос матчит смысл (даже без точных слов) | Claude через Skills `intent:` description, Codex через **Intent column** ниже |
| **Layer 3 — Ask** | Match неясен | Спросить «это про X или Y?», не угадывать |

## Правила использования index

1. **Сначала прочитай этот файл** — он короткий (~3k токенов вместо ~30k всех правил).
2. Определи тип задачи по таблице ниже (триггеры **или** intent).
3. Прочитай **только** перечисленные файлы.
4. `artifacts/research/*` — НЕ читать в runtime. Это archive (history of how rules were built).
5. `artifacts/rules-audit.md` и `rules-proposal.md` — НЕ читать в runtime. Archive.
6. Project artifacts (`./artifacts/project-state.md`, `brief.md`, etc.) — читать **первыми** перед runtime rules.
7. В новом проекте по умолчанию **не создавать локальные копии** `AGENTS.md`, `CLAUDE.md` и `memory-bank/`: правила читаются из `RULES_ROOT`.

---

## Routing table

> **Триггеры** — точные слова (Layer 1). **Intent** — смысл запроса (Layer 2, для случаев когда точных слов нет).

| Тип задачи | Триггеры | Intent (по смыслу) | Читать (memory-bank/) | Читать (project artifacts/) | НЕ читать |
|---|---|---|---|---|---|
| **Project bootstrap** | новый проект, kickoff | Пустой `project-state.md`; запрос вида «давай начнём проект X» | `discovery/brief-expander.md` | `project-state.md` (если есть) | DS / craft / mobile |
| **Brief / clarification** | расплывчатый запрос, ТЗ | Запрос < 3 строк без аудитории / цели / ограничений | `discovery/brief-expander.md`, `meta/operating-principles.md` | `project-state.md`, `brief.md` | implementation |
| **Research (SRGID)** | research, анализ, конкуренты | Пользователь предлагает решение без объяснения проблемы | `discovery/srgid-research-core.md`, `srgid-methods.md`, `sources-trust.md`. При deep — `context-research.md` | `brief.md`, `srgid.md`, `research.md` | implementation, mobile |
| **IA / sitemap / flow** | IA, навигация, flow, sitemap | Обсуждение какие экраны, переходы, главное действие | `ia-flow/ia-rules.md`, `flow-design.md` | `research.md`, `ia.md` | DS, motion, mobile-craft |
| **Wireframing** | wireframe, lo-fi | «До визуала», «эскиз», «структура без полировки» | `pd-workflows/wireframing.md`, `ia-flow/ia-rules.md` | `ia.md`, `screens.md` | DS, motion |
| **Design system / tokens** | DS, tokens, components | «token vs literal», «component vs variant», «новый или переиспользовать» | `design-system/design-system-core.md`, `tokens-spec.md`, `component-anatomy.md`. При Figma — `figma-code-parity.md`. При governance — `ds-governance.md` | `design-system.md` | mobile, content, research |
| **Figma write** | Figma MCP, create/edit Figma | Любое write-действие в Figma через MCP | `design-system/figma-code-parity.md`, `design-system/tokens-spec.md` | `design-system.md` | research, IA |
| **Screens (hi-fi)** | screens, экраны, UI | После IA, перед / во время реализации UI | `ia-flow/flow-design.md`, `craft/visual-registers.md`, `craft/craft-core.md` | `ia.md`, `design-system.md`, `screens.md` | research, code-diagnostics |
| **Mobile UI** | mobile, iOS, Android | Target platform mobile (native / cross-platform) | `platforms/mobile-platform-guidelines.md`, `mobile-craft-rules.md`, `craft/motion-rules.md` | `ia.md`, `design-system.md` | frontend (если только design), DS-governance |
| **Frontend / React код** | код, React, Next.js, frontend | Discussion shifts к props / hooks / RSC / Tailwind classes / files | `platforms/frontend-implementation-rules.md`, `craft/motion-rules.md`. При DS-привязке — `design-system/tokens-spec.md` | `design-system.md`, `screens.md` | research, IA, mobile (если web) |
| **Screenshot → код** | скрин, screenshot, image-to-code | Прикреплён скриншот / референс, «сделай как тут» | `screenshot-to-code/image-to-code-workflow.md`, `craft/visual-registers.md`, `platforms/frontend-implementation-rules.md`, `craft/anti-slop-audit.md` | — | research, IA, mobile-platform |
| **Craft audit / polish** | polish, audit, craft, anti-slop | UI «как AI-сгенерированный», «доведи до идеала», visual review | `craft/craft-core.md`, `visual-registers.md`, `anti-slop-audit.md`, `motion-rules.md` | `screens.md`, `craft-audit.md` | research, IA |
| **Design handoff** | handoff, specs, передача в dev | Готовый дизайн → готовится к передаче, specs / redlines / dev review | `pd-workflows/design-handoff.md`, `design-system/component-anatomy.md`, `pd-workflows/component-documentation.md` | `design-system.md`, `screens.md` | research, IA |
| **Design critique / review** | critique, review, feedback | Запрос оценки дизайн-решения, design review session | `pd-workflows/design-critique.md` | `screens.md` или конкретный артефакт | implementation |
| **Microcopy / content** | тексты, метки, copy | Обсуждение слов в UI, labels, error messages, CTA | `pd-workflows/microcopy.md`, `ia-flow/ia-rules.md` (labels = words) | `ia.md`, `screens.md` | DS-governance, code |
| **Accessibility audit** | a11y, WCAG, доступность | Запрос проверить интерфейс на доступность; aria; контраст; keyboard | `pd-workflows/accessibility-audit.md`, `craft/craft-core.md` (hierarchy через несколько сигналов) | `screens.md` | research, IA |
| **Component documentation** | дока компонента, doc | «Напиши доку», «опиши API», README для компонента | `pd-workflows/component-documentation.md`, `design-system/component-anatomy.md` | `design-system.md` | research, IA |
| **Bug / code diagnostics** | баг, ошибка, не работает, fix | Stack trace / error в сообщении; «не запускается» | `code-diagnostics/code-diagnostics.md`, `meta/calibration.md`. При frontend — `platforms/frontend-implementation-rules.md` | `project-state.md` (контекст) | research, IA, DS |
| **Pipeline / orchestration** | meta, оркестрация, pipeline | Вопросы «где мы», «что дальше», координация stages | `meta/pipeline-orchestration.md`, `meta/artifact-contracts.md`, `meta/operating-principles.md` | `project-state.md`, все relevant artifacts | content, mobile |

## Когда читать `artifacts/research/*`

**Только** при явных триггерах:
- «полный аудит», «full research review»
- «обоснование правила X», «откуда взято правило Y»
- «исправь правила на основе research»

В runtime для обычных задач — **не читать**.

## Когда читать `artifacts/rules-audit.md` / `rules-proposal.md`

**Только** при триггерах: «история правил», «почему так структурировано», «что мы меняли».

Это history, не runtime.

## Особые случаи

| Случай | Действие |
|---|---|
| Задача затрагивает 2+ типов | Читай файлы из обеих категорий, но **минимум общих** |
| Тип неясен | Спроси пользователя «это про X или Y?» — не угадывай |
| Локальный `memory-bank/` в проекте есть | **Supplement, не replacement.** Используй для project-specific knowledge. Core `AGENTS.md` + tool roles + этот index — **остаются global** |
| Локальный `artifacts/project-state.md` | **Читать первым**, до любых rules |

Норма для новых проектов: только папка проекта + при необходимости `artifacts/`. Общие правила не дублируются локально.

## Anti-patterns

| ❌ | ✅ |
|---|---|
| Прочитать все 34 файла «на всякий случай» | Прочитать 1-3 по index |
| Прочитать `artifacts/research/*` для обычной задачи | Только при явном запросе |
| Игнорировать `project-state.md` | Читать первым |
| Прочитать `mobile-craft-rules.md` для web-задачи | Не нужно |
| Прочитать `code-diagnostics.md` для дизайна | Не нужно |

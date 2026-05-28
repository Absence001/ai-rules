# Rules Proposal: план изменений

Что меняем, почему, в каком порядке. Без правок до подтверждения.

---

## 🎯 Цели

1. **Устранить все дубли и конфликты** из audit (без потери единственных вхождений правил)
2. **Восполнить все пробелы** из research (~80 правил)
3. **Усилить слабые формулировки** (конкретика вместо «tiny», «~», «реалистичные»)
4. **Подготовить под Skills** (атомарные файлы с чёткими границами)
5. **Разделить Claude / Codex / shared** (без drift)
6. **Добавить PD-файлы** (wireframing, handoff, microcopy, a11y-audit, doc)
7. **Сохранить SRGID и calibration формат** (доказали свою ценность)

---

## 📁 Финальная структура

```
ai-rules/
├── AGENTS.md                          ← ядро (~80 строк, было 151)
├── README.md                          ← обновлённый под новую структуру
├── sync-rules.bat                     ← без изменений
│
├── claude/                            ← Claude-specific (новое)
│   └── CLAUDE.md                      ← роль оркестратора, Figma MCP, Skills routing
│
├── codex/                             ← Codex-specific (переработано)
│   └── AGENTS.md                      ← роль code executor, не оркестратор
│
├── memory-bank/                       ← shared knowledge (атомарные файлы)
│   ├── 00-meta/                       ← новая группа: meta-правила
│   │   ├── operating-principles.md    ← оставлено только «факты vs гипотезы»
│   │   ├── calibration.md             ← НОВЫЙ: УВЕРЕННОСТЬ:X% паттерн (вынесен)
│   │   └── pipeline-orchestration.md  ← единый источник pipeline
│   │
│   ├── 01-discovery/                  ← brief + research (SRGID не трогаем)
│   │   ├── brief-expander.md          ← + Four Big Risks (Cagan)
│   │   ├── srgid-research-core.md     ← переименован из research-core.md
│   │   ├── srgid-methods.md           ← переименован из research-methods.md
│   │   ├── sources-trust.md           ← без изменений
│   │   ├── context-research.md        ← без изменений
│   │   └── artifact-contracts.md      ← переехал сюда (брифы + research артефакты)
│   │
│   ├── 02-ia-flow/                    ← IA и flow
│   │   ├── ia-rules.md                ← + Samsonov 3 questions + JTBD properly + sitemap order
│   │   ├── flow-design.md             ← + Modal/Drawer/Screen/Wizard table + states obligatory
│   │   └── ux-evaluation.md           ← без изменений
│   │
│   ├── 03-design-system/              ← DS принципы
│   │   ├── design-system-core.md      ← переработан: 3-tier tokens + Components/Recipes/Snowflakes + 5-layer Ecosystem
│   │   ├── tokens-spec.md             ← НОВЫЙ: полная спецификация токенов (категории, naming, anti-patterns)
│   │   ├── component-anatomy.md       ← НОВЫЙ: anatomy/variants/states/props (из research)
│   │   ├── figma-code-parity.md       ← объединил figma-mcp-workflow + parity-check
│   │   └── ds-governance.md           ← НОВЫЙ: lifecycle, SemVer, deprecation
│   │
│   ├── 04-craft/                      ← visual quality
│   │   ├── craft-core.md              ← + cross-author принципы + anti-`#000000` + grayscale test
│   │   ├── visual-registers.md        ← без изменений (хорош)
│   │   ├── anti-slop-audit.md         ← усилен: anti-patterns table из research
│   │   ├── motion-rules.md            ← НОВЫЙ: только transform/opacity, <300ms, action-driven, easing tree
│   │   └── taste-development.md       ← НОВЫЙ: «agents with taste» (Emil Kowalski) — манифест
│   │
│   ├── 05-platforms/                  ← платформенные правила
│   │   ├── mobile-platform-guidelines.md  ← переработан: HIG 3 themes, MD3 breakpoints + canonical layouts
│   │   ├── mobile-craft-rules.md      ← усилен: anti-patterns, bottom sheet/modal table
│   │   └── frontend-implementation-rules.md ← переработан: RSC, no `any`, modern CSS, forms, a11y
│   │
│   ├── 06-pd-workflows/               ← НОВАЯ группа: продуктовый дизайнер
│   │   ├── wireframing.md             ← НОВЫЙ: lo-fi до hi-fi
│   │   ├── design-critique.md         ← НОВЫЙ: review process
│   │   ├── design-handoff.md          ← НОВЫЙ: specs, redlines для devs
│   │   ├── microcopy.md               ← НОВЫЙ: content design
│   │   ├── accessibility-audit.md     ← НОВЫЙ: WCAG как процесс
│   │   └── component-documentation.md ← НОВЫЙ: anatomy/usage/a11y/code
│   │
│   ├── 07-screenshot-to-code/         ← workflow для screenshot
│   │   └── image-to-code-workflow.md  ← без значительных изменений
│   │
│   └── 08-code-diagnostics/           ← баги и код
│       └── code-diagnostics.md        ← усилен: ReAct + Reflexion patterns, calibration ссылка
│
├── directives/                        ← остаются короткими, обновлены ссылки
│   ├── README.md
│   ├── build-prototype.md
│   ├── build-react-ds.md
│   ├── build-tokens.md
│   ├── build-web-prototype-from-screenshot.md
│   ├── create-screens.md
│   ├── demo-app.md
│   ├── ds-prep.md
│   ├── extract-patterns.md
│   ├── parity-check.md                ← можно удалить (объединено в figma-code-parity.md), оставить как redirect
│   └── sync-to-figma.md
│
└── templates/
    └── CLAUDE.md                      ← без изменений
```

### Что меняется в цифрах

| Метрика | Сейчас | После | Δ |
|---|---|---|---|
| Файлов в memory-bank | 22 | ~30 (с группировкой) | +8 (новые pd-workflows + decomp) |
| Файлов в корне (AGENTS, README, codex) | 4 | 5 (+ claude/CLAUDE.md) | +1 |
| Строк в AGENTS.md | 151 | ~80 | −50% |
| Дублей | 6 крупных | 0 | −100% |
| Пробелов из research | ~80 | ~5 (gaps acknowledged) | −94% |
| Skill-ready юнитов | 0 | 10 групп | + новое |

---

## 🔧 Изменения по категориям

### A. Устранение дублей

| Действие | Файлы |
|---|---|
| **AGENTS.md**: удалить «Язык и стиль», «Запрещено всегда», «Процесс диагностики кода», «Формат ответа» (всё это есть в memory-bank) | AGENTS.md |
| **AGENTS.md**: оставить только: роль, источники, stage gates, modes routing | AGENTS.md |
| **operating-principles.md**: удалить дубль с AGENTS, оставить только «факты vs гипотезы vs наблюдение vs рекомендация» + «минимальность» | operating-principles.md |
| **calibration.md** (новый): вынести УВЕРЕННОСТЬ:X% паттерн в отдельный файл (применим везде, не только в багах) | calibration.md |
| **pipeline-orchestration.md**: становится единственным источником pipeline | удалить дубль из AGENTS.md и artifact-contracts.md |
| **artifact-contracts.md**: ссылается на этапы pipeline-orchestration.md, не дублирует |

### B. Консолидация pipeline

**Сейчас:** 4 места описывают одно и то же.
**После:** один источник.

```
pipeline-orchestration.md (единый):
- Pipeline (8 этапов)
- Stage gates
- Что является входом / выходом каждого этапа
- Когда craft-layer включается
└──> ссылается на artifact-contracts.md для контрактов
└──> ссылается на конкретные mode-файлы (ia-rules, design-system-core, etc.)
```

### C. Tool-specific разделение

```
AGENTS.md (общее ядро):
- Роль зависит от инструмента (см. ниже)
- Язык, источники, stage gates (одинаково)
- Pipeline (одинаково)

claude/CLAUDE.md (Claude-specific):
- "Ты — оркестратор продуктового пайплайна"
- Skills routing
- Figma MCP usage
- Agentic patterns (ReAct, Reflexion из research)

codex/AGENTS.md (Codex-specific):
- "Ты — code executor под управлением плана"
- НЕ оркестрируешь сам
- Code focus: tests, refactoring, debugging
- Не делаешь Figma работу (Claude отвечает за Figma)
```

Sync-rules.bat обновляется чтобы собирать `~/.codex/AGENTS.md` из `AGENTS.md` + `codex/AGENTS.md`.

### D. Восполнение пробелов

#### D1. Craft (17 правил)

**В craft-core.md** (расширение):
- Cross-author принципы (research 01-craft + 06-gapfill)
- Iерархия через несколько сигналов
- Whitespace generosity
- Grayscale test для иерархии

**В motion-rules.md** (НОВЫЙ):
- Только `transform`/`opacity`
- < 300ms для UI
- Action-driven motion (hover-in ≠ hover-out по длительности)
- Easing decision tree
- `prefers-reduced-motion` обязательно
- Origin-aware (transform-origin)
- Custom cubic-bezier > built-in CSS
- Не анимировать частые/keyboard actions
- Не анимировать `height/width`

**В anti-slop-audit.md** (усиление):
- Полная anti-patterns table из research
- `#000000` никогда
- Default `box-shadow: 0 2px 4px rgba(0,0,0,0.1)` = generic
- 5+ интерактивов подряд = overwhelm
- Symmetric hover transitions = школьная ошибка

**В visual-registers.md**:
- 9-step color scales + 5 семейств
- Layered shadows (близкая жёсткая + дальняя мягкая)
- One primary button per screen

**В taste-development.md** (НОВЫЙ):
- «Agents with taste» манифест (Emil Kowalski)
- 3 практики развития taste
- Taste = explicit rules, не магия

#### D2. Design Systems (20 правил)

**В design-system-core.md** (полная переработка):
- **3-tier tokens** (primitive → semantic → component) — главное изменение
- **Components / Recipes / Snowflakes** (Frost taxonomy)
- **5-layer Ecosystem** ссылка (Frost)
- Rule of Three (вместо «2+ раза»)
- Theme ≠ Mode (orthogonal)
- Semantic naming (`intent: primary` не `color: blue`)
- Never raw values (Primer DESIGN_TOKENS_GUIDE)

**В tokens-spec.md** (НОВЫЙ):
- Категории: color/spacing/typography/radius/elevation/motion/border/z-index/opacity/breakpoints
- Naming convention (Primer-style)
- Color pairs (bg-emphasis ↔ fg-onEmphasis)
- Functional naming (fgColor/bgColor/borderColor)
- Density modifiers
- Anti-patterns (brand-color для роли, hardcoded values)
- `/* check-token */` self-correction pattern

**В component-anatomy.md** (НОВЫЙ):
- Anatomy / Variants / States / Props таксономия
- Boolean vs Variant vs Slot/Instance-swap решение
- Order of props
- Naming variants semantic

**В figma-code-parity.md** (объединение figma-mcp-workflow + parity-check):
- Mirror naming Figma Variables ↔ CSS vars
- Code Connect mapping для core
- Layer names = anatomy elements

**В ds-governance.md** (НОВЫЙ):
- SemVer + deprecation cycle ≥3 месяца
- Pilot project model (Frost + Mall)
- Single ownership / стабильная команда

#### D3. IA / Product (11 правил)

**В brief-expander.md** (расширение):
- **Four Big Risks** (Cagan) как pre-flight check
- Outcome > Output (empowered teams)
- Three Samsonov questions (assumptions / wrong / plan B)
- JTBD properly (большой контекст, не task-level)

**В ia-rules.md** (расширение):
- Sitemap → wireframe → screen фиксированный порядок (Samsonov)
- Метки = слова, не жаргон
- Главное действие test (если за 3 сек не находишь — сломано)

**В flow-design.md** (усиление):
- **Modal vs Drawer vs Screen vs Wizard** decision table
- Empty / Loading / Error states **обязательны** (не «упоминается»)
- Inline expand vs Drawer vs Modal vs New screen критерии

**В operating-principles.md** (вынести как principle):
- «Design is the art of being wrong safely» (Samsonov)
- Alignment > Right (Samsonov)
- Pivot — норма, не провал (Cagan)

#### D4. AI agents / orchestration / meta (12 правил)

**В AGENTS.md** (после очистки от дублей, добавить):
- Конкретное определение agent (Willison: LLMs calling tools in a loop)
- Positive instructions > negative lists (общий принцип)

**В operating-principles.md** или новом meta-файле:
- ReAct (Thought → Action → Observation)
- Reflexion (self-correction после ошибок)
- Chain-of-Verification для критических решений
- Boring technology principle (Willison)
- Tell exactly what to do (digital intern, Willison)
- Iterate, not finalize (Willison)

**В pipeline-orchestration.md**:
- 5 паттернов workflow (chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer) — наш pipeline = chaining + orchestrator-workers
- Workflow vs Agent типология

**В calibration.md** (новый, выше упомянут):
- УВЕРЕННОСТЬ:X% не только для багов, но для всех критических решений
- Self-correction patterns

#### D5. Mobile + Frontend (22 правил)

**В mobile-platform-guidelines.md** (полная переработка):
- HIG 3 themes (clarity / deference / depth)
- **MD3 5 breakpoints** (Compact/Medium/Expanded/Large/XL) с точными значениями
- **MD3 3 canonical layouts** (Feeds/List-Detail/Supporting Pane)
- Navigation pattern по breakpoint (bottom nav → rail → drawer)
- **Touch 44pt iOS / 48dp Android** (точно, не «~44»)
- iOS swipe back sacred

**В mobile-craft-rules.md** (усиление):
- Bottom sheet vs Modal vs Full-screen decision table
- Native pickers > custom dropdown
- Haptics соответствуют действию
- Carousels на mobile = bad

**В frontend-implementation-rules.md** (полная переработка):
- RSC top, Client leaf (Lee Robinson)
- `'use client'` на корневом layout = anti-pattern
- **No `any`** в TypeScript (hard rule)
- `gap` вместо margin для flex/grid детей
- Container Queries для адаптивности компонента
- `clamp()` для fluid typography
- Forms: native types, autocomplete, label, inline validation
- A11y baseline: semantic HTML, keyboard, focus-visible, не `outline: none`
- Performance: Core Web Vitals + image optimization + lazy split
- Server Actions for mutations
- Стек по умолчанию (Next.js + TS + Tailwind + shadcn/ui) если не указано иначе

#### D6. PD-файлы (новые)

| Файл | Что внутри |
|---|---|
| `wireframing.md` | Когда lo-fi → hi-fi, что такое good wireframe, fidelity ladder, anti-patterns |
| `design-critique.md` | Как давать feedback, как получать, формат «I see / I think / I wonder» |
| `design-handoff.md` | Specs / redlines / interaction docs / acceptance criteria для devs |
| `microcopy.md` | Tone, voice, error messages, empty states, button labels, accessibility текст |
| `accessibility-audit.md` | WCAG 2.2 как процесс — checklist по AA, keyboard, screen reader, motion |
| `component-documentation.md` | Стандарт документации компонента: anatomy, variants, states, props, a11y, code, Figma link |

### E. Усиление слабых формулировок

| Файл | Сейчас | Стане |
|---|---|---|
| mobile-craft-rules.md | «Не использовать tiny text» | «Body text ≥ 13pt iOS / ≥ 14sp Android» |
| mobile-platform-guidelines.md | «Touch target минимум ~44px» | «Touch target: 44×44pt iOS, 48×48dp Android» |
| craft-core.md | «Polish делать после функциональной готовности» | «Polish после: все states работают, responsive проверен на 3 breakpoints, a11y baseline пройден» |
| flow-design.md | «Если появляется устойчивый новый паттерн» | «Если pattern повторяется ≥3 раза с identical intent (Rule of Three)» |
| frontend-implementation-rules.md | «Реалистичные placeholders» | «Placeholders из контекста проекта (имена/тексты из домена), не Lorem/John Doe» |
| visual-registers.md | «brand-marketing: Можно больше композиционной выразительности» | «brand-marketing разрешает: expressive motion, large type, branded animations, custom shapes. НЕ разрешает: убирать a11y baseline» |

### F. Negative → Positive

Переписать длинные «не делай»-списки в позитивные правила. Примеры:
- ❌ «Не использовать tiny text» → ✅ «Body text ≥ 16px»
- ❌ «Не клонировать один и тот же экран с разным текстом» → ✅ «Один экран = один уникальный layout»
- ❌ «Не делать fake fintech dashboard spam» → ✅ «Контент отражает реальные данные домена»

---

## 🚀 Оптимизация без потери качества

### Опт. 1 — Атомарные файлы (Skill-ready)

Каждый файл — **один концепт, один контекст**. Сейчас в craft-core.md и DS-файлах смешано несколько. После перестройки:
- 1 файл = 1 Skill в будущем
- Меньше токенов на одну задачу
- Легче поддерживать

### Опт. 2 — Группировка по номерам (`00-meta/`, `01-discovery/`...)

Префикс помогает:
- Понять порядок чтения
- Сгруппировать в IDE
- Подготовить под Skills с trigger-категориями

### Опт. 3 — Удаление мёртвого кода

- `codex/rules.md` старый → заменяется `codex/AGENTS.md`
- `directives/parity-check.md` → объединено в `figma-code-parity.md`, оставляем как redirect-stub

### Опт. 4 — Меньше слов, больше таблиц

Research-файлы показали — таблицы быстро читаются и Claude/Codex лучше с ними работают. Применить везде где можно (especially anti-patterns, decision trees).

### Опт. 5 — Single Source of Truth для повторяющихся концептов

Calibration (УВЕРЕННОСТЬ:X%) выносится в `calibration.md`. На него ссылаются все файлы где это применимо (code-diagnostics, design proposals, риск-оценки).

### Опт. 6 — Cross-references вместо дублей

Вместо повторения правил — ссылки:
```markdown
> Для full motion rules → 04-craft/motion-rules.md
```

---

## 📋 План исполнения (8 фаз)

### Фаза 1 — Очистка и реструктуризация (низкий риск)

1. Создать новые папки (`00-meta/`, `01-discovery/`, etc.)
2. Переместить существующие файлы в новые папки (git mv для истории)
3. Удалить дубли из AGENTS.md
4. Создать `claude/CLAUDE.md`, обновить `codex/AGENTS.md`

### Фаза 2 — Создание новых файлов (с research-контентом)

5. `calibration.md` (новый)
6. `motion-rules.md` (новый)
7. `taste-development.md` (новый)
8. `tokens-spec.md` (новый)
9. `component-anatomy.md` (новый)
10. `figma-code-parity.md` (объединение)
11. `ds-governance.md` (новый)

### Фаза 3 — Восполнение Craft / DS

12. Обновить craft-core.md (cross-author принципы)
13. Обновить anti-slop-audit.md (полная таблица)
14. Обновить visual-registers.md (9-step scales)
15. Полностью переработать design-system-core.md (3-tier tokens, F/R/S)

### Фаза 4 — Восполнение IA / Product

16. Обновить brief-expander.md (Four Big Risks + Samsonov questions)
17. Обновить ia-rules.md (sitemap order + labels = words)
18. Обновить flow-design.md (decision tables + states obligatory)
19. Обновить operating-principles.md (be wrong safely + alignment > right)

### Фаза 5 — Восполнение Mobile / Frontend

20. Полностью переработать mobile-platform-guidelines.md (HIG + MD3)
21. Обновить mobile-craft-rules.md (decision tables)
22. Полностью переработать frontend-implementation-rules.md (RSC + modern stack)

### Фаза 6 — PD-файлы (новые)

23. `wireframing.md`
24. `design-critique.md`
25. `design-handoff.md`
26. `microcopy.md`
27. `accessibility-audit.md`
28. `component-documentation.md`

### Фаза 7 — Усиление слабых формулировок

29. Пройтись по таблице E (выше) — заменить размытое на конкретное

### Фаза 8 — Финализация

30. Обновить README.md под новую структуру
31. Обновить директивы (ссылки на новые пути)
32. Обновить templates/CLAUDE.md
33. Git commit с детальным сообщением (по фазам)
34. Push на GitHub
35. Запустить sync-rules.bat → Codex получает новые правила

---

## ⏱ Оценка объёма

| Фаза | Сложность | Время |
|---|---|---|
| 1 — Реструктуризация | низкая | ~15 мин |
| 2 — Новые файлы | средняя | ~60 мин |
| 3 — Craft / DS | высокая | ~45 мин |
| 4 — IA / Product | средняя | ~30 мин |
| 5 — Mobile / Frontend | высокая | ~45 мин |
| 6 — PD-файлы | средняя | ~45 мин |
| 7 — Слабые формулировки | низкая | ~15 мин |
| 8 — Финализация | низкая | ~15 мин |
| **Итого** | | **~4-5 часов работы** |

---

## ❓ Что хочу подтвердить перед стартом

1. **Группировка папок с префиксами `00-meta/`, `01-discovery/`...** — ок?
   - Альтернатива: оставить плоскую структуру

2. **Удалить ли `operating-principles.md`** полностью (всё перенеся в AGENTS.md), или **оставить с минимальным контентом** (только «факты vs гипотезы»)?

3. **Добавлять ли все 6 PD-файлов сразу**, или сначала только самые важные (wireframing, handoff, accessibility-audit, component-documentation)?

4. **Tool-specific разделение** — устраивает ли структура (AGENTS.md общий + claude/CLAUDE.md + codex/AGENTS.md)?

5. **Стек по умолчанию** в frontend-implementation-rules.md — Lee Robinson (Next.js + TS + Tailwind + shadcn/ui + Postgres + Drizzle) или что-то другое?

Дай ответы на эти 5 вопросов — стартую Execute.

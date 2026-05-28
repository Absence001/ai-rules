# Rules Audit

Полный audit ai-rules: 36 файлов (1 AGENTS.md, 1 README.md, 1 codex/rules.md, 1 templates/CLAUDE.md, 22 memory-bank, 10 directives).

Сверено с research (5 областей + gap-fill). Цель — найти конфликты, дубли, пробелы и слабые формулировки.

---

## 🔴 ТОП-7 проблем (executive summary)

| # | Проблема | Тяжесть | Где |
|---|---|---|---|
| 1 | **Массивный дубль** AGENTS.md ↔ operating-principles.md | 🔴 высокая | оба файла |
| 2 | **Pipeline описан 3-4 раза** в разной полноте | 🔴 высокая | AGENTS.md, pipeline-orchestration.md, artifact-contracts.md |
| 3 | **codex/rules.md почти пустой и противоречит AGENTS.md** | 🟡 средняя | codex/rules.md vs AGENTS.md role |
| 4 | **DS правила застряли на 2-tier tokens** (research требует 3-tier) | 🔴 высокая | design-system-core.md, build-tokens.md |
| 5 | **Mobile rules очень тонкие** (37 строк vs research требует больше) | 🔴 высокая | mobile-platform-guidelines.md |
| 6 | **Огромные gaps** относительно research (~30 правил отсутствует) | 🔴 высокая | разные файлы |
| 7 | **Frontend rules устарели** (нет RSC, `any`, RSC, modern CSS) | 🟡 средняя | frontend-implementation-rules.md |

---

## 🔴 Часть 1: Дубли (rules повторяются между файлами)

### Дубль 1 — Базовые принципы (AGENTS.md ↔ operating-principles.md)

| Правило | AGENTS.md | operating-principles.md |
|---|---|---|
| Пиши только по-русски | строка 13 | строка 5 |
| Не додумывай | строка 14 | строка 6 |
| Не соглашайся автоматически | строка 15 | строка 7 |
| Сначала диагностика | строка 16 (косвенно) + 137 | строка 8 |
| Делай ровно запрошенное | строка 16 | строка 9 |
| Крупные действия — после подтверждения | строки 59-67 | строка 10 |

**Импакт:** ~6 правил полностью повторяются. Если поменять в одном — забудешь в другом → drift.

**Рекомендация:** оставить в AGENTS.md (он грузится глобально), удалить из operating-principles.md ИЛИ полностью убрать operating-principles.md и перенести «Факты и гипотезы» + «Минимальность» в AGENTS.md.

### Дубль 2 — Code diagnostics (AGENTS.md ↔ code-diagnostics.md)

Полное дублирование «Процесс диагностики кода» (AGENTS строки 135-150) и code-diagnostics.md (весь файл).

**Импакт:** формат ответа повторён, но **с расхождением**: в AGENTS — «КАК ПРОТЕСТИРОВАТЬ», в code-diagnostics — «КАК ПРОТЕСТИРОВАТЬ ПОСЛЕ РЕШЕНИЯ». Уже разъезжаются.

**Рекомендация:** удалить из AGENTS.md, оставить только в code-diagnostics.md. В AGENTS.md — указатель «для code задач читай code-diagnostics.md».

### Дубль 3 — Pipeline / Stage gates

| Файл | Что описывает |
|---|---|
| AGENTS.md (строки 71-82) | 8 шагов пайплайна |
| pipeline-orchestration.md (строки 9-25) | 8 этапов + stage gates |
| artifact-contracts.md | 8 артефактов с контрактами |

**Импакт:** одна и та же логика в 3 файлах с разной полнотой. Drift гарантирован.

**Рекомендация:** в AGENTS.md оставить только высокоуровневое «pipeline есть, смотри pipeline-orchestration.md». Сам pipeline только в pipeline-orchestration.md. artifact-contracts.md ссылается на этапы из pipeline-orchestration.md.

### Дубль 4 — Modes

В AGENTS.md перечислены 7 режимов (research, IA, DS, Figma MCP, flow, craft, code) с короткими описаниями. Каждому соответствует файл в memory-bank, который описывает то же самое подробнее.

**Импакт:** правила режима в двух местах (короткая версия + полная). Например, «Сначала диагностика» в Code mode AGENTS.md vs code-diagnostics.md.

**Рекомендация:** в AGENTS.md перечислить **только** названия режимов и куда читать. Полные описания — только в файлах.

### Дубль 5 — Anti-slop / craft проверки

- anti-slop-audit.md — содержит Typography, Color, Layout, Components, Content, Motion checks
- craft-core.md — упоминает «critique», «audit» как commands но не повторяет content
- mobile-craft-rules.md — «Mobile anti-slop» с пересекающимися пунктами (glassmorphism, gradients, cards in cards)

**Импакт:** mobile anti-slop частично повторяет общий anti-slop, но с unique mobile-specific items.

**Рекомендация:** оставить разделение, но в anti-slop-audit.md добавить ссылку «для mobile дополнительно см. mobile-craft-rules.md». Тут не drift, а законное разделение.

### Дубль 6 — Image-to-code (memory-bank ↔ directives)

- memory-bank/image-to-code-workflow.md — полный workflow с 10 шагами
- directives/build-web-prototype-from-screenshot.md — почти то же самое, 8 шагов, явно ссылается на memory-bank

**Импакт:** частичное пересечение, но это вообще ОК — директивы должны быть короткими ссылками на memory-bank.

**Рекомендация:** оставить, но убедиться что директивы — это **execution steps**, а memory-bank — **principles**. Сейчас директивы повторяют принципы из memory-bank.

---

## 🟡 Часть 2: Конфликты

### Конфликт 1 — Роль агента (Claude vs Codex)

**AGENTS.md:** *«Ты — основной агент-оркестратор. Ты управляешь продуктовым пайплайном»*

**codex/rules.md:** *«Codex отвечает за: написание и рефакторинг кода, отладку, реализацию компонентов»* — то есть Codex не оркестратор.

**Импакт:** AGENTS.md грузится Codex'ом тоже (через `~/.codex/AGENTS.md`), и говорит Codex быть оркестратором. codex/rules.md (который сейчас никем не используется как entry point) говорит обратное.

**Сейчас не сломано**, потому что codex/rules.md не загружается. Но это **дезориентирует** Codex.

**Рекомендация:** в AGENTS.md явно разделить:
- *«Если ты Claude Code → ты оркестратор»*
- *«Если ты Codex → ты code executor под управлением плана»*

Либо два разных AGENTS.md (для каждого) — но это сложнее поддерживать.

### Конфликт 2 — Формат ответа на баг

- AGENTS.md (строка 148): «КАК ПРОТЕСТИРОВАТЬ»
- code-diagnostics.md (строка 13): «КАК ПРОТЕСТИРОВАТЬ ПОСЛЕ РЕШЕНИЯ»

**Импакт:** агенту неясно какую формулировку использовать.

**Рекомендация:** убрать из AGENTS.md.

### Конфликт 3 — Touch target

- mobile-platform-guidelines.md: *«Touch target минимум ~44px»* (с тильдой, неточно)
- Research (HIG): 44pt iOS, 48dp Android
- Research (MD3): 48dp

**Импакт:** «44px» неверно для Android. И «~44» намекает на неуверенность.

**Рекомендация:** разделить: iOS 44pt, Android 48dp (как research).

### Конфликт 4 — Components: повторяется 2+ раза vs Rule of Three

- design-system-core.md: *«Повторяется 2+ раза → кандидат в компонент»*
- Research (Nathan Curtis, Brad Frost): Rule of Three — extract на 3-м usage, не 2-м

**Импакт:** правило подталкивает к premature abstraction.

**Рекомендация:** заменить на «Rule of Three» — на 3-м usage extract.

### Конфликт 5 — Mobile rules: «Не использовать tiny text»

mobile-craft-rules.md: *«Не использовать tiny text»* — что значит tiny?

**Импакт:** размытая формулировка.

**Рекомендация:** ≥ 13pt iOS body, ≥ 14sp Android body (HIG / MD3 baseline).

---

## 🔴 Часть 3: Пробелы (Gaps) относительно research

### Gap 1 — Craft / UI quality (file: craft-core.md, visual-registers.md, anti-slop-audit.md)

Из 01-craft-ui.md + 06-gapfill.md, отсутствует:

| Правило | Источник research | Где должно быть |
|---|---|---|
| Чёрный никогда не `#000000` | Refactoring UI | visual-registers.md или anti-slop |
| `transition: all` запрещён | Joshua Comeau | frontend-implementation-rules.md |
| Animations только `transform/opacity` | Comeau + Kowalski | frontend |
| Action-driven motion (hover-вход ≠ hover-выход по длительности) | Comeau | craft-core или anti-slop |
| UI-анимации < 300ms | Emil Kowalski + Comeau | craft / frontend |
| Custom cubic-bezier > built-in CSS easing | Emil Kowalski | craft-core |
| Origin-aware анимации (transform-origin из точки клика) | Emil | craft-core |
| Не анимировать частые/keyboard-actions | Emil | craft-core |
| Размер шрифта body ≥ 16px | Refactoring UI | frontend |
| Grayscale test для проверки иерархии | Refactoring UI | craft-core |
| 9-step color scales + 5 семейств цвета | Refactoring UI | DS / visual-registers |
| Иерархия через **несколько** сигналов (size + weight + color + position) | Refactoring UI | craft-core |
| Whitespace generosity | Refactoring UI | craft-core |
| Layered shadows (близкая жёсткая + дальняя мягкая) | Refactoring UI | DS / craft |
| One primary button per screen | Refactoring UI | DS / craft |
| `placeholder` НЕ replacement для `<label>` | Refactoring UI + a11y | frontend |
| Symmetric hover transitions = школьная ошибка | Comeau | craft |

**Gap 1 в цифрах:** ~17 правил отсутствует.

### Gap 2 — Design Systems

Из 02-design-systems.md + 06-gapfill.md, отсутствует:

| Правило | Источник | Где |
|---|---|---|
| **3-tier tokens model** (primitive → semantic → component) | Curtis, MD3, Primer | design-system-core.md (сейчас только 2-tier!) |
| Components / Recipes / Snowflakes таксономия | Brad Frost | design-system-core.md |
| 5 слоёв Frost Ecosystem | Brad Frost | design-system-core.md или новый файл |
| Semantic naming variants (`intent: primary` не `color: blue`) | Frost + Curtis | design-system-core.md |
| Rule of Three для extract | Curtis + Frost | design-system-core.md |
| Anatomy / Variants / States / Props таксономия компонента | Frost + Primer | design-system-core.md |
| Theme ≠ Mode (orthogonal) | Curtis | design-system-core.md |
| Mirror naming Figma Variables ↔ CSS vars | research + Primer | figma-mcp-workflow.md |
| Code Connect mapping для core | research | figma-mcp-workflow.md |
| Never raw values rule | Primer DESIGN_TOKENS_GUIDE | frontend / DS |
| MUST-структура правил в стиле Primer (RFC 2119) | Primer | meta-level всех файлов |
| `/* check-token */` self-correction | Primer | DS |
| Color pairs (bg-emphasis ↔ fg-onEmphasis) | Primer | DS |
| Functional naming (fgColor/bgColor/borderColor) | Primer | DS |
| Native HTML > library philosophy | Lee Robinson + research | frontend / DS |
| z-index связан с shadow level | Primer | DS |
| Дерево решений для easing | Primer | DS / craft |
| Density modifiers (condensed/normal/spacious) | Primer | DS |
| Anti-pattern: brand-color для роли (brand-red для error) | Curtis | DS |
| 3-tier tokens категории (color/spacing/typography/radius/elevation/motion/breakpoints/border/z-index/opacity) | research | DS |

**Gap 2 в цифрах:** ~20 правил.

### Gap 3 — IA / Product

Из 03-ia-product.md + 06-gapfill.md, отсутствует:

| Правило | Источник | Где |
|---|---|---|
| **Four Big Risks** (value/usability/feasibility/viability) | Marty Cagan | ia-rules.md или новый |
| Three Samsonov questions (assumptions/wrong/plan B) | Pavel Samsonov | ia-rules.md или brief-expander |
| **Modal vs Drawer vs Screen vs Wizard** decision table | research synthesis | flow-design.md |
| Empty / Loading / Error states mandatory checklist | research | flow-design.md (упоминается, но без обязательности) |
| Метки = слова, не жаргон | Samsonov | ia-rules.md |
| Sitemap → wireframe → screen фиксированный порядок | Samsonov | ia-rules.md |
| Alignment > Right (выровненная команда шипит больше) | Samsonov | brief-expander |
| Outcome > Output (empowered vs feature team) | Cagan | brief-expander |
| Design = art of being wrong safely | Samsonov | operating-principles |
| JTBD properly (что user делает в большом контексте, не task-level) | Samsonov | brief / IA |
| Pivot — норма, не провал | Cagan | operating-principles |

**Gap 3 в цифрах:** ~11 правил. **Самая важная** — Four Big Risks как pre-flight check.

### Gap 4 — AI agents / orchestration

Из 04-ai-agents.md + 06-gapfill.md, отсутствует:

| Правило | Источник | Где |
|---|---|---|
| Workflow vs Agent типология | Anthropic Building Effective Agents | AGENTS.md |
| 5 паттернов workflow (chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer) | Anthropic | pipeline-orchestration.md |
| ReAct (Thought → Action → Observation) | Lilian Weng | operating-principles или AGENTS.md |
| Reflexion (self-correction после ошибок) | Lilian Weng | code-diagnostics или operating-principles |
| Chain-of-Verification для критических решений | Lilian Weng | meta |
| Positive instructions > negative lists | Anthropic | meta — наши правила переписать |
| Self-correction patterns в стиле `/* check-token */` | Primer | DS / frontend |
| Explicit calibration (УВЕРЕННОСТЬ: X%) во всём, не только в багах | Lilian Weng | meta |
| Конкретное определение agent (LLMs calling tools in a loop) | Simon Willison | AGENTS.md |
| Boring technology principle | Simon Willison | frontend |
| Tell exactly what to do (digital intern) | Simon Willison | meta |
| Iterate, not finalize | Simon Willison | meta |

**Gap 4 в цифрах:** ~12 правил. Это самое важное для **качества наших правил**.

### Gap 5 — Mobile + Frontend

Из 05-mobile-frontend.md + 06-gapfill.md, отсутствует:

**Mobile (file: mobile-platform-guidelines.md, mobile-craft-rules.md):**

| Правило | Источник | Где |
|---|---|---|
| HIG 3 themes (clarity / deference / depth) | Apple HIG | mobile-platform |
| MD3 5 breakpoints (Compact/Medium/Expanded/Large/XL) | MD3 | mobile-platform |
| MD3 3 canonical layouts (Feeds/List-Detail/Supporting Pane) | MD3 | mobile-platform |
| Navigation pattern по breakpoint (bottom nav → rail → drawer) | MD3 | mobile-platform |
| Touch 44pt iOS / 48dp Android (точно, не «~44px») | HIG / MD3 | mobile-platform |
| Carousels на mobile = bad (тонкие точки) | research | mobile-craft |
| Bottom sheet vs Modal vs Full-screen decision | research | mobile-craft |
| Native pickers > custom dropdown | research | mobile-craft |
| Haptics соответствуют действию | HIG | mobile-craft |
| iOS swipe back sacred | HIG | mobile-platform (упоминается) |

**Frontend (file: frontend-implementation-rules.md):**

| Правило | Источник | Где |
|---|---|---|
| RSC top, Client leaf | Lee Robinson | frontend |
| `'use client'` на корневом layout = anti-pattern | Lee Robinson | frontend |
| No `any` в TypeScript | Lee Robinson | frontend |
| `gap` вместо margin для flex/grid детей | research | frontend |
| Container Queries для адаптивности компонента | research | frontend |
| `clamp()` для fluid typography | research | frontend |
| Forms: native types, autocomplete, label, inline validation после blur | research | frontend |
| Accessibility baseline: semantic HTML, keyboard, focus-visible, `outline: none` НЕТ без замены | research | frontend |
| Performance: Core Web Vitals + image optimization + lazy split | research | frontend |
| `placeholder` НЕ `<label>` | research | frontend |
| Server Actions for mutations | research | frontend |
| TanStack Query for interactive data | research | frontend (опционально) |

**Gap 5 в цифрах:** ~22 правил.

### Gap 6 — Продуктовый дизайнер (отсутствующие файлы)

Из обсуждения с пользователем — нет файлов для:

| Тема | Зачем PD | Приоритет |
|---|---|---|
| Wireframing / lo-fi | Дешёвая итерация до визуала | ⭐⭐⭐ |
| Design critique / review | Регулярная практика PD | ⭐⭐ |
| Stakeholder communication | PM/dev/client comms | ⭐⭐ |
| Design handoff | Specs, redlines для devs | ⭐⭐⭐ |
| Microcopy / content design | PD часто пишет тексты | ⭐⭐ |
| Accessibility audit (separate from craft) | WCAG как процесс | ⭐⭐ |
| Component documentation | Что писать в доке компонента | ⭐⭐⭐ |
| Iteration / version tracking | Версии дизайна | ⭐ |
| Presentation / dev review | Decks для review | ⭐ |

**Gap 6:** ~6-9 новых файлов / Skills.

---

## 🟡 Часть 4: Слабые формулировки

### Размытое («как именно?»)

| Файл | Строка | Что не так | Лучше |
|---|---|---|---|
| mobile-craft-rules | «Не использовать tiny text» | Что такое tiny? | ≥13pt iOS body / ≥14sp Android body |
| mobile-platform-guidelines | «Touch target минимум ~44px» | Тильда + 1 платформа | iOS 44pt, Android 48dp |
| craft-core | «Polish делать после функциональной готовности» | Что значит «готовности»? | После того как все states/responsive работают |
| design-system-core | «Минимальный набор компонентов» (Button, Input...) | Без условий когда какой | Связать с component types из research |
| flow-design | «Если появляется устойчивый новый паттерн — предложить поднять его в DS» | Что значит «устойчивый»? | Rule of Three — после 3 usages с identical intent |
| frontend-implementation-rules | «Реалистичные placeholders» | Что значит реалистичные? | Контекст проекта (имена, текст из домена) |
| code-diagnostics | «Проверить гипотезу 3 раза» | Как именно 3 раза? | Конкретно: код / конфиг / логи (как уже есть в строке 20) |
| visual-registers | «brand-marketing: Можно больше композиционной выразительности» | Размытое разрешение | Допустимые приёмы списком |

### Негативные списки вместо позитивных правил

Research (Lilian Weng) рекомендует positive instructions over negatives. В правилах часто наоборот:

- mobile-craft-rules.md: 6 правил из 8 — «не делай»
- frontend-implementation-rules.md: 4 из 12 — «не делай»
- AGENTS.md: «Запрещено всегда» — 6 пунктов

**Рекомендация:** где можно, переписать в позитиве. *«Не использовать tiny text»* → *«Body text ≥16px web, ≥13pt iOS, ≥14sp Android»*.

---

## 🟢 Часть 5: Что хорошо

| Файл | Что хорошо |
|---|---|
| AGENTS.md | Структура (роль / язык / pipeline / modes / запреты), приоритет источников чёткий |
| research-core.md | SRGID методология — собственная, уникальная, ценная. **Не трогать** |
| sources-trust.md | Трёхуровневое доверие — простое и работающее |
| context-research.md | Чёткий порядок контекстного погружения |
| artifact-contracts.md | Структура артефактов — хорошая основа |
| code-diagnostics.md | Формат ответа с УВЕРЕННОСТЬ:X% — это **calibration по Lilian Weng**, отличная практика |
| pipeline-orchestration.md | Stage gates явные |
| craft-core.md | «Вкус = объяснимые решения» — отличная формулировка, цитата для скильс |
| craft-core.md commands | shape/critique/audit/polish/distill/typeset — хороший набор глаголов |
| visual-registers.md | 7 регистров — конкретно и применимо |
| anti-slop-audit.md | Структурированный чек-лист |
| directives | Короткие, по делу |

---

## 🟡 Часть 6: Tool-specific issues (Claude vs Codex)

### Текущая ситуация

- `~/.claude/CLAUDE.md` → `@ai-rules/AGENTS.md` (Claude грузит)
- `~/.codex/AGENTS.md` ← копия `ai-rules/AGENTS.md` (Codex грузит)
- `codex/rules.md` — не подключен ни к чему

### Проблемы

1. **AGENTS.md написан с позиции оркестратора** — нелогично для Codex CLI (который code-tool)
2. **codex/rules.md существует но не используется** — мёртвый код
3. **Нет файлов специфично для Claude** (для Skills, Figma MCP, agentic loop)
4. **Нет разделения «общее ядро» + «Claude-specific» + «Codex-specific»**

### Рекомендация

```
ai-rules/
├── AGENTS.md              ← общее ядро (роли, язык, pipeline, источники)
├── memory-bank/           ← shared knowledge
├── claude/
│   └── CLAUDE.md          ← Claude-specific: skills routing, MCP context, agentic patterns
├── codex/
│   └── AGENTS.md          ← Codex-specific: code focus, что Codex НЕ делает (оркестрация)
└── ...
```

Тогда:
- `~/.claude/CLAUDE.md` → `@ai-rules/AGENTS.md` + `@ai-rules/claude/CLAUDE.md`
- `~/.codex/AGENTS.md` ← конкатенация `ai-rules/AGENTS.md` + `ai-rules/codex/AGENTS.md` (через sync-rules.bat)

---

## 🟣 Часть 7: Skill candidacy (для будущей Skills-обёртки)

Группировка memory-bank в **естественные Skill-юниты** (на будущее):

| Skill (будущий) | Файлы которые входят | Триггеры |
|---|---|---|
| `product-brief` | brief-expander.md + artifact-contracts.md (часть brief) | "новый проект", "brief", "ТЗ", "kickoff" |
| `srgid-research` | research-core.md + research-methods.md + sources-trust.md + context-research.md | "research", "анализ", "SRGID" |
| `ia-design` | ia-rules.md + flow-design.md + ux-evaluation.md | "IA", "sitemap", "flow", "user journey" |
| `design-system` | design-system-core.md + react-ds-workflow.md + figma-mcp-workflow.md | "design system", "tokens", "components", "Figma" |
| `mobile-design` | mobile-platform-guidelines.md + mobile-craft-rules.md | "mobile", "iOS", "Android" |
| `craft-audit` | craft-core.md + visual-registers.md + anti-slop-audit.md | "craft", "polish", "review UI", "audit" |
| `screen-from-screenshot` | image-to-code-workflow.md + visual-registers.md + frontend-implementation-rules.md + anti-slop-audit.md | "screenshot", "по скрину", "image to code" |
| `frontend-impl` | frontend-implementation-rules.md | "frontend", "React", "Next.js", "CSS" |
| `code-diagnostics` | code-diagnostics.md | "баг", "ошибка", "не работает" |
| `pipeline-control` | pipeline-orchestration.md + artifact-contracts.md (общая часть) | meta — для самого оркестратора |

Текущие **22 файла → 10 Skills**. Поддерживается one-source-of-truth (Skills указывают на memory-bank/), Claude грузит точечно.

---

## 📊 Часть 8: Что менять — итоговая таблица

| Категория | Действие | Файлов затронуто |
|---|---|---|
| Удалить дубли | AGENTS.md ↔ operating-principles.md, AGENTS.md ↔ code-diagnostics | 2-3 |
| Консолидировать pipeline | В один файл, остальные ссылаются | 3 |
| Восполнить gaps (craft) | Добавить 17 правил | 3-4 |
| Восполнить gaps (DS) | Добавить 20 правил + 3-tier tokens | 2-3 |
| Восполнить gaps (IA) | Добавить 11 правил + Four Big Risks | 2 |
| Восполнить gaps (mobile/frontend) | Добавить 22 правил + RSC + современный CSS | 2-3 |
| Восполнить gaps (meta / AI agents) | Добавить ReAct, calibration, Frost ecosystem ref | 1-2 |
| Усилить слабые формулировки | ~10 правил | разные |
| Tool-specific разделение | Claude / Codex / shared | новая структура |
| Добавить PD-файлы | wireframing, handoff, microcopy, a11y-audit, doc | 6-9 новых |
| Подготовить под Skills | Сделать файлы атомарными, единым unit | все |

---

## 📌 Готовность к Proposal

Audit готов. Следующий шаг — **Proposal**: я представлю конкретный план изменений (что добавляю, что удаляю, что переписываю), структура файлов «до vs после», и порядок исполнения. Без правок до твоего ок.

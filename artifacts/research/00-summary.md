# Research Summary

Сводка всего research по 5 областям. Ссылается на детальные файлы; здесь — только cross-cutting выводы и source map для audit-этапа.

---

## Файлы

| Файл | Область | Источники |
|---|---|---|
| `01-craft-ui.md` | Craft / UI quality | Rauno Freiberg, Joshua Comeau, Emil Kowalski, Refactoring UI |
| `02-design-systems.md` | Design systems | Brad Frost, MD3, GitHub Primer, DTCG + supplementary (Curtis, Mall, real DS) |
| `03-ia-product.md` | IA / Product strategy | Marty Cagan, Pavel Samsonov |
| `04-ai-agents.md` | AI agents / prompts | Lilian Weng, Simon Willison |
| `05-mobile-frontend.md` | Mobile + Frontend | Apple HIG, Material Design 3, Lee Robinson, Josh Comeau |
| `06-gapfill.md` | **Round 2 gap-fill** | Emil ×6 углублённо, Frost Ecosystem + Global DS, Primer foundations + AI-tokens guide, Anthropic Building Effective Agents + Tool Use, Lilian Hallucination |

---

## Универсальные принципы (cross-domain)

Это то, в чём согласны эксперты из РАЗНЫХ областей — самое надёжное основание для правил.

### 1. Discovery / risk-thinking перед делом

- **Cagan:** *«Discovery exists to kill all four [value/usability/feasibility/viability] before delivery starts»*
- **Samsonov:** *«how will we know if we are wrong in our assumptions?»*
- **Willison:** *«A bad initial result isn't a failure, it's a starting point»* — итерация дёшево
- **Rauno:** craft = сначала невидимые вещи (performance/a11y), потом полировка

**Правило:** агент НЕ начинает делать, пока не сформулировал риски и план их закрытия.

### 2. Outcome > Output

- **Cagan:** empowered teams работают на business outcome, не на feature output
- **Samsonov:** *«no one wants to use a product»* — фокус на job/goal, не на task
- **Lilian Weng:** агент имеет goal, использует tools в loop для его достижения

**Правило:** агент переформулирует запрос в outcome перед действием.

### 3. Структура → визуал, не наоборот

- **Samsonov:** *«designers ended up visually solving the worst information architecture»*
- **Frost:** atoms → molecules → organisms → pages
- **Rauno:** grid-based architecture первична
- **Refactoring UI:** иерархия через несколько сигналов (размер + вес + цвет + положение)

**Правило:** сначала IA / sitemap / структура, потом визуал. Никогда наоборот.

### 4. Производительность — часть craft, не «потом»

- **Rauno:** *«performance and accessibility are not as glamorous… because they are invisible»* — но это и есть основа craft
- **Comeau:** только `transform`/`opacity` в анимациях
- **Kowalski:** анимация прерываемая, аппаратно-ускоренная
- **Lee Robinson:** RSC top, Client leaf; CLS/LCP/INP мерять

**Правило:** performance — hard constraint, не feature.

### 5. Accessibility — baseline, не extra

- **Rauno:** screen reader test обязателен; `prefers-reduced-motion`; ARIA на интерактивы
- **Comeau + Kowalski:** `prefers-reduced-motion` всегда
- **Apple HIG / MD3:** touch targets 44pt / 48dp; safe areas; native pickers
- **Refactoring UI:** контраст WCAG AA минимум; цвет не единственный сигнал

**Правило:** a11y baseline — не optional. Pre-flight check.

### 6. Boring / battle-tested технологии

- **Willison:** *«использовать boring technology»* — проверенные стабильные решения
- **Lee Robinson:** Next.js + TS + Tailwind + shadcn/ui — стабильный стек
- **Frost:** Atomic Design — mental model не fad

**Правило:** не bleeding edge без причины.

### 7. Документация структуры, не процесса

- **Frost:** Components / Recipes / Snowflakes — taxonomy решений
- **MD3 / Primer:** структурированные token tiers
- **DTCG:** стандартизированный формат
- **Cagan / Samsonov:** workshop artifacts (assumptions, risks, decisions)

**Правило:** артефакт фиксирует решение (что выбрано, почему), не описывает «что делали».

### 8. Альтернатива безусловным правилам — taxonomy решений

- **Frost:** Components vs Recipes vs Snowflakes
- **Curtis:** Primitive vs Semantic vs Component tokens
- **MD3:** Compact/Medium/Expanded/Large/Extra-large
- **Modal vs Drawer vs Screen vs Wizard** (синтез из IA research)

**Правило:** где можно — таблица решений с условиями, а не «всегда делай X».

---

## Универсальные anti-patterns

| Anti-pattern | Откуда | Применимость |
|---|---|---|
| Размытые инструкции / задачи | Willison | AGENTS.md процесс |
| Полированный визуал поверх сломанной IA | Samsonov | flow / IA правила |
| Roadmap-driven вместо outcome-driven | Cagan | brief / pipeline |
| `#000000` чистый чёрный | Refactoring UI | visual-registers |
| `transition: all` | Comeau | frontend rules |
| Симметричные hover-transitions | Comeau + Kowalski | craft rules |
| Animation `width/height` | Comeau + Kowalski | frontend rules |
| Touch targets < 44pt / 48dp | HIG / MD3 | mobile rules |
| `'use client'` на корневом layout | Lee Robinson | frontend rules |
| `any` в TypeScript | Lee Robinson | frontend rules |
| Brand-color tokens for roles (`brand-red` для error) | Frost / Curtis | DS rules |
| Visual naming variants (`color: blue` вместо `intent: primary`) | Frost / Curtis | DS rules |
| Hardcoded values при наличии tokens | Curtis | DS rules |
| Hover-only UX на mobile | HIG / MD3 | mobile rules |
| `placeholder` вместо `<label>` | Refactoring UI / a11y | frontend rules |
| Длинные негативные списки в промптах | Lilian Weng | AGENTS.md |
| Дублирование правил | (best practice) | structure |

---

## Source map — куда что применить

Какие research-выводы → какие memory-bank файлы:

### AGENTS.md (ядро)

- **04-ai-agents:** structure системного промпта (роль → safety → capabilities → forbidden); positive вместо negative; modular loading
- **03-ia-product:** stage gates как discovery; outcome > output; alignment > right

### memory-bank/operating-principles.md

- **04-ai-agents:** когда какие файлы читать (token efficiency); короткий routing
- **03-ia-product:** «design is the art of being wrong safely» mindset

### memory-bank/craft-core.md, visual-registers.md, anti-slop-audit.md

- **01-craft-ui:** Cross-author принципы; Anti-patterns table; чёрный никогда `#000000`; иерархия через несколько сигналов; novelty mapping
- **05-mobile-frontend:** анимации + perfomance baseline

### memory-bank/design-system-core.md, react-ds-workflow.md

- **02-design-systems:** 3-tier tokens, semantic naming, Components/Recipes/Snowflakes, Anti-patterns, Granularity rules
- **05-mobile-frontend:** Lee Robinson стек по умолчанию; RSC pattern; shadcn/ui composition

### memory-bank/figma-mcp-workflow.md

- **02-design-systems:** Figma ↔ code parity rules; Code Connect ограничения; mirror naming

### memory-bank/ia-rules.md, flow-design.md, artifact-contracts.md

- **03-ia-product:** Four Big Risks; Three Samsonov questions; sitemap → wireframe → screen; Modal/Drawer/Screen/Wizard таблица; JTBD properly

### memory-bank/mobile-platform-guidelines.md, mobile-craft-rules.md

- **05-mobile-frontend:** Apple HIG (deference/clarity/depth); MD3 breakpoints; touch targets; navigation patterns; mobile anti-patterns

### memory-bank/frontend-implementation-rules.md

- **05-mobile-frontend:** Lee Robinson defaults; TS strict no `any`; native HTML > library; CSS Grid + Container Queries; gap > margin; form practices; a11y baseline; performance baseline
- **01-craft-ui:** animation defaults (transform/opacity, <300ms, prefers-reduced-motion)

### memory-bank/brief-expander.md, pipeline-orchestration.md

- **03-ia-product:** outcome-first formulation; explicit risks; alignment first
- **04-ai-agents:** structured response format; iterate not finalize

### memory-bank/code-diagnostics.md

- **04-ai-agents:** ReAct + Reflexion как основа диагностики; уровень уверенности; форматированный отчёт о баге

### memory-bank/research-core.md / research-methods.md / sources-trust.md / context-research.md

- НЕ ТРОГАТЬ — у пользователя своя система SRGID

---

## Что в research НЕ покрыто (gaps)

- **Apple HIG** — fetch вернулся пустым, использован secondary search
- **MD3 layout overview** — 404, использован secondary
- **Lee Robinson на X/Twitter** — fetch ограничен
- **Benji Taylor** — нет single seminal article, нужен скрейпинг
- **SVPG (Cagan)** — 403 Forbidden, использованы secondary
- **Pavel Samsonov LinkedIn archive** — публикуется в LinkedIn без статичных URL, неполный обзор
- **Утечки production system prompts** — упомянуты Anthropic/Cursor, но не fetched

Эти gaps **не критичны** для audit — основная масса принципов охвачена. Можем дополнить точечно если в audit обнаружится пробел.

---

## Готовность к audit

Можно стартовать. Базис:
- 5 research-файлов с прямыми цитатами и source-attribution
- Cross-cutting принципы зафиксированы
- Source map к каждому файлу memory-bank готов
- Anti-patterns собраны в таблицу

На audit-этапе будем проверять текущие файлы ai-rules против этих принципов: что согласуется, что противоречит, что отсутствует.

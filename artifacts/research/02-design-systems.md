# Research: Design systems

Глубокий research по теме построения дизайн-систем для AI-агентов, которые делают DS в Figma и реализуют в React.

## Scope note

**Утверждённые primary-источники (по списку пользователя):**
- Brad Frost — bradfrost.com (блог), atomicdesign.bradfrost.com (онлайн-версия книги — берём как ссылочный материал, без полного углубления)
- Material Design 3 — m3.material.io
- GitHub Primer — primer.style
- Design Tokens W3C / DTCG — designtokens.org (его курирует Jina Anne)

**Supplementary-источники** (оставлены потому что напрямую дополняют утверждённые без противоречий и дают ценные taxonomies / anti-patterns):
- Nathan Curtis (EightShapes) — token taxonomy, naming conventions; дополняет DTCG
- Dan Mall (Design Systems University) — piloting model; дополняет Frost
- Robin Rendle (CSS-Tricks) — определение токенов; контекст для DTCG
- Atlassian / Polaris / Carbon / SLDS — реальные taxonomies для сравнения с Primer / MD3
- Figma docs (Code Connect, Component properties) — для Figma↔код parity

При конфликте приоритет за primary-источниками.

---

## Источники

### Авторы / первоисточники

1. Brad Frost — Atomic Design book — https://atomicdesign.bradfrost.com/chapter-2/
2. Brad Frost — Designing Systems (Ch.1) — https://atomicdesign.bradfrost.com/chapter-1/
3. Brad Frost — Maintaining Design Systems (Ch.5) — https://atomicdesign.bradfrost.com/chapter-5/
4. Brad Frost — Atomic Web Design (original blog) — https://bradfrost.com/blog/post/atomic-web-design/
5. Brad Frost — Extending Atomic Design — https://bradfrost.com/blog/post/extending-atomic-design/
6. Brad Frost — Design system components, recipes, and snowflakes — https://bradfrost.com/blog/post/design-system-components-recipes-and-snowflakes/
7. Brad Frost — Design Tokens + Atomic Design — https://bradfrost.com/blog/post/design-tokens-atomic-design-%E2%9D%A4%EF%B8%8F/
8. Brad Frost — A Design System Governance Process — https://bradfrost.com/blog/post/a-design-system-governance-process/
9. Brad Frost — A Global Design System — https://bradfrost.com/blog/post/a-global-design-system/
10. Brad Frost — The Design System Ecosystem — https://bradfrost.com/blog/post/the-design-system-ecosystem/
11. Nathan Curtis — Naming Tokens in Design Systems — https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676
12. Nathan Curtis — Reimagining a Token Taxonomy — https://medium.com/eightshapes-llc/reimagining-a-token-taxonomy-462d35b2b033
13. Nathan Curtis — Components as Data — https://medium.com/@nathanacurtis/components-as-data-2be178777f21
14. Dan Mall — Design System University — https://designsystem.university/
15. Robin Rendle — What Are Design Tokens? (CSS-Tricks) — https://css-tricks.com/what-are-design-tokens/
16. Jina Anne / DTCG — Design Tokens Format Module 2025.10 — https://www.designtokens.org/tr/drafts/format/
17. DTCG — Community Group page — https://www.w3.org/community/design-tokens/

### Дизайн-системы (первоисточники)

18. Material Design 3 — Design Tokens — https://m3.material.io/foundations/design-tokens/overview
19. GitHub Primer — Token names — https://primer.style/product/primitives/token-names/
20. GitHub Primer — UI color system — https://primer.style/foundations/color/overview/
21. GitHub Primer — primitives repo (DESIGN_TOKENS_GUIDE.md) — https://github.com/primer/primitives/blob/main/DESIGN_TOKENS_GUIDE.md
22. Atlassian Design — Design tokens overview — https://atlassian.design/foundations/tokens/design-tokens
23. Atlassian Design — All tokens — https://atlassian.design/components/tokens/all-tokens
24. Shopify Polaris — Tokens (color) — https://polaris-react.shopify.com/design/colors/color-tokens
25. Shopify Polaris — Space tokens — https://polaris-react.shopify.com/tokens/space
26. Shopify polaris-tokens (GitHub) — https://github.com/Shopify/polaris-tokens
27. IBM Carbon — Color tokens — https://carbondesignsystem.com/elements/color/overview/
28. IBM Carbon — Color token migration guide — https://carbondesignsystem.com/migrating/guide/design/
29. Salesforce SLDS — Design tokens (LWC) — https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-design-tokens.html
30. Figma — Code Connect docs — https://help.figma.com/hc/en-us/articles/23920389749655-Code-Connect
31. Figma — Component properties — https://help.figma.com/hc/en-us/articles/5579474826519-Explore-component-properties

---

## Ключевые принципы (по авторам)

### Brad Frost — Atomic Design + Subatomic

**Иерархия (5 уровней):** atoms → molecules → organisms → templates → pages.

- **Atoms** — "basic HTML elements like form labels, inputs, buttons that can't be broken down any further without ceasing to be functional". Foundational building blocks UI.
- **Molecules** — "combinations of multiple atoms" (например, label + input + button = search form).
- **Organisms** — "highest complexity levels of any given interface component… consist of multiple molecules; sometimes entirely different, sometimes the same molecules repeated".
- **Templates** — макет страницы без контента.
- **Pages** — конкретные инстансы templates с реальным контентом.

**Цитата (Frost):** *"Atomic design is not a linear process, but rather a mental model to help us think of our user interfaces as both a cohesive whole and a collection of parts at the same time."*

**Subatomic = design tokens.** Цитата Frost: *"In the world of UI, design tokens are subatomic particles. The design token `color-brand-blue` is a critical ingredient of a UI, but it's not exactly functional on its own. It needs to be applied to an 'atom' (such as the background color of a button) in order to come to life."*

**Components / Recipes / Snowflakes (важнейшая практическая таксономия Frost):**
- **Components** — "intended for maximal reuse and are content and context-agnostic… common components shared across an entire organization". Живут в core DS.
- **Recipes** — "specific compositions of design system components that are to be consistently used across a product, but aren't agnostic enough to live in the design system". Пример: ProductCard у e-commerce, CustomerDataCard у analytics. **Живут в product, не в core DS.**
- **Snowflakes** — "one-off components needed to build a product, but don't really get reused outside of their first use case". Пример: компонент Seat в системе выбора места в самолёте.

**Single Responsibility Principle:** *"Creating simple components helps UI designers and developers adhere to the single responsibility principle… do one thing and do it well."*

**Pilot project workflow:** не строить DS в вакууме — стартовать с конкретного продуктового проекта, который вытягивает из себя компоненты в DS. Каждый следующий проект быстрее. ROI растёт со временем.

**Global Design System (2024):** Frost продвигает идею универсального DS на уровне всей индустрии (один Button везде), но это пока концепт.

### Nathan Curtis — Token taxonomy

**4 группы уровней в имени токена:**

1. **Base levels** (backbone):
   - **Category** — `color`, `font`, `space`, `size`, `elevation`, `breakpoints`, `shadow`, `touch`, `time`
   - **Property** — `text`, `background`, `border`, `fill`, `weight`, `size`, `line-height`, `letter-spacing`
   - **Concept** — `feedback`, `action`, `visualization`, `commerce`

2. **Modifier levels**:
   - **Variant** — `primary`, `secondary`, `tertiary`, `success`, `error`, `warning`
   - **State** — `default`, `hover`, `press`, `active`, `focus`, `disabled`, `visited`, `error`
   - **Scale** — enumerated (1,2,3), ordered (50,100,...,900), bounded (0-100), proportional (1-x, 2-x), t-shirt (s,m,l)
   - **Mode** — `on-light`, `on-dark`, `on-brand`

3. **Object levels** — `forms`, `ui-controls` (group); `input`, `button`, `tooltip` (component); `left-icon`, `inline-link` (element)

4. **Namespace levels** — `esds`, `slds`, `mds` (system); `ocean`, `sands` (theme); `consumer`, `retail` (domain)

**Принципы Curtis (дословные):**

- *"Avoid homonyms."* (например, `type` для typography и для variable type — confusion)
- *"Homogeneity Within, Heterogeneity Between"* — единообразие внутри группы, чёткое разделение между группами.
- *"Flexibility or Specificity?"* — generic `$color-success` гибче, `$color-background-success` точнее.
- *"Start Within, Then Promote Across Components"* — начинай токены локально в компоненте, выноси в global только когда переиспользуется ≥3 компонентами.
- *"Don't Globalize Decisions Prematurely"* — не загрязняй global namespace single-use токенами.
- *"Theme ≠ Mode"* — themes для брендинга (Ocean, Sands), modes для light/dark; orthogonal.
- *"No single token includes all potential levels."* — включай только необходимые уровни для отличия intent.

**Порядок уровней в имени:**
- Namespaces — первыми
- Base levels (category, property, concept) — backbone в середине
- Modifiers — последними
- Object levels охватывают base/modifier
- Mode — обычно в самом конце

**Полные примеры из EightShapes:**
- `$esds-color-feedback-background-error` = `#B90000`
- `$esds-font-heading-size-level-1` = 64px
- `$esds-color-action-text-secondary-focus`
- `$esds-color-action-background-secondary-hover-on-dark`
- `$esds-forms-color-border` = `$esds-color-neutral-70` (alias)
- `$esds-consumer-color-marquee-text-primary` (domain-scoped)

**Reimagining Token Taxonomy — 3 уровня:**
- **Generic** (foundational values) — primitive
- **Semantic** (purpose-driven naming)
- **Component** (UI-specific applications)

**Anti-patterns (Curtis):**
- Tokens applied incorrectly (e.g., `brand-red` for errors, `text-muted` for borders)
- Generic tokens applied too broadly across distinct purposes
- Hard-coded values masquerading as tokens
- Shallow token systems inhibiting dark mode and theming

**Components as Data (Curtis 2025):** компонент — это структура в YAML/JSON: `{component name}: anatomy, props, default, variants`. Простые — 20-50 строк, сложные (Alert, TextInput, Card) — 500+. Props могут быть boolean / string / enum / slot.

### Jina Anne — DTCG / W3C standard

- Термин "design tokens" coined by Jina Anne и Jon Lehman в Salesforce Lightning Design System (~2014).
- Chair of W3C Design Tokens Community Group.
- **DTCG Format Module 2025.10 (stable, Oct 2025):**
  - JSON-based, file extension `.tokens` / `.tokens.json`
  - Media type `application/design-tokens+json`
  - Properties prefixed with `$`: `$value`, `$type`, `$description`, `$extensions`, `$deprecated`
  - **Composite types:** `strokeStyle`, `border`, `transition`, `shadow`, `gradient`, `typography`
  - Aliasing через reference syntax `{group.token}`

### Dan Mall — Design Systems University

- Бывший SuperFriendly. Создал Design System University.
- **Piloting:** "There's a specific way that you get components into a design system, and that is not by making them and then having teams use them and then having teams contribute to it" — компоненты приходят через пилотный продуктовый проект.
- Курс "Make Design Systems People Want to Use" — 72 модуля, фокус на принятии (adoption), процессе и метриках.
- Разделяет component library и true design system: первое — артефакты, второе — процессы + workflow + governance.

### Robin Rendle — CSS-Tricks

- Статья "What Are Design Tokens?" (April 2019) — задала канон в front-end комьюнити.
- *"Design tokens serve as a single source of truth for keeping design system values in sync with every other project in an organization."*
- Tokens are "agnostic way to store variables such as typography, color, and spacing so that a design system can be shared across platforms" (iOS, Android, web).
- Источник правды — JSON, output через Style Dictionary в CSS/iOS/Android.

### Lukas Oppermann — GitHub Primer

- Staff design system designer at GitHub Primer.
- Focus: design tokens + color, multi-mode systems (light/dark/dimmed/high-contrast).
- Active in DTCG, advocated for technical definition of "design token".
- Primer color tokens — functional (`fgColor-*`, `bgColor-*`, `borderColor-*`), не привязаны к hue.

---

## Token taxonomy: лучшие практики

### Trade-offs: 2-tier vs 3-tier

**2-tier (primitive + semantic):**
- Pros: проще, меньше уровней косвенности, понятнее junior-разработчикам.
- Cons: при росте компонентов на семантическом слое начинается дубль / противоречия.

**3-tier (primitive + semantic + component) — рекомендуется большинством зрелых DS (Material 3, Primer, Polaris, Carbon, Atlassian):**

| Tier | Aka | Что хранит | Пример |
|---|---|---|---|
| **Primitive / Reference / Core / Global** | base, raw | Сырые значения, platform-agnostic | `blue.500 = #2563EB`, `space.4 = 16px` |
| **Semantic / Alias / System** | role-based | Назначение в UI (роль), независимое от значения | `color.text.default`, `color.bg.danger` |
| **Component** | comp | Привязка семантики к свойству конкретного компонента | `button.primary.bg`, `card.padding` |

**Aliasing:** component → semantic → primitive. Любое значение можно поменять на нижнем уровне — каскадом обновится всё выше.

**Когда вводить component tokens (Curtis правило):** только когда токен переиспользуется ≥3 раз с тем же intent или когда компонент имеет редкий paint, не покрываемый семантикой.

### Naming conventions из реальных DS

#### Material Design 3
- Префикс: `md.{tier}.{category}.{role}`
- Tiers: `ref` (reference) → `sys` (system) → `comp` (component)
- Пример: `md.ref.palette.primary40` → `md.sys.color.primary` → `md.comp.filled-button.container.color`
- Когда меняется wallpaper, генерится новая палитра Reference Tokens, мапящаяся в неизменные System Tokens.

#### GitHub Primer
- Functional naming: `{property}-{role}-{modifier}`
- Properties: `fgColor` (text/icon), `bgColor` (background), `borderColor` (borders/dividers)
- Modifiers: `muted` (secondary), `emphasis` (stronger)
- Примеры: `fgColor-default`, `fgColor-muted`, `bgColor-default`, `bgColor-muted`, `bgColor-accent-emphasis`, `fgColor-onEmphasis`, `borderColor-default`
- Все contrast values рассчитываются против `bgColor-muted`.
- Color modes: light, dark, dark_dimmed, dark_high_contrast, light_high_contrast.

#### Atlassian Design System
- Структура: `{foundation}.{property}.{modifier}`
- Foundation: `color`, `elevation`, `space`
- Property: `background`, `border`, `text`, `icon`
- Modifier: role, emphasis, state
- Примеры: `color.background.accent.blue.subtle`, `color.text.danger`, `space.100` (= 8px scale)
- Space: t-shirt-like via `100, 200, 300...` (proportional к base 8px).

#### Shopify Polaris
- CSS-vars: prefix `--p-`
- Color: `--p-color-{ui-element}-{role}-{prominence}-{state}` где ui-element ∈ {bg, bg-surface, bg-fill, text, border, icon}
- Space: `space-100 = 4px`, `space-200 = 8px`... (base 4px, multiplier x100)
- JSON kebab-case.

#### IBM Carbon
- Naming: `[element]-[role]-[order]-[state]`
- Layering tokens: `-00`, `-01`, `-02`, `-03` (сет слоёв — base + 3)
- Paired: field на `$layer-02` background = `$field-03`; border пары один-в-один (`$field-03` ↔ `$border-strong-03`)
- В light themes слои чередуются White ↔ Gray 10; в dark — становятся светлее с каждым уровнем.

#### Salesforce SLDS / SLDS2
- SLDS 1: tokens в YAML, aliases в `design-tokens/aliases/`, primitives в `design-tokens/primitive/`, ссылка `{!ALIAS_NAME}`.
- SLDS 2: заменены на "global styling hooks" — CSS custom properties.

### Что куда относится (категории токенов)

| Категория | Подкатегории | Примечания |
|---|---|---|
| **Color** | text/fg, background/bg, border, icon, fill, surface | Functional > literal. Modes (light/dark/HC) — отдельная ось. |
| **Spacing** | inset (padding), stack (vertical gap), inline (horizontal gap), squish/stretch (asymmetric) | Базовый шаг 4px или 8px. Шкала: 0, 2, 4, 8, 12, 16, 24, 32, 48, 64. Naming: 100/200/300 или xs/sm/md/lg/xl. |
| **Typography** | font-family, font-size, font-weight, line-height, letter-spacing | Часто как composite token (DTCG `typography` type): `{family, size, weight, lineHeight}`. |
| **Radius** | xs, sm, md, lg, full | Скейл 2/4/8/12/16/9999. |
| **Elevation / shadow** | level-0..level-5 | В dark mode shadows плохо читаются — заменять luminance hierarchy (более светлые surfaces для выше уровня). |
| **Motion** | duration (fast/standard/slow), easing (standard/decelerate/accelerate) | `duration-fast = 150ms`, `easing-standard = cubic-bezier(0.4, 0, 0.2, 1)`. |
| **Sizing** | icon, control-height, container max-widths | |
| **Breakpoints** | xs/sm/md/lg/xl/2xl | |
| **Border** | width (thin/thick), style | Composite в DTCG (`border` type). |
| **Z-index** | dropdown, modal, toast, tooltip | Не часть W3C spec, но de-facto в DS. |
| **Opacity** | disabled, hover overlay, scrim | |

---

## Component anatomy

Согласно Nathan Curtis ("Components as Data"), Figma docs, Polaris docs:

**4 структурных части компонента:**

1. **Anatomy** — иерархия elements (container, region, slot). Соответствует DOM (div/span/section) или Figma FRAME.
2. **Props** — конфигурация:
   - **Boolean props** — toggle on/off (icon visibility, dismissible). В Figma — Boolean property (только layer visibility).
   - **String / Number** — текстовое содержимое, числа.
   - **Enum / Variant** — закрытый список значений (size: sm/md/lg, intent: primary/secondary/danger). В Figma — Variant property.
   - **Slot** — placeholder для произвольного контента / другого компонента. В Figma — Instance swap property.
3. **States** — default, hover, focus, active, disabled, error, loading, selected, expanded. Часто реализуются как state модификаторы в токенах, не как отдельные variants.
4. **Variants** — комбинации props, дающие визуально различные формы. Должны иметь та же структура / layout / anatomy.

**Когда что выбрать (Alice Packard + Figma docs):**

- **Variant** — когда меняется визуал (цвет, размер, layout), но не структура. Имена — semantic, не визуальные: `intent: primary` (не `color: blue`).
- **Boolean prop** — когда нужно показать/скрыть элемент.
- **Slot / Instance swap** — когда контент должен быть произвольным (иконка, content area). Альтернатива bloat-у через Visibility props.
- **Отдельные компоненты** — когда anatomy/structure фундаментально различны (Button vs IconButton — может быть одним компонентом с `iconOnly` boolean, может — двумя).

**Order of props (best practice):**
- Root-level props (Variant, root Visibility) — первыми
- Затем по структуре сверху-вниз (как в DOM)
- Самые важные — выше

**Naming variants — semantic, не visual:**
- Good: `intent: primary | secondary | danger`, `size: sm | md | lg`, `state: hover`
- Bad: `color: blue | grey | red`, `button: home-page`

---

## Figma <-> code parity

### Figma Code Connect

- Создан Figma для bridge между component в Figma и кодом в репо.
- **Два режима:**
  - **Code Connect UI** — внутри Figma, языково-агностичный, простой setup. Подходит для visual mapping.
  - **Code Connect CLI** — локально в репозитории. Поддерживает property mappings, dynamic code examples. Точнее, гибче.
- В Dev Mode показывает реальные code snippets вместо auto-generated.
- Feeds в Figma MCP Server — доступно AI-tools (Cursor, Claude Code).

### Ограничения Code Connect (важно)

*Из 2026 анализа:* "Figma Code Connect maps components to code snippets in Dev Mode, but it requires manual maintenance and does not sync component structure. Structural component parity — keeping Figma variants, states, and properties in sync with coded component APIs — does not have a reliable automated solution in 2026."

То есть Code Connect — мост на уровне snippet, не на уровне API. Property mapping в Code Connect CLI частично решает, но без полной автоматизации.

### Источник правды для токенов

Два подхода, оба live:

1. **Figma-first** — токены живут как Variables в Figma, экспортятся в JSON. 42.5% команд (2024) выбрали этот путь.
2. **Code-first** — токены живут в version-controlled JSON (DTCG format), Figma — consumer через Tokens Studio / Figma Variables import. Tool-independence.

**Гибридный:** Git как SoT, Tokens Studio для двусторонней синхронизации, CI/CD + Style Dictionary для трансформации в платформенные форматы.

### Типовые проблемы parity

- Variants in Figma vs props/enums в коде расходятся.
- Spacing tokens применяются correctly в коде, но в Figma художник использует hardcoded gap.
- Naming в Figma layers не совпадает с component anatomy.
- Modes (light/dark) в Figma vs theme provider в коде — разная структура.
- Состояния (hover/focus) часто отсутствуют в Figma как variants, но есть в коде.

### Best practices для parity

- Один и тот же набор tokens с одинаковыми именами в Figma Variables и CSS vars.
- Одинаковые имена variants в Figma и enum в TS (`intent: 'primary'`).
- Одинаковая anatomy (имена layers совпадают с DOM-структурой).
- Code Connect mapping для каждого core компонента.
- Storybook + Figma side-by-side review при изменениях.

---

## Granularity (когда выносить в компонент)

Сводный набор правил из Curtis, Frost, общей практики:

1. **Rule of Three** — не выноси после двух usage; три однотипных и явно одинаковых intent → extract. Преждевременная абстракция хуже копипасты.
2. **Curtis "Start Within, Then Promote":** компонент-локальный token / sub-component сначала живёт у компонента-родителя; продвигается выше только при доказанной кросс-компонентной потребности.
3. **Frost "Components / Recipes / Snowflakes":**
   - В core DS — только context-agnostic, для всех продуктов.
   - В product code — recipes (composition core-компонентов, специфичная для продукта).
   - Snowflake — один use case → не выносим вообще.
4. **Single Responsibility** — один компонент = одна обязанность. Если у компонента >5-7 props, которые меняют принципиально поведение — это, скорее всего, 2-3 компонента.
5. **Anatomy mismatch test** — если для нового варианта нужно поменять anatomy (добавить region, перестроить layout) — это отдельный компонент, не variant.
6. **Intent test** (Curtis) — *"Extracting things that differ in intent should be avoided"*. Если token / component используется в двух местах одинаково по форме, но разный по смыслу — не объединяй.

---

## Anti-patterns

Объединено из Curtis, Frost, governance статей:

### Token anti-patterns

- **Hardcoded values в коде или Figma** — bypassing token system.
- **Brand-color tokens for roles** — использовать `brand-red` для error background (Curtis).
- **Generic tokens applied broadly** — `gray-500` используется и для borders, и для text-muted, и для disabled bg.
- **Shallow token system** — только primitive, без semantic слоя → невозможен dark mode / theming.
- **Premature globalization** — single-use токен в global namespace (Curtis).
- **Mixing themes and modes** — Ocean theme в светлом и тёмном через те же tokens (Curtis: "Theme ≠ Mode").
- **Homonyms** — `type` для typography И для variable type (Curtis).

### Component anti-patterns

- **Component sprawl** — "library accumulating UI assets faster than it can govern them; comprehensive on paper, inconsistent in practice".
- **Over-fragmentation** — atom Button-Primary, Button-Secondary, Button-Danger как отдельные компоненты, а не один с variants.
- **Под-фрагментация** — один God-Button с 30 props.
- **Visual naming of variants** — `color: blue` вместо `intent: primary`.
- **Visibility props instead of slots** — 5 booleans для разных опциональных элементов вместо одного slot.
- **Treating every repeat as extraction** — "some repeated patterns are too context-specific, immature, or unstable to standardize".
- **Variants for content** — вариант для каждого размера иконки внутри Button (правильно — slot).

### Governance / lifecycle anti-patterns

- **Graveyard DS** — 41% DS, запущенных за последние 2 года, больше не поддерживаются (2024 report). Причина — отсутствие governance, не плохие компоненты.
- **No deprecation lifecycle** — компонент удалён в minor release без warning.
- **Single ownership bottleneck** — один человек владеет DS, очередь PR-ов растёт, продукты копят локальные обходы.
- **DS team в вакууме** — DS строится без пилотного продукта (Mall, Frost).

### Figma <-> code anti-patterns

- **Figma layer names != component anatomy.**
- **Tokens not mirrored** — в Figma Variables своё naming, в коде своё.
- **Hardcoded gaps в Figma frames** при наличии space tokens.
- **No Code Connect mapping** для core components → AI/Dev Mode генерят wrong snippets.

---

## Theming / modes

### Theme vs Mode (Curtis — orthogonal axes)

- **Mode** — light / dark / high-contrast / dark-dimmed. Меняется по системным настройкам или toggle.
- **Theme** — бренд / продукт (Ocean, Sands, Courtyard в EightShapes; default vs marketing в продуктовых DS). Меняется отдельно.
- Одна и та же кнопка должна работать во всех 4 комбинациях (2 modes × 2 themes).

### Dark mode best practices

1. **Не инвертировать light** — dark — first-class, не вариант light. Парные шкалы строятся отдельно (LCH для perceptual uniformity).
2. **Semantic tokens** — токен `color.bg.surface` имеет разное значение в light/dark, имя не меняется.
3. **Luminance hierarchy вместо shadows** — в dark поверхности с большей "elevation" — светлее, не темнее. Carbon: light alternates White ↔ Gray 10; dark — каждый слой светлее.
4. **Контраст** — все contrast checks для AA/AAA в обоих modes.
5. **Brand colors могут меняться** — primary brand цвет в dark обычно desaturated/lighter.
6. **Опционально 4+ modes** — Primer: light, dark, dark_dimmed, dark_high_contrast, light_high_contrast.

### Реализация (code)

- CSS custom properties с `[data-theme="dark"]` или `prefers-color-scheme`.
- Все компоненты ссылаются ТОЛЬКО на semantic tokens, никогда на primitive напрямую.
- Theme switcher меняет CSS-var значения, не перерендеривает.

---

## Documentation (что должно быть)

Стандарт документации компонента (из stackblitz, magic patterns, design system guide):

1. **Description** — что это, для чего.
2. **Anatomy diagram** — визуальная иерархия частей.
3. **Variants** — все enum-значения с визуалами.
4. **States** — default/hover/focus/disabled/error/loading.
5. **Props API table** — name, type, default, description, required.
6. **Usage do/don't** — когда использовать, когда не использовать. Какие компоненты-альтернативы.
7. **Composition examples** — как комбинируется с другими компонентами.
8. **Accessibility** — keyboard, screen reader, contrast, ARIA roles, focus management.
9. **Code examples** — для каждого фреймворка (tabbed).
10. **Live playground** — Storybook / interactive demo.
11. **Design specs** — link на Figma component.
12. **Tokens used** — какие semantic tokens.
13. **Changelog / version** — semver, what changed.
14. **Migration notes** — для breaking changes.

---

## Governance / versioning

- **SemVer** — major.minor.patch. Breaking — только major.
- **Deprecation cycle** — минимум 3 месяца (для крупных орг — 6) между announce и removal. Announce → mark deprecated in code + docs → remove только в next major.
- **Pilot model (Mall, Frost)** — компоненты входят через продуктовый пилот, не через top-down мандат.
- **Contribution rules** — ясные criteria что качается в core, что — recipe в продукте.
- **Ownership** — кто-то один или маленькая команда отвечает; иначе DS становится graveyard.
- **Cadence** — регулярные releases (не ad-hoc), ChangeLog обязательно.

---

## Применимость к правилам AI-агента

Конкретные правила, которые войдут в `memory-bank` для AI-агентов, работающих с Figma + React DS:

### Token rules

1. **Использовать 3-tier модель:** primitive → semantic → component. Никогда не подтягивать primitive напрямую в компонент.
2. **Naming format:** `{namespace}.{category}.{property}.{variant|role}.{state?}.{mode?}` (по Curtis).
3. **Semantic names, не visual:** `color.text.danger` ≠ `color.text.red`. Variant names: `intent: primary`, не `color: blue`.
4. **Не создавать primitive токен под единичный case.** Promote из локального в global только при ≥3 переиспользованиях с identical intent (Rule of Three + Curtis).
5. **Theme и Mode — orthogonal оси.** Не смешивать в одной таксономии.
6. **DTCG format JSON** как обменный формат: `$value`, `$type`, `$description`. Composite типы для typography/border/shadow.
7. **Категории по умолчанию:** color (fg/bg/border/icon), spacing (4px base scale), typography (composite), radius, elevation, motion (duration/easing), opacity, z-index, breakpoints.
8. **Mirror imена в Figma Variables и CSS vars.** Один-в-один.

### Component rules

9. **Atomic Design как mental model**, не как жесткая иерархия. Не пытаться форсить всё в atoms/molecules.
10. **Frost Components / Recipes / Snowflakes** для решений уровня:
    - core DS — context-agnostic, всем продуктам;
    - recipes — composition в продукте;
    - snowflakes — не выносить.
11. **Single Responsibility** — один компонент, одна задача. >5-7 структурных props → разделить.
12. **Anatomy mismatch → отдельный компонент**, не variant.
13. **Variants — semantic names** (`intent`, `size`, `state`), не visual (`color`, `shade`).
14. **Boolean prop** для visibility toggles. **Slot / Instance swap** для произвольного контента. **Variant** для визуальных enum-вариаций при той же anatomy.
15. **Состояния (hover/focus/disabled/error)** — через state modifiers в semantic tokens, не через отдельные variants.
16. **Order of props:** root-уровень (variant, visibility) → по anatomy сверху вниз → важнейшие сначала.

### Figma <-> code parity rules

17. **Layer names = anatomy elements** (повторяют имена в DOM/JSX).
18. **Figma Variables = CSS variables** один-в-один по namespace и имени.
19. **Code Connect mapping обязателен** для каждого core component.
20. **Variants в Figma = enum-prop в TS** (одинаковые значения).
21. **Никогда не использовать hardcoded значения** в Figma frames — только Variables/Tokens.
22. **Modes в Figma реализуются через Variable Modes**, не через дублирование компонентов.

### Granularity rules

23. **Rule of Three:** не extract компонент / token после двух usage. Жди третьего одинакового intent.
24. **Start within, promote across** — token/sub-component сначала локально, потом наверх.
25. **Intent test** — если два места используют одинаково визуально, но разный смысл → не объединять.

### Governance rules

26. **SemVer + deprecation cycle** ≥3 месяца между announce и remove.
27. **Pilot project model** — новый компонент валидируется в реальном продукте до попадания в core.
28. **Каждое breaking change** — migration notes в changelog.
29. **Single ownership / стабильная команда** — не позволять DS превратиться в graveyard.

### Documentation rules

30. **Каждый компонент имеет:** anatomy diagram, variants/states, props API table, do/don't, a11y, code examples, Figma link, tokens used, version/changelog.

### Anti-patterns to avoid (rules `never do`)

31. Никогда не bypass token system hardcoded значениями.
32. Никогда не использовать brand/primitive токены напрямую в компонент (только через semantic).
33. Никогда не давать variant визуальное имя (`color: blue`).
34. Никогда не создавать одноразовый snowflake в core DS.
35. Никогда не миксовать theme и mode оси в одном уровне.
36. Никогда не удалять компонент в minor/patch — только в next major после deprecation period.

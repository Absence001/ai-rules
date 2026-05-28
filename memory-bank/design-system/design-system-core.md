# Design System Core

Принципы построения дизайн-системы. Источники: Brad Frost (Atomic Design / Ecosystem), GitHub Primer, Nathan Curtis, MD3, DTCG.

## Главный принцип

**Интерфейс сначала строится как система, затем как набор экранов.**

> *«Design systems are less about assets… but more about people and their relationships»* — Brad Frost

## Источник правды (иерархия)

1. **Tokens** (см. `tokens-spec.md`) — 3-tier модель
2. **Components** (см. `component-anatomy.md`) — anatomy / variants / states / props
3. **Composition rules** — как компоненты собираются в layouts/screens
4. **Governance** (см. `ds-governance.md`) — lifecycle и ownership

## 3-tier tokens (обязательно)

Не 2-tier (только primitive + semantic), а **полные 3 уровня**:

| Tier | Aka | Что хранит |
|---|---|---|
| **Primitive** | base / raw | Сырые значения (`blue.500 = #2563EB`) |
| **Semantic** | alias / system | Назначение в UI (`color.text.default`) |
| **Component** | — | Свойство компонента (`button.primary.bg`) |

**Каскад:** component → semantic → primitive. Меняешь на нижнем — обновляется всё выше.

Подробности — `tokens-spec.md`.

## Components / Recipes / Snowflakes (Frost taxonomy)

Критическое различение **что куда** живёт:

| Тип | Где живёт | Reuse |
|---|---|---|
| **Component** (context-agnostic, shared) | Core DS | Везде, во всех продуктах |
| **Recipe** (composition core-компонентов под продукт) | Product code | Только этот продукт |
| **Snowflake** (one-off, нужно один раз) | Где используется | Не reuse, не выносим |

**Правило:** не выносить recipe в core DS. Core — только то что **всем продуктам**.

> *«Recipe layer — pressure release valve»* — Frost. Снимает антипаттерн «всё в core».

## Когда что extract (Rule of Three)

| Случай | Действие |
|---|---|
| Pattern использовался 1 раз | Inline в компоненте, не extract |
| Pattern использовался 2 раза | Wait — может быть совпадение |
| Pattern использовался **3+ раза с identical intent** | Extract |
| Pattern с разным intent но визуально похож | **Не объединять** (intent test, Curtis) |

> *«Extracting things that differ in intent should be avoided»* — Curtis

## Variants vs new component

| Случай | Решение |
|---|---|
| Меняется визуал (цвет, размер, layout) | **Variant** |
| Меняется anatomy / structure фундаментально | **Отдельный компонент** |
| Нужно показать/скрыть элемент | **Boolean prop** |
| Нужен произвольный контент (icon / content area) | **Slot / Instance swap** |

Подробности — `component-anatomy.md`.

## Theme vs Mode

**Orthogonal оси:**

| Ось | Что |
|---|---|
| **Mode** | Light / Dark / High-Contrast |
| **Theme** | Бренд / продукт (Default / Marketing / Brand X) |

Не смешивать. Одна и та же кнопка должна работать во всех комбинациях (2 modes × N themes).

## 5-layer Ecosystem (Frost) — для масштаба

Когда DS обслуживает несколько продуктов:

```
Product Layer (apps, codebases, native)
    ↓ depends on
Smart Components (forms + validation, payments, typeahead)
    ↓ depends on
Recipes (product-specific compositions)
    ↓ depends on
Tech-Specific (React / Vue wrappers, native iOS/Android)
    ↓ depends on
Core DS (tokens, icons, UI components)
```

**Большинство слоёв опциональны.** Начинай с Core + Product. Добавляй остальные по реальной потребности.

См. `ds-governance.md` для деталей.

## Минимальный набор tokens (любой проект)

- `colors`: primitive + semantic (см. `tokens-spec.md`)
- `typography`: composite (family, size, weight, line-height)
- `spacing`: 4/8/16/24/32/48/64/96 scale
- `radius`: xs / sm / md / lg / full
- `shadows`: 3-5 levels
- `motion`: duration (fast/standard/slow) + easing (если есть анимации)

## Минимальный набор components (любой проект)

| Категория | Компоненты |
|---|---|
| **Atoms** | Button, Input, Text/Label, Icon, Badge/Tag, Divider |
| **Molecules** | Card, ListItem/Cell, FormField, Tabs, Header/TopBar, Modal/Sheet (если нужен) |
| **Organisms** | Только если есть реальный экранный паттерн с reuse |

**Принцип:** не создавать components «на будущее» — extract по реальной потребности (Rule of Three).

## Hard rules

1. **Never raw values** — всегда tokens. Если значение отсутствует в системе → пометь `/* check-token */`.
2. **Semantic naming variants** — `intent: primary | secondary | danger`, не `color: blue | grey | red`.
3. **Mirror naming** Figma Variables ↔ CSS variables один-в-один.
4. **States обязательны** для interactive — default / hover / focus-visible / active / disabled (+ loading / error для async).
5. **Rule of Three** для extract.
6. **One responsibility per component** — если >5-7 структурных props → разделить.

## Anti-patterns (краткий список)

| Anti-pattern | Что плохо |
|---|---|
| Hardcoded values (`color: #2563EB`) | Bypassing tokens |
| 2-tier tokens (без component layer) | Невозможно нюансировать на компонент |
| Recipe в core DS | Раздувание core |
| God component (30 props) | Сложно поддерживать |
| Visual naming (`color: blue`) | Сломано при rebrand |
| Premature globalization | Single-use в global namespace |
| Mixing theme + mode | Orthogonal axes сломаны |
| No deprecation cycle | Breaking changes без warning |
| All-in-one DS team без pilot products | Оторваны от реальности |

## Связанные файлы

- `tokens-spec.md` — полная спецификация токенов
- `component-anatomy.md` — структура компонента
- `figma-code-parity.md` — Figma ↔ код mirror
- `ds-governance.md` — lifecycle, SemVer, ownership
- `react-ds-workflow.md` — реализация в React

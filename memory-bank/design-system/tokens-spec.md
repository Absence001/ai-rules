# Tokens Specification

Полная спецификация дизайн-токенов. Источники: GitHub Primer DESIGN_TOKENS_GUIDE, Material Design 3, DTCG W3C, Nathan Curtis.

## Главное правило

> *«You are a CSS expert. Never use raw values (hex, px, etc.). Only use semantic tokens.»* — GitHub Primer

Никогда не используй raw values когда есть semantic tokens. Это фундамент DS.

## 3-Tier модель токенов

| Tier | Aka | Что хранит | Пример |
|---|---|---|---|
| **Primitive** (Reference / Core) | base, raw | Сырые значения, platform-agnostic | `blue.500 = #2563EB`, `space.4 = 16px` |
| **Semantic** (Alias / System) | role-based | Назначение в UI, независимое от значения | `color.text.default`, `color.bg.danger` |
| **Component** (comp) | — | Привязка к свойству конкретного компонента | `button.primary.bg`, `card.padding` |

**Aliasing:** component → semantic → primitive. Любое значение поменять можно на нижнем уровне → каскад вверх.

**Когда вводить component tokens (правило Curtis):** только когда токен переиспользуется ≥3 раз с тем же intent ИЛИ компонент имеет редкий paint, не покрываемый семантикой. **Rule of Three.**

## Категории токенов (обязательные)

| Категория | Подкатегории |
|---|---|
| **Color** | text/fg, background/bg, border, icon, fill, surface |
| **Spacing** | inset (padding), stack (vertical gap), inline (horizontal gap) |
| **Typography** | font-family, font-size, font-weight, line-height, letter-spacing (composite token) |
| **Radius** | xs, sm, md, lg, full |
| **Elevation / shadow** | level-0 .. level-5 |
| **Motion** | duration (fast/standard/slow), easing (standard/decelerate/accelerate) |
| **Sizing** | icon, control-height, container max-widths |
| **Breakpoints** | xs / sm / md / lg / xl / 2xl |
| **Border** | width (thin / thick), style |
| **Z-index** | dropdown, modal, toast, tooltip |
| **Opacity** | disabled, hover overlay, scrim |

## Naming conventions (Primer-style)

**Общая структура:** `[namespace]-[pattern]-[property]-[variant]-[scale]`

### Functional tokens (для UI элементов)

| Категория | Шаблон | Примеры |
|---|---|---|
| Text/icon color | `fgColor-[role]-[modifier]` | `fgColor-default`, `fgColor-muted`, `fgColor-onEmphasis` |
| Background | `bgColor-[role]-[modifier]` | `bgColor-default`, `bgColor-muted`, `bgColor-accent-emphasis` |
| Border | `borderColor-[role]-[modifier]` | `borderColor-default`, `borderColor-muted` |

### Modifiers

| Модификатор | Когда |
|---|---|
| `default` | Основной вариант |
| `muted` | Тонкое выделение / вторичный |
| `emphasis` | Сильное выделение (требует пары с `onEmphasis` для текста) |

### Sizes (control / spacing)

| Тип | Значения |
|---|---|
| **T-shirt** | `xsmall` / `small` / `medium` / `large` / `xlarge` / `xxlarge` |
| **Density** | `condensed` / `normal` / `spacious` |
| **Thickness** | `thin` / `thick` / `thicker` |
| **Viewport** | `narrow` / `regular` / `wide` |

### Control tokens (интерактивные)

```
--control-[size]-[property]
  ├── size: xsmall | small | medium | large | xlarge
  └── property: size | paddingInline-[density] | paddingBlock
```

Примеры: `--control-medium-paddingBlock`, `--control-small-paddingInline-condensed`

### Stack tokens (интервалы)

```
--stack-[property]-[size]
  ├── property: gap | padding
  └── size: condensed | normal | spacious
```

### Typography tokens

```
--text-[role]-shorthand-[size]
  ├── role: display | title | body | subtitle | caption
  └── size: small | medium | large
```

> Используй **shorthand** токены — они синхронизируют `line-height` + `font-weight`. **Никогда** отдельные font-size / line-height tokens.

### Motion tokens

```
--motion-[property]-[semantic]
  ├── property: duration | easing | transition
  └── semantic: micro | short | medium | long
```

### Z-Index layers

```
--zIndex-[layer]: behind | default | sticky | dropdown | overlay | modal | popover | skipLink
```

## Color pairs (MUST)

Обязательные сочетания background ↔ foreground:

| Background | Foreground | Когда |
|---|---|---|
| `bgColor-*-emphasis` | `fgColor-onEmphasis` | **ОБЯЗАТЕЛЬНАЯ пара** для emphasis |
| `bgColor-*-muted` | `fgColor-{semantic}` | Семантический цвет (default/muted) |
| `bgColor-default` | `fgColor-default` | Стандартная пара |

## Контраст

| Тип | WCAG минимум |
|---|---|
| Body text (< 18pt regular, < 14pt bold) | 4.5:1 (AA) |
| Large text (≥ 18pt regular, ≥ 14pt bold) | 3:1 (AA) |
| UI elements (icons, borders) | 3:1 (AA) |

> Контраст рассчитывается **против `bgColor-muted`** (не `bgColor-default`), как defensive baseline.

## Разделители в именах

| Контекст | Разделитель |
|---|---|
| CSS variables | дефис `-` (`--fgColor-default`) |
| JavaScript | точка `.` (`color.fg.default`) |
| Figma Variables | точка `.` или slash `/` (зависит от организации файла) |

**Mirror naming:** Figma Variables и CSS variables должны иметь один-в-один соответствие имён.

## Theme vs Mode

**Orthogonal оси** (Curtis):

| Ось | Что меняет | Пример |
|---|---|---|
| **Mode** | Системная тема | light / dark / high-contrast |
| **Theme** | Бренд / продукт | Default / Marketing / Brand X |

Одна и та же кнопка должна работать во всех комбинациях. **Не смешивай** mode и theme в одной таксономии токенов.

## Self-correction pattern

> *«If you suggest a token name not found in this spec or the system, suffix it with `/* check-token */`»* — Primer

Если предлагаешь имя токена, не проверив его существование:

```css
color: var(--fgColor-unfamiliar); /* check-token */
padding: var(--stack-padding-some-size); /* check-token */
```

Метка `/* check-token */` сигнализирует что значение требует проверки в реальной системе. См. также `meta/calibration.md`.

## MUST-правила (RFC 2119)

### Typography

- **MUST** использовать shorthand tokens (`font: var(--text-body-shorthand-medium)`)
- **MUST NOT** использовать отдельные `font-size` / `line-height` tokens
- **SHOULD** использовать семантическую разметку (`<h1>`, `<h2>`) + стили, не менять порядок ради визуала

### Motion

- **MUST** keep UI animations ≤ `motion.duration.medium` (300ms)
- **MUST** respect `prefers-reduced-motion`
- **SHOULD** использовать `motion.transition.*` для смены состояний

### Z-Index

- **MUST** использовать только z-index tokens, не raw значения
- **SHOULD** связывать z-index level с shadow level:
  - `shadow.resting.*` → `zIndex.default` / `zIndex.sticky`
  - `shadow.floating.small` → `zIndex.dropdown`
  - `shadow.floating.medium` → `zIndex.overlay` / `zIndex.modal`

### Spacing

- **MUST** использовать `control-*` tokens для интерактивов
- **MUST** использовать `stack-*` tokens для макета
- **SHOULD** соответствие density к цели элемента

### Цвет

- **MUST** использовать functional tokens (`fgColor` / `bgColor` / `borderColor`)
- **MUST NOT** использовать base/primitive tokens напрямую (`base-color-blue-5`) — они только для определения semantic tokens
- **SHOULD** уважать color pairs (см. выше)

## Anti-patterns

| Anti-pattern | Симптом | Источник |
|---|---|---|
| Hardcoded values (`color: #2563EB`) | Bypassing token system | Curtis / Primer |
| Brand-color tokens для роли (`brand-red` для error bg) | Сломаны при ребрендинге | Curtis |
| Primitive tokens напрямую в коде (`base-blue-5`) | Нет каскадности | Primer |
| Generic tokens applied broadly (`gray-500` для text-muted + borders + disabled bg) | Невозможно нюансировать | Curtis |
| Shallow token system (только primitive, без semantic) | Невозможен dark mode / theming | Curtis |
| Premature globalization (single-use token в global namespace) | Загрязнение | Curtis |
| Visual naming (`color: blue` вместо `intent: primary`) | Сломано при rebrand | Frost / Curtis |
| Homonyms (`type` для typography И для variable type) | Confusion | Curtis |
| Mixing theme + mode в одной таксономии | Орhonal axes сломаны | Curtis |

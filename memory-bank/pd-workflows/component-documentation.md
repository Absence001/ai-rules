# Component Documentation

Стандарт документации компонента в DS. Что должно быть для каждого reusable компонента.

## Главный принцип

**Документация — часть компонента, не optional.** Без неё компонент = чёрный ящик с непонятным contract.

## Когда документируем

| Компонент | Уровень доки |
|---|---|
| **Core DS компонент** | Полная документация (этот файл) |
| **Recipe (product-specific composition)** | Минимальная (anatomy + usage notes) |
| **Snowflake (one-off)** | Inline комментарий в коде, не отдельная дока |

См. `design-system/design-system-core.md` для Components/Recipes/Snowflakes taxonomy.

## Структура документации (14 разделов)

### 1. Description

Краткое (1-2 предложения) описание что это и для чего.

```markdown
## Card

Контейнер для группировки связанной информации с опциональными media, заголовком, содержимым и actions.
```

### 2. When to use / When NOT to use

```markdown
**Используй когда:**
- Нужно сгруппировать связанные элементы в visual container
- Список с однородной структурой items (e.g., product listings)
- Hero блок с image + text + CTA

**НЕ используй когда:**
- Достаточно padding/border без visual container (см. List Item)
- Контент уникален и не повторяется (использовать composition layout)
- Нужна nested структура карточек (anti-pattern, см. anti-slop-audit)
```

### 3. Anatomy diagram

Визуальная иерархия частей. Picture or labeled diagram.

```markdown
## Anatomy

```
┌─────────────────────────┐
│ [Image/Media]           │ ← Card.Image (optional)
├─────────────────────────┤
│ Title                   │ ← Card.Title (required)
│ Description text...     │ ← Card.Description (optional)
│                         │
│ [Footer / Actions]      │ ← Card.Footer (optional)
└─────────────────────────┘
```
```

### 4. Variants

Все enum-значения с визуалами:

```markdown
## Variants

### intent
- `default` — neutral container
- `selected` — highlighted state (для list contexts)
- `interactive` — clickable card with hover state

### size
- `compact` — minimal padding
- `default` — стандартный
- `spacious` — generous padding для hero contexts
```

### 5. States

Default / hover / focus-visible / disabled / loading / error:

```markdown
## States

| State | Когда | Visual |
|---|---|---|
| Default | Idle | <image> |
| Hover | Если interactive | Subtle elevation increase |
| Focus-visible | Keyboard navigation | Visible focus ring |
| Active | Press / click | Slight scale down |
| Disabled | Card нельзя interactуть | Opacity 0.5, no pointer events |
| Loading | Async content | Skeleton |
```

### 6. Props API table

```markdown
## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `intent` | `'default' \| 'selected' \| 'interactive'` | `'default'` | No | Visual intent |
| `size` | `'compact' \| 'default' \| 'spacious'` | `'default'` | No | Padding scale |
| `as` | `ElementType` | `'div'` | No | HTML element (`div`, `article`, `a`) |
| `onClick` | `() => void` | — | No | Click handler (превращает в interactive) |
| `loading` | `boolean` | `false` | No | Show skeleton |
| `children` | `ReactNode` | — | Yes | Card content (используй Card.Title, Card.Image и т.д.) |
```

### 7. Usage do/don't

```markdown
## Do / Don't

### Do
- Use `Card.Title` for primary heading
- Use `intent="interactive"` only when entire card is clickable
- Keep content concise — 1-2 paragraphs max per card

### Don't
- Nest cards within cards (anti-pattern)
- Use multiple primary actions in one card (one primary per card)
- Mix Card with Banner — they have different semantic intent
```

### 8. Composition examples

```tsx
// Basic
<Card>
  <Card.Title>Заказ #1234</Card.Title>
  <Card.Description>3 товара, доставка завтра</Card.Description>
</Card>

// With image
<Card>
  <Card.Image src="..." alt="Product" />
  <Card.Title>Product name</Card.Title>
  <Card.Description>Description...</Card.Description>
  <Card.Footer>
    <Button intent="primary">Купить</Button>
  </Card.Footer>
</Card>

// Interactive (entire card clickable)
<Card intent="interactive" as="a" href="/orders/1234">
  <Card.Title>Заказ #1234</Card.Title>
</Card>
```

### 9. Accessibility

```markdown
## Accessibility

**Semantic HTML:**
- Default: `<div>` (если non-interactive)
- Interactive: `<a>` (если link) или `<button>` (если action)
- Article context: `<article>` (если standalone content piece)

**Keyboard:**
- If interactive: focusable via Tab
- Enter / Space activates

**Screen reader:**
- Accessible name = Card.Title content
- If interactive: announced as button/link

**Focus:**
- Focus-visible ring on keyboard focus
- НЕ `outline: none` без альтернативы

**Contrast:**
- Background to body text: WCAG AA 4.5:1
- Border (если есть): 3:1
```

### 10. Code examples (per framework)

```markdown
## Code examples

### React
\`\`\`tsx
import { Card } from '@/components/Card';
// ... usage
\`\`\`

### Vanilla HTML/CSS
\`\`\`html
<div class="card">
  <h3 class="card-title">...</h3>
</div>
\`\`\`
```

### 11. Live playground

```markdown
## Playground

- [Storybook](link)
- [CodeSandbox](link)
```

### 12. Design specs

```markdown
## Figma

- [Card component in Figma](https://figma.com/...)
- Variant property: `intent`, `size`
- Tokens used: `card.bg`, `card.border`, `card.padding`
```

### 13. Tokens used

```markdown
## Tokens

| Property | Token |
|---|---|
| Background | `--bgColor-default` |
| Border | `--borderColor-default` |
| Border radius | `--radius-md` |
| Padding (default) | `--stack-padding-normal` |
| Padding (compact) | `--stack-padding-condensed` |
| Padding (spacious) | `--stack-padding-spacious` |
| Shadow | `--shadow-resting-small` |
| Hover shadow | `--shadow-floating-small` |
```

### 14. Changelog / version

```markdown
## Changelog

### v2.0.0 (2026-02-15) — Breaking
- Renamed `variant` prop to `intent` (semantic)
- Removed `size="huge"` — use `spacious` instead

### v1.5.0 (2026-01-10)
- Added `loading` prop

### v1.0.0 (2025-12-01)
- Initial release
```

### Migration notes

Для breaking changes:

```markdown
## Migration from v1 to v2

\`\`\`diff
- <Card variant="default">
+ <Card intent="default">
\`\`\`
```

## Где живёт документация

| Уровень | Где |
|---|---|
| **Reference doc** | DS website / Storybook / Mintlify |
| **In-code JSDoc** | Component file (краткое) |
| **Figma description** | Component property in Figma |
| **README.md** | В папке компонента в репо |

**Принцип:** документация **near the code**, обновляется вместе с кодом (не в отдельной wiki которая устаревает).

## Anti-patterns

| Anti-pattern | Симптом |
|---|---|
| Документация только в Figma | Dev не видит когда кодит |
| Документация только в Storybook | Дизайнер не видит |
| README устарел | Drift между doc и code |
| Нет migration notes для breaking | Боль при upgrade |
| «See code for usage» — нет examples | Black box |
| Documentation < component code | Невозможно использовать |
| Описание «что» без «почему» | Неясно когда применять |

## Связанные файлы

- `design-system/design-system-core.md` — DS principles
- `design-system/component-anatomy.md` — структура компонента детально
- `design-system/tokens-spec.md` — tokens для referencing
- `pd-workflows/design-handoff.md` — handoff format
- `pd-workflows/accessibility-audit.md` — a11y specs

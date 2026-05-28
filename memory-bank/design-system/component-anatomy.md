# Component Anatomy

Структура компонента: anatomy, variants, states, props. Источники: Brad Frost (Atomic Design), GitHub Primer, Nathan Curtis (Components as Data).

## 4 структурных части компонента

| Часть | Что | Где живёт |
|---|---|---|
| **Anatomy** | Иерархия elements (container, region, slot). Соответствует DOM / Figma FRAME | Layer names |
| **Props** | Конфигурация компонента | Component properties / TS props |
| **States** | default / hover / focus / active / disabled / loading / error / selected / expanded | State modifiers в токенах |
| **Variants** | Комбинации props дающие визуально различные формы | Variant property в Figma / enum в коде |

## Когда что выбрать

### Variant
**Когда:** меняется визуал (цвет, размер, layout), **но не структура**.

```
intent: primary | secondary | danger
size: sm | md | lg
state: default | hover | focus | active | disabled
```

**Naming — semantic, не visual:**
- ✅ `intent: primary | secondary | danger`
- ✅ `size: sm | md | lg`
- ❌ `color: blue | grey | red`
- ❌ `button: home-page`

### Boolean prop
**Когда:** нужно показать/скрыть элемент (icon visibility, dismissible, hasIcon).

В Figma — Boolean property. В коде — `boolean`.

### Slot / Instance swap
**Когда:** контент должен быть произвольным — иконка любая, content area произвольная.

В Figma — Instance swap property. В коде — `children` / `slot` prop.

**Альтернатива bloat-у:** вместо 5 boolean visibility props → 1 slot.

### Отдельный компонент
**Когда:** anatomy/structure фундаментально различны.

Test: если для нового варианта нужно поменять anatomy (добавить region, перестроить layout) — это **отдельный компонент**, не variant.

Примеры:
- Button vs IconButton — может быть один компонент с `iconOnly` boolean, может быть два. Зависит от того насколько различается anatomy.
- Card vs Banner — разная structure → отдельные.

## Order of props (best practice)

1. **Root-level props** (Variant, root Visibility) — первыми
2. **По структуре сверху вниз** (как в DOM)
3. **Самые важные — выше**

## States — обязательный набор

Для **любого** интерактивного элемента:

| Состояние | Селектор / prop | Обязательно? |
|---|---|---|
| **Rest / default** | (none) | ✓ всегда |
| **Hover** | `:hover` | ✓ для interactive |
| **Focus** | `:focus-visible` (НЕ `:focus`) | ✓ всегда для interactive |
| **Active** | `:active` | ✓ для clickable |
| **Disabled** | `:disabled` / `[aria-disabled]` | ✓ если состояние возможно |
| **Loading** | свой класс/prop | ✓ для async |
| **Error** | свой класс/prop | ✓ для validatable (forms) |
| **Selected** | `[aria-selected]` | ✓ для list items / tabs |
| **Expanded** | `[aria-expanded]` | ✓ для collapsibles |

Состояния реализуются через **state modifiers в semantic tokens**, не как отдельные variants. Пример: `button-primary-bgColor-rest` vs `button-primary-bgColor-hover`.

## Anti-patterns

| Anti-pattern | Симптом | Источник |
|---|---|---|
| **Component sprawl** | Library accumulating UI assets faster than it can govern them | Frost |
| **Over-fragmentation** | atom Button-Primary, Button-Secondary как отдельные компоненты | Frost |
| **God component** | Один Button с 30 props на любой случай | research |
| **Visual naming of variants** | `color: blue` вместо `intent: primary` | Frost / Curtis |
| **Visibility props instead of slots** | 5 booleans для разных опциональных элементов | research |
| **Treating every repeat as extraction** | Преждевременная абстракция | Frost |
| **Variants for content** | Вариант для каждой иконки внутри Button | research |
| **Missing states** | Только default, без hover/focus/disabled | research |
| **`:focus` instead of `:focus-visible`** | Focus ring при клике мышью | a11y best practice |
| **Inline content вместо slot** | `iconName` prop вместо `<Icon>` slot | research |

## Composition over configuration

Когда компонент имеет много вариантов — рассмотри **composition** вместо props.

❌ God component:
```tsx
<Card
  hasImage
  imageUrl="..."
  hasTitle
  title="..."
  hasDescription
  description="..."
  hasFooter
  footerActions={[...]}
/>
```

✅ Composition:
```tsx
<Card>
  <Card.Image src="..." />
  <Card.Title>...</Card.Title>
  <Card.Description>...</Card.Description>
  <Card.Footer>
    <Button>...</Button>
  </Card.Footer>
</Card>
```

Composition (Card.Image / Card.Title / Card.Footer) даёт **гибкость** без раздувания props API.

## Documentation per component (минимум)

Для каждого компонента в DS:

1. **Description** — что это, для чего
2. **Anatomy diagram** — визуальная иерархия частей
3. **Variants** — все enum-значения с визуалами
4. **States** — default/hover/focus/disabled/error/loading с визуалами
5. **Props API table** — name, type, default, description, required
6. **Usage do/don't** — когда использовать, когда не использовать. Альтернативы
7. **Composition examples** — как комбинируется
8. **Accessibility** — keyboard, screen reader, contrast, ARIA roles, focus management
9. **Code examples** — для каждого фреймворка
10. **Live playground** — Storybook / interactive demo
11. **Design specs** — link на Figma component
12. **Tokens used** — какие semantic tokens
13. **Changelog / version** — semver
14. **Migration notes** — для breaking changes

См. `pd-workflows/component-documentation.md` для детального шаблона.

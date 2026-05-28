# Motion Rules

Правила анимаций и движения в UI. Источники: Emil Kowalski, Joshua Comeau, Refactoring UI, Apple HIG, Material 3.

## Главный принцип

> *«Knowing when to animate is just one of many things you need to know in order to craft great animations»* — Emil Kowalski

Не каждое изменение требует анимации. Чем больше анимаций — тем меньше эффект каждой.

## Hard rules (применять всегда)

1. **Анимируй только `transform` и `opacity`.** Это два свойства которые дёшево анимировать через композитинг.
2. **Не используй `transition: all`.** Будущие изменения CSS вызовут неожиданные анимации.
3. **UI-анимации ≤ 300ms.** Спиннеры и переходы быстрее = отзывчивее.
4. **`prefers-reduced-motion` обязательно.** Уважай системную настройку пользователя:
   ```css
   @media (prefers-reduced-motion: reduce) {
     transition: none;
   }
   ```
5. **Не анимируй `width` / `height`.** Каскад reflow. Используй transform/scale.

## Easing decision tree

| Случай | Easing |
|---|---|
| Элемент входит на экран | `ease-out` (объект «прилетает и оседает») |
| Элемент уходит за viewport | `ease-in` (требует осторожности, может быть резко) |
| Циклическая анимация (loop fade) | `ease-in-out` |
| Hover state change | `ease` (дефолт работает) |
| По умолчанию когда не уверен | `ease-out` |
| Энергичность критична | **Custom cubic-bezier** (built-in CSS недостаточен) |

> *«Custom easing feels more energetic»* — Emil. Для production craft — кастомные кривые работают лучше встроенных.

## Action-driven motion

> Думай об **событиях, а не о состояниях** *(Joshua Comeau)*.

Hover-вход и hover-выход должны иметь **разную длительность**:

```css
.button {
  transition: transform 125ms ease-out;  /* быстрый вход */
}
.button:not(:hover) {
  transition-duration: 450ms;  /* медленный выход */
}
```

Симметричные transitions (300ms in, 300ms out) ощущаются «как робот».

## Origin-aware анимации

Анимация должна **выходить из логического источника** *(Emil)*. Dropdown открывается из кнопки, а не появляется из центра.

```css
.dropdown-content {
  transform-origin: var(--radix-dropdown-menu-content-transform-origin);
}
```

Используй CSS-переменные origin (например, Radix UI их предоставляет) или вычисляй вручную.

## Scale-правила

| Правило | Почему |
|---|---|
| **Никогда не анимируй с `scale(0)`** | Объект исчезает мгновенно, выглядит неестественно |
| **Старт с `scale(0.95)` или `0.9`** | Объект остаётся видимым, движение плавное |
| **Active state → `scale(0.97)`** | Тактильная обратная связь без bounce |
| **Не комбинируй `scale(0) + opacity(0)`** | То же что выше — лучше `scale(0.95)` |

## Когда **не** анимировать

| Случай | Почему |
|---|---|
| Часто повторяющиеся действия (открытие command palette N раз в день) | Превращается в раздражитель |
| Клавиатурная навигация (стрелки, tab) | *«You should never animate them»* — создаёт ощущение задержки |
| Когда user явно спешит / работает по сценарию | Анимация = трение |
| Каждый hover мелкого элемента | Шум |

## CSS Transforms нюансы (Emil)

| Функция | Best practice |
|---|---|
| `translate()` | Использовать **проценты** (`translateY(100%)`) — адаптивно к размеру элемента |
| `scale()` | См. Scale-правила выше |
| `rotate()` | Реже нужен. Для естественности (drawer с лёгким наклоном) |
| `3D transforms` | `rotateX/Y` + `transform-style: preserve-3d` для глубины |
| `transform-origin` | Основа origin-aware. По умолчанию центр |

> *«Percentage values are less error-prone since they're relative to the element's own size»*

## Финальный штрих

> *«Filter: blur(2px) как последний шаг»* — Emil

`filter: blur(2px)` маскирует мелкие неровности перехода между состояниями. Применяй точечно, не везде.

## Anti-patterns

| Anti-pattern | Симптом | Источник |
|---|---|---|
| `transition: all` | Скрытые поломки в будущем | Comeau |
| Симметричные hover (300ms / 300ms) | Ощущается «как робот» | Comeau |
| `scale(0)` старт | Объект телепортируется | Kowalski |
| Анимация `height: auto` | Тормоза, jank | Comeau / Kowalski |
| Анимация на каждый клавиатурный action | Замедляет работу | Kowalski |
| Bounce / elastic без причины | Generic-AI-look | Refactoring UI |
| Built-in CSS easing для critical motion | Не передаёт нужной энергии | Kowalski |
| Нет `prefers-reduced-motion` | Accessibility сломана | research consensus |

## Performance

- Только `transform`/`opacity` (causes только composite, не layout/paint).
- `will-change: transform` перед сложной анимацией — но **не** оставлять навсегда.
- Hardware acceleration (CSS transition / WAAPI) > JS animation для UI.
- Прерываемость: пользователь должен мочь прервать анимацию в любой момент с плавным переходом (Framer Motion, WAAPI).

## Cross-platform

| Платформа | Длительность | Easing |
|---|---|---|
| Web UI | < 300ms | ease-out / custom |
| iOS native | < 250ms | Apple system easing |
| Android Material | < 300ms | Material standard easing |

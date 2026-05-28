# Research: Craft / UI quality

Глубокий research по теме craft в UI: что отличает работу высокого качества. Источники: Rauno Freiberg, Joshua Comeau, Emil Kowalski, Refactoring UI (Adam Wathan + Steve Schoger).

---

## Источники

1. Rauno Freiberg — Craft index — https://rauno.me/craft
2. Rauno Freiberg — Vercel Homepage 2023 — https://rauno.me/craft/vercel
3. Joshua Comeau — An Interactive Guide to CSS Transitions — https://www.joshwcomeau.com/animation/css-transitions/
4. Joshua Comeau — Full-Bleed Layout Using CSS Grid — https://www.joshwcomeau.com/css/full-bleed/
5. Emil Kowalski — Great Animations — https://emilkowal.ski/ui/great-animations
6. Refactoring UI book summary (erikuus/good-ui GitHub) — https://github.com/erikuus/good-ui
7. Top 20 Key Points from Refactoring UI (Abdul Khaleque, Bootcamp Medium) — https://medium.com/design-bootcamp/top-20-key-points-from-refactoring-ui-by-adam-wathan-steve-schoger-d81042ac9802

---

## Rauno Freiberg — craft через дисциплину invisible work

> *«performance and accessibility are not as glamorous or fruitful to obsess over — because seemingly, they are invisible»* — Rauno

Главное: craft — это сначала **невидимые** вещи (скорость, доступность, стабильность layout), потом — детали. Не наоборот.

### Конкретные техники

| Техника | Что | Когда применять |
|---|---|---|
| **Visual rhythm / novelty mapping** | Чередуй секции высокой и низкой новизны. Не клади 5 интерактивов подряд | Лендинги, длинный контент |
| **Grid-based architecture** | Жёсткая модульная сетка (например 3×360px). Позиция сетки консистентна между страницами | Любой многостраничный UI |
| **Progressive enhancement** | Базовый слой (CSS/SVG) → опт. слой (shader/WebGL) → graceful degradation | Hero, сложная графика |
| **Code-driven visuals** | Иллюстрации = React-компоненты, не картинки. Container Queries для адаптивности | Везде где можно |
| **Accessibility by default** | Screen reader test (VoiceOver), ARIA live для динамики, `aria-hidden` на декор | Все экраны |
| **Reduced motion** | `@media (prefers-reduced-motion: reduce)` обязательно | Любая анимация |

### Чек-лист craft (адаптировано из Rauno)

- [ ] Performance первичен перед эффектностью
- [ ] Визуальная новизна разбросана (не всё сразу)
- [ ] Grid консистентен на всех страницах
- [ ] Пройти с screen reader
- [ ] `prefers-reduced-motion` уважён
- [ ] Иллюстрации = компоненты, не статичные картинки
- [ ] ARIA labels на интерактивные элементы
- [ ] Fallback для браузеров без поддержки

---

## Emil Kowalski — анимации, которые не раздражают

> *«It's easy to start adding animations everywhere. The user then becomes overwhelmed and animations lose their impact»* — Emil

Главное: **не каждое изменение требует анимации.** Анимация — инструмент привлечения внимания. Чем больше — тем меньше эффект.

### Правила Emil

| Правило | Деталь |
|---|---|
| **Естественность** | *«Changes in web apps often occur instantly, which makes the experience feel artificial»* — UI должен иметь массу/инерцию как физический мир |
| **Длительность** | < 300ms. *«Snappy animations feel responsive and connected to user's actions»* |
| **Easing по умолчанию** | `ease-out` — снизу-вверх, входы. Для всех быстрых движений |
| **Только transform/opacity** | Hardware-acceleration, остальное — caused reflow и тормозит |
| **Прерываемость** | Юзер может прервать анимацию в любой момент с плавным переходом (Framer Motion, WAAPI) |
| **Не анимируй частые действия** | Клавиатурные команды, повторяющиеся клики — без анимации |
| **Гармония** | Easing/timing соответствуют стилю продукта — «анимация чувствует себя правильно» |

---

## Joshua Comeau — CSS как инструмент craft

### Правила transitions (Comeau)

> *«transform и opacity — это два свойства, которые очень дёшево анимировать»*

| Свойство | Применение | Анти-pattern |
|---|---|---|
| `transition: all` | Никогда | Будущие изменения вызовут неожиданные анимации |
| Animate `height/width` | Только при крайней необходимости | Каскад reflow |
| `transform`/`opacity` | По умолчанию | — |
| `will-change: transform` | Перед сложной анимацией | Не оставлять навсегда |

### Easing по контексту (Comeau)

- `ease-out` — для входов («что-то приехало и осело»)
- `ease-in` — для выходов из viewport (внимание: «внезапная остановка резкая»)
- `ease` — дефолт, *«ease — обычно хороший выбор»*
- `ease-in-out` — циклические (fade in/out на повтор)

### Action-driven motion

> Думай о **событиях, а не о состояниях**.

Hover-вход быстрее hover-выхода: например 125ms in, 450ms out. Симметричные transitions — школьная ошибка.

### Full-bleed layout

> *«Research has shown that the ideal line length is about 65 characters»*

Контент в узкой колонке (текст), но картинки/видео — на полную ширину. CSS Grid:

```css
.wrapper {
  display: grid;
  grid-template-columns: 1fr min(42rem, 100%) 1fr;
}
.wrapper > * { grid-column: 2; }
.full-bleed { grid-column: 1 / -1; }
```

---

## Refactoring UI (Wathan + Schoger) — практические tactics

> Главная философия: *«Design with tactics, not talent»*

### Hierarchy и контраст

| Правило | Детали |
|---|---|
| Размер ≠ единственный сигнал | Используй: размер + вес + цвет + положение |
| Серый = вторичная инфа | Хочешь что-то приглушить — снижай контраст, не уменьшай размер |
| **Избегай чистого чёрного** | Всегда чуть-тёплый/холодный серый. `#000000` — никогда |
| **Контраст для читаемости** | Текст к фону: минимум WCAG AA |

### Spacing и layout

| Правило | Деталь |
|---|---|
| **Whitespace generously** | Дешевле увеличить padding, чем расположить элементы |
| **Spacing system** | 4/8/16/24/32/48/64/96 px — не произвольные значения |
| **Размер относителен** | Размер одного элемента всегда в контексте соседей |
| **Группировка** | Группы через близость + общее пространство |
| **Выравнивание** | Vertical + horizontal alignment — основа порядка |

### Color

| Правило | Деталь |
|---|---|
| **Не одна шкала, а семейство** | Brand + grey + success/warn/error/info. Каждый — 9 ступеней (50–900) |
| **Saturation падает на крайних** | Чистый цвет работает в середине шкалы. На светлых и тёмных нужна шкала «к серому» |
| **Цвет — для акцента** | Используй редко, только для важного |
| **Тестируй grayscale** | Если интерфейс работает в чёрно-белом — иерархия верна |

### Typography

| Правило | Деталь |
|---|---|
| **Шрифт > 16px на body** | Минимум для веба. Меньше — только captions |
| **Ограничь семейства** | 1-2 шрифта на проект. Веса используй для иерархии |
| **Line-height обратен размеру** | Большой шрифт → меньший line-height. Body → 1.5, headlines → 1.1-1.2 |
| **Letter-spacing** | Крупный текст → tighten (-0.02em). Caps/small → loosen (+0.05em) |

### Depth (тени и elevation)

| Правило | Деталь |
|---|---|
| **Тени имитируют свет** | Источник света сверху → тень снизу. Никогда не равномерные |
| **Layered shadows** | Объединяй несколько теней (близкая жёсткая + дальняя мягкая) |
| **Subtlety > drama** | Тонкие тени, не «выпуклые кнопки 2008» |

### Кнопки

| Правило | Деталь |
|---|---|
| **Primary != Secondary != Tertiary** | Чёткая иерархия. Primary заметнее всех |
| **Один primary на экран** | Если два — иерархия сломана |
| **Hover/focus/active явные** | Не только цвет — добавь shadow/scale/border |

### Forms

| Правило | Деталь |
|---|---|
| **Сократи поля до минимума** | Каждое поле — друг или враг |
| **Метки явные** | Не placeholder вместо label |
| **Группировка** | Связанные поля рядом |

---

## Cross-author принципы (что говорят ВСЕ)

Это самое ценное — то, в чём согласны независимо.

1. **Производительность первична** (Rauno + Comeau + Kowalski) — это часть craft, не отдельное «потом»
2. **Анимация только `transform`/`opacity`** (Comeau + Kowalski) — единственный безопасный способ
3. **`prefers-reduced-motion` обязательно** (Comeau + Kowalski + Rauno) — accessibility-first
4. **Anti-`transition: all`** (Comeau + Kowalski) — явно перечисляй свойства
5. **Action-driven motion** (Comeau + Kowalski) — hover-вход/выход разной длительности
6. **< 300ms для UI-анимаций** (Comeau + Kowalski) — быстрее = отзывчивее
7. **Иерархия через несколько сигналов** (Refactoring UI + Rauno) — размер + вес + цвет + положение
8. **Whitespace > украшения** (Refactoring UI + Rauno) — пространство решает большинство проблем

---

## Anti-patterns (то что выдаёт AI/junior-работу)

| Anti-pattern | Симптом | Источник |
|---|---|---|
| Чистый `#000000` | Жжёт глаза, выглядит резко | Refactoring UI |
| Тени по умолчанию (`box-shadow: 0 2px 4px rgba(0,0,0,0.1)`) | Generic-AI-look | Refactoring UI + Rauno |
| Симметричные hover-transitions (300ms in, 300ms out) | Ощущается «как робот» | Comeau + Kowalski |
| `transition: all` | Скрытые поломки в будущем | Comeau |
| 5+ интерактивных секций подряд | User overwhelm | Rauno + Kowalski |
| Анимация повторяющихся действий | Шум | Kowalski |
| `height: auto` анимация | Тормоза, jank | Comeau + Kowalski |
| Иллюстрации как PNG/JPG там где можно SVG/код | Не масштабируется | Rauno |
| Кнопки в один цвет (нет primary/secondary различия) | Сломанная иерархия | Refactoring UI |
| Размер шрифта < 16px на body | Нечитаемо | Refactoring UI |
| Placeholder как label | Доступность сломана | Refactoring UI |

---

## Применимость к правилам AI-агента

Конкретные правила для memory-bank:

### craft-core.md — добавить/уточнить

1. **Craft чек-лист** (адаптированный из Rauno) — добавить как обязательный пред-полировки
2. **Cross-author принципы** — внести в качестве «universal craft principles»
3. **Anti-patterns table** — добавить как обязательный pre-flight check для AI-генерируемого UI

### visual-registers.md

4. **Чёрный никогда не #000000** — добавить как hard rule
5. **Цветовая шкала: 9 ступеней + 5 семейств** — фиксированная структура
6. **Тестируй grayscale для проверки иерархии** — добавить как метод

### anti-slop-audit.md

7. **AI-look antipatterns table** — встроить полную таблицу из этого research
8. **«5+ интерактивов подряд = overwhelm»** — конкретное правило

### frontend-implementation-rules.md

9. **`transition: all` запрещён** — hard rule
10. **Только `transform`/`opacity` для анимаций по умолчанию** — hard rule
11. **Hover-вход быстрее hover-выхода** (action-driven motion) — hard rule
12. **`prefers-reduced-motion` обязателен** — pre-flight check
13. **Размер шрифта body минимум 16px** — hard rule

### react-ds-workflow.md

14. **Иллюстрации = React-компоненты, не картинки** — добавить как принцип
15. **Container Queries вместо media queries** где возможно

---

## Чего не нашёл / для дальнейшего изучения

- Benji Taylor — у него нет single seminal article, нужен скрейпинг Twitter/X для системного review
- Кейс-стади Linear Method — публичные принципы Linear не нашёл в одной точке

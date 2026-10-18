# Anti-Slop Audit

Финальная проверка чтобы интерфейс не выглядел как generic AI output. Источники: Refactoring UI, Emil Kowalski, Rauno Freiberg, Joshua Comeau.

## Когда применять

После того как функциональная готовность достигнута:
- Все states работают
- Responsive проверен
- A11y baseline пройден
- Контент реалистичный

Anti-slop = последний шаг перед production.

## Anti-patterns table (то что выдаёт AI/junior-работу)

### Typography

| Anti-pattern | Симптом | Источник |
|---|---|---|
| Inter / system font по лени в brand / premium / editorial | Generic | research |
| Нет реального type scale (произвольные размеры) | Каша | Refactoring UI |
| Слишком много размеров шрифтов (>5 на экране) | Размытая иерархия | Refactoring UI |
| Нет line-height / readable measure | Тяжело читать | Comeau |
| Body < 16px на web | Нечитаемо | Refactoring UI |
| `placeholder` вместо `<label>` | A11y сломана | research |

### Color

| Anti-pattern | Симптом | Источник |
|---|---|---|
| Дефолтный purple-blue gradient | Generic-AI-look | research consensus |
| Чистый `#000` / `#fff` без причины | Жёстко выглядит | Refactoring UI |
| Случайная палитра без стратегии | Хаос | Refactoring UI |
| Accent используется везде | Иерархия сломана | Refactoring UI |
| Brand-color tokens для роли (`brand-red` для error) | Сломано при ребрендинге | Curtis |
| Иерархия только через цвет (grayscale test fails) | Слабая | Refactoring UI |

### Layout

| Anti-pattern | Симптом | Источник |
|---|---|---|
| Generic 3-column card grid (без причины) | AI-look | research |
| Nested cards (cards within cards) | Не сделано | research |
| Все радиусы / отступы / тени одинаковые | Плоско | Refactoring UI |
| Нет visual rhythm | Монотонно | Rauno |
| 5+ интерактивных секций подряд | User overwhelm | Kowalski / Rauno |
| Generic shadow `0 2px 4px rgba(0,0,0,0.1)` везде | Generic-AI-look | research |

### Components

| Anti-pattern | Симптом | Источник |
|---|---|---|
| Нет states (hover / focus-visible / active / disabled) | Половина компонента | research |
| Loading / error states отсутствуют где должны быть | Сломано | research |
| Detached one-off элементы | Inconsistent | research |
| Компоненты используются непоследовательно | Visual noise | research |
| Visual naming variants (`color: blue`) | Сломано при rebrand | Frost / Curtis |
| God component (30 props) | Несопровождаемо | research |

### Content

| Anti-pattern | Симптом | Источник |
|---|---|---|
| Lorem Ipsum | Не finished | research |
| John Doe / Acme / fake startup | Generic | research |
| Фейковые метрики без placeholder пометки | Misleading | research |
| CTA `Submit` / `OK` / `Click here` | Generic | research |
| Длинные generic descriptions ChatGPT-стиля | AI-look | research |

### Motion

| Anti-pattern | Симптом | Источник |
|---|---|---|
| Motion ради motion (анимация на каждый pixel) | Шум | Kowalski |
| Анимация на частых действиях и клавиатуре | Ощущение задержки | Kowalski |
| `ease-in` на UI-элементе | Старт с задержкой — ощущается медленно | Kowalski |
| Bounce / elastic без импульса от жеста | Generic-AI-look | `apple-design` |
| Нет `prefers-reduced-motion` — или он отключает **всё** | A11y сломана / потеряна понятность | Kowalski, `apple-design` |
| `transition: all` | Скрытые поломки | Comeau |
| Долгий hover на частых элементах | Интерфейс «тормозит» | MIFB, Kowalski |
| Hover-scale без `@media (hover: hover)` | Залипает на тач-экранах | Kowalski |
| Animation `width / height` | Тормоза | `animation-performance` |
| `scale(0)` старт | Объект телепортируется | Kowalski |
| 5+ animated elements одновременно | Хаос | Kowalski |

Как делать правильно — `craft/motion-rules.md` → скиллы-первоисточники.

### Spacing

| Anti-pattern | Симптом | Источник |
|---|---|---|
| Произвольные значения (не из spacing scale) | Inconsistent | Refactoring UI |
| `margin` для отступов между flex/grid детьми | Хак | research |
| Cramped (всё прижато) | Утомительно | Refactoring UI |
| Equal padding везде | Нет hierarchy | Refactoring UI |

### Mobile-specific

| Anti-pattern | Симптом | Источник |
|---|---|---|
| Слишком много glassmorphism | Generic | research |
| Слишком много градиентов | Generic-AI-look | research |
| Cards in cards | Не сделано | research |
| Несистемные radii / spacing | Inconsistent | research |
| Hover-only UX на mobile | Не работает | research |
| Carousels с тонкими точками | UX broken | research |
| Custom dropdown вместо native picker | Hostile | research |

См. также `platforms/mobile-craft-rules.md` для mobile-specific полностью.

## Формат результата audit

Для каждого finding:

```markdown
## Finding: <короткое описание>

**Где:** <конкретное место в интерфейсе>
**Почему проблема:** <ссылка на anti-pattern / правило / источник>
**Как исправить:** <конкретное действие>
**Severity:** low / medium / high
```

### Severity критерии

| Severity | Когда |
|---|---|
| **High** | Сломана функциональность / a11y / основное действие |
| **Medium** | Visible поломка craft, но не блокирует use |
| **Low** | Polish nuance, можно отложить |

## Чек-лист быстрой проверки (под 5 минут)

- [ ] Body text ≥ 16px (web) / ≥ 13pt (iOS) / ≥ 14sp (Android)
- [ ] Текст и поверхности — не `#000000` (прозрачные обводки и тени — можно)
- [ ] Grayscale test пройден (иерархия не только через цвет)
- [ ] Все interactive элементы имеют hover / focus-visible / active
- [ ] Loading / error / empty states присутствуют где нужно
- [ ] Reduced motion: перемещение убрано, opacity и цвет оставлены
- [ ] Анимируются `transform`/`opacity` (`filter`/`clip-path` — проверено); UI до 300ms, модалки и drawer до 500ms
- [ ] Нет `ease-in` на UI-элементах
- [ ] Реалистичный контент (не Lorem / John Doe)
- [ ] One primary action per screen
- [ ] Spacing из системы (не произвольные значения)
- [ ] Touch targets 44pt iOS / 48dp Android (если mobile)
- [ ] WCAG AA контраст для текста (4.5:1 body, 3:1 large)

## Если что-то не получается — ссылайся

| Категория | Файл |
|---|---|
| Цвет / типографика / spacing / depth | `craft-core.md` |
| Motion / анимации | `motion-rules.md` |
| Mobile-specific | `platforms/mobile-craft-rules.md` |
| Visual register разделение | `visual-registers.md` |
| Component anatomy / states | `design-system/component-anatomy.md` |

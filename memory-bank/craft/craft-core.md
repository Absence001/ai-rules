# Craft Core

Принципы визуального качества и polish. Craft-layer не меняет scope, research, IA или бизнес-логику — только качество исполнения.

## Главный принцип

**Craft = объяснимые решения, не магия.** Не проси «сделать красиво»; объясняй что именно улучшает интерфейс и почему. См. `craft/taste-development.md`.

## Cross-author принципы (что говорят ВСЕ)

Это то, в чём согласны независимые эксперты — самое надёжное основание.

1. **Performance первично** — невидимые вещи (скорость, accessibility, layout stability) — часть craft, не «потом» *(Rauno Freiberg)*
2. **Анимация только `transform`/`opacity`** — единственный безопасный способ *(Comeau + Kowalski)*
3. **`prefers-reduced-motion` обязательно** — accessibility-first *(все)*
4. **Anti-`transition: all`** — явно перечисляй свойства *(Comeau)*
5. **Action-driven motion** — hover-вход/выход разной длительности *(Comeau + Kowalski)*
6. **UI-анимации < 300ms** — быстрее = отзывчивее *(Comeau + Kowalski)*
7. **Иерархия через несколько сигналов** — размер + вес + цвет + положение *(Refactoring UI + Rauno)*
8. **Whitespace > украшения** — пространство решает большинство проблем *(Refactoring UI + Rauno)*

## Когда использовать craft-layer

| Задача | Применять? |
|---|---|
| UI / frontend | Да |
| Screenshot → код | Да |
| Redesign / visual polish | Да |
| Landing / brand / portfolio | Да |
| Mobile screens | Да |
| Prototype quality | Да |
| Research-only | Нет |
| Backend-only | Нет |
| Config / debug | Нет |

## Craft commands (глаголы)

| Команда | Что делает |
|---|---|
| `shape` | Спланировать визуальную структуру до кода |
| `critique` | Найти слабые места |
| `audit` | Проверить по правилам и anti-patterns (`anti-slop-audit.md`) |
| `polish` | Довести уже рабочий UI |
| `distill` | Убрать лишнее |
| `typeset` | Улучшить типографику |
| `layout` | Улучшить сетку, spacing, rhythm |
| `animate` | Добавить уместный motion (`motion-rules.md`) |
| `harden` | Проверить states, accessibility, responsive |

## Hard rules (применять всегда)

### Цвет

1. **Чёрный никогда `#000000`.** Всегда чуть тёплый/холодный серый (`#1a1a1a`, `#0f0f0f`).
2. **Иерархия через несколько сигналов**, не только цвет. Минимум 2: size + weight + position + color + spacing.
3. **Grayscale test** — открой дизайн в чёрно-белом. Если иерархия НЕ работает → визуал держится только на цвете = недостаточно.
4. **Цвет для акцента, не для всего.** Один-два важных элемента акцентируются — остальное приглушено.

### Типографика

5. **Body ≥ 16px (web), ≥ 13pt (iOS), ≥ 14sp (Android).**
6. **Line-height обратен размеру.** Body ~1.5, headlines ~1.1-1.2.
7. **Letter-spacing адаптивный.** Крупный текст → tighten (-0.02em). Caps / small → loosen (+0.05em).
8. **Один-два шрифт-семейства** на проект максимум. Веса для иерархии.

### Spacing

9. **Spacing system.** Шкала 4/8/16/24/32/48/64/96 — не произвольные значения.
10. **Whitespace generously.** Часто проблема решается padding, не перестановкой элементов.
11. **`gap` вместо margin** для flex/grid детей.

### Depth (тени)

12. **Тени имитируют свет.** Источник сверху → тень снизу. Не равномерные «вокруг».
13. **Layered shadows.** Близкая жёсткая (1-2px) + дальняя мягкая (8-24px blur).
14. **Subtle > drama.** Не выпуклые кнопки 2008-го.

### Hierarchy

15. **One primary action per screen.** Если две primary — иерархия сломана.
16. **Hover/focus/active явные.** Не только цвет — добавь shadow / scale / border.

## Visual rhythm и novelty mapping

> *«Не использовать одни и те же анимации подряд. Чередовать секции высокой новизны (интерактивные) с низкой (микроанимации)»* — Rauno Freiberg

**Правило 5+:** если 5+ интерактивных секций подряд — user overwhelmed. Чередуй с тишиной.

## Polish — когда

**Polish ≠ начало работы.** Делать **после**:
- Все states работают (hover, focus, disabled, loading, error)
- Responsive проверен на 3 breakpoints
- A11y baseline пройден (keyboard, contrast, screen reader)
- Контент реалистичный (не Lorem Ipsum)

## Формат важных правок

```
BEFORE: <текущее состояние>
AFTER:  <предложенное состояние>
WHY:    <конкретная причина, ссылка на правило/принцип/источник>
```

## Связанные файлы

- `craft/visual-registers.md` — выбор visual register перед polish
- `craft/anti-slop-audit.md` — финальный чек-лист
- `craft/motion-rules.md` — детальные правила анимаций
- `craft/taste-development.md` — манифест taste через явные правила
- `platforms/frontend-implementation-rules.md` — реализация в коде

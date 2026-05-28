# Wireframing

Lo-fi проектирование до hi-fi визуала. Дешёвая итерация для проверки IA и flow.

## Когда использовать

| Задача | Wireframe? |
|---|---|
| Новый сценарий / flow | Да, обязательно |
| Сложная IA / multi-step process | Да |
| Изменение существующего flow | Если меняется > 1 экран |
| Простой компонент (single button, badge) | Нет |
| Polish существующего UI | Нет |

## Главный принцип

**Wireframe ≠ дешёвый визуал.** Это инструмент проверки IA, flow, иерархии — БЕЗ отвлечения визуальными деталями.

> *«Design is the art of being wrong safely»* — Samsonov. Wireframe = самый дешёвый уровень ошибиться.

## Fidelity ladder (от низшего к высшему)

| Уровень | Что | Когда применять |
|---|---|---|
| **Sketch** | Бумага / whiteboard / Excalidraw | Идея, ranscript первичной структуры |
| **Lo-fi wireframe** | Серые блоки, базовая типографика, no color | Проверка IA и hierarchy |
| **Mid-fi wireframe** | Реальный контент, basic styling, no brand colors | Проверка flow с stakeholders |
| **Hi-fi mockup** | Полный визуал, brand, типографика, цвет | Финальное согласование, dev handoff |
| **Prototype** | Кликабельный hi-fi | User testing, demo |

**Правило:** не прыгай через ступени. Lo-fi сначала, hi-fi после.

## Что должно быть в lo-fi wireframe

| Элемент | Уровень детализации |
|---|---|
| Структура и расположение блоков | Точно (это главное) |
| Иерархия (что важно, что менее) | Точно |
| Содержимое (что за блок) | Описать словом / placeholder |
| Основной CTA | Точно где, размер |
| Состояния (states) | Базовые (default, error, empty) на отдельных wireframes |
| Цвета | Серые тона |
| Типографика | Один шрифт, разные веса для иерархии |
| Иконки | Простые иконки или просто прямоугольники |
| Brand | НЕТ |

## Wireframe для каждого state

**Не один wireframe = один экран.** Для каждого экрана:
- Default state
- Loading (если async)
- Empty (если контент может отсутствовать)
- Error (если действие может провалиться)
- Success (если действие успешно)
- Edge cases (offline, не залогинен и т.д.)

## Инструменты

| Уровень | Инструмент |
|---|---|
| Sketch | Бумага, Excalidraw, FigJam |
| Lo-fi wireframe | Figma (low-fi components), Whimsical, Balsamiq |
| Mid-fi | Figma с DS компонентами в greyscale variant |
| Hi-fi | Figma с полным DS |

## Что проверять на wireframe (до перехода к hi-fi)

- [ ] IA логична — главное действие очевидно
- [ ] Hierarchy через несколько сигналов (не только размер)
- [ ] Все states покрыты (default / loading / empty / error)
- [ ] Flow закрывает outcome из brief
- [ ] Sitemap соответствует
- [ ] Метки понятны не из контекста команды (Samsonov)
- [ ] Нет dead ends (тупиков)
- [ ] Можно отменить любое деструктивное действие

Если хоть один пункт «нет» → исправь **на wireframe**, не на hi-fi.

## Wireframe critique

Используй формат «I see / I think / I wonder» (см. `design-critique.md`):

- **I see:** «Главный CTA в правом верхнем углу»
- **I think:** «Большинство пользователей справа держат большой палец, но в thumb zone нижняя часть»
- **I wonder:** «Что если перенести CTA в bottom bar?»

## Anti-patterns

| Anti-pattern | Симптом |
|---|---|
| Skip wireframe, сразу hi-fi | Дорого исправлять IA на hi-fi |
| Hi-fi wireframe (с цветом, brand) | Отвлекает от IA-проблем |
| Lorem Ipsum вместо реалистичных placeholders | Невозможно оценить длину контента |
| Wireframe только default state | Пропускаешь edge cases |
| Wireframe без user flow context | Экран в вакууме |
| Wireframe который выглядит как hi-fi без бренда | Confusion — это draft или нет? |
| Polish wireframe (тратишь время на тени) | Ширма для отсутствия мыслей |

## Когда переходить к hi-fi

| Условие | Готовность |
|---|---|
| IA проверена | ✓ |
| Flow проверен с stakeholders | ✓ |
| Все states продуманы | ✓ |
| Метки финализированы | ✓ |
| Edge cases identified | ✓ |
| Outcome из brief закрывается | ✓ |

Если все ✓ → можно переходить к hi-fi (`ia-flow/flow-design.md` → `craft/`).

## Связанные файлы

- `ia-flow/ia-rules.md` — IA до wireframe
- `ia-flow/flow-design.md` — flow и states
- `pd-workflows/design-critique.md` — формат feedback
- `discovery/brief-expander.md` — outcome чтобы проверить на wireframe

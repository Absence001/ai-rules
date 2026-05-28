# Anti-Slop Audit

## Назначение

Финальная проверка, чтобы интерфейс не выглядел как generic AI output.

## Проверить

### Typography
- Нет ли Inter/system font “по лени” в brand/premium/editorial?
- Есть ли реальный type scale?
- Не слишком ли много размеров?
- Есть ли line-height и readable measure?

### Color
- Нет ли дефолтного purple-blue gradient?
- Нет ли чистого #000/#fff без причины?
- Есть ли стратегия цвета, а не случайная палитра?
- Accent используется редко и осмысленно?

### Layout
- Нет ли generic 3-column card grid?
- Нет ли nested cards?
- Есть ли visual rhythm?
- Не одинаковые ли все радиусы, отступы, карточки?

### Components
- Есть ли states: hover, focus-visible, active, disabled, loading/error where needed?
- Нет ли detached one-off элементов?
- Используются ли компоненты последовательно?

### Content
- Нет Lorem Ipsum.
- Нет John Doe / Acme / fake startup names без причины.
- Нет фейковых метрик без пометки placeholder.
- CTA конкретные, не “Submit/OK”.

### Motion
- Нет motion ради motion.
- Нет bounce/elastic без причины.
- Есть prefers-reduced-motion, если motion заметный.

## Формат результата

- Finding
- Почему это проблема
- Как исправить
- Severity: low / medium / high

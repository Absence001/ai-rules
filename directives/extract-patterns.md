# Directive: extract-patterns

## Цель

Извлечь паттерны из HTML/CSS/скринов/существующего UI.

## Результат

`artifacts/design-audit.json` или краткий markdown-аудит, если JSON не нужен.

## Извлечь

- Colors
- Typography
- Spacing
- Radius
- Shadows
- Components
- Variants
- States

## Правила

- Частые значения имеют приоритет.
- Конфликты помечать.
- Не нормализовать слишком рано: сначала аудит, потом токены.

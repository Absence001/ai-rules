# Directive: ds-prep

## Цель

Подготовить полноценную React design system и/или Figma design system.

## Предусловия

- Есть `artifacts/brief.md` или явная задача.
- Понятно, нужна ли Figma MCP.
- Пользователь подтвердил запуск DS prep.

## Шаги

1. Проверить источники: `ds-source/`, существующая Figma, существующий код, screenshot, brand inputs.
2. Извлечь или задать tokens.
3. Создать `artifacts/design-system.md`.
4. Если React нужен — выполнить `build-react-ds.md`.
5. Если Figma нужна — выполнить `sync-to-figma.md`.
6. Выполнить `parity-check.md`, если есть React + Figma.

## Не делать

- Не перезаписывать существующую DS без подтверждения.
- Не создавать компоненты “на будущее”.

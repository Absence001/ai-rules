# Directive: sync-to-figma

## Цель

Зеркалировать tokens/components в Figma через MCP.

## Шаги

1. Проверить MCP.
2. Проверить fileKey.
3. Создать/обновить Foundation.
4. Создать/обновить Components.
5. Записать mirror/state в artifacts.
6. Не удалять существующее без подтверждения.

## Правила

- Variables для colors/spacing/radius.
- Text Styles для typography.
- Effect Styles для shadows.
- Components/variants должны совпадать с React логикой.

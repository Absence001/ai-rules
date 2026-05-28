# Directive: build-web-prototype-from-screenshot

## Цель

Восстановить web-интерфейс по screenshot как React prototype.

## Читать

- `memory-bank/screenshot-to-code/image-to-code-workflow.md`
- `memory-bank/craft/visual-registers.md`
- `memory-bank/platforms/frontend-implementation-rules.md`
- `memory-bank/craft/anti-slop-audit.md`
- `memory-bank/craft/motion-rules.md`

## Шаги

1. Проанализировать screenshot (см. workflow в memory-bank).
2. Выбрать visual register.
3. Разложить на sections/components.
4. Определить стек и зависимости.
5. Предложить план и спросить разрешение.
6. Реализовать.
7. Проверить visual diff.
8. Записать `artifacts/screens.md`, `artifacts/prototype.md`, `artifacts/craft-audit.md`.

## Библиотеки по умолчанию (Lee Robinson stack)

Если пользователь хочет minimal/free стек:
- shadcn/ui — базовая component architecture
- Tailwind — styling
- lucide-react — иконки
- framer-motion — только при необходимости анимаций

Не устанавливать без подтверждения.

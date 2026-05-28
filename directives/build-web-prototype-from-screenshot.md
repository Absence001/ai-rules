# Directive: build-web-prototype-from-screenshot

## Цель

Восстановить web-интерфейс по screenshot как React prototype.

## Читать

- `memory-bank/image-to-code-workflow.md`
- `memory-bank/visual-registers.md`
- `memory-bank/frontend-implementation-rules.md`
- `memory-bank/anti-slop-audit.md`

## Шаги

1. Проанализировать screenshot.
2. Выбрать visual register.
3. Разложить на sections/components.
4. Определить стек и зависимости.
5. Предложить план и спросить разрешение.
6. Реализовать.
7. Проверить visual diff.
8. Записать `artifacts/screens.md`, `artifacts/prototype.md`, `artifacts/craft-audit.md`.

## Библиотеки

Если пользователь хочет бесплатные библиотеки:
- shadcn/ui для базовой component architecture;
- Magic UI для visual/marketing blocks;
- Tailwind для layout;
- lucide-react для иконок;
- framer-motion только при необходимости.

Не устанавливать без подтверждения.

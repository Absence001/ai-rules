# Frontend Implementation Rules

## Перед кодом

- Проверить `package.json`.
- Не импортировать библиотеку, которой нет.
- Не ставить зависимости без подтверждения.
- Определить: Next / Vite / React / Tailwind version.

## Layout

- Предпочитать grid для сложных композиций.
- Не использовать `h-screen` для мобильного viewport; использовать `min-h-[100dvh]`.
- Не анимировать layout-driving properties, если можно transform/opacity.
- Не делать pixel-perfect ценой нечитаемого кода.

## Components

- Разбивать UI на понятные компоненты.
- Не плодить компоненты без повторного использования.
- Использовать shadcn/Magic UI как базу только если они установлены или пользователь разрешил установить.
- Не оставлять дефолтный shadcn-вид, если задача brand/editorial.

## States

Минимум для interactive elements:
- hover
- focus-visible
- active
- disabled
- loading, если есть async

## Content

- Реалистичные placeholders.
- Никакого Lorem Ipsum, если можно использовать контекст.
- Не выдумывать точные цифры как факты.

## Responsive

- Mobile-first.
- Breakpoints от контента.
- Проверить narrow / tablet / desktop.

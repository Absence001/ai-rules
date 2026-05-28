# React DS Workflow

## Когда использовать

Если проект требует полноценный React prototype / React DS.

## Порядок

1. Проверить текущий стек и `package.json`, если он есть.
2. Не ставить зависимости без подтверждения.
3. Создать или обновить `app/`.
4. Сначала tokens: `src/tokens/`.
5. Затем components: atoms → molecules → organisms.
6. Затем pages/demo.
7. Затем запуск и проверка.

## Компонентная структура

```text
src/components/<tier>/<Component>/
  Component.tsx
  Component.module.css или styles.ts
  index.ts
```

## Правила

- Никакого хардкода цветов/spacing/radius, если есть tokens.
- Props компонентов совпадают с variant logic.
- Состояния: default, hover, focus-visible, active, disabled, loading, error, success, если применимо.
- Не переписывать проект с нуля без причины.
- Не добавлять случайные библиотеки.

## Если используется shadcn / Magic UI / другая библиотека

- Сначала проверить наличие зависимости.
- Использовать библиотеку как базу, но не оставлять дефолтный безликий стиль, если задача visual/brand.
- Не импортировать компонент, которого нет в проекте.

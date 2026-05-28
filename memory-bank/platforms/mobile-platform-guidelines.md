# Mobile Platform Guidelines

## Источники истины

- iOS: Apple Human Interface Guidelines
- Android: Material Design 3
- Accessibility: WCAG 2.2

## Правила

- Сначала определить платформу: iOS, Android, cross-platform.
- Не переносить web-паттерны в mobile без причины.
- Учитывать safe areas, touch targets, readability, navigation patterns.
- Один экран — одна основная задача.
- Главное действие должно быть очевидно.
- Сложность раскрывать постепенно.

## iOS

- Navigation Stack
- Tab Bar для основных разделов
- Sheets для временных действий
- Large Titles при уместности
- swipe back / системные жесты

## Android

- Material 3 components
- Navigation Bar / Navigation Rail по контексту
- FAB только если он действительно главное действие
- Dynamic color, если уместно

## Accessibility

- Touch target минимум ~44px.
- Контраст и readable text.
- Состояния и ошибки должны быть видны.

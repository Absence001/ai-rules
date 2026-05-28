# Design System Core

## Главный принцип

Интерфейс сначала строится как система, затем как набор экранов.

## Источник правды

1. Tokens
2. Components
3. Variants
4. States
5. Composition rules

## Tokens

Минимум:
- colors: primitive + semantic;
- typography;
- spacing;
- radius;
- shadows;
- motion tokens, если есть анимации.

## Components

Минимальный набор:
- Button
- Input
- Label / Text
- Card
- Cell / List item
- Badge / Tag
- Icon container
- Header / Top bar
- Modal / Sheet, если нужен

## Variants

Если различие только в цвете, размере, состоянии, иконке или тексте — это variant/property, а не новый компонент.

## Правила

- Повторяется 2+ раза → кандидат в компонент.
- Не создавать компоненты “на будущее”.
- Не смешивать системные и случайные стили.
- Flow не должен опережать систему.

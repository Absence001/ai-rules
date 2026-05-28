# Visual Registers

## Главный принцип

Сначала выбрать один основной visual register. Не смешивать стили без причины.

## Registers

### product-app
Для SaaS, dashboard, admin, tools. Дизайн обслуживает задачу. Меньше экспрессии, больше ясности.

### mobile-product
Для мобильных приложений и flow. App-native, touch-first, readable, platform-aware.

### brand-marketing
Для лендингов, портфолио, промо. Дизайн сам является частью продукта. Можно больше композиционной выразительности.

### editorial-minimal
Спокойный премиальный стиль: типографика, пространство, muted colors, минимум эффектов.

### industrial-brutalist
Жесткая сетка, высокий типографический контраст, tactical/print feel, резкие блоки, один акцент. Включать только если задача явно визуальная/брендовая.

### premium-soft
Мягкий премиальный UI: warm neutrals, subtle shadows, restrained motion, high spacing discipline.

### image-reconstruction
Режим точного восстановления по скриншоту. Приоритет: визуальное совпадение, layout, hierarchy, proportions.

## Dials

Перед реализацией зафиксировать:

- Design variance: low / medium / high
- Motion intensity: none / subtle / expressive
- Visual density: low / medium / high

## Конфликты

- Inter/system font допустим в product-app, но нежелателен в premium/brand/editorial без причины.
- Активный motion допустим в brand, но опасен в product flow.
- Brutalist register не применять к финтех/product UI без явного запроса.

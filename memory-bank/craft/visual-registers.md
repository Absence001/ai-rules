# Visual Registers

## Главный принцип

**Один основной visual register на проект.** Не смешивать стили без причины. Регистр задаётся на этапе brief/research, не выбирается импровизацией в screens.

## Регистры

### product-app
**Когда:** SaaS, dashboard, admin, tools, B2B.
**Характер:** дизайн обслуживает задачу, минимум экспрессии, максимум ясности.
**Допускает:** subtle motion, system fonts, restrained palette.

### mobile-product
**Когда:** мобильные приложения и flow.
**Характер:** app-native, touch-first, readable, platform-aware (см. `platforms/mobile-platform-guidelines.md`).
**Допускает:** platform-conventional animations, native pickers, haptics.

### brand-marketing
**Когда:** лендинги, портфолио, промо, рекламные кампании.
**Характер:** дизайн сам — часть продукта, expressive композиция.
**Допускает:** expressive motion, large type, branded animations, custom shapes, fullscreen visuals.
**НЕ допускает:** убирать a11y baseline, нарушать contrast WCAG AA.

### editorial-minimal
**Когда:** премиальный контент, журналы, longread.
**Характер:** типографика, пространство, muted colors, минимум эффектов.
**Допускает:** custom typography, generous whitespace, asymmetric layouts.

### industrial-brutalist
**Когда:** brand-инициативы с явным запросом, art-direction, niche-проекты.
**Характер:** жёсткая сетка, высокий типографический контраст, tactical/print feel, резкие блоки, один акцент.
**НЕ применять** к финтех/product UI без явного запроса от пользователя.

### premium-soft
**Когда:** премиальные продукты с уклоном в comfort (wellness, lifestyle).
**Характер:** warm neutrals, subtle shadows, restrained motion, high spacing discipline.
**Допускает:** soft gradients (subtle), layered shadows, refined micro-details.

### image-reconstruction
**Когда:** точное восстановление по скриншоту.
**Характер:** приоритет — визуальное совпадение, layout, hierarchy, proportions.
**Допускает:** воспроизведение визуальной системы оригинала (с adaptation если нужно).

## Dials (фиксируется до реализации)

| Параметр | Значения |
|---|---|
| **Design variance** | low / medium / high |
| **Motion intensity** | none / subtle / expressive |
| **Visual density** | low / medium / high |

Фиксируется в `artifacts/brief.md` или `craft-audit.md`.

## Color scales

Из Refactoring UI:

- **5 семейств цвета:** brand + grey + success + warning + danger (+ info опционально)
- **Каждое семейство — 9 ступеней** (50/100/200/300/400/500/600/700/800/900)
- **Saturation падает на крайних ступенях** — чистый цвет работает в середине, на светлых и тёмных нужна шкала «к серому»

## Конфликты regiстров

| Конфликт | Резолюция |
|---|---|
| Inter / system font в premium / brand / editorial | Не использовать без явной причины |
| Активный motion в product flow | Снизить до subtle |
| Brutalist в финтех / product UI | Не применять без явного запроса |
| Glassmorphism в product-app | Не применять (mobile-craft anti-pattern) |
| Default shadow в premium-soft | Использовать layered shadows |

## Выбор register — checklist

Перед стартом задаём:

1. Тип продукта (B2B/B2C/brand/internal)?
2. Платформа (web/mobile/cross)?
3. Контекст использования (daily tool / occasional / one-time)?
4. Bren — есть guidelines?
5. Аудитория — кто?

→ Регистр.

Если ответы пересекают несколько registers — выбираем **доминирующий** + dials.

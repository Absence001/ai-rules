# Mobile Craft Rules

Визуальное качество мобильных экранов. Дополнение к `mobile-platform-guidelines.md` (платформенные конвенции) и `craft/craft-core.md` (общие craft принципы).

## Главный принцип

**Интерфейс должен ощущаться как приложение, не как сайт в телефоне.**

Признаки правильного mobile craft:
- Platform-aware navigation (см. `mobile-platform-guidelines.md`)
- Touch-first interactions (no hover-only UX)
- Native pickers где возможно
- Haptics в правильных моментах
- Безопасные жесты не перехвачены

## Hard rules

| Правило | Значение |
|---|---|
| **Body text** | ≥ 13pt iOS, ≥ 14sp Android |
| **Touch target** | 44pt iOS, 48dp Android |
| **Spacing между clickable elements** | Минимум 8pt — иначе misclicks |
| **Safe areas** | Учитывать notch, home indicator, status bar |
| **Bottom navigation в thumb zone** | Главные действия — в нижней части |

## Bottom sheet vs Modal vs Full screen (decision)

| Тип | Когда | Когда НЕ |
|---|---|---|
| **Bottom sheet (peek)** | Контекстный action рядом с основным экраном (filters, share) | Если нужно много информации |
| **Bottom sheet (full)** | Контекстная задача требующая фокуса (compose comment, edit details) | Если задача = целая флоу |
| **Modal full screen** | Целая задача (compose new message, settings flow) | Если можно вернуться без потери контекста |
| **Inline expand** | Доп. инфа (FAQ, accordion) | Если содержимое большое |
| **New screen** | Своя задача со своим navigation context | Если задача узкая |

## Native pickers > custom

Используй **native** там где возможно:

| Тип ввода | Native (правильно) | Custom (если без причины — anti) |
|---|---|---|
| Date | iOS / Android system picker | Custom wheel scroll |
| Time | System picker | Custom |
| Select / dropdown | iOS picker / Android dropdown | Custom dropdown |
| Number | `type="number"` keyboard | Custom keypad |
| Phone | `type="tel"` keyboard | Custom |
| Email | `type="email"` keyboard | Custom |

**Причины custom могут быть:** brand-сильные продукты с явным запросом, специфические UX-требования. Иначе — native.

## Haptics

Используй haptics для tактильной обратной связи. **Соответствие действию:**

| Действие | Haptic |
|---|---|
| Успешное завершение | success / notification success |
| Предупреждение | warning |
| Ошибка | error / notification error |
| Tap on important button | light impact |
| Toggle / switch | selection |
| Refresh / pull-to-refresh | medium impact |

**Не делать haptic на каждый клик** — превращается в шум.

## Mobile-specific anti-patterns (полный список)

| Anti-pattern | Симптом | Severity |
|---|---|---|
| Слишком много glassmorphism | Generic-AI-look | medium |
| Слишком много градиентов | Generic-AI-look | medium |
| Cards in cards (карточки внутри карточек) | Не сделано | high |
| Несистемные radii / spacing | Inconsistent | medium |
| Tiny text (< 13pt iOS / < 14sp Android) | Нечитаемо | high |
| Touch targets < 44/48 | Misclicks | high |
| Bottom sheet которая закрывает контент целиком | Лучше full screen modal | medium |
| Carousels на mobile с тонкими точками | Не понятно где находишься | medium |
| Hover-only effects | Просто не работают | high |
| Длинные dropdown в формах | Use native picker / wheel | medium |
| 4+ нижних таба | Меньше 4, лучше 3, остальное в "More" | medium |
| Скрытая навигация (hamburger) когда хватает 3 табов | Прячет основное | medium |
| Fake fintech dashboard spam | Generic | medium |
| Один экран с разным текстом (повтор layout) | Дешёво выглядит | low |
| Несистемные shadows | Inconsistent depth | medium |
| Слишком декоративный motion в product flow | Замедляет работу | medium |
| Нет состояний ошибки / загрузки / пустого | Сломан edge case | high |
| Hijacking system gestures (swipe back, edge swipe) | Frustrating | high |
| FAB как secondary action на Android | Сбивает иерархию | medium |

## States чек-лист (для каждого mobile экрана)

- [ ] Default state
- [ ] Loading (если есть async > 300ms) — skeleton
- [ ] Empty (если контент может отсутствовать) — first impression!
- [ ] Error (если действие может провалиться) — actionable message
- [ ] Success (если действие успешно) — confirm + next step
- [ ] Offline (если зависит от сети)
- [ ] Refresh (pull-to-refresh где уместно)

## Mobile motion

См. `craft/motion-rules.md`. Mobile-specific уточнения:

| Платформа | Длительность | Easing |
|---|---|---|
| iOS native | < 250ms | Apple system easing |
| Android Material | < 300ms | Material standard easing |
| Cross-platform | < 300ms | ease-out / custom |

**Уважай `prefers-reduced-motion`** — на mobile это особенно важно (motion sickness, attention).

## Связанные файлы

- `mobile-platform-guidelines.md` — платформенные конвенции (HIG, MD3)
- `craft/craft-core.md` — общие craft принципы
- `craft/motion-rules.md` — анимации
- `pd-workflows/accessibility-audit.md` — WCAG

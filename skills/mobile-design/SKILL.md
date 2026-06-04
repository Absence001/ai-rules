---
name: mobile-design
status: active
description: Design for iOS or Android with platform-aware rules. Use when target is mobile (iOS, Android, or cross-platform), or when discussing native patterns like tab bars, safe areas, sheets, haptics, gestures. Enforces HIG 3 themes (Clarity/Deference/Depth), MD3 breakpoints, touch targets (44pt iOS / 48dp Android), and mobile-specific anti-patterns.
trigger_keywords:
  ru: ["mobile", "мобильный", "iOS", "айос", "Android", "андроид", "приложение", "app", "native", "HIG", "Material", "MD3"]
  en: ["mobile", "iOS", "Android", "native", "app design", "HIG", "Material Design", "MD3", "tab bar"]
intent: |
  User designs for mobile platform (native or cross-platform). Activate when discussing
  touch targets, safe areas, navigation patterns, gestures, sheets, or platform conventions.
task_type: outcome-gradable
related_skills: [ia-design, design-system, craft-audit]
data_access_level: raw
---

# Mobile Design

Платформо-aware дизайн для mobile. Платформа решается **первой** — iOS, Android, cross-platform.

## Initial Response (обязательно при первом вызове)

При активации без конкретного контекста — сразу ответить:

> «Активирован mobile-design. Прежде всего — **платформа**:
> 1. **iOS, Android или cross-platform?** Источник истины — HIG / Material 3 / оба.
> 2. **Тип задачи:** native app / mobile web / cross-platform (React Native / Flutter)?
> 3. **Что делаем:** новый экран / навигация / patterns review / accessibility audit?
>
> Hard rules:
> - **Touch targets:** iOS ≥44pt, Android ≥48dp.
> - **Не переносить web-паттерны** (hover-only UX = fail на touch).
> - **Safe areas** и системная навигация (iOS swipe back sacred).
> - **Native pickers** > custom dropdowns.»

## Когда триггерится

- Target platform mobile (любая)
- Обсуждение native patterns (tab bar, drawer, sheet, swipe back)
- Touch targets / safe areas / haptics
- Platform-specific (iOS vs Android decisions)

## Что читать

1. **Сначала:** `./artifacts/project-state.md`, `./artifacts/brief.md`
2. **Затем:**
   - `RULES_ROOT/memory-bank/platforms/mobile-platform-guidelines.md` — HIG / MD3 / WCAG
   - `RULES_ROOT/memory-bank/platforms/mobile-craft-rules.md` — visual quality для mobile
   - При animation — `RULES_ROOT/memory-bank/craft/motion-rules.md`

## Платформа решается первой

| Платформа | Источник истины |
|---|---|
| iOS | Apple HIG |
| Android | Material Design 3 |
| Cross-platform | Both — но не смешивать в одном экране |

## Touch targets (HARD RULES)

| Платформа | Минимум |
|---|---|
| iOS | **44×44 pt** |
| Android | **48×48 dp** |
| Web mobile | 44×44 px |

## HIG 3 themes (iOS)

| Theme | Что | Применение |
|---|---|---|
| **Clarity** | Legible text, precise controls, sharp graphics | Хорошая типографика, чёткие affordances |
| **Deference** | Interface facilitates content, не distracts | Минимум chrome, контент главный |
| **Depth** | Visual layers convey hierarchy and meaning | Modals, transitions, layered surfaces |

## MD3 breakpoints (Android)

| Class | Width | Navigation pattern |
|---|---|---|
| **Compact** | < 600dp | Bottom Navigation Bar (до 5 items) |
| **Medium** | 600-839dp | Navigation Rail |
| **Expanded** | 840-1199dp | Navigation Drawer (modal) |
| **Large** | 1200-1599dp | Navigation Drawer (permanent) |
| **Extra-large** | ≥1600dp | Navigation Drawer (permanent) |

## Mobile patterns by platform

### iOS

- Navigation Stack — иерархия пуш-навигации
- Tab Bar — основные разделы (до 5)
- Sheets — временные действия / details
- Large Titles — при уместности
- **Swipe back sacred** — не блокировать системный жест
- Haptics — для feedback (success / warning / impact)

### Android

- Material 3 components
- Navigation Bar / Rail / Drawer по breakpoint
- FAB только если действительно главное действие
- Dynamic color если уместно

## Anti-Patterns

| Pattern (WRONG) | Why it fails | Correct (RIGHT) |
|---|---|---|
| Перенос web-паттернов на mobile (например, hover-only) | Hover не существует на touch | Touch / long-press / native patterns |
| Touch target < 44pt / 48dp | Не попасть пальцем, accessibility fail | Hard rule 44pt / 48dp |
| Glassmorphism / blur везде | Mobile slop, AI-look | Subtle, не везде |
| Карточки внутри карточек | Visual noise | Flat hierarchy, использовать spacing |
| Floating cards перегружают экран | Visual chaos | Один FAB / minimum floating |
| Несистемные radii и spacing | Drift от DS | Все через tokens |
| Tab bar с 6+ items | Cramped, нет места для label | Максимум 5 |
| Custom dropdown вместо native picker | Lose accessibility / familiarity | Native picker |
| Анимация на keyboard-навигации | Раздражение при повторении | Без анимации (Emil) |
| Hover-only UX | Touch не имеет hover | Tap / long-press alternatives |
| Tiny text < 13pt / 14sp | Нечитаемо | Body ≥13pt iOS, ≥14sp Android |
| Игнорировать `prefers-reduced-motion` | Accessibility fail | Респектить |
| Fake fintech dashboard spam | AI-slop | Контент отражает реальные данные домена |
| Один экран клонирован 5 раз с разным текстом | Filler-screens | Один экран = один уникальный layout |

## Outcome

- Платформа явно указана
- Touch targets соблюдены
- Navigation pattern соответствует breakpoint / платформе
- Mandatory states (см. design-system) присутствуют
- Mobile anti-patterns проверены
- Lineage entry

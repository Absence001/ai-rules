# Mobile Platform Guidelines

Платформенные правила для iOS и Android. Источники: Apple HIG, Material Design 3.

## Источники истины

| Платформа | Документация |
|---|---|
| iOS | Apple Human Interface Guidelines (developer.apple.com/design/human-interface-guidelines) |
| Android | Material Design 3 (m3.material.io) |
| Accessibility | WCAG 2.2 + платформенные guidelines |

## Главный принцип

**Не переноси web-паттерны в mobile без причины.** Mobile имеет свои conventions, touch-first, ограниченное пространство.

## Перед стартом

1. Определить платформу: **iOS / Android / cross-platform**.
2. Если cross-platform — решить: следуем native conventions каждой или унифицируем (с awareness что унифицированный = compromise).
3. Учесть safe areas, touch targets, readability, navigation patterns.

## Hard rules (cross-platform)

| Правило | Значение |
|---|---|
| **Touch target iOS** | **44 × 44 pt** минимум |
| **Touch target Android** | **48 × 48 dp** минимум |
| **Body text iOS** | ≥ 13 pt (system body — 17 pt) |
| **Body text Android** | ≥ 14 sp (system body — 16 sp) |
| **Safe areas** | Уважать notch / home indicator / status bar |
| **One основная задача per screen** | Главное действие очевидно |
| **Главное действие в thumb reach** | Bottom area (для phone) |

## Apple HIG — 3 темы

| Тема | Что значит | Как применять |
|---|---|---|
| **Clarity** | Legible text, precise controls, sharp graphics | Системные шрифты (SF), контраст, ranks через несколько сигналов |
| **Deference** | Контент в фокусе, интерфейс не мешает | Минимизируй chrome / декор / ненужные границы |
| **Depth** | Visually significant transitions and layers, conveying hierarchy | Используй translucency, motion, parallax — **дозированно** |

## iOS-specific

| Элемент | Конвенция |
|---|---|
| **Navigation** | Navigation Stack (push/pop), Tab Bar (3-5 разделов), Modal sheets |
| **Sheets** | Modal sheets для прерывания flow. Bottom sheets для контекстных actions |
| **Large Titles** | Используй когда уместно (top-level screens) |
| **Gestures** | **Swipe back от левой грани — sacred.** Не перехватывать |
| **Системный шрифт** | San Francisco (Display / Text / Mono) — не таскать сторонние без причины |
| **Haptics** | Соответствуют действию: success / warning / impact (light/medium/heavy) |
| **Native pickers** | Date / time / select — используй системные, не custom dropdown |

## Material Design 3

### 5 breakpoints (window size classes)

| Класс | Ширина | Устройство |
|---|---|---|
| **Compact** | < 600 dp | Phone portrait |
| **Medium** | 600-839 dp | Phone landscape / small tablet |
| **Expanded** | 840-1199 dp | Tablet portrait / small laptop |
| **Large** | 1200-1599 dp | Laptop / desktop |
| **Extra-large** | ≥ 1600 dp | Large desktop |

### Navigation по breakpoint

| Breakpoint | Pattern |
|---|---|
| **Compact** | Bottom Navigation Bar (3-5 destinations) |
| **Medium** | Navigation Rail (left side) |
| **Expanded+** | Permanent Navigation Drawer |

> *«Navigation components that work on mobile create ergonomic issues on large formats»* — MD3

Не таскай bottom-bar на десктоп — эргономическая ошибка.

### 3 canonical layouts MD3

| Layout | Когда |
|---|---|
| **Feeds** | Однородный поток контента (Twitter, Instagram, новости) |
| **List-Detail** | Переход от списка к детализации (Gmail, Settings) |
| **Supporting Pane** | Основной контент + связанная панель (Figma layers, Notion sidebars) |

### Android-specific

| Элемент | Конвенция |
|---|---|
| **Components** | Material 3 (button, FAB, snackbar, dialog) |
| **Navigation Bar** (bottom) | До 5 menu items с icons + labels + badges |
| **Navigation Rail** | Medium breakpoint, left side |
| **Navigation Drawer** | Expanded+ breakpoint, permanent |
| **FAB** | **Только если действие действительно главное** на экране |
| **Dynamic color** | Если уместно (Material You theming) |
| **Back gesture** | System gesture handled, не перехватывать |

## Accessibility baseline (cross-platform)

| Правило | Значение |
|---|---|
| **Touch target** | 44pt iOS / 48dp Android (см. выше) |
| **Контраст текста** | WCAG AA — 4.5:1 body, 3:1 large |
| **VoiceOver / TalkBack** | Все interactive имеют accessible label |
| **Системный font size scaling** | UI масштабируется при увеличении системного font |
| **States visible** | Не только цвет — иконка / pattern / size |
| **Errors visible** | Текст + иконка + цвет |

## Cross-platform vs native

| Подход | Когда |
|---|---|
| **Native (отдельные iOS и Android)** | Премиум продукт где UX critical, ресурс есть |
| **Cross-platform (React Native, Flutter)** | Скорость > native polish, MVP, B2B |
| **PWA** | Web присутствие + mobile через add to home screen |

## Anti-patterns

| Anti-pattern | Платформа |
|---|---|
| Bottom nav на tablet/desktop | Cross |
| Hover-only UX | Cross |
| Custom dropdown вместо native picker | iOS especially |
| FAB как secondary action | Android |
| Game без safe area | iOS / Android |
| Tiny text (< 13pt iOS / < 14sp Android) | Cross |
| Touch target < 44/48 | Cross |
| Hijacking swipe back gesture | iOS |
| Static FAB по 3+ темам | Android |
| Mixing iOS conventions on Android и наоборот | Cross |

## Связанные файлы

- `mobile-craft-rules.md` — визуальное качество мобильных экранов
- `craft/motion-rules.md` — анимации (cross-platform правила)
- `pd-workflows/accessibility-audit.md` — WCAG как процесс

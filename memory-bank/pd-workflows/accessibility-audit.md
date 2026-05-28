# Accessibility Audit

WCAG 2.2 как процесс. Не «сделать accessible», а **проверить и зафиксировать**.

## Главный принцип

**A11y = baseline, не feature.** Не делается «поверх» дизайна — встроен изначально.

## WCAG levels

| Level | Когда требуется |
|---|---|
| **A** | Минимум для любого public-facing продукта |
| **AA** | Стандарт для большинства продуктов. **Это наш default** |
| **AAA** | Только для специфических контекстов (государственные сервисы, banking some) |

> **Мы стремимся к AA** для всех продуктов, если иное явно не указано.

## 4 принципа WCAG (POUR)

| Принцип | Что значит |
|---|---|
| **Perceivable** | Информация доступна всем органам чувств (visual, auditory, tactile) |
| **Operable** | Интерфейс работает с разных input devices (keyboard, mouse, touch, voice) |
| **Understandable** | Информация и UI понятны |
| **Robust** | Совместимо с assistive technologies (screen readers, magnifiers) |

## Audit checklist (WCAG AA)

### 1. Perceivable

| Критерий | Что проверять |
|---|---|
| **1.1.1 Non-text Content** | `alt` для images. `aria-label` для icon-only buttons |
| **1.3.1 Info and Relationships** | Semantic HTML (`<h1>`-`<h6>`, `<nav>`, `<main>`) |
| **1.4.3 Contrast (Minimum)** | Body text 4.5:1, large text/UI 3:1 |
| **1.4.4 Resize Text** | Текст увеличивается до 200% без потери функциональности |
| **1.4.10 Reflow** | Контент работает на 320 CSS pixels width без horizontal scroll |
| **1.4.11 Non-text Contrast** | UI components (borders, focus indicators) — 3:1 минимум |
| **1.4.12 Text Spacing** | Адаптация к нестандартным letter/word/line spacing |
| **1.4.13 Content on Hover or Focus** | Tooltips dismissable, persistent, hoverable |

### 2. Operable

| Критерий | Что проверять |
|---|---|
| **2.1.1 Keyboard** | Всё доступно с клавиатуры |
| **2.1.2 No Keyboard Trap** | Tab не застревает в одном элементе |
| **2.1.4 Character Key Shortcuts** | Single-key shortcuts disableable / remappable |
| **2.4.3 Focus Order** | Tab order логичный (visually и semantically) |
| **2.4.4 Link Purpose** | Цель ссылки понятна из контекста |
| **2.4.7 Focus Visible** | Видимый focus indicator на keyboard focus |
| **2.4.11 Focus Not Obscured** | Focus не скрывается sticky-элементами |
| **2.5.3 Label in Name** | Accessible name содержит visible label |
| **2.5.5 Target Size (AA)** | Touch target ≥ 24×24 CSS pixels (или с adequate spacing) |
| **2.5.8 Target Size (Minimum)** | 44×44 на mobile (iOS) / 48×48 (Android) — наш standard |

### 3. Understandable

| Критерий | Что проверять |
|---|---|
| **3.1.1 Language of Page** | `<html lang="ru">` |
| **3.2.1 On Focus** | Focus не вызывает unexpected change of context |
| **3.2.2 On Input** | Input change не вызывает unexpected navigation |
| **3.3.1 Error Identification** | Errors явно identified (не только цветом) |
| **3.3.2 Labels or Instructions** | Каждое поле имеет label / instructions |
| **3.3.3 Error Suggestion** | Errors предлагают как исправить |
| **3.3.4 Error Prevention (Legal/Financial)** | Можно reversible / verify / confirm |

### 4. Robust

| Критерий | Что проверять |
|---|---|
| **4.1.2 Name, Role, Value** | Semantic HTML + ARIA where needed |
| **4.1.3 Status Messages** | Status announced to screen readers (`role="status"`, `aria-live`) |

## Tooling

| Инструмент | Для чего |
|---|---|
| **axe DevTools** | Auto-scan браузерного DOM |
| **Lighthouse Accessibility** | Quick check (Chrome DevTools) |
| **WAVE** | Browser extension с visual feedback |
| **Polypane** | Multi-viewport browser с a11y panel |
| **NVDA** (Windows) / **VoiceOver** (Mac/iOS) | Screen reader testing — manual |
| **Color contrast analyzer** | Stark (Figma plugin), WebAIM contrast checker |

## Manual testing (must)

Auto tools покрывают ~30-40% issues. Остальное — manual.

### Keyboard test

1. Disconnect mouse / trackpad
2. Tab через весь экран — все interactive достижимы?
3. Focus visible везде?
4. Enter / Space активируют buttons?
5. Esc закрывает modals?
6. Arrow keys работают в списках / меню?
7. Can escape from any state?

### Screen reader test

Минимум для каждого критичного flow:
1. VoiceOver (iOS) / TalkBack (Android) / NVDA (Win)
2. Пройди через основной flow закрыв глаза
3. Все controls имеют accessible name?
4. Headings структурированы (h1 → h2 → h3)?
5. Live regions объявляют изменения (loading, error, success)?

### Contrast test

Для каждого text/UI element:
1. Open in design tool / browser
2. Check contrast ratio against background
3. Body text ≥ 4.5:1
4. Large text (≥ 18pt regular, ≥ 14pt bold) ≥ 3:1
5. UI elements (borders, focus rings) ≥ 3:1

### Responsive test

1. Zoom to 200% — контент работает?
2. Width 320px — нет horizontal scroll?
3. Text spacing override — layout не ломается?

## Common issues (top-10)

| Issue | Severity |
|---|---|
| `outline: none` без альтернативы | 🔴 Blocker |
| Icon-only buttons без `aria-label` | 🔴 Blocker |
| `placeholder` вместо `<label>` | 🔴 Blocker |
| Контраст body text < 4.5:1 | 🔴 Blocker |
| Heading levels пропущены (`<h1>` → `<h3>`) | 🟡 Important |
| Click-only interactions (no keyboard) | 🔴 Blocker |
| Tab order не логичный | 🟡 Important |
| Errors только цветом (red) | 🔴 Blocker |
| Tooltips появляются только на hover | 🟡 Important |
| Touch targets < 44/48 | 🟡 Important |

## Audit формат (выход)

```markdown
# Accessibility Audit: <screen / flow name>

**Date:** YYYY-MM-DD
**Reviewer:** <name>
**WCAG Level:** AA

## Summary
- Total issues: N
- Blockers: X
- Important: Y
- Nice-to-have: Z

## Findings

### Finding 1: <название>
- **WCAG criterion:** 2.4.7 Focus Visible
- **Severity:** 🔴 Blocker
- **Where:** Button «Сохранить» в settings
- **What:** outline: none без замены — focus invisible на keyboard
- **How to fix:** Добавить focus-visible style (`:focus-visible { outline: 2px solid var(--focus); }`)
- **Test:** Tab to button, должен быть visible focus ring
```

## Когда делать audit

| Этап | Уровень audit |
|---|---|
| Wireframe | Базовый (структура, hierarchy через несколько сигналов) |
| Hi-fi mockup | Полный (contrast, focus order, labels) |
| Implementation | Полный + tooling + manual |
| Pre-release | Полный manual screen reader test |
| После изменений | Targeted на изменённую area |

## Связанные файлы

- `craft/craft-core.md` — иерархия через несколько сигналов
- `platforms/mobile-platform-guidelines.md` — touch targets, mobile a11y
- `platforms/frontend-implementation-rules.md` — implementation specifics
- `pd-workflows/microcopy.md` — labels и error messages

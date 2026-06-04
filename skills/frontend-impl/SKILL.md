---
name: frontend-impl
status: active
description: Implement frontend code (React, Next.js, CSS). Use when user requests code implementation, component build, page assembly, styling, or asks for "how to code this". Enforces modern stack (Lee Robinson defaults — RSC top + Client leaf, no `any`, Tailwind + shadcn/ui), no `transition: all`, transform/opacity-only animations, mandatory accessibility states, and `gap` over margin.
trigger_keywords:
  ru: ["frontend", "фронтенд", "код", "React", "Next.js", "Tailwind", "JSX", "TSX", "компонент в коде", "реализовать", "implement"]
  en: ["frontend", "code", "implement", "React", "Next.js", "Tailwind", "component code", "JSX", "TSX"]
intent: |
  User wants code implementation, not design discussion. Activate when language shifts to
  technical (props, state, hooks, RSC, Tailwind classes, files).
task_type: outcome-gradable
related_skills: [design-system, craft-audit, code-diagnostics]
data_access_level: raw
---

# Frontend Implementation

Реализация в коде. React / Next.js / Tailwind / shadcn/ui (Lee Robinson defaults).

## Initial Response (обязательно при первом вызове)

При активации без конкретного контекста — сразу ответить:

> «Активирован frontend-impl. Перед кодом:
> 1. **Стек проверен?** Прочитаю `package.json` — какой реально стек (Next / Vite / TS version).
> 2. **DS есть?** Если `design-system.md` готова — компоненты из неё. Если нет — `design-system` skill сначала.
> 3. **Screens готовы?** Что именно реализовать.
> 4. **Зависимости** — что-то нужно установить? Без подтверждения не ставлю.
>
> Hard rules:
> - **RSC top, Client leaf.** Не `'use client'` на root layout.
> - **No `any`** в TS.
> - **No raw values** — только tokens / Tailwind с design tokens.
> - **No `transition: all`**, только `transform`/`opacity` для animations.
> - **A11y baseline:** `:focus-visible`, semantic HTML, `<label>` обязательно.
> - **gap** > margin для flex/grid детей.»

## Когда триггерится

- Запрос «закодируй это», «implement», «build the component»
- Discussion переходит к props / hooks / RSC / Tailwind classes
- После DS / screens, на этапе реализации

## Что читать

1. **Сначала:** `./artifacts/project-state.md`, `./artifacts/design-system.md`, `./artifacts/screens.md`
2. **Затем:**
   - `RULES_ROOT/memory-bank/platforms/frontend-implementation-rules.md` — current stack rules
   - `RULES_ROOT/memory-bank/craft/motion-rules.md` — для анимаций
   - `RULES_ROOT/memory-bank/design-system/tokens-spec.md` — для tokens binding

## Перед кодом

1. Проверить `package.json` — какой стек реально.
2. Не импортировать библиотеку которой нет.
3. Не ставить зависимости без подтверждения.
4. Определить: Next / Vite / React / Tailwind version.

## Lee Robinson defaults (modern stack)

| Что | Default |
|---|---|
| Framework | **Next.js + App Router** |
| Language | **TypeScript** (no `any`) |
| Styling | **Tailwind CSS** |
| Components | **shadcn/ui** как база (если установлен) |
| Icons | **lucide-react** |
| Animation | **framer-motion** только при необходимости |

## RSC architecture (КРИТИЧНО)

> RSC top, Client leaf — Lee Robinson

| Слой | Что |
|---|---|
| **Root layout** | Server Component (по умолчанию) |
| **Pages** | Server Component (загружают данные) |
| **Heavy interactive** | Client Component (`'use client'`) на листьях дерева |

**Anti-pattern:** `'use client'` на корневом layout — превращает весь сайт в client bundle.

## Layout

- **`gap`** вместо margin для flex/grid детей
- **Container Queries** для адаптивности компонента (не media queries везде)
- **`clamp()`** для fluid typography
- **Grid** для сложных композиций
- НЕ `h-screen` для mobile viewport — `min-h-[100dvh]`
- НЕ pixel-perfect ценой нечитаемого кода

## Mandatory states (interactive elements)

- [ ] Rest
- [ ] Hover
- [ ] **`:focus-visible`** (НЕ `:focus`)
- [ ] Active
- [ ] Disabled (`:disabled` / `[aria-disabled]`)
- [ ] Loading (если async)
- [ ] Error (если async)

## Accessibility baseline

- Semantic HTML (`<button>` не `<div onclick>`)
- `placeholder` НЕ replacement для `<label>` — оба
- `outline: none` запрещён без замены (custom focus ring)
- Keyboard navigation работает
- ARIA roles на интерактивных не-семантических элементах

## Animation rules (Comeau + Kowalski)

- **Только `transform` / `opacity`** (НЕ width/height/margin/padding)
- `transition: all` **запрещён** — explicit properties
- UI animations **< 300ms**
- Custom cubic-bezier > built-in CSS easing
- Hover-вход быстрее hover-выхода (action-driven)
- `prefers-reduced-motion` обязателен

## Forms

- Native types (`type="email"`, `type="tel"`, `type="number"`)
- `autocomplete` атрибуты (`name`, `email`, `cc-number`...)
- `<label>` всегда явный
- Inline validation **после blur**, не во время typing
- Server Actions для mutations (Next.js)

## Tokens — never raw values

> *«You are a CSS expert. Never use raw values (hex, px, etc.). Only use semantic tokens.»* — Primer DESIGN_TOKENS_GUIDE

- Никаких `color: #1f6feb` в компонентах — `var(--fgColor-accent)`
- Никаких `padding: 16px` — `var(--space-md)` или token-based class
- Если токена не существует — пометить `/* check-token */` для review

## Anti-Patterns

| Pattern (WRONG) | Why it fails | Correct (RIGHT) |
|---|---|---|
| `'use client'` на корневом layout | Весь сайт в client bundle | RSC top, Client leaf |
| `any` в TypeScript | Type safety сломан | Конкретный type / generic |
| Margin на children в flex/grid | Lose ability to control от parent | `gap` на parent |
| `transition: all` | Скрытые поломки | Explicit list of properties |
| `outline: none` без замены | A11y fail | Custom focus ring |
| `placeholder` как `<label>` | A11y / UX fail | `<label>` обязателен |
| `<div onclick>` | Не keyboard accessible | `<button>` |
| Hardcoded цвет / spacing | Bypass DS | `var(--token)` / token class |
| `font-weight: 700` | Magic number | `var(--fontWeight-bold)` |
| Анимировать `width` / `height` | Reflow / jank | `transform` |
| Symmetric hover (300/300ms) | Robot feel | 125/450ms (action-driven) |
| Bleeding-edge библиотеки | Модель не знает | Boring tech (Lee Robinson + Willison) |
| Install зависимостей без спроса | Bloat | Спросить пользователя |

## Outcome

- Код в `app/` соответствующий DS
- Все mandatory states покрыты
- A11y baseline пройден
- Animations по правилам
- Никаких raw values — только tokens
- Не установлено левых зависимостей
- Lineage entry

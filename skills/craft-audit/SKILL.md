---
name: craft-audit
status: active
description: Apply craft-level polish, visual register selection, anti-slop audit, motion rules. Use when user requests polish, visual review, redesign quality check, anti-AI-look audit, or when finishing a UI/landing/screen. Includes Refactoring UI rules (no pure #000, hierarchy via multiple signals), Comeau/Kowalski animation rules (transform/opacity only, <300ms), and the full anti-slop checklist.
trigger_keywords:
  ru: ["craft", "polish", "polish UI", "audit", "аудит", "анти-слоп", "anti-slop", "доработать", "довести", "критика", "review UI", "visual review"]
  en: ["craft", "polish", "audit", "anti-slop", "visual review", "review UI", "critique"]
intent: |
  User wants to elevate visual quality, find anti-AI-look patterns, or do final polish pass.
  Activate also for visual register selection (product-app vs brand-marketing etc.)
task_type: outcome-gradable
related_skills: [design-system, frontend-impl, mobile-design]
data_access_level: raw
---

# Craft Audit

Финальный polish / visual review / anti-slop. **Не меняет** research, IA, scope.

## Initial Response (обязательно при первом вызове)

При активации без конкретного вопроса — сразу ответить:

> «Активирован craft-audit. Прежде чем начать, мне нужно понять:
> 1. **Что review?** (URL / screenshot / Figma / live app / описание)
> 2. **Visual register** уже выбран? (product-app / mobile-product / brand-marketing / editorial-minimal / industrial-brutalist / premium-soft / image-reconstruction)
> 3. **Тип задачи:** `shape` / `critique` / `audit` / `polish` / `distill` / `typeset` / `layout` / `animate` / `harden`?
>
> После твоих ответов — выдам review в **обязательном формате** `Before | After | Why | Severity`. Не отдельным списком.»

## Когда триггерится

- Любой запрос на polish / audit / critique визуала
- Перед screens / реализацией — выбор visual register
- После реализации — anti-slop checklist
- Когда UI «как AI-сгенерированный»

## Что читать

1. **Сначала:** `./artifacts/project-state.md`, `./artifacts/screens.md` (если есть)
2. **Затем:**
   - `RULES_ROOT/memory-bank/craft/craft-core.md` — visual intent, craft commands
   - `RULES_ROOT/memory-bank/craft/visual-registers.md` — 7 регистров
   - `RULES_ROOT/memory-bank/craft/anti-slop-audit.md` — checklist по категориям
   - `RULES_ROOT/memory-bank/craft/motion-rules.md` — animation principles
   - При taste-вопросах — `RULES_ROOT/memory-bank/craft/taste-development.md`

## Главный принцип

**Вкус = объяснимые решения.** Не «сделай красиво» — а конкретно: что улучшает интерфейс и почему.

> *«Almost every taste decision has a logical reason if you look close enough»* — Emil Kowalski

## Review Format (REQUIRED — не отклоняться)

Любое findings выдаётся **только** в формате markdown-таблицы. **Не списком**.

### ✅ CORRECT format

```markdown
| Before | After | Why | Severity |
|---|---|---|---|
| `color: #000000` | `color: hsl(0 0% 8%)` | Pure black жжёт глаза, выглядит как AI default — Refactoring UI | high |
| `transition: all 300ms` | `transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease-out` | `transition: all` ломается при будущих изменениях — Comeau | medium |
| Hover-вход 300ms, hover-выход 300ms | Hover-вход 125ms, hover-выход 450ms | Симметричный hover ощущается «как робот» — action-driven motion (Comeau / Kowalski) | medium |
```

### ❌ WRONG format

```markdown
- Color: change #000000 to #0a0a0a — better
- Transition: use specific properties
- Hover: shorter in, longer out
```

(Списком — нельзя. Нет Why → нет понимания. Нет Severity → нельзя приоритизировать.)

**Severity scale:**
- `high` — нарушает hard rule (accessibility, performance, brand)
- `medium` — заметный отход от craft baseline
- `low` — детали, nice-to-have

## Craft commands (глаголы)

| Command | Что делать |
|---|---|
| `shape` | Спланировать визуальную структуру до кода |
| `critique` | Найти слабые места |
| `audit` | Проверить по правилам и anti-patterns |
| `polish` | Довести уже рабочий UI |
| `distill` | Убрать лишнее |
| `typeset` | Улучшить типографику |
| `layout` | Улучшить сетку, spacing, rhythm |
| `animate` | Добавить уместный motion |
| `harden` | Проверить states / a11y / responsive |

## Visual register first

Перед polish — выбрать **один** основной register:

| Register | Когда |
|---|---|
| `product-app` | SaaS, dashboard, admin — задача важнее экспрессии |
| `mobile-product` | Mobile app, touch-first |
| `brand-marketing` | Лендинги, портфолио, промо — дизайн часть продукта |
| `editorial-minimal` | Премиум, типографика, пространство, muted |
| `industrial-brutalist` | Брутальный — только при явном бренд-запросе |
| `premium-soft` | Warm neutrals, subtle, high spacing discipline |
| `image-reconstruction` | Точное восстановление по скриншоту |

**Не смешивать без причины.**

## Decision Trees (Emil Kowalski → adapted)

### 1. Should this animate at all?

| Частота действия | Решение |
|---|---|
| **100+ раз/день** (keyboard shortcuts, частые клики) | **Никогда не анимировать.** Создаёт ощущение задержки |
| **10+ раз/день** (toolbar buttons, частые переходы) | Анимация **минимальная** (≤150ms) или убрать |
| **Несколько раз/день** (модалки, drawers) | Стандартная анимация (200-300ms) |
| **Редкие моменты** (onboarding, success states) | Полная анимация, можно expressive |

### 2. Animation duration

| Что | Длительность |
|---|---|
| Hover / micro-feedback | 100-150ms |
| Tooltip / popover open | 150-200ms |
| Modal / sheet open | 250-300ms |
| Page transition | 300-400ms |
| Hero animation (один раз) | 400-800ms |

**Hard rule:** UI < 300ms. Свыше — обоснованно (page transitions, hero).

### 3. Easing curve

| Сценарий | Easing |
|---|---|
| Element входит на экран | `ease-out` или `cubic-bezier(0.16, 1, 0.3, 1)` (плавно оседает) |
| Element выходит за экран | `ease-in` (резкий старт, исчезает в направлении движения) |
| Циклическая (fade in/out) | `ease-in-out` |
| Spring-like (bounce при нажатии) | `cubic-bezier(0.34, 1.56, 0.64, 1)` (slight overshoot) |
| Hover state change | `ease` (default достаточно) |

**Built-in CSS easing ≈ скучно.** Custom cubic-bezier выглядит **более энергично** (Emil Kowalski).

### 4. Hover transitions (action-driven)

| Направление | Длительность | Easing |
|---|---|---|
| **In (mouse enters)** | 100-150ms | `ease-out` (быстро откликнуться) |
| **Out (mouse leaves)** | 300-450ms | `ease-out` (плавно вернуться) |

**Анти-pattern:** симметричные 300/300ms — ощущается «как робот» (Comeau).

## Anti-slop checklist (Refactoring UI + Comeau + Kowalski + Rauno)

### Typography

- [ ] Не Inter/system font в brand / premium / editorial без причины
- [ ] Реальный type scale (не arbitrary размеры)
- [ ] Body ≥16px (web) / 13pt (iOS) / 14sp (Android)
- [ ] Line-height для body 1.5, headlines 1.1-1.2
- [ ] `text-align: left` на длинных текстах (не center)

### Color

- [ ] **Чёрный никогда не `#000000`** — `#0a0a0a` или semantic token
- [ ] Иерархия через **несколько сигналов** (размер + вес + цвет + положение)
- [ ] Серый = вторичная инфа (снижай контраст, не уменьшай размер)
- [ ] Accent редко и осмысленно
- [ ] Grayscale test — если интерфейс работает в чёрно-белом, иерархия верна
- [ ] WCAG AA минимум (4.5:1 текст, 3:1 UI)

### Layout

- [ ] Не generic 3-column card grid
- [ ] Не nested cards (карточки в карточках)
- [ ] Visual rhythm — чередование секций
- [ ] Spacing system (4/8/16/24/32/48/64/96)
- [ ] Whitespace generosity (Refactoring UI)
- [ ] `gap` вместо margin для flex/grid детей

### Components

- [ ] All mandatory states (rest/hover/focus-visible/active/disabled/loading)
- [ ] One primary button per screen (Refactoring UI)
- [ ] No detached one-off элементов

### Content

- [ ] Нет Lorem Ipsum
- [ ] Нет John Doe / Acme / fake startup names без причины
- [ ] Нет фейковых метрик без пометки `placeholder`
- [ ] CTA конкретные ("Сохранить изменения", не "OK"/"Submit")

### Motion

- [ ] `prefers-reduced-motion` уважён
- [ ] `transform`/`opacity` only (НЕ `width`/`height`/`top`/`left`)
- [ ] `transition: all` запрещён
- [ ] UI animations < 300ms (см. Decision Tree #2)
- [ ] Custom cubic-bezier > built-in CSS easing (см. Decision Tree #3)
- [ ] Hover-вход ≠ hover-выход по длительности (action-driven, Comeau — см. Decision Tree #4)
- [ ] Origin-aware (transform-origin из точки клика)
- [ ] Не анимировать частые / keyboard actions (см. Decision Tree #1)
- [ ] Не `scale(0)` — начинать с 0.95

### Shadows

- [ ] Не дефолтные `box-shadow: 0 2px 4px rgba(0,0,0,0.1)`
- [ ] Layered shadows (близкая жёсткая + дальняя мягкая)
- [ ] Subtlety > drama (не «выпуклые кнопки 2008»)

## Anti-Patterns (mid-review reference)

| Pattern (WRONG) | Why it fails | Correct (RIGHT) |
|---|---|---|
| `#000000` для текста | Жжёт глаза, AI-look | `#0a0a0a` / semantic token |
| Дефолтный purple-blue gradient | AI-cliché | Brand colors / restrained accent |
| Симметричные hover (300/300ms) | Ощущается «как робот» | 125ms in / 450ms out |
| `transition: all` | Скрытые поломки | Explicit properties |
| Анимировать `width`/`height` | Reflow / jank | `transform`/`opacity` |
| Polish ради polish | Декорация без задачи | Visual intent → polish для intent |
| Iterate ad infinitum | Drift | Before/After/Why для важных правок |
| Built-in CSS easing на главных моментах | Скучно, AI-default | Custom cubic-bezier |
| Анимация на keyboard shortcuts | Раздражение при повторении | Никогда не анимировать частые actions |

## Final Review Checklist (Emil Kowalski adapted)

После полного review — финальная таблица **всех** найденных issues с pointer на правило. Это **итоговый артефакт** review:

| # | Issue (WRONG) | Fix (RIGHT) | Why (rule / source) | Severity | Status |
|---|---|---|---|---|---|
| 1 | `#000000` в hero text | `hsl(0 0% 8%)` | Refactoring UI: no pure black | high | TODO |
| 2 | Hover 300/300ms на CTA | Hover 125/450ms | Comeau: action-driven motion | medium | TODO |
| 3 | `transition: all` в 8 местах | Explicit `transform`, `opacity`, `background-color` | Comeau: transition: all forbidden | high | TODO |
| 4 | Nested cards в pricing | Flat hierarchy, использовать spacing | Refactoring UI: no nested cards | medium | TODO |
| 5 | Lorem Ipsum в hero | Реальный текст из домена | anti-slop content rule | low | TODO |

**Status values:** `TODO` / `IN PROGRESS` / `FIXED` / `WONT FIX` (с обоснованием).

После фиксов — обновить колонку Status. Saved в `./artifacts/craft-audit.md`.

## Outcome

- Visual register выбран и зафиксирован
- Anti-slop checklist пройден
- Все findings — в format `Before | After | Why | Severity`
- Final Review Checklist в `./artifacts/craft-audit.md` (with Status column)
- Polish TODO для не-критичных
- Lineage entry в `project-state.md`

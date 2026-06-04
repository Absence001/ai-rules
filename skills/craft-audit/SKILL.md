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

## Когда триггерится

- Любой запрос на polish / audit / critique визуала
- Перед screens / реализацией — выбор visual register
- После реализации — anti-slop checklist
- Когда UI «как AI-сгенерированный»

## Что читать

1. **Сначала:** `./artifacts/project-state.md`, `./artifacts/screens.md` (если есть)
2. **Затем:**
   - `RULES_ROOT/memory-bank/craft/craft-core.md` — visual intent, craft commands
   - `RULES_ROOT/memory-bank/craft/visual-registers.md` — 7 регистров (product-app, mobile-product, brand-marketing, editorial-minimal, industrial-brutalist, premium-soft, image-reconstruction)
   - `RULES_ROOT/memory-bank/craft/anti-slop-audit.md` — checklist по категориям
   - `RULES_ROOT/memory-bank/craft/motion-rules.md` — animation principles
   - При taste-вопросах — `RULES_ROOT/memory-bank/craft/taste-development.md`

## Главный принцип

**Вкус = объяснимые решения.** Не «сделай красиво» — а конкретно: что улучшает интерфейс и почему.

> *«Almost every taste decision has a logical reason if you look close enough»* — Emil Kowalski

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
- [ ] UI animations < 300ms
- [ ] Custom cubic-bezier > built-in CSS easing
- [ ] Hover-вход ≠ hover-выход по длительности (action-driven, Comeau)
- [ ] Origin-aware (transform-origin из точки клика)
- [ ] Не анимировать частые / keyboard actions
- [ ] Не scale(0) — начинать с 0.95

### Shadows

- [ ] Не дефолтные `box-shadow: 0 2px 4px rgba(0,0,0,0.1)`
- [ ] Layered shadows (близкая жёсткая + дальняя мягкая)
- [ ] Subtlety > drama (не «выпуклые кнопки 2008»)

## Anti-Patterns

| Pattern (WRONG) | Why it fails | Correct (RIGHT) |
|---|---|---|
| `#000000` для текста | Жжёт глаза, AI-look | `#0a0a0a` / semantic token |
| Дефолтный purple-blue gradient | AI-cliché | Brand colors / restrained accent |
| Симметричные hover-transitions (300/300ms) | Ощущается «как робот» | 125ms in / 450ms out (Comeau) |
| `transition: all` | Скрытые поломки | Explicit properties |
| Анимировать `width`/`height` | Reflow / jank | `transform`/`opacity` |
| Polish ради polish | Декорация без задачи | Visual intent → polish для intent |
| Iterate ad infinitum | Drift | Before/After/Why для важных правок |

## Format результата

Каждая правка:

```
Before: [что было]
After: [что стало]
Why: [принцип / правило / источник]
Severity: low / medium / high
```

## Outcome

- Visual register выбран и зафиксирован
- Anti-slop checklist пройден
- `./artifacts/craft-audit.md` с findings в формате Before/After/Why
- Severity на каждый finding
- Polish TODO для не-критичных
- Lineage entry

---
name: craft-audit
status: active
description: Этап craft-аудита продуктового пайплайна — выбор визуального регистра и anti-slop-проверка экрана целиком, с артефактом craft-audit.md. Используй когда экран или лендинг доведён до конца и нужен финальный проход по качеству, когда результат «выглядит как AI-сгенерированный», или когда надо выбрать визуальный регистр до отрисовки. Включает правила Refactoring UI (нет чистого #000, иерархия через несколько сигналов) и полный anti-slop-чеклист. НЕ для отдельной детали вёрстки — это make-interfaces-feel-better. НЕ для движения — это animate / review-animations / emil-design-eng.
trigger_keywords:
  ru: ["craft", "craft audit", "крафт", "анти-слоп", "anti-slop", "визуальный регистр", "довести до идеала", "выглядит как AI", "финальная полировка"]
  en: ["craft", "craft audit", "anti-slop", "visual register", "final polish", "looks AI-generated"]
intent: |
  User finished a screen/landing and wants the pipeline's craft stage: pick the visual register,
  run the anti-slop checklist across the whole screen, produce artifacts/craft-audit.md.
  NOT a single implementation detail (radius, optical alignment, tabular numbers).
  NOT an animation task (building, reviewing or profiling motion).
task_type: outcome-gradable
related_skills: [design-system, frontend-impl, mobile-design, make-interfaces-feel-better, emil-design-eng]
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

- Финальный проход по качеству готового экрана или лендинга
- Перед screens / реализацией — выбор visual register
- После реализации — anti-slop checklist
- Когда UI «как AI-сгенерированный»

## Когда НЕ я

Я — **этап пайплайна**: смотрю экран целиком и оставляю `artifacts/craft-audit.md`.
Разовая правка детали и работа с движением — не ко мне:

| Запрос | Кому |
|---|---|
| Радиус, оптическое выравнивание, tabular numbers, хит-зона, сглаживание шрифта, тени | `make-interfaces-feel-better` |
| «Анимировать ли это вообще», выбор кривой и длительности, устройство компонента | `emil-design-eng` |
| Построить анимацию с нуля | `animate` (веб) / `animate-expo` (React Native) |
| Ревью существующего движения | `review-animations` |
| Аудит движения по всей кодовой базе | `improve-animations` |
| Анимация роняет кадры | `animation-performance` |
| Веб-приложение ощущается не нативно на телефоне | `mobile-native` |

Если в ходе аудита нашлась проблема из этой таблицы — **назови её в находках
и передай профильному скиллу**, а не чини сама. Полный разбор — `skills/README.md`.

**Приоритет при конфликте.** Как делать движение и детали — решают первоисточники
(Эмиль, MIFB, `apple-design`), а не наш memory-bank: наши прежние правила были их
пересказом и разошлись с оригиналом (`RULES-GOVERNANCE.md` #L7). Выше первоисточников —
только **токены конкретного проекта**: если в DS есть своя кривая или шкала длительностей,
используй её. Это не конфликт, а выбор конкретного значения внутри правила.

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
| `transition: all 300ms` | `transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1), opacity 200ms cubic-bezier(0.23, 1, 0.32, 1)` | `transition: all` ломается при будущих изменениях — Comeau; кривая — Эмиль | medium |
| Dropdown с `ease-in` | `ease-out`, `cubic-bezier(0.23, 1, 0.32, 1)` | `ease-in` задерживает старт ровно тогда, когда пользователь смотрит — Эмиль | medium |
```

### ❌ WRONG format

```markdown
- Color: change #000000 to #0a0a0a — better
- Transition: use specific properties
- Dropdown: use ease-out
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

## Движение в аудите

Кривые, длительности, пружины и hover **здесь не пересказываются** — пересказ
разошёлся с первоисточником в трёх местах (`RULES-GOVERNANCE.md` #L7). Источник —
скиллы Эмиля и MIFB, маршрут и шпаргалка — `memory-bank/craft/motion-rules.md`.

Как craft-audit работает с движением:
1. Отметить в находках, **что** не так с движением на экране, в общем формате таблицы.
2. Значение для колонки After брать из шпаргалки `motion-rules.md` или из таблиц `animate`.
3. Если движения на экране много или оно центральное — предложить пользователю
   `review-animations` (только явный вызов), а не разбирать самой.

### Анимировать ли вообще — по частоте *(Эмиль)*

| Частота действия | Решение |
|---|---|
| **100+ раз/день** (keyboard shortcuts, частые клики) | **Никогда не анимировать.** Создаёт ощущение задержки |
| **10+ раз/день** (toolbar buttons, частые переходы) | Анимация **минимальная** (≤150ms) или убрать |
| **Несколько раз/день** (модалки, drawers) | Стандартная анимация (модалки и drawer — 200–500ms) |
| **Редкие моменты** (onboarding, success states) | Полная анимация, можно expressive |

## Anti-slop checklist (Refactoring UI + Comeau + Kowalski + Rauno)

### Typography

- [ ] Не Inter/system font в brand / premium / editorial без причины
- [ ] Реальный type scale (не arbitrary размеры)
- [ ] Body ≥16px (web) / 13pt (iOS) / 14sp (Android)
- [ ] Line-height для body 1.5, headlines 1.1-1.2
- [ ] `text-align: left` на длинных текстах (не center)

### Color

- [ ] **Текст и поверхности — не `#000000`** — `#0a0a0a` или semantic token (прозрачные обводки и тени на чистом чёрном — можно, MIFB)
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

Детали и значения — шпаргалка `memory-bank/craft/motion-rules.md`.

- [ ] Reduced motion: перемещение убрано, opacity и цвет оставлены (не «всё выключено»)
- [ ] Не анимируются `width`/`height`/`top`/`left`/`margin`/`padding`
- [ ] `transition: all` запрещён
- [ ] UI до 300ms; модалки и drawer до 500ms
- [ ] Нет `ease-in` на UI; кастомные кривые вместо встроенных
- [ ] Частый hover — только смена фона ≤150ms; hover-scale — за `@media (hover: hover)`
- [ ] Popover растёт из триггера; модалка — по центру
- [ ] Не анимировать частые / keyboard actions
- [ ] Не `scale(0)` — начинать с 0.9–0.97 + opacity

### Shadows

- [ ] Не дефолтные `box-shadow: 0 2px 4px rgba(0,0,0,0.1)`
- [ ] Layered shadows (близкая жёсткая + дальняя мягкая)
- [ ] Subtlety > drama (не «выпуклые кнопки 2008»)

## Anti-Patterns (mid-review reference)

| Pattern (WRONG) | Why it fails | Correct (RIGHT) |
|---|---|---|
| `#000000` для текста | Жжёт глаза, AI-look | `#0a0a0a` / semantic token |
| Дефолтный purple-blue gradient | AI-cliché | Brand colors / restrained accent |
| `ease-in` на UI-элементе | Старт с задержкой — ощущается медленно | `ease-out` / кастомная кривая |
| Долгий hover на частых элементах | Интерфейс «тормозит» | Смена фона ≤150ms |
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
| 2 | Модалка уходит с `ease-in` 400ms | `ease-out` 200ms, выход короче входа | Эмиль: no ease-in on UI; MIFB: exit shorter than enter | medium | TODO |
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

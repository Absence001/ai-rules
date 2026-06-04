---
name: design-system
status: active
description: Build or update a design system — tokens, components, variants, states, theming, Figma↔code parity, governance. Use when user works with tokens, components, color/spacing/typography systems, design system documentation, or Figma MCP write actions involving DS. Enforces 3-tier tokens (primitive → semantic → component), semantic naming, Components/Recipes/Snowflakes taxonomy (Brad Frost), and Rule of Three for extraction.
trigger_keywords:
  ru: ["дизайн-система", "DS", "design system", "токены", "tokens", "компоненты", "components", "варианты", "variants", "theming", "parity", "Figma", "Storybook"]
  en: ["design system", "DS", "tokens", "components", "variants", "states", "theming", "parity", "Figma library", "Storybook"]
intent: |
  User works with tokens, components, variants, theming, or DS governance.
  Activate also for naming conventions, when component anatomy is discussed,
  or when user asks "should this be a token / component / variant?"
task_type: outcome-gradable
related_skills: [frontend-impl, mobile-design, craft-audit]
data_access_level: raw
---

# Design System

Построение / обновление DS: tokens → components → variants → theming → parity → governance.

## Initial Response (обязательно при первом вызове)

При активации без конкретного контекста — сразу ответить:

> «Активирован design-system. Уточни:
> 1. **Что делаем?** Создаём DS с нуля / обновляем существующую / token vs component decision / Figma-code parity check?
> 2. **Стек:** React / Figma / оба / другое?
> 3. **Brand baseline есть?** (цвета, шрифты, vibe) или строим с нуля от research?
> 4. **Объём:** core DS / recipes (product-specific) / smart components?
>
> Hard rules для нашей системы:
> - **3-tier tokens** (primitive → semantic → component). Никогда не подтягивать primitive напрямую в компонент.
> - **Semantic naming** variants (`intent: primary`, не `color: blue`).
> - **Rule of Three** — extract только на 3-м usage с identical intent.
> - **Never raw values** в коде/Figma.»

## Когда триггерится

- Любая работа с tokens / components / variants / theming
- Figma write через MCP с DS-touch
- Решение «token vs literal», «component vs variant», «новый или переиспользовать»
- Build / sync / parity check между Figma и кодом

## Что читать

1. **Сначала:** `./artifacts/project-state.md`, `./artifacts/design-system.md`
2. **Затем:**
   - `RULES_ROOT/memory-bank/design-system/design-system-core.md` — 3-tier tokens, Atomic Design, Frost taxonomy
   - `RULES_ROOT/memory-bank/design-system/tokens-spec.md` — категории tokens, MUST-правила (Primer)
   - `RULES_ROOT/memory-bank/design-system/component-anatomy.md` — anatomy / props / states
   - При Figma — `RULES_ROOT/memory-bank/design-system/figma-code-parity.md`
   - При React — `RULES_ROOT/memory-bank/design-system/react-ds-workflow.md`
   - При governance / lifecycle — `RULES_ROOT/memory-bank/design-system/ds-governance.md`

## 3-tier tokens (КРИТИЧНО — это hard rule)

```
Primitive → Semantic → Component
```

| Tier | Что | Пример |
|---|---|---|
| **Primitive** | Raw values | `base-color-blue-50: #1f6feb` |
| **Semantic** | Functional role | `fgColor-accent: var(--base-color-blue-50)` |
| **Component** | Component-specific | `button-primary-bgColor-hover` |

**Никогда не подтягивать primitive напрямую в компонент** — только через semantic.

## Components / Recipes / Snowflakes (Brad Frost)

| Тип | Где живёт | Когда |
|---|---|---|
| **Core component** | DS library | Context-agnostic, для всех продуктов (Button, Input, Modal) |
| **Recipe** | Product code | Composition core components в продукте (`ProductCard`, `CustomerDataCard`) |
| **Snowflake** | Локально (не выносить) | One-off случай — оставить inline |

## Rule of Three (Nathan Curtis)

**Не extract компонент / token после 2 usage.** Жди третьего одинакового intent.

**Premature abstraction хуже копипасты.**

## Naming — semantic, не visual

| ❌ Visual | ✅ Semantic |
|---|---|
| `color: blue` | `intent: primary` |
| `button: large` | `size: large` |
| `state: red` | `intent: danger` |

## Theme ≠ Mode (Nathan Curtis)

- **Mode** — light / dark / high-contrast (системная настройка)
- **Theme** — бренд / продукт (Ocean / Sands / default)
- **Orthogonal оси** — компонент работает во всех 2×2 комбинациях

## Mandatory states

Все интерактивные элементы:

- [ ] Rest
- [ ] Hover
- [ ] **`:focus-visible`** (НЕ `:focus`)
- [ ] Active
- [ ] Disabled (`:disabled` / `[aria-disabled]`)
- [ ] Loading (если async)

## Figma ↔ code parity

| Что | Правило |
|---|---|
| Layer names | = anatomy elements (= DOM/JSX) |
| Figma Variables | = CSS variables один-в-один |
| Variants в Figma | = enum-prop в TS (одинаковые значения) |
| Modes в Figma | = Variable Modes, не дублирование компонентов |
| Hardcoded в Figma | Запрещено — только Variables/Tokens |

## Anti-Patterns

| Pattern (WRONG) | Why it fails | Correct (RIGHT) |
|---|---|---|
| `color: blue` в коде | Hardcoded, нет токена | `var(--fgColor-accent)` |
| `brand-red` для error background | Mixing brand + role | `fgColor-danger` / `bgColor-danger` |
| Variant `color: blue` | Visual naming | Variant `intent: primary` |
| `gray-500` для borders + text + bg | Shallow token system, нет semantic | `fgColor-muted` / `borderColor-default` / `bgColor-muted` |
| Component с 30 props | God-component | Split / use slots |
| Component sprawl (Button-Primary, Button-Secondary, Button-Danger separate) | Over-fragmentation | One Button + `intent` variant |
| Extract после 2 usage | Premature abstraction | Rule of Three — на 3-м |
| Hardcoded gaps в Figma frames | Bypass token system | Variables |
| Состояния как отдельные variants | Дублирование | State через CSS pseudo / aria, не variant |
| Удалить компонент в minor release | Breaking change без deprecation | Deprecation cycle ≥3 месяца |

## Outcome

- `./artifacts/design-system.md` с tokens / components / variants / states / parity status
- 3-tier tokens соблюдены
- Semantic naming везде
- Все mandatory states присутствуют
- Figma ↔ code mirror naming (если применимо)
- Lineage entry

---
name: ia-design
status: active
description: Build information architecture and user flows. Use when user needs sitemap, navigation, user flow, screen mapping, JTBD-to-screens mapping. Activate after SRGID/research is complete — never build IA without grounded research. Includes Four Big Risks (Cagan) and Three Samsonov Questions as pre-flight checks.
trigger_keywords:
  ru: ["IA", "информационная архитектура", "sitemap", "flow", "user flow", "навигация", "экраны", "карта экранов"]
  en: ["IA", "information architecture", "sitemap", "user flow", "screen map", "navigation"]
intent: |
  User wants to structure screens, flows, or navigation. Activate also when designing decision
  trees (modal vs drawer vs screen vs wizard) or when scope of screens is unclear.
task_type: outcome-gradable
related_skills: [srgid-research, design-system, screenshot-to-code]
data_access_level: raw
---

# IA Design

Информационная архитектура и user flows. **Сначала структура → потом визуал** (Samsonov).

## Initial Response (обязательно при первом вызове)

При активации без конкретного контекста — сразу ответить:

> «Активирован ia-design. Перед IA — проверка:
> 1. **`research.md` есть?** Без research IA = ставка вслепую. Если нет — сначала `srgid-research`.
> 2. **Pre-flight check (3 вопроса Samsonov):**
>    - Какие у нас assumptions?
>    - Как мы узнаем что мы неправы?
>    - Что сделаем если неправы?
> 3. **Four Big Risks (Cagan):** какой риск открыт — value / usability / feasibility / viability?
>
> После — построю sitemap (макс. 2 уровня), main user flow, и decision table Modal/Drawer/Screen/Wizard для ключевых действий. Mandatory states (empty / loading / error) — обязательны.»

## Когда триггерится

- Запрос на sitemap / IA / навигацию / flow
- Пользователь говорит «какие экраны», «как переходим», «куда нажимать»
- После research, перед screens / DS

## Что читать

1. **Сначала:** `./artifacts/project-state.md`, `./artifacts/brief.md`, `./artifacts/srgid.md`, `./artifacts/research.md`
2. **Затем:**
   - `RULES_ROOT/memory-bank/ia-flow/ia-rules.md` — IA правила
   - `RULES_ROOT/memory-bank/ia-flow/flow-design.md` — flow правила
   - Опционально — `RULES_ROOT/memory-bank/ia-flow/ux-evaluation.md` для аудита

## Pre-flight checks (Four Big Risks + 3 Samsonov questions)

**До построения IA** прогнать пользователя через:

### Four Big Risks (Marty Cagan)

| Риск | Вопрос | Чем закрыт? |
|---|---|---|
| Value | «Will anyone use it?» | Research / interview |
| Usability | «Can users figure out how?» | Prototype / тест |
| Feasibility | «Can engineering build it?» | Tech spike |
| Business Viability | «Does it work for legal/finance/sales?» | Stakeholder review |

Зафиксировать в `project-state.md` раздел 9. Открытые риски — открытые вопросы.

### Three Samsonov Questions

1. **Какие у нас assumptions?** (явно зафиксировать)
2. **Как мы узнаем что мы неправы?** (что должно случиться)
3. **Что мы сделаем если окажемся неправы?** (план B)

Без этих 3 ответов IA = ставка вслепую.

## Порядок

1. Прочитать brief / SRGID / research.
2. Pre-flight check: Four Risks + Three Questions.
3. Главный JTBD (Cagan: outcome > output).
4. Главный сценарий, главный экран, главное действие.
5. Sitemap до 2 уровней (не глубже без причины).
6. User flow для главного сценария.
7. **Метки = слова** (Samsonov: labels не на жаргоне).
8. Decision table: Modal / Drawer / Screen / Wizard / Inline (см. таблицу ниже).
9. Записать `./artifacts/ia.md`.
10. Lineage entry.

## Modal / Drawer / Screen / Wizard

| Тип | Когда |
|---|---|
| **Modal** | Узкое подзадание, не требует full context, можно отменить |
| **Drawer / Sidesheet** | Контекстная задача рядом с основным экраном (фильтры, детали) |
| **Inline expand** | Доп. инфа без потери контекста |
| **New Screen** | Своя задача с собственным flow, можно ссылаться |
| **Wizard / Flow** | Последовательная задача в N шагов где порядок важен |

## Mandatory states (нельзя пропустить)

Для каждого экрана / flow:

- [ ] **Empty state** — это первое впечатление, не игнорить
- [ ] **Loading state** — если >300ms (skeleton / progress)
- [ ] **Error state** — что произошло + что делать («попробуй обновить», не «Error 500»)

## Anti-Patterns

| Pattern (WRONG) | Why it fails | Correct (RIGHT) |
|---|---|---|
| Полированный визуал поверх сломанной IA | Лечим симптом, причина в структуре | Сначала IA, потом UI (Samsonov) |
| Roadmap-driven IA («сделаем эти экраны») | Output, не outcome | JTBD → outcome → необходимые экраны |
| Метки на жаргоне («Sync workflow») | Пользователь не понимает | Метки = слова пользователя |
| Sitemap глубиной 5+ уровней | Невозможно ориентироваться | Максимум 2 уровня без сильного обоснования |
| Wizard когда хватило бы одного экрана | Overengineering | Decision table сверху |
| Modal внутри modal | Sign of broken IA | Refactor flow |
| Buried navigation (Cagan usability risk) | User не найдёт | Главное действие визуально очевидно |
| Empty / loading / error в TODO | Это и есть UX в 50% времени | Mandatory checklist |

## Outcome

- `./artifacts/ia.md` со всеми разделами по контракту (`artifact-contracts.md`)
- Sitemap + main user flow
- Decision на Modal/Drawer/Screen/Wizard для каждого важного действия
- Four Risks в `project-state.md` раздел 9 заполнены
- Mandatory states (empty/loading/error) обозначены
- Lineage entry

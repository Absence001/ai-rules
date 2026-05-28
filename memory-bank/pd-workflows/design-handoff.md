# Design Handoff

Передача дизайна разработке. Specs, redlines, acceptance criteria.

## Когда

Hi-fi финализирован, согласование пройдено, готов к реализации. Перед тем как Codex/dev начинает кодировать.

## Главный принцип

**Handoff = ответ на «что и как реализовать», без угадывания.** Дизайнер не «бросает через стену» — передаёт чёткие specs и доступен для вопросов.

## Что должно быть в handoff (минимум)

| Артефакт | Назначение |
|---|---|
| **Figma file link** | Все экраны и состояния |
| **Tokens used** | Список semantic tokens для каждого экрана |
| **Component map** | Какие компоненты из DS используются |
| **New components** | Если есть — спецификация anatomy / variants / states |
| **Interaction docs** | Что происходит при action (modals, transitions, error states) |
| **Edge cases** | Empty / loading / error / offline / no-permission |
| **Responsive behavior** | Что меняется на разных breakpoints |
| **Accessibility specs** | Keyboard, screen reader, contrast, focus order |
| **Acceptance criteria** | Чем подтвердим что реализовано правильно |

## Figma готовность

Перед handoff в Figma должно быть:

- [ ] Все экраны на 1 frame названы понятно (`HomePage / Default`, `HomePage / Empty`, `HomePage / Error`)
- [ ] Используются Variables (не raw values) — см. `design-system/figma-code-parity.md`
- [ ] Variant properties с semantic именами (`intent: primary`, не `color: blue`)
- [ ] Все states компонентов показаны
- [ ] Layer names соответствуют anatomy (Card / Title, не «Frame 47»)
- [ ] Code Connect mapping для core компонентов (если есть)
- [ ] Comments объясняют **почему**, не **что** (что видно из дизайна)

## Specs формат

Для каждого нового / нестандартного элемента:

```markdown
## <Component name>

**Anatomy:** <иерархия частей>
**Variants:** <enum значения>
**States:** default / hover / focus-visible / active / disabled / loading / error
**Props:** <name: type, default>
**Tokens used:** <list of semantic tokens>
**Accessibility:**
  - Role: <button / link / dialog>
  - Keyboard: <Tab / Enter / Esc>
  - Screen reader: <accessible name>
  - Focus management: <where focus goes>
**Interaction:**
  - On click: <action>
  - On hover: <visual change>
  - On error: <UI feedback>
```

## Interaction docs

Не достаточно показать static screen. Опиши:

| Интеракция | Что описать |
|---|---|
| Hover | Visual change |
| Focus | Visual + behavior |
| Click | Что происходит (navigation, modal, API call) |
| Submit | Loading → success/error states |
| Cancel | Что отменяется, восстанавливается ли state |
| Long press | Touch-specific (если mobile) |
| Swipe | Direction + result |
| Scroll | Sticky elements, infinite scroll, pagination |
| Drag | Что можно драгать, куда |

## Edge cases checklist

Для каждого экрана:

- [ ] Empty state (нет данных / first launch)
- [ ] Loading state (skeleton / progress)
- [ ] Error state (что случилось + что делать)
- [ ] Success state (если применимо)
- [ ] Offline state (если зависит от сети)
- [ ] No permission state (если требуется auth)
- [ ] Slow connection (skeleton, optimistic UI)
- [ ] Long content (overflow, truncation, scroll)
- [ ] Short content (что если данных меньше чем layout рассчитан)
- [ ] Special characters / emoji (отображение)

## Acceptance criteria формат

Для каждого фича-экрана:

```markdown
## AC: <feature name>

GIVEN <начальное состояние>
WHEN <действие пользователя>
THEN <ожидаемый результат>

Примеры:
- GIVEN пустой список заказов, WHEN пользователь открывает Orders page, THEN видит empty state с CTA «Создать первый заказ»
- GIVEN ошибка API, WHEN список загружается, THEN видит error state с retry button
- GIVEN >50 заказов, WHEN scrolling, THEN pagination загружает следующие 20
```

Это формат **Gherkin-style** (BDD) — понятен dev и QA.

## Что НЕ должно быть в handoff

| Anti-pattern | Что плохо |
|---|---|
| Просто «вот Figma link, реализуй» | Dev угадывает intent |
| Specs без interaction docs | Static screen не достаточно |
| Без edge cases | Реальность не учтена |
| Hardcoded values вместо tokens | Bypass DS |
| Раскрашенные screen без variant properties | Невозможно понять системность |
| Layer names типа «Frame 47» | Невозможно понять anatomy |
| Без acceptance criteria | QA не может проверить |

## Pre-handoff review

Перед передачей devу:

1. **Self-review** — пройди handoff checklist выше
2. **Peer review** — другой designer проверяет
3. **Tech feasibility** — короткий sync с tech lead: можем построить?
4. **Final figma cleanup** — убери черновики, переименуй frames

## Post-handoff support

- Будь доступен для вопросов (первые дни критичны)
- **Не меняй дизайн молча** в Figma — если меняешь, скажи dev
- При live testing — будь рядом
- После реализации — design review с dev'ом (что отличается от Figma)

## Связанные файлы

- `design-system/figma-code-parity.md` — Figma ↔ код mirror
- `design-system/component-anatomy.md` — спецификация компонента
- `design-system/tokens-spec.md` — токены
- `pd-workflows/component-documentation.md` — документация компонента
- `pd-workflows/accessibility-audit.md` — a11y specs

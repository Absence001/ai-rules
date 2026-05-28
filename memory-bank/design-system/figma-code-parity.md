# Figma ↔ Code Parity

Объединяет Figma MCP workflow + parity check. Источники: Figma docs, GitHub Primer, research синтез.

## Когда использовать

Если задача требует:
- Создания/редактирования компонентов в Figma через MCP
- Поддержания соответствия Figma DS ↔ React DS
- Audit'а существующего Figma файла
- Sync токенов между Figma и кодом

Не использовать для visual-only задач без production кода.

## Главный принцип

**Один источник правды для tokens, mirror naming для компонентов.**

Figma Variables и CSS variables должны иметь **один-в-один соответствие имён**. То же — для variant имён и компонентов.

## Перед началом

1. **Проверить Figma MCP подключение** — `whoami` / `get_metadata` на любую ноду
2. **Проверить `figma.config.json`** в проекте (если есть)
3. **Загрузить skill `figma:figma-use`** обязательно перед write-операциями
4. **Provided audit текущего файла:**
   - List of pages
   - Existing Variables collections
   - Existing components (`COMPONENT` / `COMPONENT_SET`)
   - Naming conventions используемые

## Порядок работы

### Создание новой DS в Figma

1. Foundation / Tokens (Variables collections)
2. Components с variants
3. Screens / Pages
4. Prototype connections (если нужны)

### Sync существующей DS

1. **Аудит** что есть в Figma vs что в коде
2. Создать **parity report** (PASS / PARTIAL / FAIL по компонентам)
3. Устранить расхождения по приоритету
4. Не перетирать существующее без подтверждения

## Token Sync

### Источник правды — два подхода

| Подход | Кто SoT | Когда применять |
|---|---|---|
| **Figma-first** | Variables в Figma → экспорт в JSON | Дизайнерская команда быстрее в Figma |
| **Code-first** | Version-controlled JSON (DTCG format) → Figma consumes via Tokens Studio | Tool-independence, multi-platform |
| **Гибрид** | Git как SoT, Tokens Studio для двусторонней синхронизации, Style Dictionary в платформенные форматы | Большие команды, multi-platform |

**Mirror naming обязательно:** одинаковые имена в Figma Variables и CSS vars.

### Категории Variables в Figma

| Тип | Categorie | Примеры |
|---|---|---|
| Color | Color variables | `color.fg.default`, `color.bg.muted` |
| Number | Number variables | `spacing.4`, `radius.md` |
| String | String variables | `font.family.body` |
| Boolean | Boolean variables | `state.dark-mode` |

### Modes

В Figma используй **Variable Modes** для:
- Light / Dark
- Themes (brand variants)
- Density

**Не дублируй компоненты** для разных режимов. Один компонент работает во всех modes через Variables.

## Component Parity

### Что проверять

| Параметр | Figma | Code | Match? |
|---|---|---|---|
| **Имя компонента** | `Button/Primary` | `<Button intent="primary">` | name |
| **Variant property** | `intent: primary \| secondary` | `intent: 'primary' \| 'secondary'` | values |
| **Variant values** | строки в Figma | enum в TS | exact |
| **Tokens used** | Variables привязки | CSS vars | mirror naming |
| **States** | состояния как variants или modes | CSS pseudo-classes / state props | coverage |
| **Anatomy** | layer names | DOM/JSX structure | semantic match |

### Parity report (выход)

```markdown
# Parity Report

## Summary
- Status: PARTIAL
- Components matched: 12/15
- Tokens matched: 80/80
- States gaps: 3

## Per-component
| Component | Status | Issues |
|---|---|---|
| Button | ✅ PASS | — |
| Input | ⚠️ PARTIAL | Missing `loading` state в Figma |
| Card | ❌ FAIL | Anatomy не совпадает: Card.Footer slot отсутствует |
```

## Figma Code Connect

### Что это

Mechанизм Figma для bridge между component в Figma и кодом в репо. Показывает реальные code snippets в Dev Mode (вместо auto-generated).

### Два режима

| Режим | Где | Когда |
|---|---|---|
| **Code Connect UI** | Внутри Figma | Простой setup, visual mapping, языко-агностичный |
| **Code Connect CLI** | Локально в репозитории | Property mappings, dynamic code examples, точнее |

### Ограничения (важно)

Code Connect — **мост на уровне snippet**, не на уровне API. То есть:
- Showing code snippets в Dev Mode ✅
- Auto-sync структуры компонентов ❌
- Структурный parity нужно поддерживать вручную

Property mapping в Code Connect CLI частично решает, но без полной автоматизации.

## Best practices

### Naming mirror

```
Figma Variable: color.fg.default
CSS variable:   --fgColor-default
TS token:       color.fg.default
```

Используй **одну конвенцию** для всех трёх. Любая разница = баг.

### Layer names = anatomy

В Figma layer names должны **соответствовать** именам DOM/JSX элементов:

```
Figma layer: Card / Image
Code:        <Card.Image>

Figma layer: Card / Title
Code:        <Card.Title>
```

### Code Connect mapping для core

**Каждый core component** в DS должен иметь Code Connect mapping. Без этого AI/Dev Mode будут генерить wrong snippets.

### Не хардкодить в Figma

В Figma frames **только через Variables**:
- ❌ `padding: 16` (hardcoded)
- ✅ `padding: {spacing.4}` (Variable)

То же что в коде: no raw values в компонентах.

## Anti-patterns

| Anti-pattern | Симптом | Источник |
|---|---|---|
| Naming mismatch (Figma `color/text/primary` vs CSS `--text-primary`) | Drift | research |
| Hardcoded values в Figma frames | Tokens обходятся | research |
| Variants в Figma vs props в коде расходятся | Parity FAIL | research |
| Layer names не соответствуют anatomy | Code Connect генерит wrong snippets | research |
| Modes через дублирование компонентов вместо Variable Modes | Раздувание library | research |
| No Code Connect mapping для core | AI / Dev Mode → wrong code | research |
| Переписывание / удаление существующих компонентов без подтверждения | Поломка downstream продуктов | внутреннее |

## Перед write в Figma — pre-flight check

1. Skill `figma:figma-use` загружен?
2. Аудит файла сделан (`get_metadata`)?
3. Список существующих компонентов проверен — не дублируешь?
4. Naming convention в файле понятна — следуешь ей?
5. Variables существующие проверены — не создаёшь дубль?

Если хоть один пункт «нет» — **остановись и проверь**.

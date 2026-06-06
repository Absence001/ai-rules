# Project CLAUDE.md (template для Claude Code) — **LOCAL OVERRIDE template**

> ⚠️ **Не копировать по умолчанию.** Default policy в `RULES_ROOT/AGENTS.md`: global-only, локальный CLAUDE.md в проекте **не нужен**.
>
> Этот шаблон используется **только** когда нужен **conscious local override** правил Claude для конкретного проекта.
>
> См. `RULES_ROOT/skills/project-init/SKILL.md` — секция «Local override mode».
>
> Шаблон. Замени `[PROJECT_NAME]` и `[YYYY-MM-DD]`.

## Проект

- **Имя:** `[PROJECT_NAME]`
- **Тип:** [лендинг / mobile app / SaaS / design system / другое]
- **Стек:** [React, Next.js, Tailwind, shadcn/ui — заполни]
- **Figma файл:** [ссылка если есть]
- **Создан:** `[YYYY-MM-DD]`
- **ai-rules commit:** `[short SHA из ~/ai-rules — git rev-parse --short HEAD]`

## RULES_ROOT

```
RULES_ROOT = ~/ai-rules
```

Глобальные правила: `RULES_ROOT/AGENTS.md` + `RULES_ROOT/claude/CLAUDE.md` (грузятся автоматически из `~/.claude/CLAUDE.md`).
Memory bank: `RULES_ROOT/memory-bank/<group>/<file>.md` (см. `RULES_ROOT/rules-index.md`).

## Порядок чтения в этом проекте

1. **Сначала** прочитать `artifacts/project-state.md` (текущее состояние проекта).
2. **Затем** при необходимости — `RULES_ROOT/rules-index.md` → точечно нужные правила.
3. Локальные правила в `./memory-bank/` (если есть) **переопределяют** глобальные.

## Project artifacts

Все project-specific артефакты в `./artifacts/`:

- `project-state.md` — shared state Claude ↔ Codex (читать первым)
- `brief.md`, `srgid.md`, `research.md`, `ia.md`, `design-system.md`, `screens.md`, `prototype.md`, `craft-audit.md` — pipeline artifacts (контракты — `RULES_ROOT/memory-bank/meta/artifact-contracts.md`)

## Role в этом проекте

Ты — **Claude** (оркестратор продуктового пайплайна). См. `RULES_ROOT/claude/CLAUDE.md` для полной роли.

В рамках этого проекта:
- Управляешь pipeline: brief → SRGID → research → IA → DS → screens → prototype → craft audit
- Работаешь с Figma через MCP (если есть)
- Делегируешь код Codex'у (через project-state.md и acceptance criteria в artifacts)
- Обновляешь `project-state.md` после каждого этапа

## Особенности этого проекта

[Добавь сюда: нестандартные договорённости, ограничения, важные решения, специфика стека / аудитории / бренда]

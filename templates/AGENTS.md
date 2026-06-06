# Project AGENTS.md (template для Codex CLI) — **LOCAL OVERRIDE template**

> ⚠️ **Не копировать по умолчанию.** Default policy в `RULES_ROOT/AGENTS.md`: global-only, локальный AGENTS.md в проекте **не нужен**.
>
> Этот шаблон используется **только** когда нужен **conscious local override** правил Codex для конкретного проекта.
>
> См. `RULES_ROOT/skills/project-init/SKILL.md` — секция «Local override mode».
>
> Шаблон. Замени `[PROJECT_NAME]` и `[YYYY-MM-DD]`.

## Проект

- **Имя:** `[PROJECT_NAME]`
- **Тип:** [лендинг / mobile app / SaaS / design system / другое]
- **Стек:** [React, Next.js, Tailwind, shadcn/ui — заполни]
- **Создан:** `[YYYY-MM-DD]`
- **ai-rules commit:** `[short SHA из ~/ai-rules — git rev-parse --short HEAD]`

## RULES_ROOT

```
RULES_ROOT = ~/ai-rules
```

Глобальные правила: `RULES_ROOT/AGENTS.md` + `RULES_ROOT/codex/AGENTS.md`.
Memory bank: `RULES_ROOT/memory-bank/<group>/<file>.md` (см. `RULES_ROOT/rules-index.md`).

## Порядок чтения в этом проекте

1. **Сначала** прочитать `artifacts/project-state.md` (текущее состояние проекта).
2. **Затем** при необходимости — `RULES_ROOT/rules-index.md` → точечно нужные правила.
3. Локальные правила в `./memory-bank/` (если есть) **переопределяют** глобальные.

## Project artifacts

Все project-specific артефакты живут в `./artifacts/`:

- `project-state.md` — shared state Claude ↔ Codex (читать первым)
- `brief.md`, `srgid.md`, `research.md`, `ia.md`, `design-system.md`, `screens.md`, `prototype.md`, `craft-audit.md` — pipeline artifacts (см. `RULES_ROOT/memory-bank/meta/artifact-contracts.md`)

## Role в этом проекте

Ты — **Codex** (code executor). См. `RULES_ROOT/codex/AGENTS.md` для полной роли.

В рамках этого проекта:
- Делаешь код / тесты / отладку
- Не оркестрируешь pipeline — это делает Claude
- Не правишь Figma — это делает Claude через MCP
- Перед изменениями кода: читай `project-state.md`, понимай где этап

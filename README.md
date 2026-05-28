# ai-rules

Единое хранилище правил для Claude Code и OpenAI Codex CLI. Подход: общее ядро + tool-specific дополнения + модульный memory-bank.

## Источник правды

- **GitHub** ([github.com/Absence001/ai-rules](https://github.com/Absence001/ai-rules)) — **source of truth**.
- **Локальный clone** (`C:/Users/PC/ai-rules`) — runtime cache. Изменения здесь нужно коммитить и пушить.
- При расхождении — GitHub приоритет, локально делаем `git pull`.

## Bootstrap

```
RULES_ROOT = C:/Users/PC/ai-rules
```

Все routing-пути в правилах разрешаются относительно `RULES_ROOT`.

В новом проекте:
1. Скопировать `templates/CLAUDE.md` и `templates/AGENTS.md` в корень проекта.
2. Создать `./artifacts/project-state.md` из `templates/project-state.md`.
3. Заполнить project-specific поля.
4. Глобальные правила (через `~/.claude/CLAUDE.md` и `~/.codex/AGENTS.md`) грузятся автоматически.

## Структура

```
ai-rules/
├── AGENTS.md                              ← общее ядро (роль, язык, routing, gates)
├── rules-index.md                         ← короткий маршрутизатор (читать первым)
│
├── claude/CLAUDE.md                       ← Claude-specific (оркестратор, Figma MCP)
├── codex/AGENTS.md                        ← Codex-specific (code executor, RSC defaults)
│
├── memory-bank/                           ← shared knowledge (runtime)
│   ├── meta/                              — pipeline, calibration, operating-principles
│   ├── discovery/                         — brief, SRGID, sources, context
│   ├── ia-flow/                           — IA, flow, UX evaluation
│   ├── design-system/                     — DS core, tokens, anatomy, parity, governance
│   ├── craft/                             — craft-core, registers, anti-slop, motion, taste
│   ├── platforms/                         — mobile-platform, mobile-craft, frontend-impl
│   ├── pd-workflows/                      — wireframing, critique, handoff, microcopy, a11y, doc
│   ├── screenshot-to-code/                — image-to-code workflow
│   └── code-diagnostics/                  — баги и код
│
├── directives/                            — короткие пошаговые инструкции
│
├── templates/                             — для нового проекта
│   ├── CLAUDE.md                          — bootstrap для Claude
│   ├── AGENTS.md                          — bootstrap для Codex
│   └── project-state.md                   — shared state Claude ↔ Codex
│
├── artifacts/                             — history (NOT runtime)
│   ├── research/                          — research топ-специалистов
│   ├── rules-audit.md                     — audit предыдущей версии
│   └── rules-proposal.md                  — план изменений
│
├── archive/                               — устаревшие файлы
│
└── sync-rules.bat                         — синхронизация ~/.codex/ + проверка ~/.claude/
```

## Подключение

### Claude Code (глобально)

Файл `~/.claude/CLAUDE.md` загружается для любого проекта автоматически:

```markdown
@C:/Users/PC/ai-rules/AGENTS.md
@C:/Users/PC/ai-rules/claude/CLAUDE.md
```

### Codex CLI (глобально)

`~/.codex/AGENTS.md` — собирается из `AGENTS.md` + `codex/AGENTS.md` через `sync-rules.bat`.

После каждого обновления правил — запусти `sync-rules.bat`.

### Новый проект

Скопируй `templates/CLAUDE.md` в корень нового проекта, заполни project-specific контекст. Глобальные правила (AGENTS.md, memory-bank) грузятся автоматически.

## Обновление правил

```bash
cd C:/Users/PC/ai-rules
# редактируй файлы
git add .
git commit -m "update: описание изменения"
git push

# синхронизация в Codex
sync-rules.bat
```

## Routing — куда читать по задаче

| Задача | Файлы |
|---|---|
| Brief / kickoff | `discovery/brief-expander.md` |
| Research (SRGID) | `discovery/srgid-*.md`, `sources-trust.md` |
| IA / sitemap / flow | `ia-flow/*.md` |
| Wireframing | `pd-workflows/wireframing.md` |
| Design system / tokens | `design-system/*.md` |
| Mobile UI | `platforms/mobile-*.md` |
| Frontend / React | `platforms/frontend-implementation-rules.md` |
| Screenshot → код | `screenshot-to-code/image-to-code-workflow.md` |
| Visual polish / craft | `craft/*.md` |
| Critique / handoff / microcopy | `pd-workflows/*.md` |
| Accessibility | `pd-workflows/accessibility-audit.md` |
| Component documentation | `pd-workflows/component-documentation.md` |
| Бaг / диагностика | `code-diagnostics/code-diagnostics.md` |

Детали — в `AGENTS.md`.

## Принципы системы

1. **One source of truth** — каждое правило в одном месте, остальное ссылается
2. **Modular** — атомарные файлы, читаются по требованию
3. **Tool-agnostic core + tool-specific extensions** — Claude и Codex видят общее ядро + свою специфику
4. **Research-backed** — все правила опираются на оригинальные источники (см. `artifacts/research/`)
5. **Skill-ready** — структура готова к Claude Skills wrappers

## История разработки

- `artifacts/research/` — глубокий research топ-специалистов (Refactoring UI, Frost, Primer, Cagan, Samsonov, Lilian Weng, Anthropic, HIG, MD3, Lee Robinson)
- `artifacts/rules-audit.md` — audit предыдущей версии
- `artifacts/rules-proposal.md` — план изменений

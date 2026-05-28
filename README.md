# ai-rules

Единое хранилище правил для Claude Code и Codex CLI.

## Структура

```
ai-rules/
├── AGENTS.md           — роль и поведение агента (читают оба)
├── memory-bank/        — знания: дизайн-система, IA, research, craft
├── directives/         — пошаговые инструкции для конкретных операций
├── codex/
│   └── rules.md        — дополнительные правила для Codex
├── templates/
│   └── CLAUDE.md       — шаблон CLAUDE.md для нового проекта
└── sync-rules.bat      — синхронизация AGENTS.md в ~/.codex/
```

## Подключение

### Claude Code (глобально)

Файл `~/.claude/CLAUDE.md` автоматически загружается для любого проекта:

```markdown
@C:/Users/PC/ai-rules/AGENTS.md
```

### Codex CLI (глобально)

`~/.codex/AGENTS.md` — копия `ai-rules/AGENTS.md`. После изменений запусти `sync-rules.bat`.

### Новый проект

Скопировать `templates/CLAUDE.md` в корень нового проекта и добавить project-specific контекст.

## Обновление правил

```bash
cd C:/Users/PC/ai-rules
# редактируй файлы
git add .
git commit -m "update: описание изменения"
git push
```

Изменения применяются сразу — при следующем открытии Claude или Cursor.

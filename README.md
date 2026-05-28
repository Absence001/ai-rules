# ai-rules

Единое хранилище правил для Claude Code и Cursor.

## Структура

```
ai-rules/
├── AGENTS.md           — роль и поведение Claude-агента
├── memory-bank/        — знания: дизайн-система, IA, research, craft
├── directives/         — пошаговые инструкции для конкретных операций
├── cursor/
│   └── rules.md        — правила для Cursor
└── templates/
    └── CLAUDE.md       — шаблон CLAUDE.md для нового проекта
```

## Подключение

### Claude Code (глобально)

Файл `~/.claude/CLAUDE.md` автоматически загружается для любого проекта:

```markdown
@C:/Users/PC/ai-rules/AGENTS.md
```

### Cursor (глобально)

Settings → Rules for AI → вставить содержимое `cursor/rules.md`

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

# artifacts/

**Не runtime.** Это history разработки правил. В обычных задачах эти файлы не читать.

## Что здесь

| Файл / папка | Назначение |
|---|---|
| `research/` | Глубокий research топ-специалистов. 7 файлов, ~2100 строк. См. archive policy ниже |
| `rules-audit.md` | Audit предыдущей версии правил (history) |
| `rules-proposal.md` | План изменений (history) |

## Когда читать research/

**Только** при явных триггерах:
- «обоснование правила X», «откуда взято правило Y»
- «полный аудит правил»
- «исправь правила на основе research»

В runtime для обычных задач — **не читать**.

## Project-specific artifacts

Этот `artifacts/` — **в ai-rules repo** (history правил).

Project-specific артефакты (brief, srgid, research, ia, design-system, screens, prototype, craft-audit, project-state) живут в `./artifacts/` **внутри каждого проекта**, не здесь.

См. контракты в `memory-bank/meta/artifact-contracts.md`.

## Источник правды

- **GitHub** ([github.com/Absence001/ai-rules](https://github.com/Absence001/ai-rules)) — source of truth для правил
- **Локальный clone** (`~/ai-rules`) — runtime cache. Изменения коммитить и пушить

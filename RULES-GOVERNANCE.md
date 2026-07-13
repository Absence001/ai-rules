# RULES-GOVERNANCE — управление системой правил ai-rules

> Материальный паспорт для **самого репозитория правил** (не для проектов). Здесь фиксируется,
> как поддерживается целостность ai-rules, чем и как это проверяется, и append-only журнал решений.
> Идея — дать нашей же методологии Material Passport / Decision Lineage применяться к правилам,
> из которых она состоит (dogfooding).

## Зачем это нужно

Правила ai-rules разложены по слоям (`AGENTS.md` → `claude/CLAUDE.md` / `codex/AGENTS.md` →
`memory-bank/` → `skills/` → `templates/`) и синкаются в машинные локации (`~/.codex/AGENTS.md`,
`~/.claude/skills/`) через `sync-rules.bat`. Между слоями и снимками возникает **drift**:
устаревшие ссылки, рассинхрон снимка Codex, разросшиеся файлы, случайные секреты.

Раньше drift ловился вручную (см. git-историю: несколько коммитов `fix drift` подряд).
Теперь — детерминированным линтером.

## Инструменты

### `scripts/rules-lint.mjs`

Node-скрипт без зависимостей (boring tech; node, не python — python3 в среде сломан).
Запуск: `node scripts/rules-lint.mjs`. Exit 1 при ошибках, 0 при чистоте. Гоняется
автоматически в конце `sync-rules.bat`.

| Правило | Что проверяет | Уровень |
|---|---|---|
| **R1 stale-ref** | ссылки на `.md` разрешаются в реальный файл (учитывает непоследовательный стиль путей: `craft/<name>.md`, `<name>.md`, `memory-bank/<name>.md`). Артефакты пайплайна и внешние пути (`~/`, `RULES_ROOT`) — в allowlist | error (path со `/`) / warn (bare) |
| **R2 stale-command** | команды, ссылающиеся на `scripts/*` и файлы репо, существуют | warn |
| **R3 max-lines / token-budget** | bloat = файл длинный (>220 строк) **И** тяжёлый (>6000 токенов) одновременно; отдельно — короткий-но-тяжёлый файл (>6000 токенов) | warn |
| **R4 secret** | hardcoded API-ключи/токены в тексте правил | error |
| **R5 skill-shape** | `skills/*` в kebab-case, есть `SKILL.md` с `name`/`description` | error |
| **R6 sync-drift** | `~/.codex/AGENTS.md` покрывает источник (`AGENTS.md` + `codex/AGENTS.md`) построчно; `RULES_ROOT`-подстановка игнорируется | error |

### Источники модели правил

Заимствовано из экосистемы (`awesome-claude-code`), переработано под нашу структуру:

- **Ctxlint** — `stale-file-ref`, `stale-command`, `max-lines`, `token-budget`, `mcp-hardcoded-secret` → наши R1–R4.
- **agnix** — валидация skill-naming (`code-review`, не `Review-Code`) и shape SKILL.md → наш R5.
- **compass** — паттерн «единый источник + CI-валидация против drift» → R6 + встраивание линтера в `sync-rules.bat`.
- **Claude Code Safety Guard** — модель детерминированного PreToolUse-блока опасных команд → план Фазы 2 (см. Lineage #L2).

## Что НЕ взято (осознанно)

- **agnix целиком** (432 правила) — избыточно для нашей системы; взяли только принцип skill-shape.
- **cost-tiered routing** (compass) — у нас роли делятся Claude/Codex, не по цене модели.
- **Memory / Observability** проекты — вне текущего scope.

## Decision Lineage (append-only)

### #L1 — Линтер правил + CI-валидация синка (2026-07-13)
**Решение:** добавлен `scripts/rules-lint.mjs` (R1–R6) и вызов из `sync-rules.bat`.
**Почему:** правила дрейфили между слоями, ловилось вручную. Модель — Ctxlint/agnix/compass.
**Проверено:** первый прогон дал 122 «ошибки» — оказались ложными (ссылки на выходные артефакты
пайплайна `artifacts/*.md`, которых нет в репо правил by design). После allowlist пайплайн-артефактов
и внешних путей: **0 ошибок, 2 warn** (bloat в `pd-workflows/component-documentation.md` 296 строк
и `skills/craft-audit/SKILL.md` 254 строки).
**Наблюдение:** гипотеза о рассинхроне снимка Codex НЕ подтвердилась — построчная проверка показала
0 смысловых расхождений (2 «отсутствующие» строки = намеренная подстановка `RULES_ROOT`). Первая
версия R6 (substring) давала false positive; заменено на построчное покрытие.

### #L2 — Enforcement-хук guard-hook (ПОДКЛЮЧЁН локально, 2026-07-13)
**Решение:** `scripts/guard-hook.mjs` — детерминированный PreToolUse-блок всегда-запрещённых команд
(`rm -rf /`, `rm -rf ~`, `git reset --hard`, force-push без lease, `commit --no-verify`, `commit --amend`,
`mkfs`, `dd of=/dev/*`, fork-бомба, рекурсивный chmod/chown на системных путях, обход GPG). Модель Safety Guard.
**Wiring:** по решению пользователя — только в `.claude/settings.local.json` репо ai-rules (пилот), НЕ глобально.
Глобально (`~/.claude/settings.json`) и другие проекты (напр. praid-ecom) пока не покрыты.
**Проверено:** 6/6 опасных команд блокируются, 7/7 рабочих (`rm -rf ./build`, `--force-with-lease`,
`git commit -m`, `reset --soft`, `corepack pnpm`) проходят — ложных срабатываний нет.
**Важно:** хук активируется при **перезапуске сессии** Claude Code (хуки читаются на старте).
В текущей сессии ещё не действует.
**Открытые вопросы:** (1) выносить ли на глобальный уровень после обкатки; (2) держать конфиг хука
в ai-rules и синкать через sync-rules.bat, или вести per-project; (3) Codex/сабагенты — non-inheritance
разрешений пока не реализован (нужен отдельный agent-scoping механизм).

### #L3 — Уточнение R3 (2026-07-13)
**Решение:** `max-lines` теперь срабатывает только вместе с превышением токен-бюджета (длинный И тяжёлый).
**Почему:** первые два срабатывания (`component-documentation.md` 295 строк / ~2153 токена,
`craft-audit/SKILL.md` 253 / ~3341) при разборе оказались обоснованно длинными (шаблон-с-примерами и
плотный skill), но под токен-бюджетом. Порог по строкам был строже токеновой реальности → ложный шум.
**Результат:** линтер полностью чист (0/0). Настоящий bloat (длинный + тяжёлый) по-прежнему ловится.

## Незакрытые хвосты

- Глобальный rollout guard-hook (`~/.claude/settings.json`) и покрытие других проектов (praid-ecom) — отложено, пилот на ai-rules.
- Codex/сабагенты non-inheritance разрешений (#L2) — не реализовано.

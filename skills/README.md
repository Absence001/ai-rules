# Skills

Skills — **Claude-only** обёртки над memory-bank. Codex CLI продолжает читать `AGENTS.md` + `codex/AGENTS.md` напрямую.

## Что это

Skill — модульное знание, которое Claude грузит **по требованию** (через description + intent matching), а не сразу всё в контекст. См. `RULES_ROOT/AGENTS.md` и Anthropic Skills docs.

## 11 skills

| Skill | Когда триггерится | Указывает на (memory-bank/) |
|---|---|---|
| `project-init` | Пустая папка, «новый проект», bootstrap | `templates/*` |
| `product-brief` | Новый проект (после init), расплывчатый запрос | `discovery/brief-expander.md` |
| `srgid-research` | Research, конкуренты, SRGID | `discovery/srgid-*.md`, `sources-trust.md` |
| `ia-design` | IA, sitemap, flow | `ia-flow/*.md` |
| `design-system` | Tokens, components, variants, theming | `design-system/*.md` |
| `mobile-design` | iOS / Android / mobile | `platforms/mobile-*.md` |
| `craft-audit` | Polish, anti-slop, visual review | `craft/*.md` |
| `screenshot-to-code` | Прикреплён скриншот, восстановить UI | `screenshot-to-code/`, `craft/*.md`, frontend |
| `frontend-impl` | React / Next.js / TS код | `platforms/frontend-implementation-rules.md` |
| `code-diagnostics` | Баг, ошибка, fix | `code-diagnostics/*.md`, `meta/calibration.md` |
| `pipeline-control` | Мета: где мы, что дальше | `meta/*.md` |

## Структура SKILL.md (по образцу Academic Research Skills v3+)

```yaml
---
name: skill-name
status: active
description: <one-line trigger + role>
trigger_keywords:
  ru: [...]
  en: [...]
intent: |
  <intent description for Layer 2 routing>
task_type: outcome-gradable
related_skills: [...]
data_access_level: raw | redacted | verified_only
---

# Skill Name

## Когда триггерится

## Что читать

## [Скилл-специфичные секции]

## Anti-Patterns

| Pattern (WRONG) | Why it fails | Correct (RIGHT) |
|---|---|---|

## Outcome
```

## Routing (3 layers)

1. **Layer 1 — Keywords** (high confidence)
   Если в запросе есть точное слово из `trigger_keywords` → activate
2. **Layer 2 — Intent** (по смыслу)
   Если запрос матчится `intent` description (даже без точных keywords) → activate
3. **Layer 3 — Fallback** (ask user)
   Если match неясен — спросить пользователя «это про X или Y?», не угадывать

## Source of truth

- Skills в `ai-rules/skills/` — git-tracked, source of truth
- `~/.claude/skills/` — runtime копия (Claude discoverable location)
- Sync через `sync-rules.bat`

## Anti-Patterns про Skills

| Pattern (WRONG) | Why it fails | Correct (RIGHT) |
|---|---|---|
| Описать skill в одной строке без триггеров | Claude не найдёт | Полный YAML frontmatter |
| Не различать `trigger_keywords` и `intent` | Skill активируется криво | Keywords = high-confidence, Intent = semantic |
| Дублировать содержимое memory-bank в SKILL.md | Drift между skill и source of truth | SKILL.md ссылается на memory-bank/X.md |
| Создать skill для очень узкой задачи | Slop, шум в списке | Минимум — стабильная категория задач |
| Не обновить sync после изменения skill | Claude видит старую версию | sync-rules.bat |

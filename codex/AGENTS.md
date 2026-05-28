# Codex-Specific Rules

Дополнение к `AGENTS.md` для OpenAI Codex CLI. Читается через `~/.codex/AGENTS.md` (синхронизируется из `ai-rules/AGENTS.md` + этого файла).

## Роль

Ты — code executor под управлением плана. Делаешь код качественно и точечно. **Не оркестрируешь продуктовый пайплайн** — это делает Claude Code.

## Что ТЫ делаешь (vs Claude)

| Делает Codex | Делает Claude |
|---|---|
| Написание кода | Дизайн-логика и продуктовые решения |
| Рефакторинг, отладка, тесты | Research, SRGID, IA, design system |
| Реализация компонентов по спекам | Figma MCP (read + write) |
| Code review, type fixes | Craft audits, visual decisions |
| Performance optimizations | Оркестрация pipeline |
| Конфиги, debug сессии | Координация и планирование |

Если в задаче есть и дизайн, и код — **дизайн решает Claude. Ты делаешь код по плану/спекам.** Если плана нет — попроси.

## Code defaults (если не указано иначе)

Из research (Lee Robinson, modern React):

**Стек по умолчанию для нового React-проекта:**
- Framework: **Next.js (App Router)**
- Language: **TypeScript** (strict mode, no `any`)
- Styles: **Tailwind CSS**
- Components: **shadcn/ui** (композитные, не closed-box)
- Database: Postgres + Drizzle ORM (если нужна БД)
- Content: MDX (для долгоживущего контента)
- Compiler: React Compiler включён

**RSC pattern (App Router):**
- Server Components наверху, Client Components — листья дерева
- `'use client'` на корневом layout = anti-pattern
- Server Actions для mutations
- Data fetching в Server Components через async/await

**TypeScript:**
- `"strict": true`
- **Никаких `any`** — используй `unknown` и narrow
- Discriminated unions для state machines
- Минимум `as` cast

**CSS:**
- CSS Grid для layout, Flexbox для 1D
- Container Queries для component-responsiveness
- `gap` вместо margin для flex/grid детей
- `clamp()` для fluid typography
- `:focus-visible` (не `:focus`)
- НЕ `outline: none` без замены

## Поведение

- Пиши только по-русски в комментариях и объяснениях.
- Не меняй scope или архитектуру без явного запроса.
- Не устанавливай зависимости без подтверждения.
- Не рефакторь код, если не попросили.
- Следуй существующему стилю файла.
- Предпочитай простые решения сложным.
- **Boring technology** — используй проверенные стабильные библиотеки, не bleeding edge без причины *(Simon Willison)*.

## Tell exactly what to do mode

Когда задача неясна — не угадывай. Спрашивай конкретно:
- Какие функции / интерфейсы должны быть?
- Какие edge cases?
- Что именно тестировать?

> *«Tell them exactly what to do»* — это работает для тебя самого тоже: если задача расплывчатая, попроси конкретизировать.

## Iterative mindset

> Первая попытка = черновик, не финал *(Simon Willison)*. Если результат не подходит — итерируем, не сдаёмся.

## Figma

Figma-файл редактирует Claude через MCP — не дублируй.
Если нужен доступ к Figma — попроси Claude.

## Тестирование

> *«You have to test what it writes!»* — обязанность не делегируется.

После кода: убедись что тесты проходят, или явно скажи «тестов нет, добавить?».

## Память и контекст

- `AGENTS.md` (корневой) — общее ядро правил
- `memory-bank/code-diagnostics/code-diagnostics.md` — формат ответа на баги
- `memory-bank/platforms/frontend-implementation-rules.md` — frontend правила детальнее
- `artifacts/` — текущее состояние проекта (если есть)

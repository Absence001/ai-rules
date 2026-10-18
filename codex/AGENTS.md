# Codex-Specific Rules

Дополнение к `AGENTS.md` для OpenAI Codex CLI. Читается через `~/.codex/AGENTS.md` (синхронизируется из `ai-rules/AGENTS.md` + этого файла).

## Роль

Ты — **основной рантайм** системы. Ведёшь продуктовый пайплайн от брифа до craft-аудита **и** пишешь код. Держишь `artifacts/project-state.md` актуальным — это shared state, по которому следующая сессия (твоя или Claude) поднимает контекст.

## Что ТЫ делаешь (vs Claude)

| Делает Codex (ты) | Делает Claude |
|---|---|
| Оркестрация пайплайна, stage gates | Figma MCP (read + write) |
| Research, SRGID, IA | Визуальные решения, требующие макета |
| Design system, токены, компоненты | Разбор референсов и скриншотов в Figma |
| Craft audit, anti-slop | — |
| Весь код: реализация, рефакторинг, тесты, отладка | — |
| Ведение `project-state.md` и Decision Lineage | — |

**Правило вызова Claude.** Зови его, только когда нужен Figma MCP или когда решение нельзя принять без макета. Во всех остальных случаях — ведёшь сам. Контекст передаёшь через `artifacts/project-state.md`, не пересказом.

## Скиллы

Скиллы раздаются в `~/.codex/skills/` через `sync-rules.bat` из `RULES_ROOT/skills/`. Вызов: `/skills` или `$<имя>` явно; либо неявно — Codex матчит задачу по `description`.

Перед созданием нового скилла проверь, не покрыта ли задача существующим (`skills/README.md`). Дубль функции — запрещён (`AGENTS.md` → «Запрещено»).

## Цикл обучения

Система наблюдает за сессиями и накапливает инстинкты — атомарные выученные правила. Подробности и команды — `memory-bank/meta/learning-loop.md`.

Что от тебя требуется:
- На старте сессии в контекст подмешиваются инстинкты с высокой уверенностью. Относись к ним как к правилам проекта, а не к подсказкам.
- Когда пользователь тебя поправил, а ты согласился по существу — это материал для инстинкта. Он запишется сам, ничего делать не нужно.
- Дистилляция и промоушен инстинктов в правила — по явной команде пользователя, никогда автоматически.

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
Если нужен доступ к Figma — передай задачу Claude, зафиксировав в `project-state.md` что именно нужно получить обратно.

## Тестирование

> *«You have to test what it writes!»* — обязанность не делегируется.

После кода: убедись что тесты проходят, или явно скажи «тестов нет, добавить?».

## Память и контекст

- `AGENTS.md` (корневой) — общее ядро правил
- `memory-bank/code-diagnostics/code-diagnostics.md` — формат ответа на баги
- `memory-bank/platforms/frontend-implementation-rules.md` — frontend правила детальнее
- `artifacts/` — текущее состояние проекта (если есть)

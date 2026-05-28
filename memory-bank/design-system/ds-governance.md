# DS Governance

Lifecycle, versioning, ownership дизайн-системы. Источники: Brad Frost, Dan Mall, industry standards.

## Главный принцип

> *«Design systems are less about assets… but more about people and their relationships»* — Brad Frost

Технология вторична. DS живёт через **процессы** и **отношения**, не через идеальные Figma-файлы.

## Frost 5-layer Ecosystem (как организовать DS)

| # | Слой | Обязательность | Кто владеет | Артефакты |
|---|---|---|---|---|
| 1 | **Core DS** | Обязательный | DS team | Tokens (Figma + JSON), Icons, UI Components, Reference site |
| 2 | **Tech-specific** | Опциональный | Framework team | React/Vue wrappers, native iOS/Android |
| 3 | **Recipes** | Опциональный | Product designers | Compositions в продукте (`ProductCard`, `CustomerDataCard`) |
| 4 | **Smart Components** | Опциональный | Backend-adjacent | Forms + validation, payments, typeahead, analytics-wired |
| 5 | **Product** | Обязательный | Product team | Figma files, codebases, native apps |

**Ключевые правила:**

- Core DS — только context-agnostic, для всех продуктов
- Recipes — product-specific, живут **в коде продукта**, не в core
- Snowflakes (одноразовые) — **не выносим вообще**

> *«Recipe layer — pressure release valve для перегруженных core-команд»* — Frost

Это снимает антипаттерн «всё в core».

## Components / Recipes / Snowflakes (Frost taxonomy)

| Тип | Что | Где живёт | Reuse |
|---|---|---|---|
| **Component** | Context-agnostic, shared across organization | Core DS | Везде |
| **Recipe** | Specific composition core-компонентов, product-specific | Product code | В рамках продукта |
| **Snowflake** | One-off, нужно один раз | Где используется | Не reuse |

**Test:** прежде чем вынести в Core DS — спроси: «это нужно ВСЕМ продуктам или только этому?»

## SemVer для DS

| Тип изменения | Версия | Пример |
|---|---|---|
| Patch | x.y.**Z** | Bug fix без API изменений |
| Minor | x.**Y**.0 | Новый компонент, новый prop с default |
| Major | **X**.0.0 | Breaking change в API / удаление |

**Никогда** не делай breaking change в minor/patch.

## Deprecation cycle

**Минимум 3 месяца** между announce и removal (для крупных орг — 6).

```
1. Announce (current major release):
   - Помечаем как deprecated в коде (@deprecated JSDoc)
   - Помечаем в Figma (description, color tag)
   - Документация: "Deprecated, use X instead"
   - Migration guide

2. Wait 3-6 months

3. Remove (next major release)
   - Удаляем из codebase
   - Удаляем из Figma library
   - Удаляем из docs
```

**Никогда** не удаляй компонент в minor/patch.

## Pilot project model

> *«There's a specific way that you get components into a design system, and that is not by making them and then having teams use them»* — Dan Mall

**Правило:** компоненты **входят в core DS через пилотный продуктовый проект**, не через top-down мандат.

Процесс:
1. Продуктовая команда строит то что нужно (как recipe)
2. Если паттерн повторяется ≥3 раза в **разных** продуктах с identical intent — рассматриваем для core
3. DS team поднимает из recipe в core
4. Старые usages мигрируют (с deprecation cycle для recipe в коде продукта)

**Не строить DS в вакууме** — без пилотного продукта компоненты будут оторваны от реальных нужд.

## Ownership

| Уровень | Кто отвечает |
|---|---|
| Core DS | Малая стабильная команда (1-3 человека минимум) |
| Recipe | Продуктовый дизайнер своего продукта |
| Tech-wrappers | Framework owners |
| Smart components | Backend-adjacent team |

**Antipattern:** single ownership bottleneck — один человек владеет всем core DS, очередь PR-ов растёт, продукты копят локальные обходы.

**Решение:** distributed ownership + регулярный contribution process.

## Contribution rules

Чёткие критерии для:

| Куда | Критерии |
|---|---|
| Core DS | Reuse ≥3 продуктов, context-agnostic, прошёл pilot, есть owner |
| Tech wrapper | Specific framework team approved |
| Recipe (в продукте) | Любой продуктовый дизайнер может |
| Smart component | Backend team approved |

## Documentation requirements

Каждый компонент в Core DS должен иметь:
- Description, anatomy, variants, states, props API
- Do/don't usage
- Accessibility specs
- Code examples (per framework)
- Live playground
- Design specs (Figma link)
- Tokens used
- Changelog / version
- Migration notes (для breaking changes)

См. `pd-workflows/component-documentation.md` для полного шаблона.

## Cadence

| Тип | Регулярность |
|---|---|
| Releases | Регулярные (не ad-hoc), например monthly |
| Changelog | Обязательно для каждого release |
| Office hours | Еженедельно для contributors |
| Roadmap | Quarterly review |

## Anti-patterns (governance)

| Anti-pattern | Симптом | Last research |
|---|---|---|
| **Graveyard DS** | 41% DS запущенных за последние 2 года больше не поддерживаются (2024 report) | research |
| **No deprecation lifecycle** | Компонент удалён в minor release без warning | industry |
| **Single ownership bottleneck** | Один человек, очередь PR-ов, локальные обходы | Frost / Mall |
| **DS team в вакууме** | DS строится без пилотного продукта | Mall / Frost |
| **Top-down мандат** | «Все должны использовать DS», но компоненты не отражают нужд | Mall |
| **Всё в core** | Recipes не вынесены в продукты, core раздувается | Frost |

## Когда DS НЕ нужна

> Не всё надо собирать в DS.

Если проект:
- Один продукт, маленький scope
- Скоро будет переделан
- Нестандартный по визуалу

→ **Достаточно набора компонентов без полной DS infrastructure** (governance, versioning, docs).

DS делается когда есть **множественные продукты** или **долгосрочный план**. Иначе — оверкилл.

# Flow Design

User flows и решения о структуре экранов. Источники: общая практика IA + Cagan + Samsonov + mobile/web research.

## Когда использовать

После IA и базовой дизайн-системы. Не раньше.

## Порядок

1. Прочитать `artifacts/ia.md`.
2. Проверить что есть `artifacts/design-system.md` ИЛИ явное разрешение делать «несистемный» prototype.
3. Разложить flow на экраны (один экран = одно решение пользователя).
4. Для каждого экрана определить:
   - **цель** (что закрывает в JTBD)
   - **состояние** (default, loading, error, empty, success)
   - **главный CTA**
   - **вторичные действия**
   - **компоненты**
5. Записать `artifacts/screens.md`.

## Modal vs Drawer vs Screen vs Wizard (decision table)

| Тип | Когда | Когда НЕ |
|---|---|---|
| **Modal** | Узкое подзадание не требующее full context. Завершается быстро. Можно отменить | Если задача длинная (>3 шагов) или требует много данных |
| **Drawer / Sidesheet** | Контекстная задача рядом с основным (фильтры, детали item, props) | Если основной экран не должен быть виден |
| **Inline expand** | Доп. инфа без потери контекста (FAQ, accordion, details) | Если содержимое слишком большое |
| **Bottom sheet (mobile)** | Mobile аналог drawer/modal. Контекстный action | Если нужно показать всю информацию (тогда full screen) |
| **Full screen modal** | Целая задача требующая фокуса (compose new, settings) | Если можно вернуться без потери контекста |
| **New screen** | Своя задача со своим flow. Можно ссылаться по URL | Если задача узкая (modal лучше) |
| **Wizard** | Последовательная задача N шагов где **порядок важен** (онбординг, оформление заказа) | Если шаги независимы (тогда отдельные экраны) |
| **Tabs внутри экрана** | Параллельные области одной задачи | Если содержимое требует переходов (тогда экраны) |

## States — обязательны для каждого экрана

| State | Когда нужен |
|---|---|
| **Default** | Всегда |
| **Loading** | Если есть async (data fetch, action) — > 300ms = skeleton/progress |
| **Empty** | Если контента может не быть (first launch, no results) — **первое впечатление!** |
| **Error** | Если действие может провалиться. Формат: что случилось + что делать |
| **Success** | Если действие успешно — confirm + next step |

**Empty / Error не optional.** Это первое впечатление если что-то идёт не так.

### Error states — формат

- ❌ «Error 500»
- ❌ «Something went wrong»
- ✅ «Не удалось загрузить заказы. Попробовать снова?» (что случилось + что делать)

### Empty states — формат

- ❌ «No data» с серой иконкой
- ✅ «Здесь будут ваши заказы. Создать первый?» (что будет + CTA)

## Loading — критерии

| Длительность | Что показывать |
|---|---|
| < 100ms | Ничего |
| 100-300ms | Optional fade-in |
| 300ms - 1s | Skeleton (структура контента) |
| 1s - 10s | Progress indicator + что грузим |
| > 10s | Цифра прогресса + cancel option |

## Правила flow

- **Flow закрывает конкретный сценарий**, не абстрактную идею.
- **Не добавлять экран без задачи.** Каждый экран — одно решение пользователя.
- Если **устойчивый новый паттерн** появляется (≥3 раза с identical intent) — предложить поднять в DS (Rule of Three).
- **Не создавать новые компоненты без объяснения** — Frost Snowflake test.
- Empty / loading / error states **не optional**.

## Navigation patterns

См. `platforms/mobile-platform-guidelines.md` для mobile-specific (bottom nav, drawer, rail).

Для web — выбор зависит от breakpoint:
- < 600px → bottom nav или hamburger
- 600-1200px → side rail или collapsible
- > 1200px → permanent side nav или horizontal

## Outcome check

После того как flow собран — проверь:

1. Закрывает ли он **outcome** из brief? (см. `discovery/brief-expander.md`)
2. Понятно ли что делать на главном экране за 3 секунды?
3. Можно ли отменить любое деструктивное действие?
4. Есть ли state для каждой ситуации (success/error/empty/loading)?

## Anti-patterns

| Anti-pattern | Симптом |
|---|---|
| Modal в modal | IA broken |
| Wizard для одного экрана | Overengineering |
| Empty state забыт | First impression сломан |
| Error «Что-то пошло не так» без actionable | Frustrating |
| Loading > 300ms без feedback | Сломано |
| Hover-only interaction на mobile | Не работает |
| Carousel с тонкими точками на mobile | UX broken |
| Tabs где должен быть flow (sequential dependency) | Confusing |
| Buried главное действие за 3+ кликами | Сломан 3-second test |

## Структура `screens.md`

См. `meta/artifact-contracts.md`. Минимум:

- Список экранов и их назначение
- Для каждого: цель / состояние / главный CTA / компоненты / states
- Gaps / placeholders (явно отмечены)

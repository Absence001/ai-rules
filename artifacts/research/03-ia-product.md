# Research: IA / Product strategy

Глубокий research по теме информационной архитектуры и продуктовых решений. Источники: Marty Cagan (SVPG), Pavel Samsonov.

---

## Источники

1. Marty Cagan — The Four Big Risks (SVPG) — https://www.svpg.com/four-big-risks/ (403 при fetch, через secondary sources)
2. RoadmapOne — SVPG's Four Product Risks (детализация) — https://roadmap.one/blog/posts/blog6-6-svpg-product-risks/
3. Marty Cagan — Inspired / Empowered (книги, через summaries)
4. Pavel Samsonov — Portfolio — https://pavelsamsonov.com/
5. Pavel Samsonov — The Next Step interview (uxmatto) — https://uxmatto.com/show/the-next-step-pavel-samsonov
6. Pavel Samsonov — LinkedIn posts (через WebSearch результаты)

---

## Marty Cagan — Four Big Risks

> *«Discovery exists to kill all four before delivery starts»*

Это **самая полезная** структура для оценки любой продуктовой идеи. Если хотя бы один риск не закрыт — идея не готова к разработке.

| Риск | Вопрос | Кто отвечает | Как тестировать |
|---|---|---|---|
| **Value** | *«Will anyone buy or choose to use it?»* | Product Manager | Интервью клиентов, ценовые эксперименты |
| **Usability** | *«Can users figure out how?»* | Product Designer | Модерируемые тесты прототипов, A/B |
| **Feasibility** | *«Can engineering build it with acceptable resources?»* | Lead Engineer | Технические спайки, бенчмарки |
| **Business Viability** | *«Does it work for legal, finance, sales, marketing, brand?»* | Product Manager | Stakeholder review, юр. экспертиза |

### Симптомы провалов

- **Value:** «никто не использует» после релиза. Лечится customer interviews до старта
- **Usability:** *«buried navigation, opaque error messages, confusing labels»* — лечится прототипами + тестами
- **Feasibility:** инженеры дают «6 месяцев» там где было «1 месяц». Лечится spike перед оценкой
- **Viability:** legal/sales/finance блокируют релиз. Лечится ранним вовлечением

### Discovery vs Delivery

Discovery — это **где мы убиваем все 4 риска**. Delivery — это **только feasibility execution**. Если идти в delivery с не-закрытыми value/usability/viability — продукт умрёт.

---

## Marty Cagan — Empowered Teams

Cagan ключевая идея: разница между *feature team* и *empowered product team*.

| Feature team | Empowered team |
|---|---|
| Получает roadmap, реализует | Получает business outcome, ищет решение |
| Меряют output (фичи) | Меряют outcome (метрики) |
| Дизайнер раскрашивает спеки | Дизайнер участвует в discovery |
| Pivot = провал | Pivot = норма |

**Применимость к AI-агенту:** агент должен работать в режиме empowered — получать *outcome* («хочу чтобы пользователь сделал X»), не *output* («сделай экран Y»).

---

## Pavel Samsonov — Information Architecture

> *«once you get it down to those fundamentals, you can actually start applying exactly the same principles that you were applying when you were conventional design»*

Главная идея: **всё — формы и метки**. Twitter, email, любая SaaS — в основе формы + метки + связи. Если IA сломана — *«designers ended up visually solving the worst information architecture you have ever seen»*. Полировка визуала не лечит сломанную IA.

### Принципы Samsonov по IA

1. **Сначала структура, потом визуал.** Визуальное решение не может починить структурную проблему.
2. **Метки — это слова.** Если метки сформулированы плохо — IA сломана. *«labels are words»* — слова важны как код.
3. **Связи > элементы.** Что с чем связано — важнее, чем как выглядит каждый элемент.
4. **Sitemap до wireframe.** Архитектура решается на уровне sitemap, не экранов.

---

## Pavel Samsonov — Jobs To Be Done (критика и переформулировка)

> *«no one wants to use a product. No one says, I am looking forward to a full day Microsoft Excel»*

Пользователи **не хотят** использовать продукты. Они хотят достичь цели. Продукт — инструмент.

### Критика дешёвого JTBD

Samsonov критикует пустой JTBD:
- *«people hire user stories to do user stories»* — фреймворк используется ради фреймворка, а не для решения проблем
- User stories деградировали: от «As [user] I want [to reach a goal] so that I can [obtain a benefit]» до «As [user] I want [to do a task] so that I can [use the tool]» — потеряли фокус на цели

### Что вместо

Фокус на:
- **Что пользователь пытается сделать в большом контексте** (не «нажать кнопку», а «закрыть месяц»)
- **Что произойдёт если он этого не сделает** (стейкс)
- **Какие альтернативы у него уже есть** (включая Excel, бумагу, ничего)

---

## Pavel Samsonov — Принципы принятия решений

### Три вопроса, которые Samsonov задаёт постоянно

> *«how will we know if we are wrong in our assumptions and what are we going to do about it?»*

1. **Какие у нас assumptions?** (явно зафиксировать)
2. **Как мы узнаем, что мы неправы?** (что должно случиться)
3. **Что мы сделаем, если окажемся неправы?** (план B)

Без этих трёх ответов решение = ставка вслепую.

### Alignment vs Right

> *«80% of the time, I'd say it's more important to be aligned than right because you ship something that you're aligned on»*

Команда, которая выровнена на «неправильном» решении, шипит и учится.
Команда, которая спорит о «правильном» решении, не шипит ничего.

**Применимость к AI-агенту:** агент должен **выровнять stakeholders** перед делом, а не «угадать правильный ответ». Это значит — задавать вопросы, не предполагать.

### Design is the art of being wrong safely

> *«Design is the art of being wrong safely»*

Дизайн — это **проверять гипотезы дёшево**. Wireframe дешевле визуала, визуал дешевле кода, код дешевле launch. Дизайн — это способ ошибаться **до** того как ошибка стоит дорого.

---

## Cross-author принципы

То в чём согласны (или дополняют друг друга):

1. **Discovery > delivery** (Cagan) = **be wrong safely** (Samsonov) — обе идеи о том чтобы провалить дёшево
2. **Empowered teams ищут outcome** (Cagan) = **focus on what user is trying to do** (Samsonov) — outcome > output
3. **Все 4 риска должны быть закрыты** (Cagan) = **what if we are wrong** (Samsonov) — explicit risk-thinking
4. **Pivot — норма** (Cagan) = **alignment > right** (Samsonov) — гибкость > правильности

---

## IA: конкретные паттерны (синтез)

### Когда экран, когда modal, когда flow

Из синтеза Cagan + Samsonov + общих best practices:

| Тип решения | Когда |
|---|---|
| **Modal** | Узкое подзадание которое не требует full context. Завершается быстро. Можно отменить |
| **Drawer / sidesheet** | Контекстная задача рядом с основным экраном (фильтры, детали) |
| **Inline expand** | Дополнительная инфа без потери контекста |
| **New screen** | Своя задача с собственным flow. Можно ссылаться |
| **Wizard / flow** | Последовательная задача в N шагов где порядок важен (онбординг, оформление заказа) |
| **Empty state** | Когда контента нет — это первое впечатление, не игнорить |
| **Loading state** | Если >300ms — skeleton/progress. Меньше — ничего (или fade-in) |
| **Error state** | Что произошло + что делать. Не «Error 500», а «попробуй обновить» |

### Anti-patterns в IA

- **Nice-to-have экраны** добавляются «потому что красиво» — Cagan против
- **Полированный визуал поверх сломанной IA** — Samsonov против. Сначала структура
- **Сложная навигация** ради «крутой архитектуры» — *«buried navigation»* (Cagan via usability risk)
- **Метки на жаргоне** вместо языка пользователя — Samsonov: labels = words
- **Wizard когда хватило бы одного экрана** — overengineering
- **Modal внутри modal** — sign of broken IA
- **Roadmap-driven design** вместо outcome-driven — feature team trap (Cagan)

---

## Применимость к правилам AI-агента

### В AGENTS.md (ядро)

1. **Stage gate перед действием** — это discovery (Cagan) встроенный в процесс. Уже есть, нужно усилить ссылкой
2. **Outcome-first formulation** — агент должен переформулировать запрос в outcome перед действием

### В ia-rules.md

3. **Четыре риска как pre-flight check** для любой IA-задачи: явно проверить value/usability/feasibility/viability
4. **Sitemap → wireframe → screen** — фиксированный порядок (Samsonov)
5. **Метки = слова** — отдельная секция про labels и language
6. **JTBD properly** — что пользователь делает в большом контексте, не task-level
7. **«Три вопроса Samsonov»** — встроить в шаблон IA-предложения

### В flow-design.md

8. **Modal vs drawer vs screen vs wizard** — фиксированная таблица решений (из этого research)
9. **Anti-patterns в IA** — таблица из этого research
10. **Empty/loading/error states обязательны** — checklist

### В brief-expander.md / pipeline

11. **Outcome > Output** — формулировать задачу в outcome
12. **Risk explicit** — что в этом проекте больше всего рискует (value/usability/feasibility/viability)
13. **Alignment first** — заметить когда команда не выровнена

### В operating-principles.md

14. **«Design is the art of being wrong safely»** — основной mindset. Wireframe дёшево, визуал дороже, код дорого
15. **Pivot — норма, не провал** — встроить как принцип

---

## Чего не нашёл / на дальнейшее

- Cagan Opportunity Solution Tree — упоминал в плане, но это методология Teresa Torres (не в нашем списке)
- INVEST framework — не покрыт, но это про user stories, скорее для backend/PM
- Прямые ссылки на SVPG статьи — заблокированы 403, использовал secondary sources
- Pavel Samsonov full LinkedIn archive — много коротких постов, нужен скрейпинг для полноты

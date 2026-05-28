# Design Critique

Процесс design review и feedback. Базовая практика продуктового дизайнера.

## Когда

| Случай | Применять? |
|---|---|
| Перед переходом wireframe → hi-fi | Да |
| Перед dev handoff | Да |
| После итерации с stakeholders | Да |
| Если пользователь / коллега даёт неструктурированный feedback | Да — попроси использовать формат |
| Polish мелкого изменения | Не обязательно |

## Главный принцип

**Critique ≠ судить.** Critique = помочь решению стать лучше через структурированный feedback.

## Формат «I see / I think / I wonder»

Стандартный structured-critique формат. Применяй И когда даёшь feedback, И когда принимаешь.

| Часть | Что | Пример |
|---|---|---|
| **I see** | Наблюдение, без оценки | «Главный CTA в правом верхнем углу, иконка пользователя слева» |
| **I think** | Интерпретация / возможная проблема | «Когда CTA визуально такой же как secondary actions, иерархия может быть неочевидна» |
| **I wonder** | Открытый вопрос / альтернатива | «А что если попробовать filled style для primary, outlined для secondary?» |

**Преимущества формата:**
- Разделяет наблюдение, оценку и предложение
- Снижает defensiveness получающего
- Позволяет другим disagree с любой из частей отдельно

## Что давать feedback на

| Уровень | Что |
|---|---|
| **Strategic** | Соответствует ли outcome из brief? Решает ли JTBD? |
| **IA / Structure** | Sitemap, hierarchy, navigation patterns |
| **Flow** | Edge cases, states, error handling |
| **Visual / Craft** | Иерархия, spacing, typography, motion, anti-slop |
| **Copy** | Метки, error messages, microcopy |
| **Accessibility** | Keyboard, screen reader, contrast |
| **Implementation** | Tokens used? Component anatomy correct? |

**Правило:** сначала high-level (strategic, IA), потом low-level (visual, copy). Не утопай в padding если IA сломана.

## Severity (для каждого finding)

| Severity | Когда |
|---|---|
| **🔴 Blocker** | Сломана функциональность / a11y / основное действие |
| **🟡 Important** | Влияет на usability но не блокирует |
| **🟢 Nice-to-have** | Polish, можно отложить |

Без severity feedback = всё кажется одинаково важным.

## Что НЕ делать в critique

| Anti-pattern | Замена |
|---|---|
| «Не нравится» без объяснения | Используй I see / I think / I wonder |
| «Сделай красивее» | Конкретные I think + I wonder |
| Оценка человека («ты ошибся») | Оценка решения («это решение может конфликтовать с X») |
| Все feedback as Blocker severity | Расставь severity |
| Решать за дизайнера | Описывай проблему, не решение |
| Persistent disagreement | Alignment > Right (Samsonov) — выровнись с командой даже если уверен |

## Когда получаешь feedback

| Действие | Когда |
|---|---|
| Слушай не защищаясь | Первая итерация = черновик (Willison). Не защищай |
| Спроси «I wonder» вопросы | Уточни что человек видит / думает |
| Запиши feedback с severity | Не забудешь |
| Не соглашайся автоматически | Можешь disagree с обоснованием |
| Iterate на следующий round | Не пытайся решить всё в одной встрече |

## Format для async critique (Figma comment / Slack)

```markdown
**I see:** <конкретное наблюдение>
**I think:** <возможная проблема / интерпретация>
**I wonder:** <альтернатива / открытый вопрос>
**Severity:** 🔴 / 🟡 / 🟢
```

## Format для live critique session

1. **Designer показывает** дизайн с контекстом (brief, outcome)
2. **Each reviewer** даёт feedback по формату (5-10 минут на человека)
3. **Designer не отвечает** во время feedback (только уточняющие вопросы)
4. **После всех** — designer summarizes что услышал, что будет делать
5. **Follow-up** в письменной форме (action items)

## Anti-patterns в feedback culture

| Anti-pattern | Что плохо |
|---|---|
| HiPPO (Highest Paid Person's Opinion) | Decision не data-driven |
| Bike-shedding (спор о padding пока IA сломана) | Misplaced priorities |
| «Всё нравится» без замечаний | Бесполезный feedback |
| Personal attacks | Сломанная culture |
| Решать вместо описывать проблему | Не оставляет места для эксперта-designer |
| Async feedback без структуры | Размытое |

## Связанные файлы

- `pd-workflows/wireframing.md` — critique на уровне wireframes
- `craft/anti-slop-audit.md` — финальный critique перед production
- `meta/operating-principles.md` — Alignment > Right

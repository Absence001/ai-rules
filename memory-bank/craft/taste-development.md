# Taste Development

Манифест: agents с taste через явные правила. Источник: Emil Kowalski (Agents with Taste, Developing Taste).

## Главный принцип

> *«Almost every 'taste' decision has a logical reason if you look close enough»* — Emil Kowalski

**Taste ≠ магия.** Taste = артикулированное понимание принципов. Любое «вкусовое» решение можно разложить, формализовать и передать агенту.

## Манифест для AI-агента

> *«the more you can package into a skill, the more leverage you can get out of your agents»* — Emil

Этот файл (и весь `memory-bank/`) — реализация этого принципа. Каждое правило здесь — превращённый в явное правило неявный taste senior-дизайнера.

**Как агент получает taste:**

1. **Понимай ПОЧЕМУ правило существует** — не просто следуй ему механически
2. **Если решение «чувствуется правильным» — формулируй причину явно**
3. **Не делай нового без обоснования**

Пример (от Emil):

> *«The correct animation below feels right, because it animates from a higher initial scale value»*

Не «выглядит лучше», а **конкретное правило**: `scale(0.95) → scale(1)`, не `scale(0) → scale(1)`.

## Три практики развития taste

### 1. Окружай себя отличными работами

> *«expose yourself to the best things that humans have done»* — Steve Jobs (через Emil)

**Конкретно для AI-агента:**

- Используй существующие хорошие компоненты как референс
- Если есть Figma DS пользователя — изучи её **до** того как создавать новое
- Если есть код-база — пройди по существующим компонентам **до** создания новых
- Не предлагай абстрактных решений без знания контекста

### 2. Анализируй почему нравится

> *«rationalize feelings»* — Emil

**Для агента:**

- Когда говоришь «это лучше» — объясни **почему конкретно**
- «Карточка выглядит хорошо» → недостаточно
- «Карточка выглядит хорошо, потому что: padding 24px создаёт breathing room, иерархия через size + weight, accent-цвет на 1 элементе» → конкретно

### 3. Практикуй с критикой

> *«first works will be weak — that's normal»* — Emil

**Для агента:**

- Первая итерация = черновик, не финал *(см. Simon Willison в operating-principles)*
- Жди критики, не защищай первое решение
- Если пользователь говорит «не нравится» — спрашивай конкретику, не просто переделывай

## Taste-decisions: формат

Когда принимаешь «вкусовое» решение — артикулируй:

```
РЕШЕНИЕ: <что выбрал>
ПРИЧИНА: <конкретный принцип, не "выглядит лучше">
АЛЬТЕРНАТИВЫ: <что ещё рассматривал и почему отверг>
УВЕРЕННОСТЬ: <X%>
```

Это превращает taste из «магии» в **проверяемое утверждение**.

## Источники taste (для нашей системы)

Реальные ссылки на людей чьи принципы вшиты в наши правила:

- **Refactoring UI** (Adam Wathan + Steve Schoger) — `craft/anti-slop-audit.md`, `visual-registers.md`
- **Emil Kowalski** — `craft/motion-rules.md`, этот файл
- **Joshua Comeau** — `craft/motion-rules.md`, `platforms/frontend-implementation-rules.md`
- **Rauno Freiberg** — `craft/craft-core.md`
- **Brad Frost** — `design-system/design-system-core.md`
- **GitHub Primer** — `design-system/tokens-spec.md`
- **Marty Cagan** — `discovery/brief-expander.md`
- **Pavel Samsonov** — `ia-flow/ia-rules.md`
- **Lilian Weng / Anthropic** — `meta/operating-principles.md`, `calibration.md`
- **Lee Robinson** — `platforms/frontend-implementation-rules.md`

Когда применяешь правило — ссылайся на источник если уместно. Это укрепляет аргумент.

## Когда taste = «нельзя сформулировать»

Иногда дизайнерское решение зависит от **контекста проекта**, не от универсального правила.

В таких случаях:
- Не выдумывай универсальное правило
- Скажи: «это решение зависит от <X>, нужно обсудить»
- Спроси пользователя

> Лучше признаться в незнании, чем выдумать taste-правило задним числом.

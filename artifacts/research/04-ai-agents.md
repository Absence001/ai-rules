# Research: AI agents / orchestration / prompts

Глубокий research по теме построения и инструктирования LLM-агентов. Источники: Lilian Weng (OpenAI), Simon Willison (independent).

---

## Источники

1. Lilian Weng — LLM Powered Autonomous Agents — https://lilianweng.github.io/posts/2023-06-23-agent/
2. Lilian Weng — Prompt Engineering — https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/
3. Simon Willison — agent-definitions tag — https://simonwillison.net/tags/agent-definitions/
4. Simon Willison — Here's how I use LLMs to help me write code — https://simonwillison.net/2025/Mar/11/using-llms-for-code/
5. Simon Willison — OpenAI reasoning models: Advice on prompting — https://simonwillison.net/2025/Feb/2/openai-reasoning-models-advice-on-prompting/

---

## Определение «agent» (что мы вообще строим)

Универсального определения нет — все жалуются. Sami Simon Willison называет это *"infuriatingly vague"*.

Рабочие определения:
- **Anthropic:** *"Agents are models using tools in a loop"*
- **Simon Willison** принял: *"LLMs calling tools in a loop to achieve a goal"*
- **OpenAI:** *"An AI agent is a system that can do work independently on behalf of the user"*
- **Solomon Hykes** (полу-шуточно): *"An AI agent is an LLM wrecking its environment in a loop"*

**Практически важно:** агент = LLM + tools + loop + goal. Всё остальное надстройка.

---

## Архитектура агента (Lilian Weng)

LLM функционирует как «мозг», дополняемый тремя компонентами:

| Компонент | Что | Применение в правилах |
|---|---|---|
| **Planning** | Декомпозиция задачи на подцели + самокритика | Требовать у агента «сначала план, потом действие» |
| **Memory** | Short-term (контекст) + long-term (vector store) | Memory-bank — наш long-term; контекст — short-term |
| **Tool Use** | Доступ к внешним API, файловой системе, MCP | Описать какие tools когда применять |

**Ключевой вызов:** *«Ограниченная длина контекста, сложность долгосрочного планирования и восстановления после ошибок, ненадежность естественного языка как интерфейса»* (Lilian Weng).

---

## Паттерны рассуждений (когда инструктировать как думать)

| Паттерн | Описание | Когда применять |
|---|---|---|
| **Chain-of-Thought (CoT)** | «Думай пошагово» — большие задачи в управляемые шаги | По умолчанию для сложных задач |
| **Tree-of-Thoughts** | Множественные ветви рассуждений + BFS/DFS поиск | Когда есть несколько разумных решений |
| **ReAct** | Thought → Action → Observation → итерация | Когда агент использует tools |
| **Reflexion** | Самоанализ ошибок и пересмотр стратегии | После провалов / для self-correction |
| **Self-Consistency** | Несколько прогонов с temp>0, majority vote | Для критичных решений где галлюцинации страшны |

**Применимость к нашим правилам:** ReAct + Reflexion — основа. Все наши директивы по умолчанию требуют «диагностика → план → действие → проверка».

---

## Prompting: что работает (Lilian Weng + Simon Willison)

### Базовые принципы

1. **Zero-shot перед few-shot.** *«Try zero shot first, then few shot if needed»* — добавляй примеры только когда модель не справляется.
2. **Few-shot examples критичны.** Выбор примеров влияет от *«near-random guessing до near SoTA»*. Плохие примеры = плохой результат.
3. **Будь конкретен и точен.** *«Be specific and precise»*, избегай негативных инструкций («не делай X»). Лучше «делай Y» (Lilian Weng).
4. **Используй разделители.** *«Use delimiters like markdown, XML tags, and section titles to clearly indicate distinct parts»* (OpenAI guide через Simon Willison).
5. **Конкретизируй цель.** *«Give very specific parameters for a successful response»* — не «сделай хорошо», а «сделай так, чтобы X, Y, Z».

### Что отличается для reasoning-моделей (o1, o3, Sonnet 4.5+)

- **Developer messages** вместо system messages — функционально то же самое
- **Минимизируй RAG-контекст** — модель сама хорошо рассуждает, лишний контекст вредит
- **Не нужно «думай пошагово»** — модель уже это делает внутри

### Снижение галлюцинаций

- **Retrieval-augmented** — давать модели документы, а не полагаться на её знания
- **Internal retrieval** — попросить сгенерировать релевантные знания **до** ответа
- **PoT/PAL** — *«Offloading решения к Python-интерпретатору»* — разделять рассуждения и вычисления

---

## Практики написания инструкций для агента (Simon Willison)

### Управление контекстом

> *«Context is king»* — Simon Willison

Весь диалог = входные данные. Каждое предыдущее сообщение влияет на следующее. Поэтому **порядок и структура** правил в системном промпте важны.

### Авторитарный режим

> *«Tell them exactly what to do»*

Режим «цифрового интерна»: вместо общих описаний — детальные спецификации, сигнатуры функций, конкретные имена. Размытые инструкции дают размытый результат.

### Итеративное уточнение — фича, не баг

> *«A bad initial result isn't a failure, it's a starting point»*

Модели не возражают против переделок. Это меняет workflow: первая итерация = черновик, не финал.

### Тестирование — обязательно, не делегируется

> *«You have to test what it writes!»*

**Ответственность разработчика.** Машина может сгенерировать код который «выглядит правильно», но не работает. LLM могут *«hallucinate a non-existent library or method»*.

### Boring technology

> Используй проверенные стабильные библиотеки, breaking changes после даты обучения = слепое пятно модели.

---

## Anti-patterns (что НЕ делать)

| Anti-pattern | Почему |
|---|---|
| Размытые инструкции («сделай красиво») | Размытый результат |
| Длинные негативные списки («не делай A, B, C…») | Позитивные инструкции работают лучше |
| Перегруз RAG/контекста для reasoning-моделей | Запутывает self-reasoning |
| Слепо верить ответу LLM | Hallucinations are *«deeply inhuman»* |
| Использовать bleeding-edge библиотеки | Модель их не знает |
| Один большой промпт без структуры | Нужны разделители (XML, markdown) |
| Дублирование правил в разных местах | Конфликты, drift |

---

## Применимость к правилам AI-агента

Конкретные правила для нашего AGENTS.md и memory-bank:

### В AGENTS.md (ядро)

1. **Явное определение роли** — «ты агент, делаешь X, не делаешь Y» — в начале файла
2. **Stage gates** — требовать подтверждение перед опасными действиями (это ReAct + safety)
3. **Format enforcement** — структурированный шаблон ответа на баг (это Self-Consistency на формат)
4. **Process for code diagnostics** — это ReAct + Reflexion
5. **Source priority** — иерархия источников чтобы разрешать конфликты

### В memory-bank/

6. **operating-principles.md** должен начинаться с «когда читать какие файлы» — это token-efficient loading (от длины контекста)
7. **Каждый файл = одна область** — модульность снижает конфликты
8. **Каждое правило с примером WRONG/CORRECT** — few-shot работает (Lilian Weng)
9. **Использовать markdown разделители** (## секции, таблицы) — Simon Willison

### Anti-patterns в наших правилах сейчас (предположение, проверить в audit)

- Дубли между файлами memory-bank
- Размытые формулировки типа «качественно», «правильно», «хорошо»
- Длинные списки «не делай» вместо «делай»
- Отсутствие WRONG/CORRECT примеров

### Stage-gates как у Anthropic

> Anthropic единственная лаборатория публикующая system prompts. Их паттерн: явные правила безопасности в начале, потом capabilities, потом forbidden actions, потом edge cases.

Применить к нашему AGENTS.md: переупорядочить — сначала роль и язык, потом stage gates (безопасность), потом pipeline, потом режимы, потом запреты.

---

## Чего не нашёл / нужно дополнить

- Конкретный AGENTS.md standard от OpenAI — упомянут, но не нашёл детальной спецификации
- Cross-platform AGENTS.md convention — есть ли единый формат?
- Утечки production system prompts (Anthropic публикует, OpenAI нет) — для глубокого анализа нужен доступ к ним

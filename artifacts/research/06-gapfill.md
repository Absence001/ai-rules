# Research Gap-fill (Round 2)

Восполнение пробелов первого research. Утверждённый пользователем список URL. Использовать вместе с 01-05.

---

## Источники (round 2)

### Прочитано напрямую

1. Emil Kowalski — Agents with Taste — https://emilkowal.ski/ui/agents-with-taste
2. Emil Kowalski — Developing Taste — https://emilkowal.ski/ui/developing-taste
3. Emil Kowalski — Good vs Great Animations — https://emilkowal.ski/ui/good-vs-great-animations
4. Emil Kowalski — 7 Practical Animation Tips — https://emilkowal.ski/ui/7-practical-animation-tips
5. Emil Kowalski — You Don't Need Animations — https://emilkowal.ski/ui/you-dont-need-animations
6. Emil Kowalski — CSS Transforms — https://emilkowal.ski/ui/css-transforms
7. Brad Frost — A Global Design System — https://bradfrost.com/blog/post/a-global-design-system/
8. Brad Frost — The Design System Ecosystem — https://bradfrost.com/blog/post/the-design-system-ecosystem/
9. GitHub Primer — Color usage — https://primer.style/product/getting-started/foundations/color-usage/
10. GitHub Primer — Token names — https://primer.style/product/primitives/token-names/
11. GitHub Primer — Typography — https://primer.style/product/getting-started/foundations/typography/
12. GitHub Primer — DESIGN_TOKENS_GUIDE.md — https://github.com/primer/primitives/blob/main/DESIGN_TOKENS_GUIDE.md
13. Anthropic — Building Effective Agents — https://www.anthropic.com/research/building-effective-agents
14. Anthropic — Tool use overview — https://platform.claude.com/docs/en/docs/build-with-claude/tool-use/overview
15. Anthropic — Prompt engineering overview (meta-страница) — https://platform.claude.com/docs/en/docs/build-with-claude/prompt-engineering/overview
16. Lilian Weng — Hallucination — https://lilianweng.github.io/posts/2024-07-07-hallucination/
17. Lee Robinson — Main page (recent posts list) — https://leerob.com/

### Не открылись, использовалось secondary

18. Apple HIG main — JS-only, через secondary search
19. Material Design 3 navigation bar — JS-only, через secondary search

### Не открылись совсем

20. Brad Frost — Atomic Web Design (original post) — 500 Server Error
21. SVPG / Marty Cagan articles — 403 Forbidden (повторно)
22. Lee Robinson — Coding Agents article — 404

---

## Часть 1: Craft (расширение 01-craft-ui.md)

### Emil Kowalski — Taste как тренируемый навык

> *«Almost every 'taste' decision has a logical reason if you look close enough»*

**Taste ≠ магия.** Taste = артикулированное понимание принципов. Можно разложить, формализовать, передать агенту.

#### Как развивать taste (3 практики Emil)

1. **Окружай себя отличными работами.** Список авторов которых уважаешь + их приложения. Steve Jobs: *«expose yourself to the best things that humans have done»*
2. **Анализируй почему нравится.** Не «потому что круто» — а конкретно: что делает решение хорошим. Рационализируй ощущения.
3. **Практикуй с критикой.** Создавай → получай feedback от знающих → исправляй. Первые работы будут слабыми — это норма.

#### Как агент получает taste

Не магически. Через **явные правила в skill-файлах**.

> *«The correct animation below feels right, because it animates from a higher initial scale value»*

Каждое «taste-решение» → артикулированное правило → передано агенту.

> *«the more you can package into a skill, the more leverage you can get out of your agents»*

**Применимость к нашим правилам:** именно это мы и делаем — превращаем неявный taste в явные правила.

### Emil Kowalski — Good vs Great animations

| Good | Great |
|---|---|
| Анимация есть | Анимация **origin-aware** (выходит из своего источника) |
| Использует ease-out | Использует **custom cubic-bezier** для энергичности |
| Анимирует transform | Знает когда `clip-path` нужнее transform |
| Любая анимация | Понимает когда анимация декоративна, а когда функциональна |

> *«Custom easing feels more energetic»* — встроенные CSS-кривые недостаточны

> *«Everyone's software is good enough these days»* — differentiation через **анимации** меняет восприятие продукта

### Emil Kowalski — 7 практических tips (целиком)

1. **Scale кнопки при `:active`** — `scale: 0.97` для тактильной обратной связи
2. **Не анимируй с `scale(0)`** — начинай с 0.9+. Объект должен оставаться видимым
3. **Не задерживай последующие подсказки** — первая с delay, остальные `transition-duration: 0ms` для мгновенности
4. **Правильный easing** — `ease-out` для входов/выходов с экрана. Встроенных недостаточно, нужны кастомные
5. **Origin-aware анимации** — `transform-origin` с точки срабатывания. CSS vars типа `var(--radix-dropdown-menu-content-transform-origin)`
6. **UI-анимации < 300ms.** Спиннеры и переходы быстрее = отзывчивее. Не повторяй анимации
7. **`filter: blur(2px)` как финальный штрих** — маскирует мелкие неровности перехода

### Emil Kowalski — Когда **не** анимировать

> *«Knowing when to animate is just one of many things you need to know in order to craft great animations»*

| Случай | Почему |
|---|---|
| Часто повторяющиеся действия | *«I use Raycast hundreds of times a day. If it animated every time I opened it, it would be very annoying»* |
| Клавиатурная навигация | Создаёт ощущение задержки. *«You should never animate them»* |
| Когда user спешит | *«When I open Raycast, I have a clear goal in mind. I don't expect to be delighted»* |

**Критерии решения:**
- Частота использования
- Наличие явной функциональной цели у анимации
- Влияние на скорость работы

### Emil Kowalski — CSS Transforms нюансы

| Функция | Best practice |
|---|---|
| `translate()` | Использовать **проценты** (`translateY(100%)`) — адаптивно. Предпочтительнее `translateX/Y` над общим |
| `scale()` | **Никогда** не анимировать с `scale(0)`. Альтернатива — `scale(0.5)` + opacity |
| `rotate()` | Реже нужен. Для естественного движения (drawer открывается с лёгким вращением) |
| `3D transforms` | `rotateX/Y` + `transform-style: preserve-3d` для глубины |
| `transform-origin` | По умолчанию центр. Контролирует точку якоря. Основа для origin-aware |

> *«Percentage values are less error-prone since they're relative to the element's own size»*

---

## Часть 2: Design Systems (расширение 02-design-systems.md)

### Brad Frost — A Global Design System (концептуальная статья)

**Идея:** единая библиотека базовых UI-компонентов для всего веба, на основе Web Components. Слой поверх HTML.

**Зачем:**
> *«vast numbers of human beings are devoting their time and energy to designing, building, documenting, and maintaining the exact same set of common components»*

WebAIM 2024: в топ-миллионе сайтов *«49,991,225 distinct accessibility errors»* — корневая причина в дублировании плохо сделанных компонентов.

**Что должно быть в Global DS:**
- Базовые: аккордеоны, datepickers, табы, формы, alerts, диалоги, тултипы
- *«These basic UI components are unexceptional commodities»* — универсальны для всех

**Что НЕ должно:**
- Эстетика — компоненты *«vanilla base containing only browser-default styles»*
- Specialised use-cases

**Применимость:** мы НЕ строим global DS, но мы строим продуктовые DS. Принцип «boring stuff в core, специфика в продукт» — основа.

### Brad Frost — The Design System Ecosystem (структурная статья)

**5 слоёв (от низа к верху):**

| # | Слой | Обязательность | Кто владеет | Артефакты |
|---|---|---|---|---|
| 1 | **Core DS** | Обязательный | DS team | Tokens (Figma + JSON), Icons, UI Components (Figma + Web Components + Storybook), Reference site |
| 2 | **Tech-specific** | Опциональный | Framework team | React/Vue/Angular wrappers, native iOS/Android |
| 3 | **Recipes** | Опциональный | Product designers | Compositions (`ProductCard`, `CustomerDataCard`) — живут в продукте |
| 4 | **Smart Components** | Опциональный | Backend-adjacent | Forms + validation, payments, typeahead, analytics-wired |
| 5 | **Product** | Обязательный | Product team | Figma files, codebases, native apps |

**Ключевые цитаты:**
- *«A complex system that works is invariably found to have evolved from a simple system that worked»* (Gall's Law)
- *«Nearly all of these layers are optional»* — начинай простым, добавляй сложность по реальной потребности
- *«Design systems are less about assets… but more about people and their relationships»* — технология вторична
- Recipe layer — *«pressure release valve»* для перегруженных core-команд

**Применимость:** наша Atomic Design таксономия должна сосуществовать с этими 5 слоями. Recipes как обязательный паттерн.

### GitHub Primer — Color Usage (расширение)

**Functional tokens (3 типа):**
- `fgColor-*` — для текста и иконок
- `bgColor-*` — для фонов
- `borderColor-*` — для границ/разделителей

**Нейтральная шкала (0-13):**
| Шаги | Назначение |
|---|---|
| 0-5 | Фоны |
| 7-8 | Границы (минимальный контраст для управления) |
| 9-10 | Текст и иконки |

**Семантические модификаторы:**
- `muted` — тонкое выделение
- `emphasis` — сильное выделение (с парой `fgColor-onEmphasis`)
- `default` — основной

**Color modes:** автоматически меняют значение в зависимости от light/dark.

**Anti-patterns:**
- Использовать base-color tokens напрямую в коде/дизайне (они только справочные)
- Игнорировать контраст — расчёт **против `bgColor-muted`** (не `bgColor-default`)

### GitHub Primer — Token Names (полная конвенция)

**Структура (8 частей):** `prefix-namespace-pattern-variant-property-variant-scale`

**3 категории токенов:**

| Категория | Структура | Пример |
|---|---|---|
| **Base** | `namespace-pattern-property-scale` | `base-size-4`, `base-color-green-5`, `base-fontWeight-semibold` |
| **Functional** | `property-variant` | `bgColor-inset`, `borderColor-default`, `boxShadow-inset-thick` |
| **Component** | `pattern-variant-property-state` | `control-danger-borderColor-rest`, `button-primary-bgColor-hover` |

**Модификаторы цвета:** `default`, `muted`, `emphasis`

**Модификаторы размера:**
- T-shirt: `xsmall | small | medium | large | xlarge | xxlarge`
- Плотность: `condensed | normal | spacious`
- Толщина: `thin | thick | thicker`
- Viewport: `narrow | regular | wide`

**Разделители:**
- CSS variables → дефис `-`
- JavaScript → точка `.`

### GitHub Primer — Typography (полные правила)

**Технические основы:**
- **`rem` единицы** — для accessibility scaling
- **`line-height` безразмерный** — варьируется по стилю, выравнивание по сетке 4px

**Иерархия:**
- *«stress efficient, clean reading experiences»*
- **Не полагайся на цвет** как основной способ выделения

**Читаемость:**
1. **Высота строки** — использовать специальные tokens
2. **Длина строки** — ~80 символов или меньше (W3 Page Structure Guidelines)
3. **Выравнивание** — left (ragged right). Центрирование и справа — нетипично для GitHub

**Best practices:**
- ✅ CSS-переменные веса (`var(--fontWeight-bold)`)
- ❌ Произвольные значения (`font-weight: 700`)
- ✅ Семантическая разметка (`<h1>`, `<h2>`) + стили
- ❌ Менять порядок заголовков ради визуала

### GitHub Primer — DESIGN_TOKENS_GUIDE.md (КРИТИЧЕСКИ ВАЖНО — гайд написан для AI-агента)

> Это **прямой инструкт для AI-кодера от Primer:** *«You are a CSS expert. Never use raw values (hex, px, etc.). Only use semantic tokens»*

**Главное правило:** никогда не raw values. Всегда semantic tokens.

#### Структура token-имён (5 категорий)

| Категория | Шаблон | Примеры |
|---|---|---|
| **Control tokens** (интерактивные) | `--control-[size]-[property]` | `--control-medium-paddingBlock`, `--control-small-paddingInline-condensed` |
| **Stack tokens** (интервалы) | `--stack-[property]-[size]` | property: gap/padding; size: condensed/normal/spacious |
| **Typography tokens** | `--text-[role]-shorthand-[size]` | role: display/title/body/subtitle/caption; size: small/medium/large |
| **Motion tokens** | `--motion-[property]-[semantic]` | property: duration/easing/transition; semantic: micro/short/medium/long |
| **Z-Index layers** | `--zIndex-[layer]` | behind, default, sticky, dropdown, overlay, modal, popover, skipLink |

#### Цветовая логика (MUST)

| Background | Foreground | Правило |
|---|---|---|
| `--bgColor-*-emphasis` | `--fgColor-onEmphasis` | **ОБЯЗАТЕЛЬНАЯ пара** |
| `--bgColor-*-muted` | `--fgColor-{semantic}` | Используй семантический цвет |
| `--bgColor-default` | `--fgColor-default` | Стандартная пара |

**Контраст:** WCAG AA — 4.5:1 для текста, 3:1 для крупного/UI

#### MUST-правила (RFC 2119)

**Typography MUST:**
- Использовать **shorthand** tokens (`font: var(...)`) — синхронизирует line-height + font-weight
- `text-codeBlock` для кодовых блоков, `text-codeInline` для inline
- **Никогда** отдельные font-size/line-height tokens

**Motion MUST:**
- Анимации ≤ `motion.duration.medium` (300ms) для UI
- **Уважать** `prefers-reduced-motion`
- Использовать `motion.transition.*` для смены состояния

**Z-Index MUST:**
- Только z-index tokens (не raw)
- Связь z-index с shadow level: `shadow.resting.*` → `zIndex.default/sticky`; `shadow.floating.small/medium` → `zIndex.dropdown/overlay`

**Spacing MUST:**
- Control tokens для интерактивов
- Stack tokens для макета
- Density padding соответствует цели элемента

#### Чек-лист состояний (MUST для всех интерактивных)

| Состояние | Селектор | Status |
|---|---|---|
| Rest | `.element` | ✓ |
| Hover | `:hover` | ✓ |
| Focus | `:focus-visible` | ✓ **НЕ** `:focus` |
| Active | `:active` | ✓ |
| Disabled | `:disabled` / `[aria-disabled]` | ✓ |

#### Дерево решений: Easing

1. Вход/выход из viewport → `motion.easing.enter/exit`
2. Движение на экране → `motion.easing.move`
3. Hover state change → `motion.easing.hover`
4. Постоянное движение → `motion.easing.linear`

#### Защита от галлюцинаций (КРИТИЧНО для нашей задачи)

> *«If you suggest a token name not found in this spec or the system, suffix it with `/* check-token */`»*

**Это прямая инструкция для AI:** если не уверен в имени токена — пометь для проверки. Гениальный паттерн self-correction.

---

## Часть 3: AI Agents (расширение 04-ai-agents.md)

### Anthropic — Building Effective Agents (официальные паттерны)

> *«Начните с простых промптов, оптимизируйте их комплексной оценкой и добавляйте многоэтапные системы только когда более простые решения не срабатывают»*

#### Workflows vs Agents (различение)

| Тип | Что | Когда |
|---|---|---|
| **Workflow** | LLM + tools управляются через **предопределённые** пути кода | Чётко определённые задачи, нужна предсказуемость |
| **Agent** | LLM **динамически** направляет процесс и tool use | Open-ended, нельзя предсказать количество шагов |

#### Пять паттернов Workflows

**1. Prompt Chaining**
- Задача → последовательные шаги, каждый обрабатывает выход предыдущего
- *«Идеален для ситуаций, где задача может быть легко разложена на фиксированные подзадачи»*
- Пример: маркетинг копи → перевод; план → проверка → написание

**2. Routing**
- Классификация входа → специализированные подзадачи
- Пример: разделение customer support по категориям

**3. Parallelization**
- Независимые подзадачи одновременно → агрегация
- Варианты:
  - **Sectioning** — разделение на подзадачи
  - **Voting** — одна задача N раз
- Пример: проверка кода несколькими экземплярами на уязвимости

**4. Orchestrator-Workers**
- Центральный LLM **динамически** разбивает + делегирует + синтезирует
- *«Подзадачи определяются на основе входных данных, а не заранее»*
- Пример: изменения в множество файлов кода

**5. Evaluator-Optimizer**
- Один LLM генерирует → второй оценивает → feedback loop
- *«когда мы имеем четкие критерии оценки и итеративное улучшение дает измеримую ценность»*
- Пример: литературный перевод

#### Autonomous Agents

Работают в цикле: *«план и независимое действие, потенциально возврат к человеку для информации или суждения»*

**Требования:**
- Чётко спроектированные tools
- Тестирование в изолированных окружениях
- Подходящие ограничения

**Когда:** open-ended проблемы где невозможно предсказать количество шагов (coding, computer use)

#### Три фундаментальных принципа

1. **Простота** дизайна агента
2. **Прозрачность** — явное отображение этапов планирования
3. **Документация инструментов** и тестирование (Agent-Computer Interface)

**Применимость к нам:** наш AGENTS.md — это **гибридный workflow + autonomous agent**. Pipeline (research → IA → DS → screens) — это chaining. Каждый stage gate — это checkpoint workflow. В рамках stage — autonomous agent.

### Anthropic — Tool Use (официальные правила)

> *«Tool access is one of the highest-leverage primitives you can give an agent»*

#### Client vs Server tools

| Тип | Где исполняется | Как работает |
|---|---|---|
| **Client tools** | В приложении пользователя | Claude → `stop_reason: "tool_use"` → код пользователя → `tool_result` обратно |
| **Server tools** | На инфраструктуре Anthropic | Claude видит результаты напрямую (web_search, code_execution, web_fetch) |

#### Что делать когда мало контекста

> *«Claude Opus is much more likely to recognize that a parameter is missing and ask for it. Claude Sonnet may ask, especially when prompted to think before outputting a tool request. But it may also do its best to infer a reasonable value»*

**Поведение модели:**
- **Opus** — обычно спрашивает
- **Sonnet** — может догадаться

**Применимость:** наш AGENTS.md должен явно требовать «не угадывай, спрашивай» — это компенсирует тенденцию Sonnet к угадыванию.

#### Strict tool use

`strict: true` гарантирует что Claude следует схеме точно.

**Применимость:** если делаем custom tools — всегда `strict: true`.

### Lilian Weng — Hallucination (механика и противодействие)

#### Два типа галлюцинаций

1. **In-context** — несоответствие предоставленному контексту
2. **Extrinsic** — противоречие знаниям обучения. *«The model output should be grounded by the pre-training dataset»*

#### Причины

**Pretraining:**
- Интернет-данные устаревшие/неполные
- Модель механически запоминает ошибки через MLE

**Fine-tuning:**
- Исследование Gekhman et al.: *«Unknown examples are fitted substantially slower than Known»*
- Новые знания усваиваются медленнее → больше склонность к галлюцинациям

#### Способы обнаружения

- **Retrieval-based** (FActScore, SAFE) — проверка против внешних источников
- **Sampling-based** (SelfCheckGPT) — N выборок, расхождение = галлюцинация
- **Calibration** — измерение уверенности модели

#### Способы снижения

| Подход | Суть |
|---|---|
| **RAG** | Извлечь релевантные документы ДО генерации |
| **Chain-of-Verification (CoVe)** | 4 этапа: черновик → вопросы → ответы → финальный |
| **RARR** | Авто-редактирование с атрибуцией |
| **Self-RAG** | Модель сама решает нужен ли retrieval |
| **Fine-tuning (FLAME)** | DPO с метриками фактичности |

> *«LLMs need to be (1) factual and (2) acknowledge not knowing the answer when applicable»*

**Применимость к нашим правилам:**
- Правило «не выдумывай файлы/источники» уже есть — это anti-hallucination
- Правило «3 раза проверь гипотезу + укажи уверенность %» — это calibration
- Правило «format ответа на баг с УВЕРЕННОСТЬ: X%» — это **именно** calibration по Weng
- Добавить: RAG-подобный паттерн «прежде чем утверждать про память — прочитай файл», CoVe для критических решений

---

## Часть 4: Mobile + Frontend (расширение 05-mobile-frontend.md)

### Apple HIG — 3 темы (подтверждение через secondary)

| Тема | Что |
|---|---|
| **Clarity** | Legible text, precise controls, sharp graphics, seamless UI |
| **Deference** | Interface facilitates content discovery, не distract elaborate decorations |
| **Depth** | Visually significant transitions and layers, conveying hierarchy and meaning |

**Touch target:** 44×44 pt минимум (известно из практики, исходник не открылся)

**Применимость:** уже было в 05-mobile-frontend.md. Подтверждено secondary sources.

### Material Design 3 — Navigation Bar (через specs URL secondary)

- **До 5 menu items** с icons, labels, badges
- Оптимизирован для **compact и medium** window sizes
- На handheld screens — common pattern

**Применимость:** уже было в 05-mobile-frontend.md (правило «не больше 4-5 табов»). Подтверждено.

### Lee Robinson — текущий фокус (через main page)

Темы статей которые он публикует:
- Coding Agents & Complexity Budgets
- Building Low-Level Software with Only Coding Agents
- Image Compression
- Developer Marketing
- Understanding AI

**Профессиональный контекст:** работает в Cursor, преподаёт AI. Раньше Vercel.

> *«My life's work is to make technology easy to understand and interesting to learn about»*

**Применимость:** показывает что **современный senior frontend = понимание AI-агентов**. Это валидирует наш подход — правила для AI-агентов в frontend контексте.

---

## Главные находки (cross-domain, gap-fill)

### 1. Primer DESIGN_TOKENS_GUIDE — model для нашей задачи

Это **производственный гайд для AI-агента написания CSS с дизайн-токенами**. Структура которую можно перенести 1:1:
- *«You are a CSS expert. Never use raw values»* — установка роли + hard rule
- MUST-правила (RFC 2119) с конкретными tokens
- Дерево решений для easing
- Чек-лист состояний
- Self-correction паттерн (`/* check-token */`)

**Импликация:** наши memory-bank/frontend-implementation-rules.md и react-ds-workflow.md должны иметь похожую структуру: установка роли → MUST-правила → деревья решений → чек-листы → self-correction.

### 2. Anthropic Building Effective Agents — модель оркестрации

Наш pipeline = orchestrator-workers + prompt chaining + stage gates. Это валидно по официальной модели Anthropic.

**Импликация:** в pipeline-orchestration.md можно прямо назвать паттерны (этот этап = chaining, этот = parallelization), это сделает правила понятнее агенту.

### 3. Emil "agents-with-taste" — наш контекст

Это литературный first-class source о том, что **AI-агенты могут иметь taste через явные правила**. Прямая цитата для нашей задачи:

> *«the more you can package into a skill, the more leverage you can get out of your agents»*

**Импликация:** в AGENTS.md можно прямо сослаться на этот принцип как философию: «явные правила = leverage».

### 4. Hallucination calibration — у нас уже есть, но усилить

> *«УВЕРЕННОСТЬ: X%»* в шаблоне ответа = **calibration по Lilian Weng**

**Импликация:** усилить — требовать процент уверенности не только в багах, но во **всех критических решениях**.

### 5. Frost "ecosystem" — снимает напряжение «всё в core»

5 слоёв с recipes как «pressure release valve» = решение проблемы перегруза DS-команды.

**Импликация:** в design-system-core.md закрепить что **recipes живут в продукте, не в core DS**. Это снимает антипаттерн «всё в core».

---

## Что осталось в gaps

| Источник | Статус | Workaround |
|---|---|---|
| Apple HIG детальные подсекции (layout, color, typography, navigation-bars) | JS-only сайт | Использовать MD3 + secondary references; цитаты HIG нельзя гарантировать дословно |
| Material Design 3 (полный) | JS-only сайт | Same — secondary references |
| Brad Frost original "atomic web design" пост | 500 Server Error | Используем что есть от книги (онлайн-версия частично доступна) и Recipe/Ecosystem статей |
| Marty Cagan SVPG статьи целиком | 403 Forbidden | Имеем content через secondary (RoadmapOne) — достаточно для базы |
| Lee Robinson — конкретные статьи | 404 на старые URLs | Имеем список тем — глубокие тезисы пропускаем |

**Эти gaps НЕ блокируют audit.** Базис принципов охвачен; конкретные платформ-specific tactics для iOS/Android можно подтверждать на лету через WebSearch при необходимости.

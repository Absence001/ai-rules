# Research: Mobile + Frontend

Источники: Apple HIG, Material Design 3, Lee Robinson (Next.js / React), Josh Comeau (CSS).

---

## Источники

1. Apple HIG — Designing for iOS — https://developer.apple.com/design/human-interface-guidelines/designing-for-ios
2. Material Design 3 — Layout, Canonical layouts, Breakpoints — https://m3.material.io/foundations/layout/
3. Lee Robinson — Personal stack — https://leerob.com/stack
4. Lee Robinson — Next.js patterns (X/Twitter, leerob.com)
5. Josh Comeau — CSS Transitions, Full-Bleed Layout (см. также 01-craft-ui.md)

---

## Часть 1: Mobile design

### Apple HIG — три кита iOS

| Принцип | Что значит | Как применять |
|---|---|---|
| **Deference (почтение)** | Контент в фокусе, интерфейс не мешает | Минимизируй chrome, декор, ненужные границы |
| **Clarity (ясность)** | Чёткая иерархия, разборчивая типографика | Системные шрифты (SF), контраст, ranks |
| **Depth (глубина)** | Слои передают иерархию | Используй translucency, motion, parallax — но дозированно |

### Конкретные правила iOS

| Правило | Деталь |
|---|---|
| **Touch target минимум** | 44×44 pt |
| **Системный шрифт** | San Francisco (Display / Text / Mono) — не таскать сторонние без причины |
| **Safe area** | Уважать notch, home indicator, status bar |
| **Navigation patterns** | Tab Bar (ровные ветви), Navigation Stack (drill-down), Split View (iPad) |
| **Modality** | Используй modal когда нужно прервать flow. Иначе — push в стек |
| **Gestures** | Свайп назад от левой грани — sacred. Не перехватывать |
| **Haptics** | Соответствуют действию (success / warn / impact light/medium/heavy) |

### Material Design 3 — breakpoints

Пять опинионированных width-классов:

| Класс | Ширина | Устройство |
|---|---|---|
| **Compact** | < 600dp | Phone portrait |
| **Medium** | 600–839dp | Phone landscape / small tablet |
| **Expanded** | 840–1199dp | Tablet portrait / small laptop |
| **Large** | 1200–1599dp | Laptop / desktop |
| **Extra-large** | ≥ 1600dp | Large desktop |

### MD3 — navigation по breakpoint

| Breakpoint | Navigation |
|---|---|
| Compact | **Bottom Navigation Bar** (3-5 destinations) |
| Medium | **Navigation Rail** (на левой стороне) |
| Expanded+ | **Permanent Navigation Drawer** |

> *«Navigation components that work on mobile, create ergonomic issues on large formats»*

Не таскать bottom-bar на десктоп — это эргономическая ошибка.

### MD3 — три canonical layouts

| Layout | Когда |
|---|---|
| **Feeds** | Однородный поток контента (Twitter, Instagram, новости) |
| **List-Detail** | Перейти от списка к детализации (Gmail, Settings) |
| **Supporting Pane** | Основной контент + связанная панель (Figma layers, Notion sidebars) |

### Mobile-specific anti-patterns

| Anti-pattern | Почему плохо |
|---|---|
| Touch target < 44pt iOS / 48dp Android | Промахи, frustration |
| Тонкие кликабельные элементы рядом | Misclicks |
| Bottom sheet которая закрывает контент целиком | Лучше уже full screen modal |
| Карусели на mobile с тонкими точками | Не понятно где находишься |
| Hover-only effects на mobile | Просто не работают |
| Длинные dropdown в форме | Используй native picker / wheel |
| 4+ нижних таба | Меньше 4, лучше 3, остальное в "More" |
| Скрытая навигация (hamburger) когда хватает 3 табов | Прячет основное |

---

## Часть 2: Frontend code quality

### Lee Robinson — стек по умолчанию

| Слой | Выбор | Почему |
|---|---|---|
| **Framework** | Next.js (App Router) | *«The latest AI models are really good at React»* |
| **Language** | TypeScript — всегда, без `any` | Type safety |
| **Styles** | Tailwind CSS | *«You can easily colocate your styles with your markup»* — AI-friendly |
| **Components** | shadcn/ui (composable, не closed-box) | Готовые, но кастомизируемые |
| **Database** | Postgres | Boring, надёжный |
| **ORM** | Drizzle | Type-safe, no magic |
| **Content** | MDX | Долгоживущий контент |
| **Compiler** | React Compiler включён | Не пиши useMemo/useCallback вручную |

### React Server Components (RSC) — правила Lee Robinson

> Паттерн: **Server Components наверху, Client Components — листья дерева**

| Где быть | Что делает |
|---|---|
| **Server (default в App Router)** | Data fetching, тяжёлые вычисления, доступ к БД, секреты |
| **Client (`'use client'`)** | Интерактивность, hooks (useState/useEffect), браузерные API |

**Anti-patterns с RSC:**
- `'use client'` на корневом layout — отменяет всю выгоду от RSC
- Тащить heavy data libraries в Client component
- Передавать функции через props server → client (нельзя)
- Использовать useState там где state живёт в URL (используй search params)

### Data fetching — Lee Robinson defaults

| Где | Чем |
|---|---|
| **Server Components** | Прямые async/await вызовы, без useEffect |
| **Client interactive** | TanStack Query (когда нужны mutations, optimistic) |
| **Forms** | Server Actions для мутаций |
| **State в URL** | `useSearchParams` + `usePathname` — shareable |
| **Local UI state** | `useState` |
| **Глобальный UI state** | Context минимально. Zustand для сложного |

### TypeScript — практики

| Практика | Деталь |
|---|---|
| **Strict mode всегда** | `"strict": true` |
| **No `any`** | Если не знаешь тип — `unknown` и сужай |
| **Discriminated unions** | Для states (`'loading' \| 'success' \| 'error'`) |
| **Type-safe API** | tRPC / Drizzle / Hono — где сервер сам диктует типы |
| **Avoid `as` cast** | Кроме narrow-cases (DOM events, environment) |
| **Generic helpers** | Не злоупотреблять — readability первична |

### CSS — современные практики (Josh Comeau + общее)

| Техника | Когда |
|---|---|
| **CSS Grid** | Layout страницы, 2D расположение |
| **Flexbox** | 1D ряды/колонки, центрирование |
| **Container Queries** | Адаптивность компонента к контейнеру, не viewport |
| **`clamp()`** | Fluid typography: `font-size: clamp(1rem, 2vw, 1.5rem)` |
| **CSS variables** | Темы, динамические значения |
| **`:has()`** | Стилизация родителя по содержимому |
| **`gap`** | Отступы между flex/grid детьми — не margin |
| **Logical properties** | `padding-inline` / `margin-block` для RTL/LTR |

### Animation defaults (cross-reference с 01-craft-ui.md)

- Только `transform` / `opacity`
- < 300ms для UI
- `ease-out` для входов
- `prefers-reduced-motion` обязательно
- Не `transition: all`

### Forms — практики

| Практика | Деталь |
|---|---|
| **Native HTML inputs** | `type="email"`, `type="tel"`, `type="number"` — вызывают правильную клавиатуру |
| **`autocomplete`** | Заполняй атрибуты — пользователю быстрее |
| **`<label>` для каждого поля** | Не placeholder вместо label (a11y) |
| **Inline validation после blur** | Не на каждый keystroke |
| **Show errors на submit, не до** | Не пугать пользователя до того как он закончил |
| **Disable submit пока invalid** | Только если cause обоснован визуально |
| **`required`, `pattern`, `min/max`** | Native validation — fallback всегда |
| **Server Actions** | Современный путь для submit (Next.js) |

### Accessibility — baseline

| Правило | Деталь |
|---|---|
| **Semantic HTML** | `<button>` для действия, `<a>` для навигации, `<form>` для форм |
| **Keyboard navigable** | Tab, Enter, Esc работают везде |
| **Focus visible** | Не `outline: none` без альтернативы |
| **ARIA — only when needed** | Сначала semantic HTML, ARIA только если нужно дополнить |
| **Screen reader test** | VoiceOver / NVDA минимум для критичных flows |
| **Color not only signal** | Иконка / текст / pattern в дополнение к цвету |
| **Контраст текста** | WCAG AA (4.5:1 body, 3:1 large) |

### Performance — baseline

| Правило | Деталь |
|---|---|
| **Images optimized** | Next.js `<Image>` / serve correct sizes |
| **Code-split heavy** | `next/dynamic` для тяжёлых компонент |
| **Avoid layout shift** | Reserve space, не let-the-image-pop-in |
| **CLS / LCP / INP** | Меряй Core Web Vitals |
| **Preload critical fonts** | Через `<link rel="preload">` или Next.js font |
| **Static первым** | SSG для контента, SSR/RSC для динамики, CSR — крайний случай |

### Frontend anti-patterns (cross-author)

| Anti-pattern | Symptom |
|---|---|
| `'use client'` на корневом layout | Убивает RSC выгоду |
| useEffect для server data | Используй RSC или TanStack Query |
| `any` в TypeScript | Type holes, баги в runtime |
| `outline: none` без замены | Сломан keyboard focus |
| Inline styles вместо классов | Невозможно theme'ить |
| Animation через `width/height` | Тормоза |
| `margin` для отступов между flex детьми | Используй `gap` |
| `placeholder` вместо `<label>` | Accessibility сломана |
| `transition: all` | Скрытые поломки в будущем |
| Hover-only UX на mobile | Просто не работает |

---

## Cross-author принципы (Mobile + Frontend)

1. **Native HTML > library** — `<button>`, `<a>`, `<form>` сначала, библиотека только если undefendable причина
2. **Server > Client when possible** — RSC top, Client leaf
3. **Touch targets — sacred** — 44pt iOS / 48dp Android, никаких исключений
4. **`prefers-reduced-motion` уважать** (cross — все)
5. **Type safety без `any`** — Lee Robinson
6. **Boring tech** — стабильные библиотеки, не bleeding edge (cross — Robinson + Willison)
7. **Адаптивная навигация** — bottom bar на mobile ≠ nav drawer на desktop (MD3)
8. **CSS Grid + Container Queries** — для layout, modern CSS вместо JS-resize

---

## Применимость к правилам AI-агента

### В mobile-platform-guidelines.md — добавить/уточнить

1. **iOS touch target 44pt / Android 48dp** — hard rule
2. **MD3 5 breakpoints + navigation pattern по классу** — фиксированная таблица
3. **iOS три принципа: deference, clarity, depth** — встроить
4. **Safe area + status bar + home indicator** — checklist для каждого экрана
5. **Native pickers для select / date / time** — не custom dropdown

### В mobile-craft-rules.md

6. **Mobile anti-patterns table** — встроить из этого research
7. **Bottom sheet vs modal vs full-screen** — таблица решений
8. **Haptics соответствуют действию** — guideline

### В frontend-implementation-rules.md — добавить/уточнить

9. **Стек по умолчанию: Next.js + TS + Tailwind + shadcn/ui** (Lee Robinson) — если не указано иначе
10. **RSC top, Client leaf** — обязательный паттерн App Router
11. **No `any` в TypeScript** — hard rule
12. **CSS Grid + Container Queries** — для layout современный подход
13. **Native HTML > library** — checklist
14. **`gap` вместо margin между flex/grid** — hard rule
15. **Form practices** — таблица из этого research встроить
16. **A11y baseline** — обязательный checklist
17. **Performance baseline** — Core Web Vitals + рекомендации

### В react-ds-workflow.md

18. **shadcn/ui composition pattern** — не closed-box компоненты
19. **Server Actions для mutations** — современный паттерн
20. **TanStack Query для interactive data** — defaults

---

## Чего не нашёл / для дальнейшего

- Apple HIG fetch вернулся пустым — нужен иной способ (RSS / docs API)
- M3 layout overview 404 — использовал secondary search
- Josh Comeau center-a-div заблокирован — пересмотреть позже
- Lee Robinson на X — не fetch-friendly, нужен manual review

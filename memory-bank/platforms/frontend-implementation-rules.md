# Frontend Implementation Rules

Правила реализации frontend кода. Источники: Lee Robinson, Joshua Comeau, GitHub Primer DESIGN_TOKENS_GUIDE, modern React практика.

## Стек по умолчанию

Если не указано иначе пользователем — используй (Lee Robinson defaults):

| Слой | Выбор |
|---|---|
| **Framework** | Next.js (App Router) |
| **Language** | TypeScript (strict mode, **no `any`**) |
| **Styles** | Tailwind CSS |
| **Components** | shadcn/ui (композитные) |
| **Database** | Postgres + Drizzle ORM (если нужна БД) |
| **Content** | MDX (для долгоживущего контента) |
| **Compiler** | React Compiler включён (не пиши useMemo/useCallback вручную) |

> *«The latest AI models are really good at React»* — Lee Robinson. Stack оптимизирован под AI-assisted development.

## Перед началом кода

- Проверить `package.json` — какой стек, какие версии
- **Не импортировать** библиотеку которой нет
- **Не ставить зависимости** без подтверждения
- Определить: Next версия, React версия, Tailwind/CSS-in-JS, TypeScript strict?

## React Server Components (RSC)

Если App Router (Next 13+):

> **Server Components наверху, Client Components — листья дерева** *(Lee Robinson)*

| Где | Что делает |
|---|---|
| **Server Components** (default) | Data fetching, тяжёлые вычисления, доступ к БД, секреты |
| **Client Components** (`'use client'`) | Интерактивность, hooks (useState/useEffect), браузерные API |

### RSC anti-patterns

- ❌ `'use client'` на корневом layout — убивает выгоду от RSC
- ❌ Heavy data libraries в Client component
- ❌ Передача функций через props server → client (нельзя)
- ❌ useEffect для server data — используй RSC или TanStack Query
- ❌ useState там где state живёт в URL — используй search params

## TypeScript hard rules

| Правило | Значение |
|---|---|
| **`"strict": true`** | Всегда |
| **No `any`** | Если не знаешь тип — `unknown` и narrow |
| **Discriminated unions** | Для state machines (`'loading' \| 'success' \| 'error'`) |
| **Минимум `as` cast** | Только narrow cases (DOM events, environment) |
| **Type-safe API** | tRPC / Drizzle / Hono — где сервер диктует типы |

## CSS modern practices

| Техника | Когда |
|---|---|
| **CSS Grid** | Layout страницы, 2D расположение |
| **Flexbox** | 1D ряды/колонки, центрирование |
| **Container Queries** | Адаптивность компонента к **контейнеру**, не viewport |
| **`clamp()`** | Fluid typography: `font-size: clamp(1rem, 2vw, 1.5rem)` |
| **CSS variables** | Темы, динамические значения, design tokens |
| **`:has()`** | Стилизация родителя по содержимому |
| **`gap`** | Отступы между flex/grid детьми — **не margin** |
| **Logical properties** | `padding-inline` / `margin-block` для RTL/LTR |
| **`:focus-visible`** | Focus ring — **НЕ `:focus`** (выключает focus на mouse click) |

## Animation (cross-reference)

См. `craft/motion-rules.md`. Hard rules:

- Только `transform` / `opacity`
- < 300ms для UI
- `ease-out` для входов
- `prefers-reduced-motion` обязательно
- НЕ `transition: all`
- Action-driven motion (hover-in ≠ hover-out)

## Forms

| Практика | Деталь |
|---|---|
| **Native HTML inputs** | `type="email"`, `type="tel"`, `type="number"` — вызывают правильную клавиатуру на mobile |
| **`autocomplete`** | Заполняй атрибуты — браузер заполняет за пользователя |
| **`<label>` для каждого поля** | **НЕ** placeholder вместо label (a11y) |
| **Inline validation после blur** | Не на каждый keystroke (раздражает) |
| **Errors на submit, не до** | Не пугать пользователя пока он не закончил |
| **Disable submit пока invalid** | Только если cause обоснован визуально |
| **`required`, `pattern`, `min/max`** | Native validation — fallback всегда |
| **Server Actions** | Современный путь для submit (Next.js App Router) |

## Accessibility baseline (обязательно)

| Правило | Значение |
|---|---|
| **Semantic HTML** | `<button>` для действия, `<a>` для навигации, `<form>` для форм |
| **Keyboard navigable** | Tab, Enter, Esc работают везде |
| **`:focus-visible`** | Видимый focus ring (НЕ `outline: none` без альтернативы) |
| **ARIA only when needed** | Сначала semantic HTML, ARIA если нужно дополнить |
| **Screen reader test** | VoiceOver / NVDA минимум для критичных flows |
| **Color not only signal** | Иконка / текст / pattern в дополнение к цвету |
| **WCAG AA контраст** | 4.5:1 body, 3:1 large |
| **Alt text для images** | `alt=""` для декоративных, descriptive для контентных |
| **Skip links** | Для длинных navigation |

## Performance baseline

| Правило | Метрика |
|---|---|
| **Images optimized** | Next.js `<Image>` / serve правильные размеры |
| **Code-split heavy** | `next/dynamic` для тяжёлых компонент |
| **Avoid layout shift** | Reserve space, не let-the-image-pop-in |
| **CLS / LCP / INP** | Core Web Vitals — measure |
| **Preload critical fonts** | `<link rel="preload">` или Next.js font |
| **Static первым** | SSG для контента, SSR/RSC для динамики, CSR — крайний случай |
| **Bundle size** | Анализируй с next-bundle-analyzer |

## Data fetching defaults

| Контекст | Чем |
|---|---|
| **Server Components** | Прямые async/await вызовы, без useEffect |
| **Client interactive** | TanStack Query (mutations, optimistic updates) |
| **Forms** | Server Actions |
| **State в URL** | `useSearchParams` + `usePathname` — shareable |
| **Local UI state** | `useState` |
| **Глобальный UI state** | Context минимально. Zustand для сложного |

## Components — общие правила

- Разбивать UI на понятные компоненты
- Не плодить компоненты без повторного использования (Rule of Three)
- Использовать **shadcn/ui** как базу — composable, не closed-box
- Не оставлять дефолтный shadcn-вид если задача brand/editorial
- Композиция через `Card.Image`, `Card.Title` > god-components с 30 props

## Tokens (cross-reference)

> *«You are a CSS expert. Never use raw values (hex, px, etc.). Only use semantic tokens.»* — Primer

См. `design-system/tokens-spec.md`. Если в проекте есть DS:
- Никаких raw hex / px — только semantic tokens
- Если токена нет → пометь `/* check-token */` и спроси

## Responsive

- **Mobile-first** — стиль по умолчанию для smallest screen, override для больше
- **Breakpoints от контента**, не arbitrary
- **Проверить** narrow / tablet / desktop (минимум 3 точки)
- **Container Queries** для component-level responsiveness

## Контент

- Реалистичные placeholders из контекста проекта (не Lorem / John Doe / Acme)
- Не выдумывать точные цифры как факты
- CTA конкретные (не «Submit», «Click here»)

## Anti-patterns (полный список)

| Anti-pattern | Симптом |
|---|---|
| `'use client'` на корневом layout | Убивает RSC выгоду |
| useEffect для server data | Используй RSC или TanStack Query |
| `any` в TypeScript | Type holes |
| `outline: none` без замены | Сломан keyboard focus |
| Inline styles вместо классов | Невозможно theme |
| Animation `width` / `height` | Тормоза |
| `margin` между flex детьми | Используй `gap` |
| `placeholder` вместо `<label>` | A11y сломана |
| `transition: all` | Скрытые поломки |
| Hover-only UX на mobile | Не работает |
| Hardcoded hex / px при наличии tokens | Bypassing DS |
| Custom dropdown вместо native picker (mobile) | Hostile UX |
| `h-screen` на mobile | iOS / Android viewport quirks. Используй `min-h-[100dvh]` |
| Random component splits | Невозможно reuse |
| Default shadcn-look в brand-задаче | Generic |
| Bleeding edge libraries без причины | Боль в поддержке |

## Связанные файлы

- `craft/motion-rules.md` — анимации детально
- `design-system/tokens-spec.md` — токены
- `design-system/component-anatomy.md` — структура компонентов
- `pd-workflows/accessibility-audit.md` — WCAG как процесс
- `code-diagnostics/code-diagnostics.md` — формат ответа на баги

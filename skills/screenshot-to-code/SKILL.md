---
name: screenshot-to-code
status: active
description: Reconstruct a web/mobile UI as a React prototype from a screenshot or reference image. Use when user provides a screenshot/image and asks to build it as code, or wants visual cloning. Includes the full image-to-code workflow, anti-slop checks during reconstruction, and a final visual diff checklist.
trigger_keywords:
  ru: ["скриншот", "screenshot", "по картинке", "из изображения", "image to code", "восстановить UI", "clone UI", "по скрину"]
  en: ["screenshot", "image to code", "reconstruct UI", "clone from image", "rebuild from screenshot"]
intent: |
  User provided an image and wants code that matches it. Activate also when user says
  "сделай как тут" / "make it look like this" with a visual reference.
task_type: outcome-gradable
related_skills: [craft-audit, design-system, frontend-impl]
data_access_level: raw
---

# Screenshot → Code

Восстановление UI по скриншоту / референсу.

## Initial Response (обязательно при первом вызове)

При активации без конкретного контекста — сразу ответить:

> «Активирован screenshot-to-code. **Не начинаю код сразу.** Сначала:
> 1. **Скриншот / референс приложен?** Если нет — попрошу.
> 2. **Тип скрина:** web landing / app screen / dashboard / mobile / editorial?
> 3. **Visual register** — какой один основной? (`product-app` / `brand-marketing` / `editorial-minimal` / `mobile-product` / другой)
> 4. **Стек** — Next.js + Tailwind + shadcn/ui (по умолчанию Lee Robinson) или другой?
> 5. **Figma MCP** — использовать или явно без MCP?
>
> Порядок: анализ → component tree → стек → твоё подтверждение → реализация → visual diff → anti-slop audit.»

## Когда триггерится

- Пользователь прикрепил скриншот / референс
- «Сделай как тут», «по картинке», «восстанови UI»
- Image to code prototype

## Что читать

1. **Сначала:** `./artifacts/project-state.md`
2. **Затем:**
   - `RULES_ROOT/memory-bank/screenshot-to-code/image-to-code-workflow.md` — порядок
   - `RULES_ROOT/memory-bank/craft/visual-registers.md` — выбор register
   - `RULES_ROOT/memory-bank/platforms/frontend-implementation-rules.md` — frontend defaults
   - `RULES_ROOT/memory-bank/craft/anti-slop-audit.md` — финальная проверка

## Порядок

1. **Не начинать код сразу.**
2. Не использовать Figma MCP если пользователь явно сказал без MCP.
3. Анализ визуала:
   - тип скрина (web landing / app / dashboard / mobile / editorial)
   - layout / typography / spacing / colors / components
   - visual register (один основной)
4. Component tree + стек.
5. Спросить разрешение на реализацию.
6. Реализовать (React).
7. Visual diff checklist (см. ниже).
8. Anti-slop audit (`craft-audit` skill).
9. Записать `./artifacts/screens.md`, `./artifacts/prototype.md`, `./artifacts/craft-audit.md`.

## Visual diff checklist

После реализации проверить:

- [ ] Структура (sections в той же иерархии)
- [ ] Пропорции (gap / padding / size)
- [ ] Типографика (sizes / weights / line-heights)
- [ ] Цвета (точность hex / hsl, особенно accents)
- [ ] Spacing (rhythm, density)
- [ ] Responsive (mobile / tablet / desktop если применимо)
- [ ] Состояния (hover / focus / active)
- [ ] Кириллица / контент (не Lorem)

## Библиотеки (если пользователь хочет free)

| Библиотека | Когда |
|---|---|
| shadcn/ui | Базовая component architecture |
| Magic UI | Visual / marketing blocks |
| Tailwind | Layout / styling |
| lucide-react | Иконки |
| framer-motion | Только при необходимости |

**Не устанавливать без подтверждения.**

## Anti-Patterns

| Pattern (WRONG) | Why it fails | Correct (RIGHT) |
|---|---|---|
| Начать код сразу без анализа | Угадывание, переделка | Анализ → component tree → код |
| Создать свою DS с нуля | Не нужно для quick prototype | Использовать выбранную библиотеку как базу |
| Копировать бренд / логотипы | Right issues | Placeholders |
| Длинная страница одним блоком | Слишком сложно держать в контексте | Анализировать секциями |
| Дефолтный shadcn вид без brand polish | Generic AI-look | Customize tokens / typography для register |
| Pixel-perfect ценой нечитаемого кода | Trade-off неверный | Прозрачный код важнее ±2px |
| Lorem Ipsum в финальном результате | Filler | Реалистичные placeholders из домена |
| Пропустить anti-slop audit | Финал выглядит generic | Обязательный финальный проход |

## Outcome

- `./artifacts/screens.md` со списком экранов и компонентов
- `./artifacts/prototype.md` с инструкцией запуска
- `./artifacts/craft-audit.md` с visual diff findings
- Visual diff checklist пройден
- Anti-slop audit пройден
- Lineage entry

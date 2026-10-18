# Vendored skills — происхождение и лицензии

Скиллы, пришедшие извне. Их `SKILL.md` **не редактируются**: любая правка потеряется
при обновлении из апстрима, а расхождение с оригиналом будет незаметным. Если нужно
изменить поведение — делай это маршрутизацией (`rules-index.md`, `skills/README.md`),
а не правкой вендоренного файла.

Исключение — `agents/openai.yaml`: его в апстриме нет, он генерируется нами
для интерфейса Codex и является нашим файлом.

---

## emilkowalski/skills

- **Источник:** https://github.com/emilkowalski/skills
- **Коммит:** `2d228630ba1446365f614a108cb8252f1feda202`
- **Завендорено:** 2026-10-18
- **Лицензия:** MIT, © 2026 Emil Kowalski

**Скиллы (15):** `animate` · `animate-expo` · `animation-performance` ·
`animation-vocabulary` · `apple-design` · `ask-sonner` · `break-ui` ·
`emil-design-eng` · `find-animation-opportunities` · `improve-animations` ·
`mobile-native` · `pick-ui-library` · `prototype` · `review-animations` · `write-swift`

Машиночитаемый список для `scripts/rules-lint.mjs` (R1/R2/R3 к этим скиллам не применяются —
их ссылки указывают на файлы целевого проекта, объём задан автором; R4 и R5 применяются):

```vendored
animate
animate-expo
animation-performance
animation-vocabulary
apple-design
ask-sonner
break-ui
emil-design-eng
find-animation-opportunities
improve-animations
mobile-native
pick-ui-library
prototype
review-animations
write-swift
```

Файл `emil-design-eng/performance-cheatsheet.md` взят из корня апстрим-репозитория
и положен рядом с основным скиллом.

**Только по явному вызову** (в апстриме стоит `disable-model-invocation: true`,
у нас это отражено как `allow_implicit_invocation: false`):
`pick-ui-library`, `prototype`, `review-animations`.

### Обновление из апстрима

```bash
git clone --depth 1 https://github.com/emilkowalski/skills.git /tmp/emil
cp -r /tmp/emil/skills/<name>/* skills/<name>/
# agents/openai.yaml не трогать — он наш
# обновить коммит в этом файле
```

### Текст лицензии

```
MIT License

Copyright (c) 2026 Emil Kowalski

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Адаптированные из everything-claude-code

Не вендоринг, а переработка: идея и структура взяты, текст написан заново под эту систему,
поэтому наши `SKILL.md` **редактируются** как свои.

- **Источник:** https://github.com/affaan-m/everything-claude-code (MIT)
- **Адаптировано 2026-10-18:**

| Наш скилл / файл | Источник в ECC | Что изменено |
|---|---|---|
| `distill` + `scripts/observe.mjs`, `inject-instincts.mjs`, `instincts.mjs` | `skills/continuous-learning-v2` | Node вместо bash+python, без фонового демона, домены пайплайна, промоушен в memory-bank |
| `council` | `skills/council` | Four Big Risks в вердикте, запись в Decision Lineage, честность о якоре без подагентов |
| `skill-scout` | `skills/skill-scout` | Codex-локации, вендоринг, правила R7, поиск на двух языках |
| `scripts/anti-slop-check.mjs` | `design-quality-check.js` (хук ECC) | Сигналы из нашего `anti-slop-audit.md`, сверены с первоисточниками |
| `scripts/delivery-gate.mjs` | `skills/delivery-gate` | Условие «артефакты менялись → project-state обновлён» вместо тестов |
| Самооценка в `memory-bank/meta/calibration.md` | `skills/agent-self-evaluation` | Встроена в калибровку, связана с циклом обучения |

## Прочие внешние скиллы

| Скилл | Происхождение | Статус |
|---|---|---|
| `make-interfaces-feel-better` | внешний, автор не зафиксирован при добавлении | в репозитории с 2026-10-18 |
| `serega-gentle`, `serega-emotional` | внешние, эффекты посимвольного раскрытия текста | в репозитории с 2026-10-18 |

Если найдётся апстрим этих трёх — добавить сюда источник и коммит, как у Эмиля.

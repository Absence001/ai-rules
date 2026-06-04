---
name: code-diagnostics
status: active
description: Diagnose bugs, errors, broken code, config issues, dependency problems. Use when user reports "не работает", "ошибка", "баг", "broken", or shares an error message/log. Enforces strict diagnosis-before-fix protocol, mandatory response format with confidence percentage (calibration per Lilian Weng), and triple-check hypothesis rule.
trigger_keywords:
  ru: ["баг", "ошибка", "не работает", "сломалось", "не запускается", "fix", "почини", "что не так"]
  en: ["bug", "error", "broken", "doesn't work", "won't run", "fix", "debug", "what's wrong"]
intent: |
  User reports something is broken or asks to fix. Activate also when user shares an
  error message / stack trace / log without explicit "fix" word.
task_type: outcome-gradable
related_skills: [frontend-impl, pipeline-control]
data_access_level: raw
---

# Code Diagnostics

Диагностика и фикс. **Сначала найти проблему — потом править.**

## Когда триггерится

- Любой репорт «не работает», «ошибка», «сломалось», «fix»
- Stack trace / error message в сообщении
- Failed test / unexpected behaviour

## Что читать

1. **Сначала:** `./artifacts/project-state.md` (контекст проекта)
2. **Затем:**
   - `RULES_ROOT/memory-bank/code-diagnostics/code-diagnostics.md` — protocol
   - `RULES_ROOT/memory-bank/meta/calibration.md` — формат уверенности
   - При frontend — `RULES_ROOT/memory-bank/platforms/frontend-implementation-rules.md`

## Обязательный формат ответа

```
- ПРОБЛЕМА: …
- ГДЕ ИМЕННО: …
- КАК БУДЕМ РЕШАТЬ (план): …
- ЧТО ИЗМЕНИТСЯ ПОСЛЕ: …
- КАК ПРОТЕСТИРОВАТЬ ПОСЛЕ РЕШЕНИЯ: …
- УВЕРЕННОСТЬ: X%
- ВОПРОС: Могу ли я начать исправление?
```

**Никогда не править код без подтверждения** ВОПРОСА. Это calibration по Lilian Weng + stage gate.

## Протокол

1. **Сначала найти проблему** в коде / конфиге / логах. До этого — никаких правок.
2. **Проверить гипотезу 3 раза:**
   - Код (сам исходник)
   - Конфиг (package.json, tsconfig, env)
   - Логи / симптомы (runtime errors, network, console)
3. Если 3-кратная проверка не сходится — задать вопрос, не править.
4. После правки — **минимальные изменения**. Не рефакторить попутно.
5. Отчёт: что / почему / какие файлы / как проверить.

## ReAct + Reflexion (Lilian Weng)

**Thought → Action → Observation → итерация.**

Если первый fix не сработал — **не retry слепо.** Делай Reflexion:
1. Что именно не сработало (конкретно)?
2. Какая assumption была неверна?
3. Какая другая стратегия?
4. Тогда новая попытка.

## Уровни уверенности (calibration)

| % | Что значит |
|---|---|
| **90-100%** | Видел эту ошибку раньше, fix — типовой |
| **70-89%** | Гипотеза с косвенными подтверждениями (логи + код согласуются) |
| **50-69%** | Одна гипотеза не подтверждена другой — спросить детали |
| **30-49%** | Только догадка — не править, задать вопросы |
| **< 30%** | Слепое угадывание — STOP, задать вопрос пользователю |

**Хороший ответ:** УВЕРЕННОСТЬ: 75%, потому что код согласуется с логом, но я не вижу env.

## Anti-Patterns

| Pattern (WRONG) | Why it fails | Correct (RIGHT) |
|---|---|---|
| Сразу предложить fix не разобравшись | Лечим симптом, причина остаётся | Diagnose → propose → подтверждение |
| Заявить «уверен на 100%» когда не уверен | Sycophancy / overconfidence | Честный % уверенности |
| Слепой retry после провала | Трата токенов | Reflexion: что не сработало → новая стратегия |
| Большие изменения с рефакторингом «попутно» | Risk + drift | Минимальные изменения только под bug |
| Править код без явного «можно» | Stage gate нарушен | Question → wait → fix |
| Игнорировать calibration формат | Lose discipline | Полный шаблон каждый раз |

## Outcome

- Шаблон ответа полностью заполнен
- УВЕРЕННОСТЬ:X% явно указана
- Гипотеза проверена 3-кратно ИЛИ задан clarifying вопрос
- После fix — отчёт что/почему/какие файлы
- Lineage entry (если bug критичный для проекта)

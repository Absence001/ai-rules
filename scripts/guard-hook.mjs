#!/usr/bin/env node
// guard-hook — детерминированный PreToolUse-хук для Claude Code.
// Модель: Claude Code Safety Guard (см. RULES-GOVERNANCE.md, Lineage #L2).
// Превращает текстовые high-risk gates из AGENTS.md в enforcement: блокирует
// всегда-запрещённые команды ДО выполнения. Без LLM в цикле — same input, same verdict.
//
// Контракт Claude Code PreToolUse-хука:
//   stdin  = JSON { tool_name, tool_input: { command, ... }, ... }
//   exit 0 = разрешить; exit 2 = ЗАБЛОКИРОВАТЬ (stderr показывается агенту)
//
// Философия: defense-in-depth, не абсолют. Ловим реалистичный путь беды
// (прямые опасные команды). Индирекция через переменные ($X) — вне scope, как и у Safety Guard.

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let cmd = "";
  try {
    const input = JSON.parse(raw || "{}");
    // Рантайм-агностично: проверяем любой инструмент, который несёт строку команды.
    // Claude Code зовёт его Bash, Codex — иначе; завязка на имя отключила бы хук
    // в одном из рантаймов молча. Риск несёт сама команда, а не её инструмент.
    const ti = input.tool_input || {};
    cmd = typeof ti.command === "string" ? ti.command : "";
  } catch {
    process.exit(0); // не смогли распарсить — не мешаем работе
  }
  if (!cmd) process.exit(0);

  const c = cmd.replace(/\s+/g, " ").trim();

  // Всегда-запрещённые паттерны: [regex, объяснение, безопасная альтернатива]
  const RULES = [
    // Корень / домашняя директория / корень диска — но НЕ конкретная папка по абсолютному пути.
    // В Git Bash на Windows любой абсолютный путь начинается с «/» (/c/Users/...), поэтому
    // цель обязана заканчиваться сразу после корня или быть глобом: «/», «/*», «/c/», «/c/*», «~».
    // Иначе хук блокировал бы `rm -rf /c/Users/me/project/build` — обычную рабочую команду.
    [/\brm\s+-[a-z]*(?:rf|fr)[a-z]*\s+(?:--no-preserve-root\s+)?(?:\/(?:[a-z]\/?)?|~\/?|\$HOME\/?|%USERPROFILE%\\?)(?:\*)?(?:\s|$)/i,
      "Рекурсивное удаление корня, корня диска или домашней директории",
      "удали конкретную папку полным путём (`rm -rf /c/Users/you/proj/build`) — такие команды не блокируются"],
    [/\brm\s+-[a-z]*(?:rf|fr)[a-z]*\s+.*--no-preserve-root/i,
      "Рекурсивное удаление с --no-preserve-root", "удали конкретную папку явным путём"],
    [/\bmkfs\b/i, "Форматирование файловой системы", "выполни вручную, если действительно нужно"],
    [/\bdd\b[^|]*\bof=\/dev\//i, "Перезапись блочного устройства через dd", "выполни вручную с осознанием рисков"],
    [/:\(\)\s*\{\s*:\s*\|\s*:\s*&\s*\}\s*;\s*:/, "Fork-бомба", "не выполнять"],
    [/\bgit\s+reset\s+--hard\b/i, "git reset --hard уничтожает незакоммиченные изменения",
      "git stash (сохранить) или git reset --soft/--mixed"],
    [/\bgit\s+push\b[^&|;]*(--force(?!-with-lease)|(?<![\w-])-f\b)/i,
      "Force-push перезаписывает историю удалёнки", "git push --force-with-lease (безопаснее)"],
    [/\bgit\s+commit\b[^&|;]*(--no-verify|(?<![\w-])-n\b)/i,
      "commit --no-verify пропускает хуки (в т.ч. проверки безопасности)", "исправь причину падения хука"],
    [/\bgit\s+commit\b[^&|;]*--amend\b/i,
      "commit --amend переписывает существующий коммит", "создай новый коммит поверх"],
    [/\b(chmod|chown|chgrp)\s+-[a-z]*R[a-z]*\s+.*\/(etc|usr|var|lib|bin|sbin|boot)\b/i,
      "Рекурсивная смена прав на системном пути", "выполни точечно и вручную"],
    [/\bgit\s+.*(gpgsign=false|--no-gpg-sign)/i,
      "Обход подписи коммитов", "не обходить, если пользователь явно не просил"],
  ];

  for (const [re, why, alt] of RULES) {
    if (re.test(c)) {
      process.stderr.write(
        `⛔ guard-hook заблокировал команду.\n` +
        `Причина: ${why}.\n` +
        `Команда: ${cmd}\n` +
        `Безопасная альтернатива: ${alt}.\n` +
        `Это неотменяемо-запрещённое действие (RULES-GOVERNANCE.md #L2). ` +
        `Если оно действительно нужно — пользователь выполняет его сам.\n`,
      );
      process.exit(2); // блок
    }
  }
  process.exit(0); // разрешить
});

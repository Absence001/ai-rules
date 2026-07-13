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
    // хук вешаем на Bash; на другие инструменты — пропускаем
    if (input.tool_name && input.tool_name !== "Bash") process.exit(0);
    cmd = (input.tool_input && input.tool_input.command) || "";
  } catch {
    process.exit(0); // не смогли распарсить — не мешаем работе
  }
  if (!cmd) process.exit(0);

  const c = cmd.replace(/\s+/g, " ").trim();

  // Всегда-запрещённые паттерны: [regex, объяснение, безопасная альтернатива]
  const RULES = [
    [/\brm\s+-[a-z]*r[a-z]*f[a-z]*\s+(\/|~|\/\*|\$HOME|\/\*\s|--no-preserve-root)/i,
      "Рекурсивное удаление корня/домашней директории", "удали конкретную папку явным путём вручную"],
    [/\brm\s+-[a-z]*f[a-z]*r[a-z]*\s+(\/|~|\/\*|\$HOME)/i,
      "Рекурсивное удаление корня/домашней директории", "удали конкретную папку явным путём вручную"],
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

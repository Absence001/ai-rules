@echo off
echo Syncing ai-rules globally...

set RULES_ROOT=C:\Users\PC\ai-rules
set CODEX_HOME=C:\Users\PC\.codex
set CLAUDE_HOME=C:\Users\PC\.claude

REM ============================================================
REM Codex: ~/.codex/AGENTS.md = AGENTS.md + codex/AGENTS.md + bootstrap
REM ============================================================
echo.
echo --- Codex sync ---

copy /Y "%RULES_ROOT%\AGENTS.md" "%CODEX_HOME%\AGENTS.md.tmp" >nul
echo. >> "%CODEX_HOME%\AGENTS.md.tmp"
echo --- >> "%CODEX_HOME%\AGENTS.md.tmp"
echo. >> "%CODEX_HOME%\AGENTS.md.tmp"
type "%RULES_ROOT%\codex\AGENTS.md" >> "%CODEX_HOME%\AGENTS.md.tmp"
echo. >> "%CODEX_HOME%\AGENTS.md.tmp"
echo --- >> "%CODEX_HOME%\AGENTS.md.tmp"
echo. >> "%CODEX_HOME%\AGENTS.md.tmp"
echo ## Bootstrap reminder >> "%CODEX_HOME%\AGENTS.md.tmp"
echo. >> "%CODEX_HOME%\AGENTS.md.tmp"
echo RULES_ROOT = %RULES_ROOT% >> "%CODEX_HOME%\AGENTS.md.tmp"
echo. >> "%CODEX_HOME%\AGENTS.md.tmp"
echo В новом проекте: >> "%CODEX_HOME%\AGENTS.md.tmp"
echo 1. Сначала читать ./artifacts/project-state.md если есть. >> "%CODEX_HOME%\AGENTS.md.tmp"
echo 2. Затем RULES_ROOT/rules-index.md для routing. >> "%CODEX_HOME%\AGENTS.md.tmp"
echo 3. Грузить только нужные правила. >> "%CODEX_HOME%\AGENTS.md.tmp"

move /Y "%CODEX_HOME%\AGENTS.md.tmp" "%CODEX_HOME%\AGENTS.md" >nul

if %errorlevel%==0 (
    echo [OK] %CODEX_HOME%\AGENTS.md updated
) else (
    echo [ERROR] Failed to update %CODEX_HOME%\AGENTS.md
)

REM ============================================================
REM Claude: ~/.claude/CLAUDE.md уже корректный (с @-импортами).
REM Проверяем что @-импорты на месте.
REM ============================================================
echo.
echo --- Claude check ---

if exist "%CLAUDE_HOME%\CLAUDE.md" (
    findstr /C:"@C:/Users/PC/ai-rules/AGENTS.md" "%CLAUDE_HOME%\CLAUDE.md" >nul
    if errorlevel 1 (
        echo [WARN] %CLAUDE_HOME%\CLAUDE.md doesn't import AGENTS.md
        echo Add: @C:/Users/PC/ai-rules/AGENTS.md
    ) else (
        findstr /C:"@C:/Users/PC/ai-rules/claude/CLAUDE.md" "%CLAUDE_HOME%\CLAUDE.md" >nul
        if errorlevel 1 (
            echo [WARN] %CLAUDE_HOME%\CLAUDE.md doesn't import claude/CLAUDE.md
            echo Add: @C:/Users/PC/ai-rules/claude/CLAUDE.md
        ) else (
            echo [OK] %CLAUDE_HOME%\CLAUDE.md imports both AGENTS.md and claude/CLAUDE.md
        )
    )
) else (
    echo [WARN] %CLAUDE_HOME%\CLAUDE.md doesn't exist
)

echo.
echo Done.
pause

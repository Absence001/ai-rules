@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
echo Syncing ai-rules globally...

set RULES_ROOT=%USERPROFILE%\ai-rules
set CODEX_HOME=%USERPROFILE%\.codex
set CLAUDE_HOME=%USERPROFILE%\.claude

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
echo 1. Не копировать локально AGENTS.md, CLAUDE.md и memory-bank без особой причины. >> "%CODEX_HOME%\AGENTS.md.tmp"
echo 2. Сначала читать ./artifacts/project-state.md если есть. >> "%CODEX_HOME%\AGENTS.md.tmp"
echo 3. Затем RULES_ROOT/rules-index.md для routing. >> "%CODEX_HOME%\AGENTS.md.tmp"
echo 4. Грузить только нужные правила из RULES_ROOT. >> "%CODEX_HOME%\AGENTS.md.tmp"

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
    findstr /C:"/ai-rules/AGENTS.md" "%CLAUDE_HOME%\CLAUDE.md" >nul
    if errorlevel 1 (
        echo [WARN] %CLAUDE_HOME%\CLAUDE.md doesn't import AGENTS.md
        echo Add: /ai-rules/AGENTS.md
    ) else (
        findstr /C:"/ai-rules/claude/CLAUDE.md" "%CLAUDE_HOME%\CLAUDE.md" >nul
        if errorlevel 1 (
            echo [WARN] %CLAUDE_HOME%\CLAUDE.md doesn't import claude/CLAUDE.md
            echo Add: /ai-rules/claude/CLAUDE.md
        ) else (
            echo [OK] %CLAUDE_HOME%\CLAUDE.md imports both AGENTS.md and claude/CLAUDE.md
        )
    )
) else (
    echo [WARN] %CLAUDE_HOME%\CLAUDE.md doesn't exist
)

REM ============================================================
REM Claude Skills: copy ai-rules/skills/ to ~/.claude/skills/
REM ============================================================
echo.
echo --- Claude Skills sync ---

if not exist "%CLAUDE_HOME%\skills" mkdir "%CLAUDE_HOME%\skills"
xcopy /E /Y /I /Q "%RULES_ROOT%\skills" "%CLAUDE_HOME%\skills" >nul

if %errorlevel%==0 (
    REM Dynamic count: count SKILL.md files in skills/ subdirectories
    set SKILL_COUNT=0
    for /D %%D in ("%RULES_ROOT%\skills\*") do (
        if exist "%%D\SKILL.md" set /A SKILL_COUNT+=1
    )
    echo [OK] %CLAUDE_HOME%\skills synced ^(!SKILL_COUNT! skills^)
) else (
    echo [ERROR] Failed to sync Skills
)

echo.
echo Done.

REM Env-gated pause: skip when called from CI/agent/script
REM Set SYNC_RULES_NO_PAUSE=1 to skip the pause prompt.
REM Examples (PowerShell): $env:SYNC_RULES_NO_PAUSE=1; .\sync-rules.bat
REM Examples (cmd):        set SYNC_RULES_NO_PAUSE=1 && sync-rules.bat
if not defined SYNC_RULES_NO_PAUSE pause
endlocal

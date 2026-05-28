@echo off
echo Syncing ai-rules to Codex and Claude...

copy /Y "C:\Users\PC\ai-rules\AGENTS.md" "C:\Users\PC\.codex\AGENTS.md"
if %errorlevel%==0 (
    echo [OK] .codex\AGENTS.md updated
) else (
    echo [ERROR] Failed to update .codex\AGENTS.md
)

echo Done.
pause

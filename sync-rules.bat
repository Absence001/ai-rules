@echo off
echo Syncing ai-rules to Codex...

REM Combine AGENTS.md + codex/AGENTS.md into ~/.codex/AGENTS.md
copy /Y "C:\Users\PC\ai-rules\AGENTS.md" "C:\Users\PC\.codex\AGENTS.md.tmp"
echo. >> "C:\Users\PC\.codex\AGENTS.md.tmp"
echo --- >> "C:\Users\PC\.codex\AGENTS.md.tmp"
echo. >> "C:\Users\PC\.codex\AGENTS.md.tmp"
type "C:\Users\PC\ai-rules\codex\AGENTS.md" >> "C:\Users\PC\.codex\AGENTS.md.tmp"
move /Y "C:\Users\PC\.codex\AGENTS.md.tmp" "C:\Users\PC\.codex\AGENTS.md"

if %errorlevel%==0 (
    echo [OK] .codex\AGENTS.md updated ^(AGENTS.md + codex/AGENTS.md^)
) else (
    echo [ERROR] Failed to update .codex\AGENTS.md
)

echo Done.
pause

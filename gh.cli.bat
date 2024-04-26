@echo off
setlocal

REM Check if repository URL file exists
if not exist repository.url.txt (
    echo Repository URL file not found. Creating file...
    echo Add your repository URL to repository.url.txt and rerun this script.
    echo Example: https://github.com/username/repository
    echo.  > repository.url.txt
    pause
    exit /b
)

REM Read repository URL from file
set /p REPO_URL=<repository.url.txt

REM Clone repository
gh repo clone %REPO_URL%

REM Navigate to cloned repository directory
cd %REPO_URL:https://github.com/=%

REM Show open issues
gh issue list

REM Show open pull requests
gh pr list

REM Show current repository status and info
gh repo view

REM Open repository in browser
start %REPO_URL%

endlocal

@echo off
REM Deploy Frontend V2 to GitHub
REM Repository: https://github.com/KujtimMusa/frontend-v2

echo ========================================
echo DEPLOY FRONTEND V2 TO GITHUB
echo ========================================
echo.

cd /d "%~dp0"

echo [1/6] Checking Git status...
if not exist .git (
    echo   Initializing Git repository...
    git init
) else (
    echo   Git repository already initialized
)

echo.
echo [2/6] Checking remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/KujtimMusa/frontend-v2.git
if %errorlevel% equ 0 (
    echo   Remote added successfully
) else (
    echo   Remote already exists or updated
)

echo.
echo [3/6] Adding all files...
git add .
echo   Files added to staging

echo.
echo [4/6] Creating commit...
git commit -m "Initial commit: V2 Frontend - Production Ready"
if %errorlevel% equ 0 (
    echo   Commit created successfully
) else (
    echo   No changes to commit or commit failed
)

echo.
echo [5/6] Setting branch to main...
git branch -M main
echo   Branch set to main

echo.
echo [6/6] Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! Frontend V2 deployed to GitHub
    echo ========================================
    echo.
    echo Repository: https://github.com/KujtimMusa/frontend-v2
    echo.
    echo Next steps:
    echo   1. Connect repository to Vercel
    echo   2. Set ENV Variable: NEXT_PUBLIC_API_URL
    echo   3. Deploy!
) else (
    echo.
    echo ========================================
    echo ERROR: Push failed
    echo ========================================
    echo.
    echo Possible reasons:
    echo   - Not authenticated with GitHub
    echo   - Repository permissions issue
    echo   - Network issue
    echo.
    echo Try manually:
    echo   git push -u origin main
)

pause

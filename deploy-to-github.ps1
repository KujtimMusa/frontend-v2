# Deploy Frontend V2 to GitHub
# Repository: https://github.com/KujtimMusa/frontend-v2

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DEPLOY FRONTEND V2 TO GITHUB" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to frontend-v2 directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "[1/6] Checking Git status..." -ForegroundColor Yellow

# Check if Git is initialized
if (-not (Test-Path .git)) {
    Write-Host "  Initializing Git repository..." -ForegroundColor Gray
    git init
} else {
    Write-Host "  Git repository already initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "[2/6] Checking remote repository..." -ForegroundColor Yellow

# Check if remote exists
$remoteExists = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Adding remote repository..." -ForegroundColor Gray
    git remote add origin https://github.com/KujtimMusa/frontend-v2.git
    Write-Host "  Remote added: origin -> https://github.com/KujtimMusa/frontend-v2.git" -ForegroundColor Green
} else {
    Write-Host "  Remote already exists: $remoteExists" -ForegroundColor Green
    Write-Host "  Updating remote URL..." -ForegroundColor Gray
    git remote set-url origin https://github.com/KujtimMusa/frontend-v2.git
}

Write-Host ""
Write-Host "[3/6] Checking .gitignore..." -ForegroundColor Yellow

# Ensure .env is in .gitignore
$gitignoreContent = Get-Content .gitignore -Raw
if ($gitignoreContent -notmatch "^\\.env$") {
    Write-Host "  Adding .env to .gitignore..." -ForegroundColor Gray
    Add-Content .gitignore "`n# environment files`n.env"
    Write-Host "  .env added to .gitignore" -ForegroundColor Green
} else {
    Write-Host "  .env already in .gitignore" -ForegroundColor Green
}

Write-Host ""
Write-Host "[4/6] Adding all files..." -ForegroundColor Yellow
git add .
Write-Host "  Files added to staging" -ForegroundColor Green

Write-Host ""
Write-Host "[5/6] Creating commit..." -ForegroundColor Yellow
$commitMessage = "Initial commit: V2 Frontend - Production Ready

- Complete authentication flow (Login, Entry, Callback)
- Dashboard with stats and charts
- Products management
- Recommendations with ML integration
- Margin Calculator
- OAuth flow for Shopify
- Modern UI with shadcn/ui components
- TypeScript throughout
- Production ready"

git commit -m $commitMessage
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Commit created successfully" -ForegroundColor Green
} else {
    Write-Host "  No changes to commit (or commit failed)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[6/6] Pushing to GitHub..." -ForegroundColor Yellow

# Set branch to main
git branch -M main

# Push to GitHub
Write-Host "  Pushing to origin/main..." -ForegroundColor Gray
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS! Frontend V2 deployed to GitHub" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository: https://github.com/KujtimMusa/frontend-v2" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Connect repository to Vercel" -ForegroundColor White
    Write-Host "  2. Set ENV Variable: NEXT_PUBLIC_API_URL" -ForegroundColor White
    Write-Host "  3. Deploy!" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "ERROR: Push failed" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible reasons:" -ForegroundColor Yellow
    Write-Host "  - Not authenticated with GitHub" -ForegroundColor White
    Write-Host "  - Repository permissions issue" -ForegroundColor White
    Write-Host "  - Network issue" -ForegroundColor White
    Write-Host ""
    Write-Host "Try manually:" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor White
}

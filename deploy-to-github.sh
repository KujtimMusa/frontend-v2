#!/bin/bash

# Deploy Frontend V2 to GitHub
# Repository: https://github.com/KujtimMusa/frontend-v2

echo "========================================"
echo "DEPLOY FRONTEND V2 TO GITHUB"
echo "========================================"
echo ""

# Change to frontend-v2 directory
cd "$(dirname "$0")"

echo "[1/6] Checking Git status..."

# Check if Git is initialized
if [ ! -d .git ]; then
    echo "  Initializing Git repository..."
    git init
else
    echo "  Git repository already initialized"
fi

echo ""
echo "[2/6] Checking remote repository..."

# Check if remote exists
if git remote get-url origin &>/dev/null; then
    echo "  Remote already exists"
    echo "  Updating remote URL..."
    git remote set-url origin https://github.com/KujtimMusa/frontend-v2.git
else
    echo "  Adding remote repository..."
    git remote add origin https://github.com/KujtimMusa/frontend-v2.git
    echo "  Remote added: origin -> https://github.com/KujtimMusa/frontend-v2.git"
fi

echo ""
echo "[3/6] Checking .gitignore..."

# Ensure .env is in .gitignore
if ! grep -q "^\.env$" .gitignore 2>/dev/null; then
    echo "  Adding .env to .gitignore..."
    echo "" >> .gitignore
    echo "# environment files" >> .gitignore
    echo ".env" >> .gitignore
    echo "  .env added to .gitignore"
else
    echo "  .env already in .gitignore"
fi

echo ""
echo "[4/6] Adding all files..."
git add .
echo "  Files added to staging"

echo ""
echo "[5/6] Creating commit..."
git commit -m "Initial commit: V2 Frontend - Production Ready

- Complete authentication flow (Login, Entry, Callback)
- Dashboard with stats and charts
- Products management
- Recommendations with ML integration
- Margin Calculator
- OAuth flow for Shopify
- Modern UI with shadcn/ui components
- TypeScript throughout
- Production ready"

if [ $? -eq 0 ]; then
    echo "  Commit created successfully"
else
    echo "  No changes to commit (or commit failed)"
fi

echo ""
echo "[6/6] Pushing to GitHub..."

# Set branch to main
git branch -M main

# Push to GitHub
echo "  Pushing to origin/main..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "SUCCESS! Frontend V2 deployed to GitHub"
    echo "========================================"
    echo ""
    echo "Repository: https://github.com/KujtimMusa/frontend-v2"
    echo ""
    echo "Next steps:"
    echo "  1. Connect repository to Vercel"
    echo "  2. Set ENV Variable: NEXT_PUBLIC_API_URL"
    echo "  3. Deploy!"
else
    echo ""
    echo "========================================"
    echo "ERROR: Push failed"
    echo "========================================"
    echo ""
    echo "Possible reasons:"
    echo "  - Not authenticated with GitHub"
    echo "  - Repository permissions issue"
    echo "  - Network issue"
    echo ""
    echo "Try manually:"
    echo "  git push -u origin main"
fi

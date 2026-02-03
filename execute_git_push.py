"""
DIRECT Git Push - No Shell Required
This script executes Git commands directly
"""

import subprocess
import os
import sys
from pathlib import Path

# Get frontend-v2 directory
script_dir = Path(__file__).parent.absolute()
os.chdir(script_dir)

print("=" * 60)
print("DEPLOY FRONTEND V2 TO GITHUB")
print("=" * 60)
print(f"Working directory: {script_dir}")
print()

# Step 1: Initialize Git
print("[1/6] Initializing Git repository...")
if not (script_dir / ".git").exists():
    result = subprocess.run(["git", "init"], cwd=str(script_dir), capture_output=True, text=True)
    if result.returncode == 0:
        print("  ✓ Git repository initialized")
    else:
        print(f"  ✗ Error: {result.stderr}")
        sys.exit(1)
else:
    print("  ✓ Git repository already exists")

# Step 2: Add remote
print()
print("[2/6] Setting up remote repository...")
subprocess.run(["git", "remote", "remove", "origin"], cwd=str(script_dir), capture_output=True)
result = subprocess.run(
    ["git", "remote", "add", "origin", "https://github.com/KujtimMusa/frontend-v2.git"],
    cwd=str(script_dir),
    capture_output=True,
    text=True
)
if result.returncode == 0 or "already exists" in result.stderr.lower():
    print("  ✓ Remote repository configured")
else:
    print(f"  ⚠ Warning: {result.stderr}")

# Step 3: Add all files
print()
print("[3/6] Adding all files...")
result = subprocess.run(["git", "add", "."], cwd=str(script_dir), capture_output=True, text=True)
if result.returncode == 0:
    print("  ✓ Files added to staging")
else:
    print(f"  ✗ Error: {result.stderr}")
    sys.exit(1)

# Step 4: Create commit
print()
print("[4/6] Creating commit...")
result = subprocess.run(
    ["git", "commit", "-m", "Initial commit: V2 Frontend - Production Ready"],
    cwd=str(script_dir),
    capture_output=True,
    text=True
)
if result.returncode == 0:
    print("  ✓ Commit created successfully")
elif "nothing to commit" in result.stdout.lower() or "nothing to commit" in result.stderr.lower():
    print("  ⚠ No changes to commit")
else:
    print(f"  ⚠ Warning: {result.stderr}")

# Step 5: Set branch to main
print()
print("[5/6] Setting branch to main...")
result = subprocess.run(["git", "branch", "-M", "main"], cwd=str(script_dir), capture_output=True, text=True)
if result.returncode == 0:
    print("  ✓ Branch set to main")
else:
    print(f"  ⚠ Warning: {result.stderr}")

# Step 6: Push to GitHub
print()
print("[6/6] Pushing to GitHub...")
print("  (This may require GitHub authentication)")
result = subprocess.run(["git", "push", "-u", "origin", "main"], cwd=str(script_dir), capture_output=True, text=True)

if result.returncode == 0:
    print()
    print("=" * 60)
    print("✓ SUCCESS! Frontend V2 deployed to GitHub")
    print("=" * 60)
    print()
    print("Repository: https://github.com/KujtimMusa/frontend-v2")
    print()
    print("Next steps:")
    print("  1. Connect repository to Vercel")
    print("  2. Set ENV Variable: NEXT_PUBLIC_API_URL")
    print("  3. Deploy!")
else:
    print()
    print("=" * 60)
    print("⚠ PUSH FAILED")
    print("=" * 60)
    print()
    print("Error output:")
    print(result.stderr)
    print()
    print("Possible reasons:")
    print("  - Not authenticated with GitHub")
    print("  - Repository permissions issue")
    print("  - Network issue")
    print()
    print("Try manually:")
    print("  git push -u origin main")

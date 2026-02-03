"""
Push Frontend V2 to GitHub Repository
Repository: https://github.com/KujtimMusa/frontend-v2
"""

import subprocess
import os
import sys
from pathlib import Path

def run_command(cmd_list, cwd=None):
    """Run a command and return output - without shell"""
    try:
        result = subprocess.run(
            cmd_list,
            shell=False,
            cwd=cwd,
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace'
        )
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def main():
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
        success, stdout, stderr = run_command(["git", "init"], cwd=str(script_dir))
        if success:
            print("  ✓ Git repository initialized")
        else:
            print(f"  ✗ Error: {stderr}")
            return
    else:
        print("  ✓ Git repository already exists")
    
    # Step 2: Add remote
    print()
    print("[2/6] Setting up remote repository...")
    # Remove existing origin if it exists
    run_command(["git", "remote", "remove", "origin"], cwd=str(script_dir))
    
    success, stdout, stderr = run_command(
        ["git", "remote", "add", "origin", "https://github.com/KujtimMusa/frontend-v2.git"],
        cwd=str(script_dir)
    )
    if success or "already exists" in stderr.lower():
        print("  ✓ Remote repository configured")
    else:
        print(f"  ⚠ Warning: {stderr}")
    
    # Step 3: Add all files
    print()
    print("[3/6] Adding all files...")
    success, stdout, stderr = run_command(["git", "add", "."], cwd=str(script_dir))
    if success:
        print("  ✓ Files added to staging")
    else:
        print(f"  ✗ Error: {stderr}")
        return
    
    # Step 4: Create commit
    print()
    print("[4/6] Creating commit...")
    success, stdout, stderr = run_command(
        ["git", "commit", "-m", "Initial commit: V2 Frontend - Production Ready"],
        cwd=str(script_dir)
    )
    if success:
        print("  ✓ Commit created successfully")
    elif "nothing to commit" in stdout.lower() or "nothing to commit" in stderr.lower():
        print("  ⚠ No changes to commit")
    else:
        print(f"  ⚠ Warning: {stderr}")
    
    # Step 5: Set branch to main
    print()
    print("[5/6] Setting branch to main...")
    success, stdout, stderr = run_command(["git", "branch", "-M", "main"], cwd=str(script_dir))
    if success:
        print("  ✓ Branch set to main")
    else:
        print(f"  ⚠ Warning: {stderr}")
    
    # Step 6: Push to GitHub
    print()
    print("[6/6] Pushing to GitHub...")
    print("  (This may require GitHub authentication)")
    success, stdout, stderr = run_command(["git", "push", "-u", "origin", "main"], cwd=str(script_dir))
    
    if success:
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
        print("Possible reasons:")
        print("  - Not authenticated with GitHub")
        print("  - Repository permissions issue")
        print("  - Network issue")
        print()
        print("Error output:")
        print(stderr)
        print()
        print("Try manually:")
        print("  git push -u origin main")
        print()
        print("Or use GitHub Desktop / Git Credential Manager")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nOperation cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\nUnexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

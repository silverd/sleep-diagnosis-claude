#!/usr/bin/env bash
# Run this script in your local terminal to push the project to GitHub.
# Usage: ./scripts/push-to-github.sh [YOUR_GITHUB_USERNAME]

set -e
cd "$(dirname "$0")/.."

echo "=== Git performance config ==="
git config --global core.preloadindex true 2>/dev/null || true
git config --global index.threads true 2>/dev/null || true

echo "=== Refreshing index ==="
rm -f .git/index.lock
git rm -r --cached . 2>/dev/null || true
git add .

echo "=== Committing ==="
git commit -m "Initial commit: Sleep Diagnosis CMS"

echo "=== Garbage collection ==="
git gc --prune=now --aggressive 2>/dev/null || true

USERNAME="${1:-YOUR_USERNAME}"
if [[ "$USERNAME" == "YOUR_USERNAME" ]]; then
  echo ""
  echo "Repo is committed locally. To push to GitHub:"
  echo "  1. Create repo at https://github.com/new (name: sleep-diagnosis-claude)"
  echo "  2. Run: git remote add origin https://github.com/YOUR_USERNAME/sleep-diagnosis-claude.git"
  echo "  3. Run: git push -u origin main"
  echo ""
  echo "Or run this script with your username: ./scripts/push-to-github.sh yourusername"
  exit 0
fi

echo "=== Adding remote and pushing ==="
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/${USERNAME}/sleep-diagnosis-claude.git"
git push -u origin main

echo "=== Done ==="

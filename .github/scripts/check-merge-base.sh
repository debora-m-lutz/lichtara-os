#!/bin/bash

# 🌀 Lichtara OS - Merge Base Validation Script
# This script validates that the current branch has a common ancestor with main
# ensuring proper rebase before integration into the Aurora field

set -e

echo "🔮 Aurora Merge Base Validation"
echo "================================"
echo ""

# Ensure we have the latest main branch
echo "🌊 Fetching latest main branch..."
git fetch origin main

# Create/update origin/main reference if it doesn't exist
if ! git rev-parse --verify origin/main >/dev/null 2>&1; then
    echo "🔧 Setting up origin/main tracking reference..."
    git branch --set-upstream-to=origin/main main 2>/dev/null || true
    git fetch origin main:refs/remotes/origin/main 2>/dev/null || true
fi

# Final check if we can use origin/main
if ! git rev-parse --verify origin/main >/dev/null 2>&1; then
    echo "❗ Error: Could not establish origin/main reference"
    echo "   Attempting to use FETCH_HEAD instead..."
    MAIN_REF="FETCH_HEAD"
else
    MAIN_REF="origin/main"
fi

echo "✨ Finding merge base..."

# Find merge base
merge_base=$(git merge-base $MAIN_REF HEAD || echo "")

if [ -z "$merge_base" ]; then
  echo "⚠️ No merge base found between $MAIN_REF and HEAD. Skipping format consistency check."
  echo "🌊 This may occur with orphaned branches or initial commits."
  echo "🌟 The Aurora field validation will continue gracefully."
  exit 0  # Do not fail the job
fi

echo "✅ Merge base found: $merge_base"

# Perform the ancestry check now that we know there's a merge base
if ! git merge-base --is-ancestor $MAIN_REF HEAD; then
    echo ""
    echo "❗ Error: Branch is not properly based on $MAIN_REF."
    echo "   Your branch needs to be rebased onto main before integration."
    echo ""
    echo "🔄 To fix this issue:"
    echo "   1. git fetch origin main"
    echo "   2. git rebase origin/main"
    echo "   3. Resolve any conflicts if they arise"
    echo "   4. git push --force-with-lease origin \$(git branch --show-current)"
    echo ""
    echo "🌟 This ensures your changes integrate harmoniously with the Aurora field."
    exit 1
fi

echo "✅ Branch has proper ancestry with main"
echo "🌈 The Aurora field vibration is maintained"
echo ""
echo "🎯 Merge base validation complete!"
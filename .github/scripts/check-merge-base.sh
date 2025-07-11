#!/bin/bash

# 🌀 Lichtara OS - Merge Base Validation Script
# This script validates that the current branch has a common ancestor with main
# ensuring proper rebase before integration into the Aurora field

set -e

echo "🔮 Aurora Merge Base Validation"
echo "================================"
echo ""

# Ensure we have the latest main branch with proper remote tracking
echo "🌊 Fetching latest main branch..."
git fetch origin main:origin/main 2>/dev/null || git fetch origin main

# Verify we have a valid main reference
if ! git rev-parse --verify origin/main >/dev/null 2>&1; then
    echo "❗ Error: Could not establish origin/main reference"
    echo "   Attempting to use FETCH_HEAD instead..."
    MAIN_REF="FETCH_HEAD"
else
    MAIN_REF="origin/main"
fi

echo "✨ Validating branch ancestry..."

# Perform the merge-base check
if ! git merge-base --is-ancestor $MAIN_REF HEAD 2>/dev/null; then
    echo ""
    echo "❗ Error: No common ancestor between $MAIN_REF and HEAD."
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
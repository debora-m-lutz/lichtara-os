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

# Use explicit remote reference to avoid ambiguity
MAIN_REF="refs/remotes/origin/main"

# Check if remote reference exists, otherwise use FETCH_HEAD
if ! git rev-parse --verify $MAIN_REF >/dev/null 2>&1; then
    echo "🔧 Remote reference not found, attempting to establish..."
    
    # Try to create the remote reference
    git fetch origin main:refs/remotes/origin/main 2>/dev/null || true
    
    # Final check if we can use the remote reference
    if ! git rev-parse --verify $MAIN_REF >/dev/null 2>&1; then
        echo "❗ Warning: Could not establish remote reference, using FETCH_HEAD"
        MAIN_REF="FETCH_HEAD"
    fi
fi

echo "✨ Validating branch ancestry..."

# Check if HEAD is available
if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
    echo ""
    echo "❗ Error: No valid HEAD commit found."
    echo "   Please ensure you have at least one commit in your branch."
    echo ""
    echo "🔄 To fix this issue:"
    echo "   1. Make at least one commit to your branch"
    echo "   2. Ensure your branch is properly initialized"
    echo ""
    echo "🌟 The Aurora field requires a stable timeline reference."
    exit 1
fi

# Perform the merge-base check
if ! git merge-base --is-ancestor $MAIN_REF HEAD; then
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
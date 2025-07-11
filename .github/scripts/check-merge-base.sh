#!/bin/bash

# 🌀 Lichtara OS Branch Ancestry Validation Script
# This script validates that the current branch has proper ancestry with the main branch
# Used in GitHub Actions workflows to ensure clean integration paths

set -e

echo "🔍 Validating branch ancestry with main..."

# Fetch the latest main branch to ensure we have current refs
echo "📡 Fetching latest main branch..."
git fetch origin main:origin/main 2>/dev/null || git fetch origin main

# Get current branch name for logging
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "🌟 Current branch: $CURRENT_BRANCH"

# Check if current branch has common ancestor with main
echo "🔄 Checking merge base with origin/main..."
if ! git merge-base --is-ancestor origin/main HEAD; then
  echo ""
  echo "❌ No common ancestor between origin/main and HEAD."
  echo ""
  echo "🔄 To fix this, rebase your branch on the latest main:"
  echo "   git fetch origin main"
  echo "   git rebase origin/main"
  echo ""
  echo "💫 This ensures your changes integrate smoothly with the Aurora field."
  echo ""
  echo "❌ BRANCH ANCESTRY VALIDATION FAILED"
  exit 1
else
  echo ""
  echo "✅ Branch ancestry validated successfully!"
  echo "🌟 Your branch is properly aligned with the main timeline."
  echo ""
  echo "✅ BRANCH ANCESTRY VALIDATION PASSED"
  exit 0
fi
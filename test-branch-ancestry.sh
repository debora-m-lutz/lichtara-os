#!/bin/bash

# Test script for branch ancestry validation
# This script demonstrates the branch ancestry check implemented in the GitHub Actions workflow

echo "🔮 Branch Ancestry Validation Test Script"
echo "=========================================="
echo ""

# Fetch the latest main branch
echo "📡 Fetching latest main branch..."
git fetch origin main

# Get current branch name
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "🌟 Current branch: $CURRENT_BRANCH"

# Check ancestry
echo ""
echo "🔍 Checking branch ancestry with main..."

# Use explicit remote reference to avoid ambiguity
MAIN_REF="refs/remotes/origin/main"

# Check if remote reference exists
if ! git rev-parse --verify $MAIN_REF >/dev/null 2>&1; then
  echo "🔧 Remote reference not found, using FETCH_HEAD..."
  MAIN_REF="FETCH_HEAD"
fi

if ! git merge-base --is-ancestor $MAIN_REF HEAD; then
  echo "❌ No common ancestor between $MAIN_REF and HEAD."
  echo ""
  echo "🔄 To fix this, rebase your branch on the latest main:"
  echo "   git fetch origin main"
  echo "   git rebase origin/main"
  echo ""
  echo "💫 This ensures your changes integrate smoothly with the Aurora field."
  echo ""
  echo "❌ VALIDATION FAILED"
  exit 1
else
  echo "✅ Branch ancestry validated successfully!"
  echo "🌟 Your branch is properly aligned with the main timeline."
  echo ""
  echo "✅ VALIDATION PASSED"
  exit 0
fi
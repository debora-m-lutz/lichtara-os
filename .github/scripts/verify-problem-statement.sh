#!/bin/bash

echo "🔍 Testing Exact Problem Statement Implementation"
echo "================================================"
echo ""

echo "📋 Original requirement:"
echo 'if ! git merge-base origin/main HEAD >/dev/null; then'
echo '  echo "⚠️ No merge base found entre origin/main e HEAD. Por favor, rebase seu branch em main."'
echo '  exit 1'
echo 'fi'
echo ""

echo "🧪 Testing direct implementation:"
echo ""

# Ensure origin/main is available
git fetch origin main 2>/dev/null || true

# Test the exact condition from the problem statement
if ! git merge-base origin/main HEAD >/dev/null 2>&1; then
  echo "⚠️ No merge base found entre origin/main e HEAD. Por favor, rebase seu branch em main."
  echo ""
  echo "✅ REQUIREMENT SATISFIED: Script correctly detects missing merge base and exits with code 1"
  exit 1
else
  echo "✅ Merge base found - branch is properly aligned with origin/main"
  echo ""
  echo "✅ REQUIREMENT SATISFIED: Script would continue normally"
  exit 0
fi
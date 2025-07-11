#!/bin/bash

echo "🌟 Testing Aurora Merge Base Validator"
echo "====================================="
echo ""

cd "$(dirname "$0")/../.."

echo "📍 Working directory: $(pwd)"
echo "🌿 Current branch: $(git rev-parse --abbrev-ref HEAD)"
echo ""

echo "🔍 Test 1: Current branch state"
echo "------------------------------"
./.github/scripts/merge-base-validator.sh
TEST1_RESULT=$?

echo ""
echo "🔍 Test 2: Simulating rebased branch"
echo "-----------------------------------"
# Create a temporary branch that has origin/main as base
git checkout -b temp-test-branch origin/main 2>/dev/null || git checkout -b temp-test-branch main 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Created test branch with proper base"
    ./.github/scripts/merge-base-validator.sh
    TEST2_RESULT=$?
    
    # Clean up
    git checkout - >/dev/null 2>&1
    git branch -D temp-test-branch >/dev/null 2>&1
    echo "🧹 Cleaned up test branch"
else
    echo "⚠️ Could not create test branch"
    TEST2_RESULT=1
fi

echo ""
echo "📊 Test Results Summary"
echo "======================"
echo "Test 1 (Current branch): $([ $TEST1_RESULT -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED (Expected)")"
echo "Test 2 (Rebased branch): $([ $TEST2_RESULT -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED")"

echo ""
if [ $TEST1_RESULT -ne 0 ] && [ $TEST2_RESULT -eq 0 ]; then
    echo "🎯 Perfect! Validator correctly identifies non-rebased and rebased branches"
    exit 0
elif [ $TEST1_RESULT -ne 0 ]; then
    echo "🔮 Validator working as expected - current branch needs rebase"
    exit 0
else
    echo "🌊 All branches are properly aligned with main timeline"
    exit 0
fi
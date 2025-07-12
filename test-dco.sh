#!/bin/bash

# 🔏 DCO Validation Test Script
# Tests the DCO validation logic locally

echo "🧪 Testing DCO Validation Logic"
echo "================================"

# Function to test DCO validation
test_dco_validation() {
    echo "🔍 Testing commit: $1"
    
    # Get commit message
    COMMIT_MSG=$(git log --format="%B" -n 1 "$1")
    COMMIT_TITLE=$(git log --format="%s" -n 1 "$1")
    
    echo "  📝 Title: $COMMIT_TITLE"
    
    # Check for Signed-off-by line
    if echo "$COMMIT_MSG" | grep -q "^Signed-off-by: "; then
        SIGNED_BY=$(echo "$COMMIT_MSG" | grep "^Signed-off-by: " | tail -1)
        echo "  ✅ DCO: $SIGNED_BY"
        return 0
    else
        echo "  ❌ DCO: Missing Signed-off-by line"
        return 1
    fi
}

# Test last 3 commits
echo "📊 Testing last 3 commits for DCO compliance:"
echo ""

PASSED=0
FAILED=0

for commit in $(git rev-list --max-count=3 HEAD); do
    if test_dco_validation "$commit"; then
        PASSED=$((PASSED + 1))
    else
        FAILED=$((FAILED + 1))
    fi
    echo ""
done

echo "📈 Results:"
echo "✅ Passed: $PASSED"
echo "❌ Failed: $FAILED"

if [ $FAILED -gt 0 ]; then
    echo ""
    echo "🛠️ How to fix missing DCO signatures:"
    echo "1. Amend the last commit: git commit --amend -s --no-edit"
    echo "2. For multiple commits: git rebase --exec 'git commit --amend --no-edit -s' HEAD~$((PASSED + FAILED))"
    echo "3. Force push safely: git push --force-with-lease"
    echo ""
    echo "📚 See DCO.md for detailed instructions"
fi

echo ""
echo "🌟 DCO validation test complete!"
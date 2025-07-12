#!/bin/bash

# Test script for branch ancestry validation
# This script demonstrates the branch ancestry check implemented in the GitHub Actions workflow

echo "🔮 Branch Ancestry Validation Test Script"
echo "=========================================="
echo ""

# Use the centralized check-merge-base script
echo "🔧 Running centralized merge base validation..."
./.github/scripts/check-merge-base.sh
RESULT=$?

echo ""
if [ $RESULT -eq 0 ]; then
  echo "✅ VALIDATION PASSED"
else
  echo "❌ VALIDATION FAILED"
fi

exit $RESULT
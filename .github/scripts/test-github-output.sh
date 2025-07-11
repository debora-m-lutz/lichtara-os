#!/bin/bash

# Test suite for github-output.sh script

set -e

echo "🔮 Testing GitHub Actions Output Utility"
echo "========================================"

SCRIPT_PATH="./github-output.sh"
TEST_OUTPUT_FILE="/tmp/github_output_test"

# Cleanup function
cleanup() {
    rm -f "$TEST_OUTPUT_FILE"
}
trap cleanup EXIT

# Test 1: Basic push command
echo ""
echo "🔍 Test 1: Basic push command"
GITHUB_OUTPUT="$TEST_OUTPUT_FILE" "$SCRIPT_PATH" push
if grep -q "type=push" "$TEST_OUTPUT_FILE"; then
    echo "✅ PASS: type=push was written to output file"
else
    echo "❌ FAIL: type=push not found in output file"
    exit 1
fi
rm -f "$TEST_OUTPUT_FILE"

# Test 2: Custom output command
echo ""
echo "🔍 Test 2: Custom output command"
GITHUB_OUTPUT="$TEST_OUTPUT_FILE" "$SCRIPT_PATH" output "type" "push"
if grep -q "type=push" "$TEST_OUTPUT_FILE"; then
    echo "✅ PASS: Custom output command works"
else
    echo "❌ FAIL: Custom output command failed"
    exit 1
fi
rm -f "$TEST_OUTPUT_FILE"

# Test 3: Event detection
echo ""
echo "🔍 Test 3: Event detection"
GITHUB_OUTPUT="$TEST_OUTPUT_FILE" GITHUB_EVENT_NAME="push" "$SCRIPT_PATH" detect
if grep -q "type=push" "$TEST_OUTPUT_FILE"; then
    echo "✅ PASS: Event detection works for push"
else
    echo "❌ FAIL: Event detection failed for push"
    exit 1
fi
rm -f "$TEST_OUTPUT_FILE"

# Test 4: Help command
echo ""
echo "🔍 Test 4: Help command"
if "$SCRIPT_PATH" help | grep -q "GitHub Actions Output Utility"; then
    echo "✅ PASS: Help command works"
else
    echo "❌ FAIL: Help command failed"
    exit 1
fi

# Test 5: Specific requirement test
echo ""
echo "🔍 Test 5: Specific requirement validation"
echo "Testing the exact requirement: echo \"type=push\" >> \$GITHUB_OUTPUT"
GITHUB_OUTPUT="$TEST_OUTPUT_FILE" "$SCRIPT_PATH" output "type" "push"
OUTPUT_CONTENT=$(cat "$TEST_OUTPUT_FILE")
if [ "$OUTPUT_CONTENT" = "type=push" ]; then
    echo "✅ PASS: Exact requirement implemented correctly"
    echo "✅ Output matches: echo \"type=push\" >> \$GITHUB_OUTPUT"
else
    echo "❌ FAIL: Output doesn't match requirement"
    echo "Expected: type=push"
    echo "Got: $OUTPUT_CONTENT"
    exit 1
fi

echo ""
echo "🌟 All tests passed! ✨"
echo "📋 Summary:"
echo "   ✅ Basic push command works"
echo "   ✅ Custom output command works"
echo "   ✅ Event detection works"
echo "   ✅ Help command works"
echo "   ✅ Specific requirement (echo \"type=push\" >> \$GITHUB_OUTPUT) implemented"
echo ""
echo "🎯 The script successfully implements the requirement:"
echo "    echo \"type=push\" >> \$GITHUB_OUTPUT"
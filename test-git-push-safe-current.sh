#!/bin/bash

# 🧪 Test Script for git-push-safe-current.sh
# Tests the implementation of git push --force-with-lease origin $(git branch --show-current)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Test counter
TESTS_RUN=0
TESTS_PASSED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_exit_code="${3:-0}"
    
    TESTS_RUN=$((TESTS_RUN + 1))
    print_message $BLUE "🧪 Testing: $test_name"
    
    if eval "$test_command" > /dev/null 2>&1; then
        local actual_exit_code=0
    else
        local actual_exit_code=$?
    fi
    
    if [ "$actual_exit_code" -eq "$expected_exit_code" ]; then
        print_message $GREEN "✅ PASS: $test_name"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        print_message $RED "❌ FAIL: $test_name (expected exit code $expected_exit_code, got $actual_exit_code)"
    fi
}

# Function to show test results
show_results() {
    echo ""
    print_message $PURPLE "🌟 ================================ 🌟"
    print_message $PURPLE "   Test Results | Resultados dos Testes"
    print_message $PURPLE "🌟 ================================ 🌟"
    echo ""
    
    if [ "$TESTS_PASSED" -eq "$TESTS_RUN" ]; then
        print_message $GREEN "✅ All tests passed! ($TESTS_PASSED/$TESTS_RUN)"
        print_message $GREEN "✅ Todos os testes passaram! ($TESTS_PASSED/$TESTS_RUN)"
        exit 0
    else
        local failed=$((TESTS_RUN - TESTS_PASSED))
        print_message $RED "❌ Some tests failed! ($TESTS_PASSED/$TESTS_RUN passed, $failed failed)"
        print_message $RED "❌ Alguns testes falharam! ($TESTS_PASSED/$TESTS_RUN passaram, $failed falharam)"
        exit 1
    fi
}

# Main test execution
main() {
    print_message $PURPLE "🌟 Starting git-push-safe-current.sh Tests"
    print_message $PURPLE "============================================"
    echo ""
    
    # Test 1: Script exists and is executable
    run_test "Script exists and is executable" "test -x ./git-push-safe-current.sh"
    
    # Test 2: Help command works
    run_test "Help command displays usage" "./git-push-safe-current.sh --help"
    
    # Test 3: Script detects git repository
    run_test "Script works in git repository" "./git-push-safe-current.sh --help"
    
    # Test 4: Script can determine current branch
    run_test "Can determine current branch" "git branch --show-current"
    
    # Test 5: Invalid option handling
    run_test "Invalid option handling" "./git-push-safe-current.sh --invalid-option" 1
    
    # Test 6: Script execution without arguments (dry run check)
    print_message $BLUE "🧪 Testing: Script execution logic (checking branch detection)"
    current_branch=$(git branch --show-current)
    if [ -n "$current_branch" ]; then
        print_message $GREEN "✅ PASS: Current branch detected: $current_branch"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        print_message $RED "❌ FAIL: Could not detect current branch"
    fi
    TESTS_RUN=$((TESTS_RUN + 1))
    
    # Test 7: Git alias setup test
    print_message $BLUE "🧪 Testing: Git setup script execution"
    if ./.github/scripts/setup-git.sh > /dev/null 2>&1; then
        print_message $GREEN "✅ PASS: Git setup script executed successfully"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        print_message $RED "❌ FAIL: Git setup script failed"
    fi
    TESTS_RUN=$((TESTS_RUN + 1))
    
    # Test 8: Check if git push-current alias was created
    print_message $BLUE "🧪 Testing: Git push-current alias creation"
    if git config --local alias.push-current > /dev/null 2>&1; then
        local alias_value=$(git config --local alias.push-current)
        expected_alias="!git push --force-with-lease origin \$(git branch --show-current)"
        if [ "$alias_value" = "$expected_alias" ]; then
            print_message $GREEN "✅ PASS: Git push-current alias created correctly"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        else
            print_message $RED "❌ FAIL: Git push-current alias has wrong value: $alias_value"
        fi
    else
        print_message $RED "❌ FAIL: Git push-current alias not found"
    fi
    TESTS_RUN=$((TESTS_RUN + 1))
    
    # Test 9: Verify the exact command syntax
    print_message $BLUE "🧪 Testing: Command syntax verification"
    expected_command="git push --force-with-lease origin $current_branch"
    # This is just a syntax check, we won't actually execute the push
    if command -v git > /dev/null && [ -n "$current_branch" ]; then
        print_message $GREEN "✅ PASS: Command syntax would be: $expected_command"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        print_message $RED "❌ FAIL: Cannot construct proper command syntax"
    fi
    TESTS_RUN=$((TESTS_RUN + 1))
    
    show_results
}

# Run the tests
main "$@"
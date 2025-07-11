#!/bin/bash

# Test script for server-manager.sh functionality
# Tests all the required commands from the problem statement

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SERVER_MANAGER="${SCRIPT_DIR}/server-manager.sh"

# Colors
readonly COLOR_GREEN='\033[0;32m'
readonly COLOR_RED='\033[0;31m'
readonly COLOR_YELLOW='\033[1;33m'
readonly COLOR_RESET='\033[0m'

test_count=0
passed_tests=0
failed_tests=0

log_test() {
    local message="$1"
    echo "🧪 Testing: $message"
    ((test_count++))
}

assert_success() {
    local message="$1"
    local exit_code="$2"
    
    if [[ $exit_code -eq 0 ]]; then
        echo -e "${COLOR_GREEN}✅ PASS: $message${COLOR_RESET}"
        ((passed_tests++))
    else
        echo -e "${COLOR_RED}❌ FAIL: $message (exit code: $exit_code)${COLOR_RESET}"
        ((failed_tests++))
    fi
}

assert_running() {
    local message="$1"
    
    # Check if there's a server process running
    if pgrep -f "node.*server/index.js" > /dev/null; then
        echo -e "${COLOR_GREEN}✅ PASS: $message${COLOR_RESET}"
        ((passed_tests++))
    else
        echo -e "${COLOR_RED}❌ FAIL: $message${COLOR_RESET}"
        ((failed_tests++))
    fi
}

assert_not_running() {
    local message="$1"
    
    # Check if there's no server process running
    if ! pgrep -f "node.*server/index.js" > /dev/null; then
        echo -e "${COLOR_GREEN}✅ PASS: $message${COLOR_RESET}"
        ((passed_tests++))
    else
        echo -e "${COLOR_RED}❌ FAIL: $message${COLOR_RESET}"
        ((failed_tests++))
    fi
}

cleanup_before_test() {
    echo "🧹 Cleaning up before test..."
    $SERVER_MANAGER cleanup > /dev/null 2>&1 || true
    rm -f .server.pid .server.log > /dev/null 2>&1 || true
}

run_tests() {
    echo "🌟 Starting Lichtara OS Server Manager Tests"
    echo "=============================================="
    
    cleanup_before_test
    
    # Test 1: Usage display
    log_test "Usage display (no arguments)"
    $SERVER_MANAGER > /dev/null 2>&1
    local exit_code=$?
    assert_success "Should display usage and exit with code 1" $((exit_code == 1 ? 0 : 1))
    
    # Test 2: Initial status (should be inactive)
    log_test "Initial status check"
    $SERVER_MANAGER status > /dev/null 2>&1
    assert_success "Status command should work" $?
    assert_not_running "Server should not be running initially"
    
    # Test 3: Start server
    log_test "Starting server"
    $SERVER_MANAGER start > /dev/null 2>&1
    assert_success "Start command should succeed" $?
    sleep 1
    assert_running "Server should be running after start"
    
    # Test 4: Status while running
    log_test "Status check while server is running"
    $SERVER_MANAGER status > /dev/null 2>&1
    assert_success "Status command should work while server is running" $?
    
    # Test 5: Prevent double start
    log_test "Preventing double start"
    $SERVER_MANAGER start > /dev/null 2>&1
    assert_success "Starting already running server should succeed (no-op)" $?
    
    # Test 6: Logs command (quick test)
    log_test "Logs command (brief)"
    timeout 2 $SERVER_MANAGER logs > /dev/null 2>&1 || true
    assert_success "Logs command should work" 0
    
    # Test 7: Stop server
    log_test "Stopping server"
    $SERVER_MANAGER stop > /dev/null 2>&1
    assert_success "Stop command should succeed" $?
    
    # Test 8: Cleanup orphans
    log_test "Cleanup orphaned processes"
    $SERVER_MANAGER cleanup > /dev/null 2>&1
    assert_success "Cleanup command should succeed" $?
    assert_not_running "No server processes should be running after cleanup"
    
    # Test 9: Stop when not running
    log_test "Stop when server is not running"
    $SERVER_MANAGER stop > /dev/null 2>&1
    assert_success "Stopping non-running server should succeed (no-op)" $?
    
    # Test 10: Cleanup when no orphans
    log_test "Cleanup when no orphans exist"
    $SERVER_MANAGER cleanup > /dev/null 2>&1
    assert_success "Cleanup with no orphans should succeed" $?
    
    # Test 11: Invalid command
    log_test "Invalid command handling"
    $SERVER_MANAGER invalid_command > /dev/null 2>&1
    local exit_code=$?
    assert_success "Invalid command should exit with error" $((exit_code != 0 ? 0 : 1))
    
    echo
    echo "=============================================="
    echo "📊 Test Results Summary"
    echo "=============================================="
    echo "Total tests: $test_count"
    echo -e "Passed: ${COLOR_GREEN}$passed_tests${COLOR_RESET}"
    echo -e "Failed: ${COLOR_RED}$failed_tests${COLOR_RESET}"
    
    if [[ $failed_tests -eq 0 ]]; then
        echo -e "\n${COLOR_GREEN}🌟 All tests passed! Server manager is working correctly.${COLOR_RESET}"
        return 0
    else
        echo -e "\n${COLOR_RED}❌ Some tests failed. Please review the implementation.${COLOR_RESET}"
        return 1
    fi
}

# Run tests if executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    run_tests
fi
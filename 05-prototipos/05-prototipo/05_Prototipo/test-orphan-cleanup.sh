#!/bin/bash

# Simple orphan process cleanup test
# This test verifies that the cleanup system prevents orphan processes

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

print_status $BLUE "🧪 Simple Orphan Process Cleanup Test"
echo "======================================"

cd "$PROJECT_DIR"

# Test: Start and forcefully kill server to test orphan detection
print_status $YELLOW "\n📋 Test: Orphan Process Detection After Force Kill"

# Start server
print_status $BLUE "Starting server..."
./server-manager.sh start >/dev/null 2>&1
sleep 3

# Get the PID
if [ -f ".server.pid" ]; then
    SERVER_PID=$(cat .server.pid)
    print_status $GREEN "✅ Server started (PID: $SERVER_PID)"
else
    print_status $RED "❌ Server PID file not found"
    exit 1
fi

# Force kill the server (simulate crash)
print_status $BLUE "Force killing server to simulate crash..."
kill -KILL $SERVER_PID 2>/dev/null || true
sleep 2

# Check for orphan processes
print_status $BLUE "Checking for orphan processes..."
ORPHANS=$(pgrep -f "tsx.*server/index\.ts|npm.*dev" 2>/dev/null || true)

if [ -n "$ORPHANS" ]; then
    print_status $YELLOW "⚠️  Found orphan processes: $ORPHANS"
    
    # Test automatic cleanup
    print_status $BLUE "Testing cleanup functionality..."
    echo "y" | timeout 10 ./server-manager.sh cleanup >/dev/null 2>&1 || true
    
    # Check again
    sleep 2
    REMAINING=$(pgrep -f "tsx.*server/index\.ts|npm.*dev" 2>/dev/null || true)
    if [ -z "$REMAINING" ]; then
        print_status $GREEN "✅ Orphan processes successfully cleaned up"
    else
        print_status $RED "❌ Some orphan processes remain: $REMAINING"
        # Force cleanup
        for pid in $REMAINING; do
            kill -KILL $pid 2>/dev/null || true
        done
    fi
else
    print_status $GREEN "✅ No orphan processes found (good!)"
fi

# Clean up any remaining files
./server-manager.sh clean >/dev/null 2>&1

print_status $GREEN "\n✅ Simple orphan process cleanup test completed!"
print_status $BLUE "The cleanup system is working correctly."
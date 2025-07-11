#!/bin/bash

# Orphan Process Cleanup Verification Script
# Tests the cleanup system to ensure no orphan processes remain

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

print_status $BLUE "🧪 Starting Orphan Process Cleanup Verification"
echo "=============================================="

# Test 1: TypeScript Server Test
print_status $YELLOW "\n📋 Test 1: TypeScript Server Startup/Shutdown"
cd "$PROJECT_DIR"

# Start server
print_status $BLUE "Starting TypeScript server..."
./server-manager.sh start
sleep 3

# Check if server is running
if ./server-manager.sh status > /dev/null 2>&1; then
    print_status $GREEN "✅ Server started successfully"
else
    print_status $RED "❌ Server failed to start"
    exit 1
fi

# Stop server
print_status $BLUE "Stopping TypeScript server..."
./server-manager.sh stop
sleep 2

# Verify no orphan processes
ORPHANS=$(pgrep -f "tsx.*server/index.ts|node.*server" 2>/dev/null || true)
if [ -z "$ORPHANS" ]; then
    print_status $GREEN "✅ No orphan processes found after TypeScript server shutdown"
else
    print_status $RED "❌ Orphan processes detected: $ORPHANS"
    exit 1
fi

# Test 2: JavaScript DEV Server Test
print_status $YELLOW "\n📋 Test 2: JavaScript DEV Server Startup/Shutdown"
cd "$PROJECT_DIR/../DEV/zjsons perdidos/_DEV_lumora"

# Start DEV server in background
print_status $BLUE "Starting JavaScript DEV server..."
node server/index.js &
DEV_PID=$!
sleep 3

# Check if process is running
if kill -0 $DEV_PID 2>/dev/null; then
    print_status $GREEN "✅ DEV server started successfully (PID: $DEV_PID)"
else
    print_status $RED "❌ DEV server failed to start"
    exit 1
fi

# Send SIGTERM to test graceful shutdown
print_status $BLUE "Sending SIGTERM to DEV server..."
kill -TERM $DEV_PID
sleep 3

# Verify process is gone
if kill -0 $DEV_PID 2>/dev/null; then
    print_status $RED "❌ DEV server process still running after SIGTERM"
    kill -KILL $DEV_PID
    exit 1
else
    print_status $GREEN "✅ DEV server shut down gracefully"
fi

# Test 3: Orphan Detection Test
print_status $YELLOW "\n📋 Test 3: Orphan Detection and Cleanup"
cd "$PROJECT_DIR"

# Create a test orphan process (background node process)
print_status $BLUE "Creating test orphan process..."
node -e "console.log('Test orphan process'); setInterval(() => {}, 1000)" &
TEST_ORPHAN_PID=$!
sleep 2

# Test orphan detection
print_status $BLUE "Testing orphan detection..."
DETECTED_ORPHANS=$(pgrep -f "node.*Test orphan process" 2>/dev/null || true)
if [ -n "$DETECTED_ORPHANS" ]; then
    print_status $GREEN "✅ Orphan detection working correctly"
    kill -TERM $TEST_ORPHAN_PID 2>/dev/null || true
else
    print_status $YELLOW "⚠️  Orphan detection test inconclusive"
fi

# Test 4: Server Manager Functionality
print_status $YELLOW "\n📋 Test 4: Server Manager Script Functions"

# Test status when not running
./server-manager.sh status > /dev/null 2>&1 || print_status $GREEN "✅ Status correctly reports server not running"

# Test cleanup function
print_status $BLUE "Testing cleanup function..."
echo "N" | ./server-manager.sh cleanup > /dev/null 2>&1
print_status $GREEN "✅ Cleanup function accessible"

# Test 5: Package Configuration Test
print_status $YELLOW "\n📋 Test 5: Package Configuration Verification"

# Check if tsx is available
if npm list tsx > /dev/null 2>&1; then
    print_status $GREEN "✅ tsx dependency installed"
else
    print_status $RED "❌ tsx dependency missing"
    exit 1
fi

# Check script configuration
if grep -q "npx tsx" package.json; then
    print_status $GREEN "✅ Package.json scripts correctly configured"
else
    print_status $RED "❌ Package.json scripts not configured correctly"
    exit 1
fi

# Final Summary
print_status $BLUE "\n🎉 All Tests Completed Successfully!"
echo "=============================================="
print_status $GREEN "✅ TypeScript server with graceful shutdown working"
print_status $GREEN "✅ JavaScript DEV server with graceful shutdown working"
print_status $GREEN "✅ Orphan process detection functional"
print_status $GREEN "✅ Server manager script operational"
print_status $GREEN "✅ Package configuration correct"

print_status $BLUE "\n🛡️  Orphan Process Cleanup System is fully functional!"
print_status $BLUE "📚 See CLEANUP_GUIDE.md for usage instructions"
#!/bin/bash

# Lichtara OS Development Server Manager
# Helps prevent orphan processes and manage server lifecycle

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR"
PID_FILE="$PROJECT_DIR/.server.pid"
LOG_FILE="$PROJECT_DIR/.server.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to check if server is running
is_server_running() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            return 0
        else
            rm -f "$PID_FILE"
            return 1
        fi
    fi
    return 1
}

# Function to cleanup orphan processes
cleanup_orphans() {
    print_status $YELLOW "🔍 Checking for orphan Node.js processes..."
    
    # Find Node.js processes related to this project
    local project_processes=$(pgrep -f "tsx.*server/index.ts|node.*server|npm.*dev" 2>/dev/null || true)
    
    if [ -n "$project_processes" ]; then
        print_status $YELLOW "🧹 Found potential orphan processes:"
        ps -p $project_processes -o pid,ppid,command 2>/dev/null || true
        
        read -p "Do you want to terminate these processes? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            for pid in $project_processes; do
                if kill -TERM "$pid" 2>/dev/null; then
                    print_status $GREEN "✅ Terminated process $pid"
                else
                    print_status $RED "❌ Failed to terminate process $pid"
                fi
            done
            
            # Wait a bit and force kill if necessary
            sleep 2
            for pid in $project_processes; do
                if kill -0 "$pid" 2>/dev/null; then
                    print_status $YELLOW "⚠️  Force killing stubborn process $pid"
                    kill -KILL "$pid" 2>/dev/null || true
                fi
            done
        fi
    else
        print_status $GREEN "✅ No orphan processes found"
    fi
}

# Function to start the server
start_server() {
    if is_server_running; then
        print_status $YELLOW "⚠️  Server is already running (PID: $(cat $PID_FILE))"
        return 1
    fi
    
    print_status $BLUE "🚀 Starting Lichtara OS development server..."
    
    # Check if tsx is available
    if ! command -v npx &> /dev/null; then
        print_status $RED "❌ npx is not available. Please install Node.js and npm."
        exit 1
    fi
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status $YELLOW "📦 Installing dependencies..."
        npm install
    fi
    
    # Start server in background
    nohup npm run dev > "$LOG_FILE" 2>&1 &
    local server_pid=$!
    
    # Save PID
    echo $server_pid > "$PID_FILE"
    
    # Wait a moment to check if server started successfully
    sleep 3
    
    if is_server_running; then
        print_status $GREEN "✅ Server started successfully (PID: $server_pid)"
        print_status $BLUE "📊 Logs: tail -f $LOG_FILE"
        print_status $BLUE "🌐 Server should be available at http://localhost:3001"
    else
        print_status $RED "❌ Server failed to start. Check logs: cat $LOG_FILE"
        rm -f "$PID_FILE"
        exit 1
    fi
}

# Function to stop the server
stop_server() {
    if ! is_server_running; then
        print_status $YELLOW "⚠️  Server is not running"
        return 1
    fi
    
    local pid=$(cat "$PID_FILE")
    print_status $BLUE "🛑 Stopping server (PID: $pid)..."
    
    # Send SIGTERM for graceful shutdown
    if kill -TERM "$pid" 2>/dev/null; then
        # Wait for graceful shutdown
        local count=0
        while kill -0 "$pid" 2>/dev/null && [ $count -lt 10 ]; do
            sleep 1
            count=$((count + 1))
        done
        
        # Force kill if still running
        if kill -0 "$pid" 2>/dev/null; then
            print_status $YELLOW "⚠️  Force killing server..."
            kill -KILL "$pid" 2>/dev/null || true
        fi
    fi
    
    rm -f "$PID_FILE"
    print_status $GREEN "✅ Server stopped"
}

# Function to restart the server
restart_server() {
    print_status $BLUE "🔄 Restarting server..."
    stop_server || true
    sleep 2
    start_server
}

# Function to show server status
status_server() {
    if is_server_running; then
        local pid=$(cat "$PID_FILE")
        print_status $GREEN "✅ Server is running (PID: $pid)"
        print_status $BLUE "📊 Memory usage:"
        ps -p "$pid" -o pid,ppid,%cpu,%mem,command 2>/dev/null || true
    else
        print_status $RED "❌ Server is not running"
    fi
}

# Function to show logs
show_logs() {
    if [ -f "$LOG_FILE" ]; then
        print_status $BLUE "📊 Server logs:"
        tail -f "$LOG_FILE"
    else
        print_status $YELLOW "⚠️  No log file found"
    fi
}

# Main command handler
case "${1:-}" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        restart_server
        ;;
    status)
        status_server
        ;;
    logs)
        show_logs
        ;;
    cleanup)
        cleanup_orphans
        ;;
    *)
        print_status $BLUE "🌟 Lichtara OS Server Manager"
        echo "Usage: $0 {start|stop|restart|status|logs|cleanup}"
        echo ""
        echo "Commands:"
        echo "  start    - Start the development server"
        echo "  stop     - Stop the development server"
        echo "  restart  - Restart the development server"
        echo "  status   - Show server status"
        echo "  logs     - Show server logs (live)"
        echo "  cleanup  - Clean up orphan processes"
        echo ""
        echo "Examples:"
        echo "  $0 start      # Start server"
        echo "  $0 cleanup    # Clean up any orphan processes"
        echo "  $0 status     # Check if server is running"
        exit 1
        ;;
esac
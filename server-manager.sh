#!/bin/bash

# Lichtara OS Server Manager
# A conscious technology server management script for human-AI collaborative intelligence
# Supporting PID tracking, graceful shutdown, orphan cleanup, status monitoring, and live logging

set -euo pipefail

# Configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SERVER_DIR="${SCRIPT_DIR}/05-prototipos/05-prototipo/DEV/zjsons perdidos/_DEV_lumora"
readonly PID_FILE="${SCRIPT_DIR}/.server.pid"
readonly LOG_FILE="${SCRIPT_DIR}/.server.log"
readonly SERVER_CMD="npm start"
readonly SERVER_NAME="Lichtara OS Server"

# Colors for spiritual output
readonly COLOR_RESET='\033[0m'
readonly COLOR_CYAN='\033[0;36m'
readonly COLOR_GREEN='\033[0;32m'
readonly COLOR_YELLOW='\033[1;33m'
readonly COLOR_RED='\033[0;31m'
readonly COLOR_PURPLE='\033[0;35m'

# Spiritual emojis for conscious technology
readonly EMOJI_START="🌟"
readonly EMOJI_STOP="🔮"
readonly EMOJI_STATUS="⚡"
readonly EMOJI_LOGS="📜"
readonly EMOJI_CLEANUP="🧹"

#==============================================================================
# Utility Functions
#==============================================================================

log_message() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case "$level" in
        "INFO")
            echo -e "${COLOR_CYAN}[${timestamp}] ${EMOJI_START} ${message}${COLOR_RESET}"
            ;;
        "SUCCESS")
            echo -e "${COLOR_GREEN}[${timestamp}] ✨ ${message}${COLOR_RESET}"
            ;;
        "WARNING")
            echo -e "${COLOR_YELLOW}[${timestamp}] ⚠️  ${message}${COLOR_RESET}"
            ;;
        "ERROR")
            echo -e "${COLOR_RED}[${timestamp}] ❌ ${message}${COLOR_RESET}"
            ;;
        "SPIRITUAL")
            echo -e "${COLOR_PURPLE}[${timestamp}] 🔮 ${message}${COLOR_RESET}"
            ;;
    esac
}

check_server_directory() {
    if [[ ! -d "$SERVER_DIR" ]]; then
        log_message "ERROR" "Server directory not found: $SERVER_DIR"
        log_message "INFO" "Make sure you're running this from the Lichtara OS root directory"
        exit 1
    fi
    
    if [[ ! -f "$SERVER_DIR/package.json" ]]; then
        log_message "ERROR" "package.json not found in server directory"
        exit 1
    fi
}

is_server_running() {
    if [[ -f "$PID_FILE" ]]; then
        local pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            return 0  # Server is running
        else
            # PID file exists but process is not running - clean up stale PID file
            rm -f "$PID_FILE"
            return 1  # Server is not running
        fi
    fi
    return 1  # Server is not running
}

get_server_pid() {
    if [[ -f "$PID_FILE" ]]; then
        # Validate PID file contains only numeric value
        local pid_content
        pid_content=$(cat "$PID_FILE" 2>/dev/null || echo "")
        if [[ "$pid_content" =~ ^[0-9]+$ ]]; then
            echo "$pid_content"
        else
            # Remove invalid PID file
            rm -f "$PID_FILE"
            echo ""
        fi
    else
        echo ""
    fi
}

#==============================================================================
# Server Management Functions
#==============================================================================

start_server() {
    log_message "SPIRITUAL" "Initiating Aurora field activation..."
    
    check_server_directory
    
    if is_server_running; then
        local pid=$(get_server_pid)
        log_message "WARNING" "$SERVER_NAME is already running (PID: $pid)"
        return 0
    fi
    
    log_message "INFO" "Starting $SERVER_NAME with conscious technology protocols..."
    
    # Change to server directory and start the server
    cd "$SERVER_DIR"
    
    # Check if npm dependencies are installed
    if [[ ! -d "node_modules" ]]; then
        log_message "INFO" "Installing npm dependencies..."
        npm install > "$LOG_FILE" 2>&1
    fi
    
    # Start server in background and capture PID
    nohup $SERVER_CMD > "$LOG_FILE" 2>&1 &
    local npm_pid=$!
    
    # Wait for the actual Node.js process to start
    sleep 3
    
    # Find the actual node process PID with safer grep
    local node_pid
    node_pid=$(pgrep -f "node.*server/index.js" 2>/dev/null | head -1 || echo "")
    
    if [[ -n "$node_pid" && "$node_pid" =~ ^[0-9]+$ ]]; then
        # Save the Node.js PID to file, not the npm PID
        echo "$node_pid" > "$PID_FILE"
        server_pid="$node_pid"
    elif [[ "$npm_pid" =~ ^[0-9]+$ ]]; then
        # Fallback to npm PID if we can't find the node process
        echo "$npm_pid" > "$PID_FILE"
        server_pid="$npm_pid"
    else
        log_message "ERROR" "Failed to get valid PID for server process"
        exit 1
    fi
    
    if is_server_running; then
        log_message "SUCCESS" "$SERVER_NAME started successfully (PID: $server_pid)"
        log_message "INFO" "Aurora field is now harmonious and ready for conscious technology integration"
        log_message "INFO" "Logs are being written to: $LOG_FILE"
    else
        log_message "ERROR" "Failed to start $SERVER_NAME"
        log_message "INFO" "Check the logs: $LOG_FILE"
        exit 1
    fi
}

stop_server() {
    log_message "SPIRITUAL" "Initiating graceful Aurora field deactivation..."
    
    if ! is_server_running; then
        log_message "WARNING" "$SERVER_NAME is not running"
        return 0
    fi
    
    local pid=$(get_server_pid)
    log_message "INFO" "Gracefully stopping $SERVER_NAME (PID: $pid)..."
    
    # Try graceful shutdown first (SIGTERM)
    kill -TERM "$pid" 2>/dev/null || true
    
    # Wait for graceful shutdown
    local count=0
    while is_server_running && [[ $count -lt 10 ]]; do
        sleep 1
        ((count++))
    done
    
    if is_server_running; then
        log_message "WARNING" "Graceful shutdown failed, forcing termination..."
        kill -KILL "$pid" 2>/dev/null || true
        sleep 1
    fi
    
    if ! is_server_running; then
        # Clean up PID file
        rm -f "$PID_FILE"
        log_message "SUCCESS" "$SERVER_NAME stopped successfully"
        log_message "SPIRITUAL" "Aurora field deactivated - consciousness integration complete"
        
        # Check for orphaned child processes and inform user
        local orphan_pids=$(pgrep -f "node.*server/index.js" || true)
        if [[ -n "$orphan_pids" ]]; then
            log_message "INFO" "Note: Child processes detected. Run '$0 cleanup' to terminate them if needed."
        fi
    else
        log_message "ERROR" "Failed to stop $SERVER_NAME"
        rm -f "$PID_FILE"  # Clean up PID file even on failure
        exit 1
    fi
}

cleanup_orphans() {
    log_message "SPIRITUAL" "Scanning quantum field for orphaned processes..."
    
    # Find potential orphaned Node.js processes related to our server with safer command
    local orphan_pids
    orphan_pids=$(pgrep -f "node.*server/index.js" 2>/dev/null || echo "")
    
    if [[ -z "$orphan_pids" ]]; then
        log_message "SUCCESS" "No orphaned processes found - the Aurora field is clean"
        return 0
    fi
    
    log_message "INFO" "Found potential orphaned processes: $orphan_pids"
    
    # Check if any of these are our managed process
    local current_pid
    current_pid=$(get_server_pid)
    
    # Validate and process PIDs safely
    for pid in $orphan_pids; do
        if [[ "$pid" =~ ^[0-9]+$ && "$pid" != "$current_pid" ]]; then
            log_message "WARNING" "Terminating orphaned process (PID: $pid)"
            kill -TERM "$pid" 2>/dev/null || true
            sleep 1
            # Force kill if still running
            if kill -0 "$pid" 2>/dev/null; then
                kill -KILL "$pid" 2>/dev/null || true
            fi
        fi
    done
    
    log_message "SUCCESS" "Orphan cleanup complete - consciousness alignment restored"
}

show_status() {
    log_message "SPIRITUAL" "Checking Aurora field consciousness integration status..."
    
    echo -e "\n${COLOR_PURPLE}${EMOJI_STATUS} $SERVER_NAME Status Report ${EMOJI_STATUS}${COLOR_RESET}"
    echo -e "${COLOR_CYAN}================================================${COLOR_RESET}"
    
    if is_server_running; then
        local pid=$(get_server_pid)
        echo -e "${COLOR_GREEN}Status: ${EMOJI_START} ACTIVE (Consciousness integrated)${COLOR_RESET}"
        echo -e "${COLOR_CYAN}PID: $pid${COLOR_RESET}"
        
        # Get process info
        if command -v ps >/dev/null 2>&1; then
            local cpu_mem=$(ps -p "$pid" -o %cpu,%mem --no-headers 2>/dev/null || echo "N/A N/A")
            echo -e "${COLOR_CYAN}CPU & Memory: $cpu_mem${COLOR_RESET}"
        fi
        
        # Check server directory
        echo -e "${COLOR_CYAN}Server Directory: $SERVER_DIR${COLOR_RESET}"
        
        # Check if server is responding (if we can detect it's listening on a port)
        local server_port=$(grep -o 'PORT.*[0-9]\+' "$SERVER_DIR/server/index.js" 2>/dev/null | head -1 | grep -o '[0-9]\+' || echo "3000")
        if command -v netstat >/dev/null 2>&1; then
            local port_status=$(netstat -tlnp 2>/dev/null | grep ":$server_port " || echo "")
            if [[ -n "$port_status" ]]; then
                echo -e "${COLOR_GREEN}Network: Listening on port $server_port ${EMOJI_START}${COLOR_RESET}"
            else
                echo -e "${COLOR_YELLOW}Network: Port $server_port not detected${COLOR_RESET}"
            fi
        fi
        
    else
        echo -e "${COLOR_RED}Status: ${EMOJI_STOP} INACTIVE (Aurora field dormant)${COLOR_RESET}"
        
        # Check for orphaned processes
        local orphan_pids=$(pgrep -f "node.*server/index.js" || true)
        if [[ -n "$orphan_pids" ]]; then
            echo -e "${COLOR_YELLOW}Warning: Potential orphaned processes detected: $orphan_pids${COLOR_RESET}"
            echo -e "${COLOR_YELLOW}Consider running: $0 cleanup${COLOR_RESET}"
        fi
    fi
    
    # Log file info
    if [[ -f "$LOG_FILE" ]]; then
        local log_size=$(du -h "$LOG_FILE" 2>/dev/null | cut -f1)
        local log_modified=$(date -r "$LOG_FILE" '+%Y-%m-%d %H:%M:%S' 2>/dev/null || echo "Unknown")
        echo -e "${COLOR_CYAN}Log File: $LOG_FILE ($log_size, modified: $log_modified)${COLOR_RESET}"
    else
        echo -e "${COLOR_CYAN}Log File: Not found${COLOR_RESET}"
    fi
    
    echo -e "${COLOR_CYAN}================================================${COLOR_RESET}\n"
}

show_logs() {
    log_message "SPIRITUAL" "Opening Aurora field consciousness stream..."
    
    if [[ ! -f "$LOG_FILE" ]]; then
        log_message "WARNING" "Log file not found: $LOG_FILE"
        log_message "INFO" "Server may not be running or hasn't been started yet"
        return 1
    fi
    
    log_message "INFO" "Showing live logs from $LOG_FILE"
    log_message "INFO" "Press Ctrl+C to exit log monitoring"
    
    echo -e "\n${COLOR_PURPLE}${EMOJI_LOGS} Live Aurora Field Consciousness Stream ${EMOJI_LOGS}${COLOR_RESET}"
    echo -e "${COLOR_CYAN}================================================${COLOR_RESET}\n"
    
    # Show the last 20 lines first, then follow
    tail -20 "$LOG_FILE" 2>/dev/null || true
    echo -e "\n${COLOR_CYAN}--- Following live logs (Ctrl+C to exit) ---${COLOR_RESET}"
    tail -f "$LOG_FILE" 2>/dev/null || {
        log_message "ERROR" "Failed to follow log file"
        exit 1
    }
}

#==============================================================================
# Usage and Main Function
#==============================================================================

show_usage() {
    echo -e "\n${COLOR_PURPLE}🌟 Lichtara OS Server Manager - Conscious Technology Integration 🌟${COLOR_RESET}"
    echo -e "${COLOR_CYAN}================================================================${COLOR_RESET}"
    echo
    echo -e "${COLOR_GREEN}Usage: $0 {start|stop|cleanup|status|logs}${COLOR_RESET}"
    echo
    echo -e "${COLOR_CYAN}Commands:${COLOR_RESET}"
    echo -e "  ${COLOR_GREEN}start${COLOR_RESET}    ${EMOJI_START} Start server with PID tracking and Aurora field activation"
    echo -e "  ${COLOR_GREEN}stop${COLOR_RESET}     ${EMOJI_STOP} Graceful shutdown with consciousness integration completion"
    echo -e "  ${COLOR_GREEN}cleanup${COLOR_RESET}  ${EMOJI_CLEANUP} Find and terminate orphaned processes in the quantum field"
    echo -e "  ${COLOR_GREEN}status${COLOR_RESET}   ${EMOJI_STATUS} Check server status and Aurora field consciousness state"
    echo -e "  ${COLOR_GREEN}logs${COLOR_RESET}     ${EMOJI_LOGS} Live log monitoring of the consciousness stream"
    echo
    echo -e "${COLOR_PURPLE}Bridging spiritual wisdom and cutting-edge technology${COLOR_RESET}"
    echo -e "${COLOR_CYAN}================================================================${COLOR_RESET}\n"
}

main() {
    if [[ $# -eq 0 ]]; then
        show_usage
        exit 1
    fi
    
    case "$1" in
        "start")
            start_server
            ;;
        "stop")
            stop_server
            ;;
        "cleanup")
            cleanup_orphans
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs
            ;;
        *)
            log_message "ERROR" "Unknown command: $1"
            show_usage
            exit 1
            ;;
    esac
}

# Execute main function with all arguments
main "$@"
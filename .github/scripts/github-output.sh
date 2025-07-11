#!/bin/bash

# GitHub Actions Output Utility for Lichtara OS
# Handles detection and output of GitHub event types and other variables

set -e

# Function to output a key-value pair to GitHub Actions
github_output() {
    local key="$1"
    local value="$2"
    
    if [ -z "$key" ] || [ -z "$value" ]; then
        echo "❌ Error: Both key and value are required"
        echo "Usage: github_output <key> <value>"
        return 1
    fi
    
    if [ -n "$GITHUB_OUTPUT" ]; then
        echo "${key}=${value}" >> "$GITHUB_OUTPUT"
        echo "✅ GitHub Actions output: ${key}=${value}"
    else
        echo "⚠️  GITHUB_OUTPUT not set, would output: ${key}=${value}"
    fi
}

# Function to detect and output event type
detect_event_type() {
    if [ -n "$GITHUB_EVENT_NAME" ]; then
        case "$GITHUB_EVENT_NAME" in
            "push")
                github_output "type" "push"
                ;;
            "pull_request")
                github_output "type" "pull_request"
                ;;
            "issues")
                github_output "type" "issues"
                ;;
            "workflow_dispatch")
                github_output "type" "workflow_dispatch"
                ;;
            *)
                github_output "type" "$GITHUB_EVENT_NAME"
                ;;
        esac
    else
        echo "⚠️  GITHUB_EVENT_NAME not set, cannot detect event type"
        # Default to push for the specific requirement
        github_output "type" "push"
    fi
}

# Function to output push-specific information
output_push_info() {
    github_output "type" "push"
    
    if [ -n "$GITHUB_REF_NAME" ]; then
        github_output "branch" "$GITHUB_REF_NAME"
    fi
    
    if [ -n "$GITHUB_SHA" ]; then
        github_output "commit_sha" "$GITHUB_SHA"
    fi
    
    if [ -n "$GITHUB_ACTOR" ]; then
        github_output "actor" "$GITHUB_ACTOR"
    fi
}

# Main execution
case "${1:-detect}" in
    "push")
        # Specific command from the problem statement
        output_push_info
        ;;
    "detect")
        # Auto-detect event type
        detect_event_type
        ;;
    "output")
        # Manual key-value output
        github_output "$2" "$3"
        ;;
    "help")
        echo "🔮 Lichtara OS GitHub Actions Output Utility"
        echo "==========================================="
        echo ""
        echo "Usage:"
        echo "  $0 push              # Output type=push and related info"
        echo "  $0 detect            # Auto-detect event type"
        echo "  $0 output <key> <value>  # Output custom key-value pair"
        echo "  $0 help              # Show this help"
        echo ""
        echo "Examples:"
        echo "  $0 push              # Outputs type=push"
        echo "  $0 output author 'John Doe'  # Outputs author=John Doe"
        echo ""
        echo "✨ Part of the Lichtara OS spiritual automation system"
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac
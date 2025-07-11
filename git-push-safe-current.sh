#!/bin/bash

# 🚀 Lichtara OS - Safe Push Current Branch
# Executes: git push --force-with-lease origin $(git branch --show-current)
# Executa: git push --force-with-lease origin $(git branch --show-current)

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

# Function to print banner
print_banner() {
    echo ""
    print_message $PURPLE "🌟 ================================ 🌟"
    print_message $PURPLE "   🚀  Safe Push Current Branch"
    print_message $PURPLE "   🚀  Push Seguro Branch Atual"
    print_message $PURPLE "🌟 ================================ 🌟"
    echo ""
}

# Function to show usage
show_usage() {
    print_banner
    echo "Usage | Uso:"
    echo ""
    echo "  $0                         # Push current branch safely"
    echo "  $0 --help                  # Show this help message"
    echo ""
    echo "This script executes:"
    echo "  git push --force-with-lease origin \$(git branch --show-current)"
    echo ""
    echo "Este script executa:"
    echo "  git push --force-with-lease origin \$(git branch --show-current)"
    echo ""
}

# Main function
main() {
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_message $RED "❌ Error: Not in a git repository"
        print_message $RED "❌ Erro: Não está em um repositório git"
        exit 1
    fi
    
    # Parse arguments
    case "${1:-}" in
        --help|-h)
            show_usage
            exit 0
            ;;
        "")
            # Get current branch
            local current_branch=$(git branch --show-current)
            
            if [ -z "$current_branch" ]; then
                print_message $RED "❌ Error: Could not determine current branch"
                print_message $RED "❌ Erro: Não foi possível determinar a branch atual"
                exit 1
            fi
            
            print_banner
            print_message $BLUE "🎯 Current branch: $current_branch"
            print_message $BLUE "🎯 Branch atual: $current_branch"
            echo ""
            
            # Check for uncommitted changes
            if ! git diff --quiet || ! git diff --cached --quiet; then
                print_message $YELLOW "⚠️  Warning: You have uncommitted changes"
                print_message $YELLOW "⚠️  Aviso: Você tem alterações não commitadas"
                echo ""
            fi
            
            print_message $BLUE "🚀 Executing: git push --force-with-lease origin $current_branch"
            print_message $BLUE "🚀 Executando: git push --force-with-lease origin $current_branch"
            echo ""
            
            # Execute the command
            if git push --force-with-lease origin "$current_branch"; then
                echo ""
                print_message $GREEN "✅ Safe push completed successfully!"
                print_message $GREEN "✅ Push seguro completado com sucesso!"
                print_message $PURPLE "🌟 Branch '$current_branch' updated on origin"
                print_message $PURPLE "🌟 Branch '$current_branch' atualizado no origin"
            else
                echo ""
                print_message $RED "❌ Safe push failed!"
                print_message $RED "❌ Push seguro falhou!"
                print_message $YELLOW "This could mean:"
                print_message $YELLOW "Isso pode significar:"
                print_message $YELLOW "  - Someone else has pushed to this branch"
                print_message $YELLOW "  - Alguém mais fez push para esta branch"
                print_message $YELLOW "  - Your local branch is out of sync"
                print_message $YELLOW "  - Sua branch local está fora de sincronia"
                print_message $BLUE "Try: git fetch && git rebase origin/$current_branch"
                print_message $BLUE "Tente: git fetch && git rebase origin/$current_branch"
                exit 1
            fi
            ;;
        *)
            print_message $RED "❌ Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
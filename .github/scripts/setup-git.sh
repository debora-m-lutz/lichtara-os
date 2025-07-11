#!/bin/bash

# 🔧 Git Configuration Script for Lichtara OS
# Sets up safer git defaults with --force-with-lease support
# Script de Configuração do Git para Lichtara OS
# Configura padrões mais seguros do git com suporte a --force-with-lease

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
    print_message $PURPLE "   🔧  Lichtara OS Git Setup"
    print_message $PURPLE "   🔧  Configuração Git Lichtara OS"
    print_message $PURPLE "🌟 ================================ 🌟"
    echo ""
}

# Function to show usage
show_usage() {
    print_banner
    echo "Usage | Uso:"
    echo ""
    echo "  $0                         # Configure safe git defaults"
    echo "  $0 --help                  # Show this help message"
    echo "  $0 --reset                 # Reset to git defaults"
    echo ""
    echo "This script configures git for safer development practices."
    echo "Este script configura o git para práticas de desenvolvimento mais seguras."
    echo ""
}

# Function to configure safe git defaults
configure_safe_defaults() {
    print_banner
    print_message $BLUE "🔧 Configuring safe git defaults..."
    print_message $BLUE "🔧 Configurando padrões seguros do git..."
    echo ""
    
    # Create alias for safe force push
    print_message $YELLOW "📌 Creating alias 'push-safe' for --force-with-lease"
    print_message $YELLOW "📌 Criando alias 'push-safe' para --force-with-lease"
    git config --local alias.push-safe 'push --force-with-lease'
    
    # Set up other safety configurations
    print_message $YELLOW "📌 Enabling automatic cleanup of remote tracking branches"
    print_message $YELLOW "📌 Habilitando limpeza automática de branches de tracking remotas"
    git config --local fetch.prune true
    
    print_message $YELLOW "📌 Setting push default to 'simple' for safety"
    print_message $YELLOW "📌 Definindo push padrão como 'simple' para segurança"
    git config --local push.default simple
    
    print_message $YELLOW "📌 Enabling color output for better visibility"
    print_message $YELLOW "📌 Habilitando saída colorida para melhor visibilidade"
    git config --local color.ui auto
    
    echo ""
    print_message $GREEN "✅ Git configuration completed successfully!"
    print_message $GREEN "✅ Configuração do git completada com sucesso!"
    echo ""
    print_message $BLUE "📋 Available commands | Comandos disponíveis:"
    print_message $BLUE "   git push-safe           # Same as git push --force-with-lease"
    print_message $BLUE "   ./.github/scripts/safe-push.sh  # Interactive safe push tool"
    echo ""
}

# Function to reset git configuration
reset_configuration() {
    print_banner
    print_message $BLUE "🔄 Resetting git configuration to defaults..."
    print_message $BLUE "🔄 Resetando configuração do git para padrões..."
    echo ""
    
    git config --local --unset alias.push-safe || true
    git config --local --unset fetch.prune || true
    git config --local --unset push.default || true
    git config --local --unset color.ui || true
    
    print_message $GREEN "✅ Git configuration reset completed!"
    print_message $GREEN "✅ Reset da configuração do git completado!"
    echo ""
}

# Function to show current configuration
show_current_config() {
    print_message $BLUE "📋 Current git configuration:"
    print_message $BLUE "📋 Configuração atual do git:"
    echo ""
    
    echo "Aliases:"
    git config --local --get-regexp "alias.*" || echo "  No local aliases configured"
    echo ""
    
    echo "Push settings:"
    echo "  push.default: $(git config --local push.default || echo 'not set')"
    echo "  fetch.prune: $(git config --local fetch.prune || echo 'not set')"
    echo "  color.ui: $(git config --local color.ui || echo 'not set')"
    echo ""
}

# Main script logic
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
        --reset)
            reset_configuration
            ;;
        "")
            configure_safe_defaults
            show_current_config
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
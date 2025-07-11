#!/bin/bash

# 🛡️ Safe Push Script for Lichtara OS
# Provides secure force push functionality with --force-with-lease
# Roteiro de Push Seguro para Lichtara OS
# Oferece funcionalidade de push forçado seguro com --force-with-lease

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
    print_message $PURPLE "   🛡️  Lichtara OS Safe Push Tool"
    print_message $PURPLE "   🛡️  Ferramenta de Push Seguro"
    print_message $PURPLE "🌟 ================================ 🌟"
    echo ""
}

# Function to show usage
show_usage() {
    print_banner
    echo "Usage | Uso:"
    echo ""
    echo "  $0 [branch-name]           # Safe push to specific branch"
    echo "  $0                         # Safe push to current branch"
    echo "  $0 --help                  # Show this help message"
    echo ""
    echo "Examples | Exemplos:"
    echo ""
    echo "  $0 feature/my-feature      # Push feature branch safely"
    echo "  $0                         # Push current branch safely"
    echo ""
    echo "This tool uses 'git push --force-with-lease' for maximum safety."
    echo "Esta ferramenta usa 'git push --force-with-lease' para máxima segurança."
    echo ""
}

# Function to get current branch
get_current_branch() {
    git branch --show-current
}

# Function to validate branch exists
validate_branch() {
    local branch=$1
    if ! git show-ref --verify --quiet refs/heads/$branch; then
        print_message $RED "❌ Error: Branch '$branch' does not exist locally"
        print_message $RED "❌ Erro: Branch '$branch' não existe localmente"
        exit 1
    fi
}

# Function to check if branch has upstream
check_upstream() {
    local branch=$1
    local upstream=$(git for-each-ref --format='%(upstream:short)' refs/heads/$branch)
    
    if [ -z "$upstream" ]; then
        print_message $YELLOW "⚠️  Warning: Branch '$branch' has no upstream set"
        print_message $YELLOW "⚠️  Aviso: Branch '$branch' não tem upstream definido"
        print_message $BLUE "Setting upstream to origin/$branch..."
        print_message $BLUE "Definindo upstream para origin/$branch..."
        
        git push --set-upstream origin $branch
        print_message $GREEN "✅ Upstream set successfully"
        print_message $GREEN "✅ Upstream definido com sucesso"
        return
    fi
    
    print_message $BLUE "📡 Upstream: $upstream"
}

# Function to perform safe push
safe_push() {
    local branch=$1
    
    print_message $BLUE "🔍 Checking repository status..."
    print_message $BLUE "🔍 Verificando status do repositório..."
    
    # Check if we have uncommitted changes
    if ! git diff --quiet || ! git diff --cached --quiet; then
        print_message $RED "❌ Error: You have uncommitted changes"
        print_message $RED "❌ Erro: Você tem alterações não commitadas"
        print_message $YELLOW "Please commit or stash your changes first"
        print_message $YELLOW "Por favor, commit ou faça stash das suas alterações primeiro"
        exit 1
    fi
    
    # Switch to target branch if not already there
    local current_branch=$(get_current_branch)
    if [ "$current_branch" != "$branch" ]; then
        print_message $BLUE "🔄 Switching to branch: $branch"
        print_message $BLUE "🔄 Mudando para branch: $branch"
        git checkout $branch
    fi
    
    # Validate branch
    validate_branch $branch
    
    # Check upstream
    check_upstream $branch
    
    print_message $BLUE "🚀 Performing safe push with --force-with-lease..."
    print_message $BLUE "🚀 Executando push seguro com --force-with-lease..."
    
    # Perform the safe push
    if git push --force-with-lease origin $branch; then
        print_message $GREEN "✅ Safe push completed successfully!"
        print_message $GREEN "✅ Push seguro completado com sucesso!"
        print_message $PURPLE "🌟 Branch '$branch' updated on origin"
        print_message $PURPLE "🌟 Branch '$branch' atualizado no origin"
    else
        print_message $RED "❌ Safe push failed!"
        print_message $RED "❌ Push seguro falhou!"
        print_message $YELLOW "This could mean:"
        print_message $YELLOW "Isso pode significar:"
        print_message $YELLOW "  - Someone else has pushed to this branch"
        print_message $YELLOW "  - Alguém mais fez push para esta branch"
        print_message $YELLOW "  - Your local tracking branch is out of sync"
        print_message $YELLOW "  - Sua branch de tracking local está fora de sincronia"
        print_message $BLUE "Try: git fetch && git rebase origin/$branch"
        print_message $BLUE "Tente: git fetch && git rebase origin/$branch"
        exit 1
    fi
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
        "")
            # No argument provided, use current branch
            local branch=$(get_current_branch)
            if [ -z "$branch" ]; then
                print_message $RED "❌ Error: Could not determine current branch"
                print_message $RED "❌ Erro: Não foi possível determinar a branch atual"
                exit 1
            fi
            print_banner
            print_message $BLUE "🎯 Using current branch: $branch"
            print_message $BLUE "🎯 Usando branch atual: $branch"
            safe_push $branch
            ;;
        *)
            # Branch name provided
            local branch=$1
            print_banner
            print_message $BLUE "🎯 Target branch: $branch"
            print_message $BLUE "🎯 Branch alvo: $branch"
            safe_push $branch
            ;;
    esac
}

# Run main function
main "$@"
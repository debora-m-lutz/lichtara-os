#!/bin/bash

# Script para aplicar proteção de ramificação
# Script to apply branch protection

echo "🛡️ Aplicando Proteção de Ramificação / Applying Branch Protection"
echo "=================================================================="

# Check if gh CLI is available
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) não encontrado / not found"
    echo "Instale o GitHub CLI: https://cli.github.com/"
    echo "Install GitHub CLI: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Não autenticado no GitHub / Not authenticated with GitHub"
    echo "Execute: gh auth login"
    echo "Run: gh auth login"
    exit 1
fi

# Get repository information
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
echo "📂 Repositório / Repository: $REPO"

# Apply protection to main branch
echo "🔒 Protegendo branch 'main' / Protecting 'main' branch..."

gh api repos/$REPO/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Code Quality Check","Branch Protection Status"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":false}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false \
  --field required_linear_history=true \
  --field required_conversation_resolution=true

if [ $? -eq 0 ]; then
    echo "✅ Proteção aplicada à branch 'main' / Protection applied to 'main' branch"
else
    echo "❌ Erro ao aplicar proteção à branch 'main' / Error applying protection to 'main' branch"
fi

# Apply protection to develop branch if it exists
if gh api repos/$REPO/branches/develop &> /dev/null; then
    echo "🔒 Protegendo branch 'develop' / Protecting 'develop' branch..."
    
    gh api repos/$REPO/branches/develop/protection \
      --method PUT \
      --field required_status_checks='{"strict":true,"contexts":["Code Quality Check","Branch Protection Status"]}' \
      --field enforce_admins=false \
      --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":false}' \
      --field restrictions=null \
      --field allow_force_pushes=false \
      --field allow_deletions=false \
      --field required_linear_history=true \
      --field required_conversation_resolution=true

    if [ $? -eq 0 ]; then
        echo "✅ Proteção aplicada à branch 'develop' / Protection applied to 'develop' branch"
    else
        echo "❌ Erro ao aplicar proteção à branch 'develop' / Error applying protection to 'develop' branch"
    fi
else
    echo "ℹ️ Branch 'develop' não encontrada / 'develop' branch not found"
fi

echo "=================================================================="
echo "🎉 Configuração de proteção concluída / Protection setup completed"
echo ""
echo "📖 Para mais informações, consulte:"
echo "📖 For more information, see:"
echo "   - 03-tecnica:/branch-protection.md"
echo "   - .github/branch-protection-config.yml"
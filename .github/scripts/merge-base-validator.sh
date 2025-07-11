#!/bin/bash

echo "🔮 Aurora Merge Base Validation"
echo "==============================="
echo ""

# Bilingual function for error messages
show_error() {
    echo "⚠️ ALERTA DE HARMONIA | HARMONY ALERT"
    echo "======================================"
    echo ""
    echo "🇧🇷 PT: $1"
    echo "🇺🇸 EN: $2"
    echo ""
    echo "🌟 Para resolver | To resolve:"
    echo "git fetch origin main"
    echo "git rebase origin/main"
    echo ""
    echo "✨ O Campo Quântico requer alinhamento com a timeline principal"
    echo "✨ The Quantum Field requires alignment with the main timeline"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Não está em um repositório Git | Not in a Git repository"
    exit 1
fi

echo "🌊 Verificando conexão com o Campo Principal | Checking connection to Main Field..."

# Ensure we have origin/main available
if ! git show-ref --verify --quiet refs/remotes/origin/main; then
    echo "📡 Sincronizando com origem | Synchronizing with origin..."
    
    # Try to fetch origin/main
    if ! git fetch origin main 2>/dev/null; then
        echo "⚠️ Não foi possível sincronizar com origin/main"
        echo "⚠️ Could not synchronize with origin/main"
        
        # Try alternative: check if main branch exists locally
        if git show-ref --verify --quiet refs/heads/main; then
            echo "🔄 Usando branch main local | Using local main branch"
            TARGET_BRANCH="main"
        else
            show_error \
                "Não foi possível encontrar a branch main. Verifique sua conexão de rede e tente novamente." \
                "Could not find main branch. Check your network connection and try again."
            exit 1
        fi
    else
        TARGET_BRANCH="origin/main"
        echo "✅ Sincronização com origin/main completa | Synchronization with origin/main complete"
    fi
else
    TARGET_BRANCH="origin/main"
    echo "✅ origin/main disponível | origin/main available"
fi

echo ""
echo "🔍 Analisando base de convergência | Analyzing convergence base..."
echo "Branch atual | Current branch: $(git rev-parse --abbrev-ref HEAD)"
echo "Branch alvo | Target branch: $TARGET_BRANCH"
echo ""

# Perform the merge-base check
if ! git merge-base "$TARGET_BRANCH" HEAD >/dev/null 2>&1; then
    echo ""
    echo "🌀 DIVERGÊNCIA DIMENSIONAL DETECTADA | DIMENSIONAL DIVERGENCE DETECTED"
    echo "=================================================================="
    echo ""
    
    show_error \
        "Nenhuma base de convergência encontrada entre $TARGET_BRANCH e HEAD. Por favor, rebase seu branch em main." \
        "No merge base found between $TARGET_BRANCH and HEAD. Please rebase your branch on main."
    
    echo "🔮 Status do Campo Quântico | Quantum Field Status:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "⚡ Timeline divergente detectada | Divergent timeline detected"
    echo "🌊 Realinhamento necessário | Realignment necessary"
    echo "🌟 Branch não está sincronizada com a origem | Branch is not synchronized with origin"
    echo ""
    
    exit 1
else
    MERGE_BASE=$(git merge-base "$TARGET_BRANCH" HEAD)
    echo "✅ BASE DE CONVERGÊNCIA CONFIRMADA | CONVERGENCE BASE CONFIRMED"
    echo "============================================================="
    echo ""
    echo "🎯 Base comum | Common base: $MERGE_BASE"
    echo "🌟 Timeline harmonizada | Timeline harmonized"
    echo "✨ Campo Quântico estável | Quantum Field stable"
    echo ""
    echo "🔮 A Aurora abençoa esta integração | Aurora blesses this integration"
    echo "🌊 Prossiga com a manifestação | Proceed with manifestation"
    
    exit 0
fi
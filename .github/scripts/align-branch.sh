#!/bin/bash

echo "🌟 Aurora Branch Alignment Tool"
echo "==============================="
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Não está em um repositório Git | Not in a Git repository"
    exit 1
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$CURRENT_BRANCH" = "main" ]; then
    echo "ℹ️ Você já está na branch main | You are already on main branch"
    echo "✨ Nenhum alinhamento necessário | No alignment necessary"
    exit 0
fi

echo "🌿 Branch atual | Current branch: $CURRENT_BRANCH"
echo ""

# Run the merge base validator first
echo "🔍 Verificando alinhamento atual | Checking current alignment..."
if ./.github/scripts/merge-base-validator.sh; then
    echo ""
    echo "✅ Branch já está alinhada! | Branch is already aligned!"
    echo "🌟 Nenhuma ação necessária | No action necessary"
    exit 0
fi

echo ""
echo "🔄 INICIANDO PROCESSO DE REALINHAMENTO | STARTING REALIGNMENT PROCESS"
echo "=================================================================="
echo ""

# Ask for confirmation
read -p "🤔 Deseja realinhar automaticamente com main? | Auto-align with main? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "⏸️ Realinhamento cancelado | Realignment cancelled"
    echo "🔮 Execute manualmente quando estiver pronto | Execute manually when ready:"
    echo "   git fetch origin main"
    echo "   git rebase origin/main"
    exit 0
fi

echo ""
echo "🌊 Sincronizando com origem | Synchronizing with origin..."
if ! git fetch origin main; then
    echo "❌ Falha ao sincronizar | Failed to synchronize"
    exit 1
fi

echo ""
echo "🔄 Realizando rebase com origin/main..."
echo "⚠️ Este processo pode requerer resolução de conflitos"
echo "⚠️ This process may require conflict resolution"
echo ""

if git rebase origin/main; then
    echo ""
    echo "🎉 REALINHAMENTO CONCLUÍDO COM SUCESSO | REALIGNMENT COMPLETED SUCCESSFULLY"
    echo "==========================================================================="
    echo ""
    echo "✨ Verificando novo alinhamento | Verifying new alignment..."
    
    if ./.github/scripts/merge-base-validator.sh; then
        echo ""
        echo "🌟 Perfeito! Branch totalmente alinhada com main"
        echo "🌟 Perfect! Branch fully aligned with main"
        echo ""
        echo "🚀 Pronto para continuar o desenvolvimento | Ready to continue development"
    fi
else
    echo ""
    echo "⚠️ REBASE ENCONTROU CONFLITOS | REBASE ENCOUNTERED CONFLICTS"
    echo "=========================================================="
    echo ""
    echo "🔧 Para resolver | To resolve:"
    echo "1. Resolva os conflitos nos arquivos indicados"
    echo "2. Execute: git add <arquivos-resolvidos>"
    echo "3. Execute: git rebase --continue"
    echo ""
    echo "🚨 Se precisar cancelar | If you need to cancel:"
    echo "   git rebase --abort"
    echo ""
    echo "💡 Depois de resolver, execute este script novamente para verificar"
    echo "💡 After resolving, run this script again to verify"
    
    exit 1
fi
#!/bin/bash

# 🚀 Quick Reference: git push --force-with-lease origin $(git branch --show-current)
# This script shows all available ways to execute this command safely

echo "🌟 Lichtara OS - Safe Push Current Branch Reference"
echo "=================================================="
echo ""
echo "📋 Available methods to execute:"
echo "   git push --force-with-lease origin \$(git branch --show-current)"
echo ""
echo "1. 🎯 Direct command:"
echo "   git push --force-with-lease origin \$(git branch --show-current)"
echo ""
echo "2. 🔧 Git alias (after running setup):"
echo "   git push-current"
echo ""
echo "3. 🛡️ Interactive script:"
echo "   ./git-push-safe-current.sh"
echo ""
echo "4. 🔧 Setup git aliases:"
echo "   ./.github/scripts/setup-git.sh"
echo ""
echo "5. 🧪 Run tests:"
echo "   ./test-git-push-safe-current.sh"
echo ""
echo "📖 Current branch: $(git branch --show-current 2>/dev/null || echo 'Not in a git repository')"
echo ""
#!/bin/bash
# 🌊 Git Remote Setup Script for Lichtara OS
# Ensures proper git configuration for development and CI/CD workflows

set -e

echo "🌟 Setting up git configuration for Lichtara OS..."

# Add safe directory configuration
git config --global --add safe.directory "$(pwd)" 2>/dev/null || true

echo "🔄 Fetching main branch from origin..."

# Fetch main branch
git fetch origin main

# Set up remote tracking for main branch if it doesn't exist
if ! git rev-parse --verify origin/main >/dev/null 2>&1; then
    echo "📡 Setting up origin/main remote tracking..."
    git fetch origin main:refs/remotes/origin/main
fi

echo "✅ Git remote setup complete!"
echo "🌊 Ready for spiritual format validation and Aurora workflows"

# Verify setup
if git rev-parse --verify origin/main >/dev/null 2>&1; then
    echo "✨ origin/main reference: $(git rev-parse --short origin/main)"
else
    echo "⚠️ Warning: origin/main reference not available"
    exit 1
fi
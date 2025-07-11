#!/bin/bash

# Git Configuration Setup for Lichtara OS
# Handles safe directory setup and git configuration cleanup for CI/CD environments

set -e

echo "🔮 Lichtara OS Git Configuration Setup"
echo "======================================="

# Add repository directory as safe directory
echo "🛡️  Adding repository as safe directory..."
if [ -n "$GITHUB_WORKSPACE" ]; then
    # Check if already added to avoid duplicates
    if ! git config --global --get-all safe.directory | grep -Fxq "$GITHUB_WORKSPACE"; then
        git config --global --add safe.directory "$GITHUB_WORKSPACE"
        echo "✅ Added $GITHUB_WORKSPACE as safe directory"
    else
        echo "✅ $GITHUB_WORKSPACE already configured as safe directory"
    fi
else
    echo "⚠️  GITHUB_WORKSPACE not set, using current directory"
    CURRENT_DIR="$(pwd)"
    if ! git config --global --get-all safe.directory | grep -Fxq "$CURRENT_DIR"; then
        git config --global --add safe.directory "$CURRENT_DIR"
        echo "✅ Added $CURRENT_DIR as safe directory"
    else
        echo "✅ $CURRENT_DIR already configured as safe directory"
    fi
fi

echo ""
echo "🧹 Cleaning up SSH command configurations..."

# List existing SSH command configurations (for debugging)
echo "🔍 Current SSH command configurations:"
git config --local --name-only --get-regexp core\.sshCommand || echo "   No SSH command configurations found"

# Clean up SSH command configurations in submodules
echo "🔧 Cleaning up submodule SSH configurations..."
git submodule foreach --recursive sh -c "git config --local --unset-all core.sshCommand || true" || true

# Clean up main repository SSH command configurations
echo "🔧 Cleaning up main repository SSH configurations..."
git config --local --unset-all core.sshCommand || true

echo ""
echo "🧹 Cleaning up HTTP extraheader configurations for GitHub..."

# List existing HTTP extraheader configurations (for debugging)
echo "🔍 Current HTTP extraheader configurations:"
git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader || echo "   No HTTP extraheader configurations found"

# Clean up HTTP extraheader configurations
echo "🔧 Cleaning up HTTP extraheader configurations..."
git config --local --unset-all http.https://github.com/.extraheader || true

echo ""
echo "✨ Git configuration setup complete!"
echo "🌟 Repository is now configured for secure CI/CD operations"
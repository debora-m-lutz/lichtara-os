#!/bin/bash

# Git Configuration Setup and Cleanup Script
# Implements comprehensive Git security and configuration management

echo "🔧 Lichtara OS Git Configuration Setup"
echo "======================================"
echo ""

# Add repository directory as safe directory
echo "🛡️  Setting up safe directory configuration..."
if [ -n "$GITHUB_WORKSPACE" ]; then
    echo "Adding $GITHUB_WORKSPACE as safe directory"
    /usr/bin/git config --global --add safe.directory "$GITHUB_WORKSPACE" || true
else
    echo "GITHUB_WORKSPACE not set, using current directory"
    /usr/bin/git config --global --add safe.directory "$(pwd)" || true
fi

echo ""
echo "🧹 Cleaning up SSH command configurations..."

# List existing SSH command configurations before cleanup
echo "Checking for existing core.sshCommand configurations:"
/usr/bin/git config --local --name-only --get-regexp core\.sshCommand || true

# Clean up SSH command configurations
echo "Removing local SSH command configurations:"
/usr/bin/git config --local --unset-all core.sshCommand || true

# Clean up SSH command configurations in submodules recursively
echo "Cleaning up SSH configurations in submodules:"
/usr/bin/git submodule foreach --recursive sh -c "git config --local --unset-all core.sshCommand || true" || true

echo ""
echo "🌐 Cleaning up HTTP extraheader configurations for GitHub..."

# List existing HTTP extraheader configurations before cleanup
echo "Checking for existing HTTP extraheader configurations:"
/usr/bin/git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader || true

# Clean up HTTP extraheader configurations for GitHub
echo "Removing HTTP extraheader configurations:"
/usr/bin/git config --local --unset-all http.https://github.com/.extraheader || true

echo ""
echo "✅ Git configuration setup and cleanup completed successfully!"
echo "🌟 Repository is now configured with optimal security settings."
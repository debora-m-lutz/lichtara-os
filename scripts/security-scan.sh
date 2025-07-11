#!/bin/bash

# Security Scan Script for Lichtara OS
# Scans for potentially sensitive files that should not be committed to the repository

set -e

echo "🔍 Scanning for potentially sensitive files..."

# Define common sensitive file patterns
sensitive_patterns=(
    "*.key"
    "*.pem" 
    "*.p12"
    "*.pfx"
    ".env"
    "secrets.json"
    "*.crt"
    "*.cert"
    "id_rsa"
    "id_dsa"
    "id_ecdsa"
    "id_ed25519"
    "*.keystore"
    "*.jks"
    "*.p7b"
    "*.p7c"
    "*.der"
    "config.json"
    "credentials.json"
    "service-account*.json"
)

found_sensitive=false

# Check each pattern
for pattern in "${sensitive_patterns[@]}"; do
    if find . -name "$pattern" -not -path "./.git/*" -not -path "./node_modules/*" -not -path "./.vscode/*" | grep -q .; then
        echo "⚠️ Found potential sensitive files matching $pattern:"
        find . -name "$pattern" -not -path "./.git/*" -not -path "./node_modules/*" -not -path "./.vscode/*"
        found_sensitive=true
    fi
done

# Additional checks for environment and config files with common sensitive content
echo ""
echo "🔍 Checking for files that might contain sensitive data..."

# Check for files containing common sensitive keywords
if grep -r -l --include="*.json" --include="*.yml" --include="*.yaml" --include="*.config" --include="*.env*" \
    -E "(password|secret|token|key|credential|api_key|private_key)" . 2>/dev/null | grep -v ".git" | grep -v "node_modules" | head -5; then
    echo "⚠️ Found files that may contain sensitive keywords (password, secret, token, etc.)"
    echo "Please review these files to ensure no actual secrets are committed."
fi

echo ""

if [ "$found_sensitive" = true ]; then
    echo "❌ Security scan failed: Potential sensitive files detected!"
    echo ""
    echo "📝 Recommendations:"
    echo "1. Review the files listed above"
    echo "2. Remove any files containing actual secrets or credentials"
    echo "3. Add sensitive file patterns to .gitignore"
    echo "4. Consider using environment variables or secure secret management"
    echo ""
    exit 1
fi

echo "✅ Sensitive file scan completed - No obvious sensitive files found"
echo ""
echo "💡 Remember:"
echo "- Always review your commits before pushing"
echo "- Use .gitignore to exclude sensitive files"
echo "- Use environment variables for configuration"
echo "- Consider using tools like git-secrets for additional protection"
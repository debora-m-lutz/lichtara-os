#!/bin/sh
# Pre-commit hook to prevent API keys and secrets from being committed
# Copy this file to .git/hooks/pre-commit and make it executable

set -e

echo "🔍 Running security checks before commit..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Flag to track if any issues are found
ISSUES_FOUND=0

# Function to print colored output
print_error() {
    echo "${RED}❌ $1${NC}"
    ISSUES_FOUND=1
}

print_warning() {
    echo "${YELLOW}⚠️  $1${NC}"
}

print_success() {
    echo "${GREEN}✅ $1${NC}"
}

# Check for potential API keys in staged files
echo "Checking for potential API keys..."

# Check each pattern
for pattern in "sk-" "OPENAI_API_KEY.*=.*sk-" "Bearer sk-" "apikey.*sk-" "api_key.*sk-" "token.*sk-"; do
    if git diff --cached 2>/dev/null | grep -q "$pattern"; then
        print_error "Potential API key found with pattern: $pattern"
        echo "Files containing potential secrets:"
        git diff --cached --name-only 2>/dev/null | xargs grep -l "$pattern" 2>/dev/null | sed 's/^/  /' || echo "  (check git diff for details)"
        echo ""
        echo "To fix this:"
        echo "1. Remove the hardcoded API key from the code"
        echo "2. Use environment variables instead: process.env.OPENAI_API_KEY"
        echo "3. Add the real key to your .env file (which is gitignored)"
        echo ""
    fi
done

# Check for .env files being committed
echo "Checking for .env files..."
if git diff --cached --name-only 2>/dev/null | grep -E "\.env$|\.env\..*" | grep -v "\.env\.example"; then
    print_error "Environment files found in commit:"
    git diff --cached --name-only 2>/dev/null | grep -E "\.env$|\.env\..*" | grep -v "\.env\.example" | sed 's/^/  /'
    echo ""
    echo "Environment files should not be committed as they contain secrets."
    echo "Use .env.example for templates instead."
    echo ""
fi

# Check for console.log with potential secrets
echo "Checking for console.log with secrets..."
if git diff --cached 2>/dev/null | grep -E "console\.(log|error|warn|info).*sk-"; then
    print_warning "Found console.log statements that might contain API keys"
    echo "Review these carefully before committing."
    echo ""
fi

# Check for TODO/FIXME comments about security
echo "Checking for security TODOs..."
SECURITY_TODOS=$(git diff --cached 2>/dev/null | grep -i -E "(TODO|FIXME|HACK).*(security|api.?key|secret|token|password)" || true)
if [ -n "$SECURITY_TODOS" ]; then
    print_warning "Found security-related TODOs in your changes:"
    echo "$SECURITY_TODOS"
    echo ""
fi

# Verify .gitignore includes .env patterns
echo "Checking .gitignore configuration..."
if [ -f .gitignore ]; then
    if ! grep -q "^\.env$" .gitignore; then
        print_warning ".gitignore should include '.env' pattern"
    fi
    if ! grep -q "\.env\." .gitignore; then
        print_warning ".gitignore should include '.env.*' pattern"  
    fi
else
    print_warning ".gitignore file not found"
fi

# Check for package.json changes that might include secrets
echo "Checking package.json for secrets..."
if git diff --cached --name-only 2>/dev/null | grep -q "package\.json"; then
    if git diff --cached package.json 2>/dev/null | grep -E "sk-|secret|token"; then
        print_warning "package.json changes contain potential secrets"
        echo "Review package.json changes carefully."
    fi
fi

# Final result
echo ""
if [ $ISSUES_FOUND -eq 0 ]; then
    print_success "All security checks passed!"
    echo ""
    echo "Commit proceeding..."
    exit 0
else
    echo ""
    print_error "Security issues found! Commit blocked."
    echo ""
    echo "Fix the issues above and try again."
    echo ""
    echo "If you need to commit anyway (not recommended), use:"
    echo "  git commit --no-verify"
    echo ""
    exit 1
fi
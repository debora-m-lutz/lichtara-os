#!/bin/bash
# Security setup script for Lichtara OS
# This script installs security measures to prevent API key exposure

set -e

echo "🔒 Setting up security measures for Lichtara OS..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo "${BLUE}🔧 $1${NC}"
}

print_success() {
    echo "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo "${RED}❌ $1${NC}"
}

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "This script must be run from the root of a git repository"
    exit 1
fi

print_step "Installing pre-commit hook..."

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy the pre-commit hook
if [ -f "scripts/pre-commit-hook.sh" ]; then
    cp scripts/pre-commit-hook.sh .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
    print_success "Pre-commit hook installed"
else
    print_error "Pre-commit hook script not found at scripts/pre-commit-hook.sh"
    exit 1
fi

print_step "Setting up environment configuration..."

# Check if .env.example exists and .env doesn't
if [ -f ".env.example" ] && [ ! -f ".env" ]; then
    echo "Would you like to create a .env file from .env.example? (y/n)"
    read -r response
    if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
        cp .env.example .env
        print_success ".env file created from template"
        print_warning "Remember to update .env with your actual API keys"
        print_warning "NEVER commit the .env file to version control"
    fi
fi

# Check for prototype environment files
for prototype in "05-prototipos/05-prototipo/05_Prototipo" "05-prototipos/05-prototipo/5.1_Prototipo"; do
    if [ -d "$prototype" ] && [ -f "$prototype/.env.example" ] && [ ! -f "$prototype/.env" ]; then
        echo "Would you like to create $prototype/.env from template? (y/n)"
        read -r response
        if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
            cp "$prototype/.env.example" "$prototype/.env"
            print_success "Environment file created for $prototype"
        fi
    fi
done

print_step "Verifying .gitignore configuration..."

# Check if .gitignore properly excludes .env files
if [ -f ".gitignore" ]; then
    if grep -q "^\.env$" .gitignore && grep -q "\.env\." .gitignore; then
        print_success ".gitignore properly configured for environment files"
    else
        print_warning ".gitignore may not properly exclude environment files"
        echo "Checking .gitignore patterns..."
        
        if ! grep -q "^\.env$" .gitignore; then
            echo ".env" >> .gitignore
            print_success "Added .env to .gitignore"
        fi
        
        if ! grep -q "\.env\." .gitignore; then
            echo ".env.*" >> .gitignore  
            print_success "Added .env.* to .gitignore"
        fi
    fi
else
    print_error ".gitignore file not found"
fi

print_step "Testing security setup..."

# Test the pre-commit hook
echo "Testing pre-commit hook..."
if .git/hooks/pre-commit --help > /dev/null 2>&1 || [ $? -eq 1 ]; then
    print_success "Pre-commit hook is executable"
else
    print_error "Pre-commit hook test failed"
fi

# Run security scan on current repository
echo "Running security scan on current files..."
if [ -f "scripts/pre-commit-hook.sh" ]; then
    # Create a temporary script that doesn't exit on failure for testing
    temp_script=$(mktemp)
    sed 's/exit 1/echo "Issues found but continuing..."/g' scripts/pre-commit-hook.sh > "$temp_script"
    chmod +x "$temp_script"
    
    # Run the test (will show warnings but not exit)
    "$temp_script" || true
    
    rm "$temp_script"
else
    print_warning "Security scan script not found"
fi

echo ""
print_success "Security setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update your .env files with real API keys (never commit these)"
echo "2. Review and follow the Security Guide: SECURITY_GUIDE.md"
echo "3. Test the pre-commit hook by making a commit"
echo ""
echo "🔍 The pre-commit hook will now:"
echo "   - Check for API keys in your code"
echo "   - Prevent .env files from being committed"
echo "   - Warn about potential security issues"
echo ""
echo "💡 If you ever need to bypass the hook (not recommended):"
echo "   git commit --no-verify"
echo ""
print_warning "Remember: Never commit real API keys to version control!"
echo ""
echo "For more information, see:"
echo "  - SECURITY_GUIDE.md - Comprehensive security practices"
echo "  - .env.example - Environment variable templates"
echo "  - scripts/pre-commit-hook.sh - The security hook script"
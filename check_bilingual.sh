#!/bin/bash

# Bilingual Documentation Checker
# Checks for bilingual content in main documentation files

echo "🌍 Checking bilingual documentation..."

# Function to check if a file has bilingual content
check_bilingual_content() {
    local file=$1
    local filename=$(basename "$file")
    
    if [ ! -f "$file" ]; then
        echo "❌ $filename not found"
        return 1
    fi
    
    # Check for English/Portuguese indicators in the file
    if grep -q "English.*Português\|EN:.*PT:\|**EN:**.***PT:**" "$file"; then
        echo "✅ $filename has bilingual sections"
        return 0
    else
        echo "❌ $filename missing bilingual sections"
        return 1
    fi
}

# Check main documentation files
all_passed=true

if ! check_bilingual_content "README.md"; then
    all_passed=false
fi

if ! check_bilingual_content "CONTRIBUTING.md"; then
    all_passed=false
fi

if ! check_bilingual_content "CODE_OF_CONDUCT.md"; then
    all_passed=false
fi

# Final message
if [ "$all_passed" = true ]; then
    echo "🌟 Bilingual check completed - supporting international collaboration"
    exit 0
else
    echo "⚠️ Some files are missing bilingual content"
    exit 1
fi
#!/bin/bash

# Markdown Content Validation Script
# Validates that all markdown files have meaningful content

echo "📝 Validating markdown files..."

# Track validation status
all_valid=true
empty_files=()
minimal_files=()

# Check each markdown file
while IFS= read -r -d '' file; do
    # Get file size in bytes
    size=$(wc -c < "$file" 2>/dev/null || echo "0")
    
    if [ "$size" -eq 0 ]; then
        echo "❌ Empty file: $file"
        empty_files+=("$file")
        all_valid=false
    elif [ "$size" -le 2 ]; then
        echo "⚠️  Minimal content: $file (${size} bytes)"
        minimal_files+=("$file")
        all_valid=false
    else
        echo "✅ Valid content: $file (${size} bytes)"
    fi
done < <(find . -name "*.md" -type f -print0)

echo ""
echo "Summary:"
total_files=$(find . -name "*.md" -type f | wc -l)
echo "- Total markdown files: $total_files"
echo "- Empty files: ${#empty_files[@]}"
echo "- Minimal content files: ${#minimal_files[@]}"

if [ "$all_valid" = true ]; then
    echo "✅ All documentation files have content"
    exit 0
else
    echo "❌ Some documentation files need content"
    
    if [ ${#empty_files[@]} -gt 0 ]; then
        echo ""
        echo "Empty files to fix:"
        for file in "${empty_files[@]}"; do
            echo "  - $file"
        done
    fi
    
    if [ ${#minimal_files[@]} -gt 0 ]; then
        echo ""
        echo "Minimal content files to fix:"
        for file in "${minimal_files[@]}"; do
            echo "  - $file"
        done
    fi
    
    exit 1
fi
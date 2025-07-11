#!/bin/bash

# Script to validate all package.json files in the repository
# Handles file paths with spaces correctly

set -e

echo "📦 Checking prototype package.json files..."

# Count the number of package.json files found
package_count=0

# Find all package.json files, using null delimiter to handle spaces in filenames
while IFS= read -r -d '' file; do
    package_count=$((package_count + 1))
done < <(find . -name "package.json" -not -path "./node_modules/*" -print0)

if [ $package_count -eq 0 ]; then
    echo "ℹ️ No package.json files found in prototypes"
    exit 0
fi

echo "Found $package_count package.json files:"

# List all package.json files
find . -name "package.json" -not -path "./node_modules/*" -print0 | tr '\0' '\n'

echo ""

# Validate each package.json using proper file handling for spaces
validation_failed=false

find . -name "package.json" -not -path "./node_modules/*" -print0 | while IFS= read -r -d '' file; do
    echo "Validating $file..."
    if node -e "JSON.parse(require('fs').readFileSync('$file', 'utf8'))" 2>/dev/null; then
        echo "✅ $file is valid JSON"
    else
        echo "❌ $file has invalid JSON"
        validation_failed=true
    fi
done

# Check if any validations failed
if [ "$validation_failed" = true ]; then
    echo ""
    echo "❌ Some package.json files are invalid!"
    exit 1
fi

echo ""
echo "✅ All package.json files are valid!"
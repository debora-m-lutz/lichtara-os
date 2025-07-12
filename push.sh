#!/bin/bash

# Lichtara OS Push Wrapper
# Simplified access to safe push functionality
# Implements: git push --force-with-lease origin $(git branch --show-current)

set -e

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Execute the safe push script
exec "${SCRIPT_DIR}/.github/scripts/safe-push.sh" "$@"
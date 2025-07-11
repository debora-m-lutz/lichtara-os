# 🌊 Git Remote Setup for Lichtara OS

This document explains the git remote configuration setup required for Lichtara OS development and CI/CD workflows.

## Issue Background

The command `git fetch origin main` was failing in GitHub Actions workflows, specifically in the spiritual-format-validation.yml workflow. This occurred because the default GitHub Actions checkout doesn't automatically set up remote tracking for all branches, only the current working branch.

## Solution

### Automated Setup Script

Use the provided setup script to ensure proper git configuration:

```bash
.github/scripts/setup-git-remotes.sh
```

This script:
- Configures git safe directory settings
- Fetches the main branch from origin
- Sets up remote tracking for origin/main
- Verifies the setup works correctly

### Manual Setup

If you need to set up git remotes manually:

```bash
# Add safe directory (if needed)
git config --global --add safe.directory $(pwd)

# Fetch main branch
git fetch origin main

# Set up remote tracking (if not already configured)
git fetch origin main:refs/remotes/origin/main

# Verify setup
git rev-parse --verify origin/main
```

### In GitHub Actions

The spiritual-format-validation.yml workflow now includes this setup automatically:

```yaml
- name: 🔄 Process Changed Files
  if: github.event_name == 'pull_request'
  run: |
    # Set up git remotes using the dedicated script
    .github/scripts/setup-git-remotes.sh
    
    # Now we can safely compare against origin/main
    CHANGED_FILES=$(git diff --name-only origin/main...HEAD)
```

## Why This Fix Was Needed

1. **GitHub Actions Limitation**: The default checkout action only sets up tracking for the current branch
2. **Workflow Dependencies**: The spiritual format validation needs to compare changes against the main branch
3. **Robust Fallback**: The fix includes fallback logic to use the PR base SHA if origin/main is unavailable

## Testing

To test that your git setup works correctly:

```bash
# Run the setup script
.github/scripts/setup-git-remotes.sh

# Test that origin/main reference works
git rev-parse --verify origin/main

# Test file comparison (should not error)
git diff --name-only origin/main...HEAD
```

## Benefits

- ✅ Reliable `git fetch origin main` in all environments
- ✅ Proper remote tracking for automated workflows
- ✅ Fallback handling for edge cases
- ✅ Reusable script for consistent setup
- ✅ Clear error messages and validation
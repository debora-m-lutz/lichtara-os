# Git Merge Base Validation Utility

This utility script implements the requirement to validate branch ancestry with the main branch, specifically the command:
```bash
if ! git merge-base --is-ancestor origin/main HEAD; then
  echo "❗ Error: No common ancestor between origin/main and HEAD. Rebase your branch onto main."
  exit 1
fi
```

## 📁 Files Added

- `.github/scripts/check-merge-base.sh` - Main validation script
- Updated `.github/workflows/spiritual-format-validation.yml` - Integrated the check into PR validation

## 🚀 Usage

### Direct Script Execution

```bash
# Validate current branch ancestry
./.github/scripts/check-merge-base.sh
```

### GitHub Actions Integration

The check is automatically integrated into the `spiritual-format-validation.yml` workflow and runs on every pull request:

```yaml
- name: 🌀 Validate Branch Ancestry
  if: github.event_name == 'pull_request'
  run: |
    echo "🔍 Validating branch ancestry with main..."
    ./.github/scripts/check-merge-base.sh
```

## ✨ Features

### 🔍 Automatic Branch Detection
- Fetches latest main branch from origin
- Sets up proper remote tracking if needed
- Falls back to FETCH_HEAD if needed

### 🌈 Aurora-themed Output
- Spiritual emoji indicators (🔮✨🌊🌀)
- Clear success/failure messages
- Helpful rebase instructions when validation fails

### 🛡️ Robust Error Handling
- Gracefully handles missing remote references
- Provides clear error messages and solutions
- Compatible with various Git configurations

## 🎯 Validation Scenarios

### ✅ Success Case
When the branch has a common ancestor with main:
```
🔮 Aurora Merge Base Validation
================================
🌊 Fetching latest main branch...
✨ Validating branch ancestry...
✅ Branch has proper ancestry with main
🌈 The Aurora field vibration is maintained
🎯 Merge base validation complete!
```

### ❌ Failure Case
When the branch needs to be rebased:
```
🔮 Aurora Merge Base Validation
================================
🌊 Fetching latest main branch...
✨ Validating branch ancestry...
❗ Error: No common ancestor between origin/main and HEAD.
   Your branch needs to be rebased onto main before integration.

🔄 To fix this issue:
   1. git fetch origin main
   2. git rebase origin/main
   3. Resolve any conflicts if they arise
   4. git push --force-with-lease origin $(git branch --show-current)

🌟 This ensures your changes integrate harmoniously with the Aurora field.
```

## 🔄 Integration with Lichtara OS Workflows

This validation is seamlessly integrated into the existing spiritual automation system:
- Runs on every pull request
- Maintains Aurora field vibrational harmony
- Follows the project's spiritual conventions
- Provides guidance aligned with conscious technology principles

## 🎯 Requirement Fulfillment

This implementation specifically addresses the problem statement requirement:
```bash
if ! git merge-base --is-ancestor origin/main HEAD; then
  echo "❗ Error: No common ancestor between origin/main and HEAD. Rebase your branch onto main."
  exit 1
fi
```

The script implements this exact logic with enhanced:
1. Error handling and setup
2. Spiritual theming consistent with the project
3. Clear user guidance for resolution
4. GitHub Actions integration
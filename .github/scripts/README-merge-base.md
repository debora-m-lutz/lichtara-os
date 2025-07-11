# 🔮 Aurora Merge Base Validation

This directory contains scripts for ensuring dimensional alignment between branches and the main timeline in the Lichtara OS quantum field.

## Scripts Overview

### 🌀 merge-base-validator.sh
The primary validation script that checks if the current branch has a proper merge base with `origin/main`.

**Usage:**
```bash
./.github/scripts/merge-base-validator.sh
```

**What it does:**
- Ensures `origin/main` is available and up-to-date
- Performs `git merge-base origin/main HEAD` check  
- Provides bilingual error messages (Portuguese/English)
- Uses Aurora-themed spiritual messaging consistent with the repository style

**Exit codes:**
- `0`: Merge base found - branch is properly aligned
- `1`: No merge base found - branch needs rebase

### 🌟 align-branch.sh
An interactive helper script that checks alignment and offers to automatically fix it.

**Usage:**
```bash
./.github/scripts/align-branch.sh
```

**What it does:**
- Runs merge base validation
- If validation fails, offers to automatically rebase against `origin/main`
- Handles conflicts gracefully with helpful guidance
- Provides step-by-step instructions for manual resolution

### 🔍 test-merge-base-validator.sh
A testing script to verify the merge base validator works correctly.

**Usage:**
```bash
./.github/scripts/test-merge-base-validator.sh
```

## Integration with GitHub Actions

The merge base validation is automatically integrated into the **Spiritual Format Validation** workflow (`.github/workflows/spiritual-format-validation.yml`) and runs on all pull requests.

### Workflow Integration

When a pull request is opened, the workflow will:
1. Validate spiritual format conventions
2. **Check dimensional alignment** (merge base validation)
3. Process changed files for consistency

If the merge base check fails, the PR validation will fail with clear instructions on how to resolve the issue.

## Problem Statement Implementation

This implementation addresses the requirement:

```bash
if ! git merge-base origin/main HEAD >/dev/null; then
  echo "⚠️ No merge base found entre origin/main e HEAD. Por favor, rebase seu branch em main."
  exit 1
fi
```

**Enhancements made:**
- ✨ Aurora-themed spiritual messaging
- 🌐 Bilingual support (Portuguese/English)
- 🛡️ Robust error handling for missing `origin/main`
- 🔧 Helper tools for automatic resolution
- 📊 Comprehensive testing
- 🤖 GitHub Actions integration

## Usage Examples

### For Developers

**Check if your branch needs rebase:**
```bash
./.github/scripts/merge-base-validator.sh
```

**Automatically align your branch:**
```bash
./.github/scripts/align-branch.sh
```

### For CI/CD

The validation runs automatically on all pull requests. If it fails:

1. The PR checks will show a failure
2. Review the Action logs for detailed guidance
3. Run the alignment script locally:
   ```bash
   git fetch origin main
   git rebase origin/main
   ```
4. Push the rebased branch

## Error Messages

All error messages follow the spiritual/Aurora theming of the repository:

```
🌀 DIVERGÊNCIA DIMENSIONAL DETECTADA | DIMENSIONAL DIVERGENCE DETECTED
==================================================================

⚠️ ALERTA DE HARMONIA | HARMONY ALERT
======================================

🇧🇷 PT: Nenhuma base de convergência encontrada entre origin/main e HEAD. Por favor, rebase seu branch em main.
🇺🇸 EN: No merge base found between origin/main and HEAD. Please rebase your branch on main.

🌟 Para resolver | To resolve:
git fetch origin main
git rebase origin/main

✨ O Campo Quântico requer alinhamento com a timeline principal
✨ The Quantum Field requires alignment with the main timeline
```

## Files Created

- `.github/scripts/merge-base-validator.sh` - Main validation script
- `.github/scripts/align-branch.sh` - Interactive alignment helper  
- `.github/scripts/test-merge-base-validator.sh` - Testing script
- `.github/scripts/README-merge-base.md` - This documentation
- Modified: `.github/workflows/spiritual-format-validation.yml` - Added merge base step

## Contributing

When contributing to these scripts, please maintain:
- 🌟 Aurora/spiritual theming in all messages
- 🌐 Bilingual support (Portuguese/English)
- 🛡️ Robust error handling
- 📝 Clear documentation
- ✨ Consistent emoji usage matching repository style
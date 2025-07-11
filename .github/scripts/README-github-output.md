# GitHub Scripts | Scripts do GitHub

This directory contains utility scripts for Lichtara OS development and GitHub workflows.

Este diretório contém scripts utilitários para desenvolvimento do Lichtara OS e workflows do GitHub.

## 🛡️ Safe Push Tool | Ferramenta de Push Seguro

### `safe-push.sh`
A secure wrapper around `git push --force-with-lease` that provides safety checks and bilingual error messages.

Um wrapper seguro em torno do `git push --force-with-lease` que fornece verificações de segurança e mensagens de erro bilíngues.

**Usage | Uso:**
```bash
# Push current branch safely
./.github/scripts/safe-push.sh

# Push specific branch safely  
./.github/scripts/safe-push.sh feature/my-feature

# Get help
./.github/scripts/safe-push.sh --help
```

**Features | Características:**
- ✅ Uses `--force-with-lease` for maximum safety
- ✅ Validates repository state before pushing
- ✅ Bilingual output (English/Portuguese)
- ✅ Automatic upstream configuration
- ✅ Helpful error messages and guidance
- ✅ `git push-safe` alias for `git push --force-with-lease`
- ✅ `git push-current` alias for `git push --force-with-lease origin $(git branch --show-current)`

## ⚙️ Git Configuration Setup | Configuração do Git

### `setup-git.sh`
Configures git with safer defaults and convenient aliases for --force-with-lease operations.

Configura o git com padrões mais seguros e aliases convenientes para operações --force-with-lease.

**Usage | Uso:**
```bash
# Configure safe defaults (run once per repository)
./.github/scripts/setup-git.sh

# Reset to defaults
./.github/scripts/setup-git.sh --reset

# Get help
./.github/scripts/setup-git.sh --help
```

**What it configures | O que configura:**
- ✅ `git push-safe` alias for `git push --force-with-lease`
- ✅ Automatic cleanup of remote tracking branches
- ✅ Safe push defaults
- ✅ Color output for better visibility

## 📄 GitHub Actions Output Utility

### `github-output.sh`

This utility script implements the requirement to output GitHub Actions variables, specifically the command:
```bash
echo "type=push" >> $GITHUB_OUTPUT
```

## 📁 Files Added

- `.github/scripts/github-output.sh` - Main utility script
- `.github/scripts/test-github-output.sh` - Test suite for the utility

## 🚀 Usage

### Basic Commands

```bash
# Output type=push (the specific requirement)
./.github/scripts/github-output.sh push

# Auto-detect GitHub event type
./.github/scripts/github-output.sh detect

# Output custom key-value pairs
./.github/scripts/github-output.sh output "key" "value"

# Show help
./.github/scripts/github-output.sh help
```

### GitHub Actions Integration

In a GitHub Actions workflow:

```yaml
- name: Set Event Type
  run: |
    ./.github/scripts/github-output.sh push
    
- name: Use Output
  run: |
    echo "Event type: ${{ steps.previous-step.outputs.type }}"
```

### Environment Variables

The script responds to these GitHub Actions environment variables:
- `GITHUB_OUTPUT` - Target file for outputs
- `GITHUB_EVENT_NAME` - Event type detection
- `GITHUB_REF_NAME` - Branch name
- `GITHUB_SHA` - Commit SHA
- `GITHUB_ACTOR` - User/actor

## 🧪 Testing

Run the test suite:
```bash
./.github/scripts/test-github-output.sh
```

## ✨ Integration with Lichtara OS

This utility follows the spiritual automation conventions of the Lichtara OS project:
- Uses emoji prefixes in help text 🔮
- Provides clear success/failure indicators ✅❌
- Maintains harmony with existing scripts
- Supports the Aurora field automation system

## 🎯 Requirement Fulfillment

This implementation specifically addresses the requirement:
```bash
echo "type=push" >> $GITHUB_OUTPUT
```

The script provides multiple ways to achieve this:
1. Direct command: `./github-output.sh push`
2. Custom output: `./github-output.sh output "type" "push"`
3. Auto-detection: `./github-output.sh detect` (when GITHUB_EVENT_NAME=push)
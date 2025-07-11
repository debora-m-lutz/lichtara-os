# Scripts | Scripts

## Português

### Scripts de Automação

Esta pasta contém scripts de automação para o repositório Aurorabridge.

#### `apply-branch-protection.sh`

Script para aplicar as regras de proteção de ramificação usando o GitHub CLI.

**Uso:**
```bash
# Tornar o script executável
chmod +x scripts/apply-branch-protection.sh

# Executar o script
./scripts/apply-branch-protection.sh
```

**Pré-requisitos:**
- GitHub CLI instalado (`gh`)
- Autenticação configurada (`gh auth login`)
- Permissões de administrador no repositório

---

## English

### Automation Scripts

This folder contains automation scripts for the Aurorabridge repository.

#### `apply-branch-protection.sh`

Script to apply branch protection rules using GitHub CLI.

**Usage:**
```bash
# Make script executable
chmod +x scripts/apply-branch-protection.sh

# Run the script
./scripts/apply-branch-protection.sh
```

**Prerequisites:**
- GitHub CLI installed (`gh`)
- Authentication configured (`gh auth login`)
- Administrator permissions on the repository
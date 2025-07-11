# Branch Protection Setup Guide | Guia de Configuração de Proteção de Branch

## English

### Overview
This guide explains how to protect the main branch of this repository against forced pushes, deletions, and ensure status checks are required before merging.

### Steps to Enable Branch Protection

1. **Navigate to Repository Settings**
   - Go to your repository on GitHub
   - Click on "Settings" tab
   - Click on "Branches" in the left sidebar

2. **Add Branch Protection Rule**
   - Click "Add rule"
   - Enter branch name pattern: `main` (or `master` if using master branch)

3. **Configure Protection Settings**
   - ✅ **Restrict pushes that create files larger than 100 MB**
   - ✅ **Require status checks to pass before merging**
     - Select "Require branches to be up to date before merging"
     - Add status checks:
       - `CI Tests` (if you have CI workflows)
       - `Documentation Check`
       - `Security Scan`
   - ✅ **Require pull request reviews before merging**
     - Require at least 1 review
     - Dismiss stale reviews when new commits are pushed
     - Require review from code owners (if CODEOWNERS file exists)
   - ✅ **Require signed commits**
   - ✅ **Require linear history**
   - ✅ **Include administrators** (applies rules to repository administrators)
   - ✅ **Restrict pushes that create files larger than specified limit**

4. **Force Push and Deletion Protection**
   - ✅ **Restrict force pushes**
   - ✅ **Allow deletions** (keep unchecked to prevent deletion)

### Recommended GitHub Actions Status Checks
This repository includes workflows that can serve as required status checks:
- Documentation validation
- Security scanning
- Code quality checks

---

## Português

### Visão Geral
Este guia explica como proteger o branch principal deste repositório contra pushes forçados, exclusões e garantir que verificações de status sejam obrigatórias antes da mesclagem.

### Passos para Habilitar a Proteção de Branch

1. **Navegar para as Configurações do Repositório**
   - Vá para seu repositório no GitHub
   - Clique na aba "Settings"
   - Clique em "Branches" na barra lateral esquerda

2. **Adicionar Regra de Proteção de Branch**
   - Clique em "Add rule"
   - Digite o padrão do nome do branch: `main` (ou `master` se usando branch master)

3. **Configurar Definições de Proteção**
   - ✅ **Restringir pushes que criam arquivos maiores que 100 MB**
   - ✅ **Exigir que verificações de status passem antes da mesclagem**
     - Selecione "Require branches to be up to date before merging"
     - Adicione verificações de status:
       - `CI Tests` (se você tem workflows de CI)
       - `Documentation Check`
       - `Security Scan`
   - ✅ **Exigir revisões de pull request antes da mesclagem**
     - Exigir pelo menos 1 revisão
     - Descartar revisões obsoletas quando novos commits são enviados
     - Exigir revisão dos proprietários do código (se arquivo CODEOWNERS existir)
   - ✅ **Exigir commits assinados**
   - ✅ **Exigir histórico linear**
   - ✅ **Incluir administradores** (aplica regras aos administradores do repositório)
   - ✅ **Restringir pushes que criam arquivos maiores que o limite especificado**

4. **Proteção contra Push Forçado e Exclusão**
   - ✅ **Restringir pushes forçados**
   - ✅ **Permitir exclusões** (manter desmarcado para prevenir exclusão)

### Verificações de Status do GitHub Actions Recomendadas
Este repositório inclui workflows que podem servir como verificações de status obrigatórias:
- Validação de documentação
- Verificação de segurança
- Verificações de qualidade de código
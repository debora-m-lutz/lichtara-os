# Proteção de Ramificação | Branch Protection

## Português

### Conjuntos de Regras de Ramificação

Este documento define as regras de proteção para as ramificações mais importantes do repositório Aurorabridge. Os conjuntos de regras estabelecem controles sobre:

- **Exclusão de ramificações**: Colaboradores não podem excluir ramificações protegidas
- **Push forçado**: Push com `--force` é bloqueado em ramificações protegidas  
- **Verificações de status**: Todas as verificações devem passar antes do merge
- **Histórico linear**: Commits de merge não são permitidos, use rebase

### Ramificações Protegidas

- **main**: Ramificação principal de produção
- **master**: Ramificação alternativa principal (se existir)
- **develop**: Ramificação de desenvolvimento principal

### Regras Implementadas

#### 1. Verificação de Histórico Linear
- ✅ **Obrigatório**: Histórico de commits deve ser linear
- ❌ **Bloqueado**: Commits de merge em pull requests
- 🔄 **Solução**: Use `git rebase` em vez de `git merge`

#### 2. Verificação de Qualidade do Código
- ✅ **Estrutura**: Todos os diretórios principais devem ter README.md
- ✅ **Segurança**: Verificação automática de informações sensíveis
- ✅ **Documentação**: Consistência na estrutura de documentação

#### 3. Convenções de Commit
- ✅ **Mensagens**: Commits devem ter mensagens descritivas (mínimo 10 caracteres)
- ✅ **Clareza**: Commits devem explicar claramente as mudanças

### Fluxo de Trabalho

1. **Criar branch** a partir de `main` ou `develop`
2. **Fazer commits** seguindo as convenções
3. **Abrir Pull Request** para a ramificação de destino
4. **Verificações automáticas** são executadas
5. **Revisão** por mantenedores (se configurado)
6. **Merge** apenas se todas as verificações passarem

### Comandos Úteis

```bash
# Verificar histórico linear local
git log --oneline --graph

# Fazer rebase interativo
git rebase -i main

# Verificar commits antes do push
git log --oneline main..HEAD
```

---

## English

### Branch Rule Sets

This document defines protection rules for the most important branches in the Aurorabridge repository. Rule sets establish controls over:

- **Branch deletion**: Collaborators cannot delete protected branches
- **Force push**: Push with `--force` is blocked on protected branches
- **Status checks**: All checks must pass before merging
- **Linear history**: Merge commits are not allowed, use rebase

### Protected Branches

- **main**: Main production branch
- **master**: Alternative main branch (if it exists)
- **develop**: Main development branch

### Implemented Rules

#### 1. Linear History Verification
- ✅ **Required**: Commit history must be linear
- ❌ **Blocked**: Merge commits in pull requests
- 🔄 **Solution**: Use `git rebase` instead of `git merge`

#### 2. Code Quality Check
- ✅ **Structure**: All main directories must have README.md
- ✅ **Security**: Automatic checking for sensitive information
- ✅ **Documentation**: Consistency in documentation structure

#### 3. Commit Conventions
- ✅ **Messages**: Commits must have descriptive messages (minimum 10 characters)
- ✅ **Clarity**: Commits must clearly explain changes

### Workflow

1. **Create branch** from `main` or `develop`
2. **Make commits** following conventions
3. **Open Pull Request** to target branch
4. **Automatic checks** are executed
5. **Review** by maintainers (if configured)
6. **Merge** only if all checks pass

### Useful Commands

```bash
# Check local linear history
git log --oneline --graph

# Perform interactive rebase
git rebase -i main

# Check commits before push
git log --oneline main..HEAD
```

---

## Configuração Técnica | Technical Configuration

### GitHub Actions Workflow

O arquivo `.github/workflows/branch-protection.yml` implementa as seguintes verificações:

- **linear-history-check**: Verifica histórico linear em PRs
- **code-quality**: Valida estrutura e segurança do código
- **commit-convention**: Verifica convenções de commit
- **protection-status**: Status final de todas as verificações

### Customização

Para modificar as regras, edite o arquivo `.github/workflows/branch-protection.yml` e ajuste:

- Ramificações protegidas na seção `branches`
- Critérios de verificação nos jobs individuais
- Mensagens de erro e sucesso

---

> **Nota**: Esta configuração garante que apenas mudanças de alta qualidade sejam integradas às ramificações principais, mantendo a integridade do repositório Aurorabridge.
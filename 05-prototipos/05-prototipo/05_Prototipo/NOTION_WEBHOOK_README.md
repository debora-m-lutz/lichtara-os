# Integração Webhook com Notion - Lichtara OS

## Visão Geral

Esta implementação adiciona funcionalidade de webhook para integração com o workspace Notion. O sistema permite:

- Receber webhooks do Notion quando páginas são criadas/atualizadas
- Criar páginas no Notion via API
- Listar páginas do workspace
- Testar a conectividade da API

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na pasta `05-prototipos/05-prototipo/05_Prototipo/`:

```bash
NOTION_API_KEY=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
NOTION_WEBHOOK_SECRET=seu_webhook_secret_aqui
PORT=3001
NODE_ENV=development
```

### 2. Dependências

A integração usa o SDK oficial do Notion:
- `@notionhq/client` - SDK oficial do Notion
- `dotenv` - Para carregar variáveis de ambiente

## API Endpoints

### Webhooks do Notion

**POST `/api/notion/webhook`**
- Recebe webhooks do Notion
- Valida assinatura do webhook (em produção)
- Processa eventos: `page_created`, `page_updated`, `database_updated`

### Operações de Páginas

**POST `/api/notion/pages`**
```json
{
  "title": "Título da Página",
  "content": "Conteúdo da página",
  "parentId": "id_da_pagina_pai_opcional"
}
```

**GET `/api/notion/pages`**
- Lista páginas do workspace
- Retorna ID, título e metadados

### Teste de Conectividade

**GET `/api/notion/test`**
- Testa a conexão com a API do Notion
- Verifica se o token de integração está funcionando

### Endpoints de Desenvolvimento

**POST `/api/test/webhook`**
- Endpoint para testar recebimento de webhooks
- Usado para desenvolvimento e debug

**POST `/api/test/create-page`**
- Cria uma página de teste no Notion
- Demonstra a funcionalidade de criação

## Como Configurar no Notion

1. **Criar Integração Interna**:
   - Acesse https://www.notion.so/my-integrations
   - Clique em "New integration"
   - Configure o nome e workspace
   - Copie o "Internal Integration Token"

2. **Configurar Webhook**:
   - Na página da integração, adicione o endpoint webhook
   - URL: `https://seu-dominio.com/api/notion/webhook`
   - Selecione os eventos que deseja receber

3. **Dar Permissões**:
   - Convide a integração para páginas/bancos de dados
   - Use o botão "Share" nas páginas do Notion

## Segurança

- O webhook valida assinaturas em produção
- Variáveis de ambiente protegem credenciais
- Token de integração limitado ao workspace configurado

## Logs e Monitoramento

O sistema registra:
- ✨ Páginas criadas
- 🔗 Webhooks recebidos
- ❌ Erros de conectividade
- 🧪 Testes realizados

## Estrutura de Arquivos

```
server/
├── index.ts              # Servidor principal com rotas
├── notion-webhook.ts     # Lógica de integração com Notion
├── webhook-test.ts       # Endpoints de teste
└── cleanup.ts           # Limpeza de recursos
```

## Exemplo de Uso

### Teste de Conectividade
```bash
curl -X GET http://localhost:3001/api/notion/test
```

### Criar Página
```bash
curl -X POST http://localhost:3001/api/notion/pages \
  -H "Content-Type: application/json" \
  -d '{"title": "Nova Página", "content": "Conteúdo da página"}'
```

### Simular Webhook
```bash
curl -X POST http://localhost:3001/api/notion/webhook \
  -H "Content-Type: application/json" \
  -d '{"type": "page_created", "data": {"id": "123", "title": "Página Teste"}}'
```

## Notas de Desenvolvimento

- Em desenvolvimento, a validação de assinatura é desabilitada
- Use `NODE_ENV=production` para habilitar validação completa
- O endpoint de teste está disponível apenas em desenvolvimento
- Logs detalhados ajudam no debugging da integração
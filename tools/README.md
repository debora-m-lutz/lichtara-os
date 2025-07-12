# Notion Integration Tool | Ferramenta de Integração com Notion

Esta ferramenta permite criar páginas no Notion através de canalizações de texto, integrando o processo criativo do Lichtara OS com a organização digital.

This tool allows creating pages in Notion through text channeling, integrating the creative process of Lichtara OS with digital organization.

## ⚡ Quick Start | Início Rápido

```bash
# 1. Navigate to tools directory
cd tools

# 2. Configure environment (copy and edit)
cp .env.example .env
# Edit .env with your Notion credentials

# 3. Install dependencies (optional, script works without python-dotenv)
pip install -r requirements.txt

# 4. Run the tool
python3 notion_integration.py
```

## 🚀 Setup | Configuração

### 1. Instalação das Dependências | Dependencies Installation

```bash
cd tools
pip install -r requirements.txt
```

**Nota**: A dependência `python-dotenv` é opcional. O script funciona sem ela, carregando variáveis de ambiente diretamente do arquivo `.env`.

**Note**: The `python-dotenv` dependency is optional. The script works without it, loading environment variables directly from the `.env` file.

### 2. Configuração do Ambiente | Environment Configuration

1. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```

2. Configure suas credenciais no arquivo `.env`:
   - `NOTION_TOKEN`: Token de integração do Notion (obtenha em https://www.notion.so/my-integrations)
   - `NOTION_DATABASE_ID`: ID do database onde as páginas serão criadas

### 3. Configuração do Notion

1. Crie uma integração no Notion:
   - Acesse https://www.notion.so/my-integrations
   - Clique em "New integration"
   - Nomeie sua integração (ex: "Lichtara OS Channeling")
   - Copie o "Internal Integration Token"

2. Configure o database:
   - Crie ou acesse um database no Notion
   - Clique em "..." → "Connections" → Adicione sua integração
   - Copie o ID do database da URL (a string de 32 caracteres)

## 📝 Uso | Usage

### Execução Interativa | Interactive Execution

```bash
cd tools
python3 notion_integration.py
```

O script solicitará:
- **Título da Canalização**: O título da página que será criada
- **Texto Canalizado**: O conteúdo que será adicionado à página

### Uso Programático | Programmatic Usage

```python
from notion_integration import canalizar_para_notion

# Criar uma nova página
canalizar_para_notion("Meu Título", "Meu texto canalizado...")
```

### Usando Variáveis de Ambiente | Using Environment Variables

```bash
# Direto da linha de comando
NOTION_TOKEN=your_token NOTION_DATABASE_ID=your_db_id python3 notion_integration.py

# Ou definindo no shell
export NOTION_TOKEN=your_token
export NOTION_DATABASE_ID=your_db_id
python3 notion_integration.py
```

## 🌟 Funcionalidades | Features

- ✅ Criação automática de páginas no Notion
- ✅ Configuração através de variáveis de ambiente
- ✅ Interface interativa para entrada de dados
- ✅ Feedback imediato sobre o status da operação
- ✅ Suporte completo ao português (canalizações)
- ✅ Funcionamento independente de python-dotenv
- ✅ Carregamento automático de arquivos .env

## 🔧 Estrutura da Página Criada | Created Page Structure

Cada página criada contém:
- **Título**: Campo "Name" do database
- **Conteúdo**: Bloco de parágrafo com o texto canalizado

## 🚨 Troubleshooting

### Erros Comuns | Common Errors

1. **401 Unauthorized**: Verifique se o NOTION_TOKEN está correto
2. **404 Not Found**: Verifique se o NOTION_DATABASE_ID está correto e se a integração tem acesso ao database
3. **400 Bad Request**: Verifique se o database tem uma propriedade "Name" do tipo "Title"
4. **ModuleNotFoundError**: Apenas o módulo `requests` é obrigatório. O script funciona sem `python-dotenv`

### Logs de Debug

O script imprime:
- Status code da requisição HTTP
- Resposta completa da API do Notion

## 📚 Referências | References

- [Notion API Documentation](https://developers.notion.com/)
- [Lichtara OS Documentation](../README.md)

---

*Ferramenta desenvolvida para o ecossistema Lichtara OS - Bridging spiritual wisdom and cutting-edge technology*
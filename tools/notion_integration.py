import os
import requests

# Tenta carregar variáveis do arquivo .env se python-dotenv estiver disponível
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # Se python-dotenv não estiver disponível, carrega variáveis de ambiente diretamente
    # ou de um arquivo .env simples
    env_file = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_file):
        with open(env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()

NOTION_TOKEN = os.getenv("NOTION_TOKEN")
NOTION_DATABASE_ID = os.getenv("NOTION_DATABASE_ID")

def canalizar_para_notion(titulo, texto):
    url = "https://api.notion.com/v1/pages"
    
    payload = {
        "parent": { "database_id": NOTION_DATABASE_ID },
        "properties": {
            "Name": {
                "title": [
                    {
                        "text": {
                            "content": titulo
                        }
                    }
                ]
            }
        },
        "children": [
            {
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "text": [
                        {
                            "type": "text",
                            "text": {
                                "content": texto
                            }
                        }
                    ]
                }
            }
        ]
    }
    
    headers = {
        "Authorization": f"Bearer {NOTION_TOKEN}",
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
    }
    
    response = requests.post(url, headers=headers, json=payload)
    print("✅ Canalização enviada:", response.status_code)
    print(response.json())

# Execução interativa
if __name__ == "__main__":
    titulo = input("Título da Canalização: ")
    texto = input("Texto Canalizado: ")
    canalizar_para_notion(titulo, texto)
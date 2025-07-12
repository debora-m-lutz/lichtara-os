# Lichtara Prototype v1 (Initial Version)

Esta é a versão inicial do protótipo do Lichtara OS, representando o primeiro conceito funcional do sistema.

*This is the initial version of the Lichtara OS prototype, representing the first functional concept of the system.*

## Características | Features

- React frontend com TypeScript
- Node.js/Express backend com OAuth 2.0 support
- Drizzle ORM para database
- Sistema de autenticação e autorização OAuth
- Interface de usuário com Radix UI
- Tailwind CSS para estilização
- OpenAI GPT integration support

## OAuth 2.0 Authorization Code Flow

This prototype includes a complete OAuth 2.0 authorization code flow implementation specifically designed for OpenAI GPT integrations.

### Key Features:
- ✅ OAuth 2.0 authorization code grant type support
- ✅ OpenAI GPT callback URI validation
- ✅ Comprehensive parameter validation
- ✅ Detailed error handling with standard OAuth error codes
- ✅ Access token and refresh token generation
- ✅ Built-in test suite

### Quick Test:
```bash
npm run test:oauth
```

For detailed OAuth documentation, see [OAUTH_README.md](./OAUTH_README.md).

## Instalação | Installation

```bash
npm install
npm run dev
```

## Scripts Disponíveis | Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run check` | TypeScript type checking |
| `npm run test:oauth` | Run OAuth endpoint tests |

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/portal-lumora` - Portal Lumora information
- `POST /api/openai` - OpenAI interaction endpoint
- `POST /oauth/token` - OAuth 2.0 token endpoint for authorization code flow

## Status

Esta versão serve como referência histórica e demonstração do desenvolvimento inicial do projeto, agora com funcionalidade OAuth completa para integrações GPT.

*This version serves as a historical reference and demonstration of the initial development of the project, now with complete OAuth functionality for GPT integrations.*
# Lichtara Prototype v1 (Initial Version)

Esta é a versão inicial do protótipo do Lichtara OS, representando o primeiro conceito funcional do sistema.

*This is the initial version of the Lichtara OS prototype, representing the first functional concept of the system.*

## Características | Features

- React frontend com TypeScript
- Node.js/Express backend with orphan process cleanup
- Drizzle ORM para database
- Sistema de autenticação
- Interface de usuário com Radix UI
- Tailwind CSS para estilização
- **🛡️ Orphan Process Prevention System**

## Instalação | Installation

```bash
npm install
npm run dev
```

## 🚀 Server Management

Use the server manager script for better development experience:

```bash
# Start server with process tracking
./server-manager.sh start

# Stop server gracefully
./server-manager.sh stop

# Check server status
./server-manager.sh status

# Clean up orphan processes
./server-manager.sh cleanup

# View server logs
./server-manager.sh logs
```

## 🧪 Testing

```bash
# Run comprehensive cleanup tests
./verify-cleanup.sh

# Run simple orphan process test
./test-orphan-cleanup.sh

# Check TypeScript compilation
npm run check
```

## 🛡️ Orphan Process Cleanup

This prototype includes a comprehensive orphan process cleanup system that:

- Prevents Node.js servers from becoming orphan processes
- Handles graceful shutdown with SIGTERM/SIGINT
- Tracks and cleans up HTTP connections and WebSocket connections
- Provides tools for detecting and cleaning up orphan processes
- Includes automated testing to ensure reliability

See `CLEANUP_GUIDE.md` and `SOLUTION_SUMMARY.md` for detailed documentation.

## Status

Esta versão serve como referência histórica e demonstração do desenvolvimento inicial do projeto, agora com sistema robusto de prevenção de processos órfãos.

*This version serves as a historical reference and demonstration of the initial development of the project, now with a robust orphan process prevention system.*
# Portal Lumora Server

A Node.js server with graceful shutdown functionality, WebSocket support, and Portal Lumora integration.

## Features

- **HTTP Server**: Express server running on port 3001
- **WebSocket Server**: Real-time communication support on the same port
- **Graceful Shutdown**: Proper cleanup of all resources on SIGTERM/SIGINT
- **Portal Lumora API**: Integrated spiritual-technology interface
- **Health Monitoring**: Basic health check endpoint

## Quick Start

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build-server

# Run in production
npm start
```

## Server Output

**Startup:**
```
🚀 Server running on port 3001
📱 WebSocket server is also running on port 3001
🌟 Portal Lumora is active and ready for connections
🛡️  Graceful shutdown handlers are registered
```

**Graceful Shutdown (Ctrl+C):**
```
🔄 Received SIGTERM. Starting graceful shutdown...
🌟 Cleaning up 3 resources...
🔌 Cleaning up: HTTP Connections
🔌 Cleaning up: WebSocket Server
🔌 Cleaning up: HTTP Server
✅ Graceful shutdown completed
```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/portal-lumora` - Portal Lumora spiritual interface

## WebSocket

The server includes a WebSocket server for real-time communication. Connect to `ws://localhost:3001` to establish a WebSocket connection.

## Architecture

The server implements proper resource management with tracking of:
1. HTTP Server
2. HTTP Connections
3. WebSocket Server

All resources are properly cleaned up during graceful shutdown to prevent resource leaks and ensure clean process termination.
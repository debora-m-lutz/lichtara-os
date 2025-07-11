# Core Cleanup Manager

A robust process cleanup utility for Node.js applications that handles graceful shutdown and prevents orphan processes.

## Installation

The cleanup manager is available at `./core/cleanup` and can be imported using CommonJS:

```javascript
const { 
  ProcessCleanupManager, 
  createServerCleanup, 
  createConnectionsCleanup, 
  createWebSocketCleanup 
} = require('./core/cleanup');
```

## Quick Start

```javascript
const { 
  ProcessCleanupManager, 
  createServerCleanup, 
  createConnectionsCleanup, 
  createWebSocketCleanup 
} = require('./core/cleanup');

// Create cleanup manager with custom options
const cleanup = new ProcessCleanupManager({
  timeout: 10000,  // 10 second timeout
  logPrefix: '🌟'
});

// Register resources for cleanup
cleanup.registerResources([
  createServerCleanup(server),
  createConnectionsCleanup(activeConnections),
  createWebSocketCleanup(wss, activeWebSockets)
]);

// Cleanup happens automatically on process exit, or manually:
await cleanup.cleanup();
```

## API Reference

### ProcessCleanupManager

#### Constructor Options

- `timeout` (number): Timeout in milliseconds for graceful shutdown (default: 10000)
- `forceExitOnTimeout` (boolean): Whether to force exit after timeout (default: true)
- `logPrefix` (string): Prefix for log messages (default: '🔄')

#### Methods

- `registerResource(resource)`: Register a single cleanup resource
- `registerResources(resources)`: Register multiple cleanup resources
- `unregisterResource(name)`: Remove a resource by name
- `cleanup()`: Manually trigger cleanup without exiting the process
- `gracefulShutdown(signal, exitCode)`: Perform graceful shutdown and exit

### Helper Functions

#### createServerCleanup(server)
Creates a cleanup resource for HTTP servers.

#### createConnectionsCleanup(connections)
Creates a cleanup resource for active HTTP connections (Set or Array).

#### createWebSocketCleanup(wss, connections)
Creates a cleanup resource for WebSocket servers and optionally active WebSocket connections.

#### createDatabaseCleanup(db)
Creates a cleanup resource for database connections.

## Features

- **Automatic Signal Handling**: Automatically handles SIGTERM, SIGINT, uncaught exceptions, and unhandled promise rejections
- **Manual Cleanup**: Support for manual cleanup without process termination
- **Timeout Protection**: Configurable timeout with force exit option
- **Resource Management**: Easy registration and management of cleanup resources
- **Detailed Logging**: Comprehensive logging with configurable prefixes
- **Promise-based**: Full async/await support

## Examples

### Express.js Server

```javascript
const express = require('express');
const { ProcessCleanupManager, createServerCleanup, createConnectionsCleanup } = require('./core/cleanup');

const app = express();
const activeConnections = new Set();

const server = app.listen(3000, () => {
  console.log('Server running on port 3000');
});

// Track connections
server.on('connection', (connection) => {
  activeConnections.add(connection);
  connection.on('close', () => {
    activeConnections.delete(connection);
  });
});

// Setup cleanup
const cleanup = new ProcessCleanupManager({
  timeout: 15000,
  logPrefix: '🚀'
});

cleanup.registerResources([
  createServerCleanup(server),
  createConnectionsCleanup(activeConnections)
]);
```

### WebSocket Server

```javascript
const WebSocket = require('ws');
const { ProcessCleanupManager, createWebSocketCleanup } = require('./core/cleanup');

const wss = new WebSocket.Server({ port: 8080 });
const activeWebSockets = new Set();

wss.on('connection', (ws) => {
  activeWebSockets.add(ws);
  ws.on('close', () => {
    activeWebSockets.delete(ws);
  });
});

const cleanup = new ProcessCleanupManager({
  logPrefix: '🌐'
});

cleanup.registerResource(
  createWebSocketCleanup(wss, activeWebSockets)
);
```

### Custom Resource

```javascript
const { ProcessCleanupManager } = require('./core/cleanup');

const cleanup = new ProcessCleanupManager();

cleanup.registerResource({
  name: 'Custom Resource',
  cleanup: async () => {
    // Your custom cleanup logic here
    console.log('Cleaning up custom resource...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Custom resource cleaned up');
  }
});
```
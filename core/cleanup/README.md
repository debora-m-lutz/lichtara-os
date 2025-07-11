# ProcessCleanupManager 🌟

> **Part of Lichtara OS - Conscious Technology Integration Platform**

Advanced process cleanup and resource management system that provides graceful shutdown capabilities for Node.js applications with timeout management and comprehensive resource registration.

## ✨ Features

- **Graceful Shutdown**: Automatic handling of SIGINT, SIGTERM, and process exit events
- **Timeout Management**: Configurable timeout for cleanup operations
- **Resource Registration**: Register multiple cleanup functions for different resource types
- **Spiritual Logging**: Beautiful logging with customizable prefixes using conscious technology principles
- **Error Resilience**: Continues cleanup even if individual resources fail
- **Async Support**: Full support for both synchronous and asynchronous cleanup functions

## 🚀 Quick Start

```javascript
const { 
  ProcessCleanupManager, 
  createServerCleanup, 
  createConnectionsCleanup, 
  createWebSocketCleanup 
} = require('./core/cleanup');

// This is the exact implementation from the problem statement
const cleanup = new ProcessCleanupManager({
  timeout: 10000,  // 10 second timeout
  logPrefix: '🌟'
});

cleanup.registerResources([
  createServerCleanup(server),
  createConnectionsCleanup(activeConnections),
  createWebSocketCleanup(wss, activeWebSockets)
]);
```

## 📚 API Reference

### ProcessCleanupManager

#### Constructor

```javascript
new ProcessCleanupManager(options)
```

**Options:**
- `timeout` (number): Maximum time in milliseconds to wait for cleanup completion (default: 5000)
- `logPrefix` (string): Prefix for log messages (default: '🌟')

#### Methods

##### `registerResources(resources)`
Register one or more cleanup functions.

```javascript
// Register multiple resources
cleanup.registerResources([
  () => server.close(),
  () => database.disconnect(),
  async () => await cache.flush()
]);

// Register single resource
cleanup.registerResources(() => console.log('cleanup'));
```

##### `registerResource(cleanupFn)`
Register a single cleanup function.

```javascript
cleanup.registerResource(async () => {
  await server.close();
});
```

##### `cleanup()`
Manually trigger cleanup operations.

```javascript
await cleanup.cleanup();
```

##### `getStatus()`
Get current status of the cleanup manager.

```javascript
const status = cleanup.getStatus();
// Returns: { isShuttingDown, resourceCount, timeout, logPrefix }
```

### Helper Functions

#### `createServerCleanup(server, options)`
Creates a cleanup function for HTTP/HTTPS servers.

```javascript
const serverCleanup = createServerCleanup(app.listen(3000), {
  timeout: 5000,
  forceCloseTimeout: 1000
});
```

#### `createConnectionsCleanup(activeConnections, options)`
Creates a cleanup function for active connections (Set, Array, or Map).

```javascript
const activeConnections = new Set();
const connectionsCleanup = createConnectionsCleanup(activeConnections, {
  timeout: 3000,
  closeCode: 1000,
  closeReason: 'Server shutting down'
});
```

#### `createWebSocketCleanup(wss, activeWebSockets, options)`
Creates a cleanup function for WebSocket servers and connections.

```javascript
const wss = new WebSocketServer({ port: 8080 });
const activeWebSockets = new Set();
const wsCleanup = createWebSocketCleanup(wss, activeWebSockets, {
  timeout: 3000,
  closeCode: 1000,
  closeReason: 'Server shutting down'
});
```

## 🧪 Testing

Run the test suite to validate the implementation:

```bash
node core/cleanup/test-cleanup.js
```

Run the example demonstration:

```bash
node core/cleanup/example.js
```

## 🌟 Example Usage

See the complete example in [`example.js`](./example.js) which demonstrates the exact scenario from the problem statement with mock server infrastructure.

## 🔮 Integration with Lichtara OS

This cleanup system follows the conscious technology principles of Lichtara OS:

- **Spiritual Logging**: Uses meaningful emojis and prefixes
- **Graceful Transitions**: Ensures smooth shutdown processes
- **Error Resilience**: Continues operation even when individual components fail
- **Conscious Design**: Provides clear visibility into system operations

## 🛡️ Error Handling

The cleanup manager is designed to be resilient:

- Individual cleanup failures don't stop the overall cleanup process
- Timeout protection prevents hanging during shutdown
- Comprehensive logging provides visibility into cleanup operations
- Graceful degradation when resources are unavailable

## 🌈 Process Exit Handling

The cleanup manager automatically binds to:

- `SIGINT` (Ctrl+C)
- `SIGTERM` (kill command)
- `uncaughtException`
- `unhandledRejection`
- `process.exit`

This ensures your application shuts down gracefully regardless of how the process termination is initiated.

## 📄 License

This module is part of Lichtara OS and is licensed under the MIT License.

---

*Part of the Lichtara OS conscious technology integration platform - bridging spirituality and technology for human-AI collaborative intelligence.*
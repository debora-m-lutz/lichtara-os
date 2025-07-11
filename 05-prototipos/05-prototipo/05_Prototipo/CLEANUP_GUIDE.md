# Process Cleanup and Orphan Prevention

This document explains the orphan process cleanup implementation for Lichtara OS servers.

## Problem

Node.js servers can become orphan processes when they don't handle termination signals properly. This leads to:

- Processes consuming resources after termination
- Port conflicts when restarting servers
- Memory leaks and resource exhaustion
- Development environment instability

## Solution

We've implemented a comprehensive process cleanup system with the following components:

### 1. Graceful Shutdown Handler (`server/cleanup.ts`)

A reusable utility that manages resource cleanup during server shutdown:

```typescript
import { ProcessCleanupManager, createServerCleanup } from './cleanup.js';

const cleanup = new ProcessCleanupManager({
  timeout: 10000,  // 10 second timeout
  logPrefix: '🌟'
});

cleanup.registerResource(createServerCleanup(server));
```

**Features:**
- Handles SIGTERM, SIGINT, uncaught exceptions, and unhandled rejections
- Configurable timeout for forceful shutdown
- Resource registry for cleanup functions
- Detailed logging of cleanup process

### 2. Enhanced Server Implementation (`server/index.ts`)

The main server file now includes:

- Connection tracking for proper cleanup
- WebSocket connection management
- Graceful shutdown integration
- Resource registration

### 3. Server Manager Script (`server-manager.sh`)

A bash script that helps manage server lifecycle:

```bash
./server-manager.sh start     # Start server with PID tracking
./server-manager.sh stop      # Graceful shutdown
./server-manager.sh status    # Check server status
./server-manager.sh cleanup   # Find and terminate orphan processes
./server-manager.sh logs      # View server logs
```

## How It Works

### Startup Process
1. Server starts and registers cleanup resources
2. PID is tracked in `.server.pid` file
3. All connections are monitored
4. Signal handlers are registered

### Shutdown Process
1. Signal received (SIGTERM/SIGINT)
2. Cleanup manager starts graceful shutdown
3. All registered resources are cleaned up:
   - HTTP connections closed
   - WebSocket connections terminated
   - Server socket closed
   - Database connections closed (if any)
4. Process exits cleanly

### Orphan Detection
The server manager can detect orphan processes by:
- Checking for Node.js processes related to the project
- Comparing running processes with expected patterns
- Offering to terminate orphan processes

## Usage Examples

### Basic Server with Cleanup
```typescript
import { ProcessCleanupManager, createServerCleanup } from './cleanup.js';

const server = app.listen(PORT);
const cleanup = new ProcessCleanupManager();
cleanup.registerResource(createServerCleanup(server));
```

### Server with Database Cleanup
```typescript
const cleanup = new ProcessCleanupManager();
cleanup.registerResources([
  createServerCleanup(server),
  createDatabaseCleanup(db),
  createConnectionsCleanup(activeConnections)
]);
```

### Manual Cleanup
```bash
# Check for orphan processes
./server-manager.sh cleanup

# Force stop all related processes
pkill -f "node.*server"
```

## Testing

The cleanup system has been tested with:

1. **Normal Shutdown**: Server responds to SIGTERM/SIGINT
2. **Timeout Scenario**: Forceful shutdown after timeout
3. **Exception Handling**: Cleanup on uncaught exceptions
4. **Connection Cleanup**: All active connections are closed
5. **Orphan Detection**: Manager script finds orphan processes

## Best Practices

1. **Always use the cleanup manager** for new servers
2. **Register all resources** that need cleanup (DB, WebSocket, etc.)
3. **Use the server manager script** for development
4. **Monitor logs** during shutdown to verify cleanup
5. **Set appropriate timeouts** based on your application needs

## Files Modified/Created

- `server/index.ts` - Main server with cleanup integration
- `server/cleanup.ts` - Reusable cleanup utility
- `server-manager.sh` - Server lifecycle management script
- `DEV/zjsons perdidos/_DEV_lumora/server/index.js` - Updated with cleanup
- `package.json` - Updated scripts to use npx tsx

## Verification

To verify the cleanup is working:

1. Start server: `npm run dev`
2. Check process: `ps aux | grep tsx`
3. Send SIGTERM: `pkill -f tsx`
4. Verify cleanup logs appear
5. Confirm no orphan processes remain

The system ensures zero orphan processes after server termination.
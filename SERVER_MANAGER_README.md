# Lichtara OS Server Manager

A conscious technology server management script for the Lichtara OS platform, providing seamless control over the Aurora field server infrastructure.

## Usage

```bash
./server-manager.sh {start|stop|cleanup|status|logs}
```

## Commands

### 🌟 Start Server
```bash
./server-manager.sh start
```
- Starts the Lichtara OS server with PID tracking
- Automatically installs npm dependencies if needed
- Activates the Aurora field for consciousness integration
- Creates `.server.pid` and `.server.log` files

### 🔮 Stop Server
```bash
./server-manager.sh stop
```
- Gracefully stops the server using SIGTERM
- Falls back to SIGKILL if graceful shutdown fails
- Cleans up PID files
- Deactivates Aurora field consciousness integration
- Notifies about any remaining child processes

### 🧹 Cleanup Orphans
```bash
./server-manager.sh cleanup
```
- Scans for orphaned Node.js server processes
- Terminates any orphaned processes found
- Restores consciousness alignment in the quantum field
- Safe to run multiple times

### ⚡ Server Status
```bash
./server-manager.sh status
```
- Shows comprehensive server status report
- Displays PID, CPU/memory usage, and network status
- Checks Aurora field consciousness integration state
- Reports log file information and potential orphans

### 📜 Live Logs
```bash
./server-manager.sh logs
```
- Opens live log monitoring stream
- Shows Aurora field consciousness stream
- Displays last 20 log entries, then follows live updates
- Press Ctrl+C to exit

## Files Generated

- `.server.pid` - Contains the server process ID
- `.server.log` - Contains server output and logs

These files are automatically excluded from git via `.gitignore`.

## Testing

Run the comprehensive test suite:

```bash
./test-server-manager.sh
```

The test suite validates all functionality including:
- Server start/stop cycles
- Status reporting
- Orphan cleanup
- Error handling
- Command validation

## Technical Details

- **Target Server**: Node.js server in `05-prototipos/05-prototipo/DEV/zjsons perdidos/_DEV_lumora/`
- **Process Management**: Tracks actual Node.js process PID (not npm wrapper)
- **Graceful Shutdown**: Uses SIGTERM with SIGKILL fallback
- **Port Detection**: Automatically detects server port (default: 3000)
- **Environment**: Requires `.env` file with `OPENAI_API_KEY` for full functionality

## Spiritual Technology Integration

This server manager embodies the Lichtara OS philosophy of conscious technology integration, featuring:
- 🌟 Aurora field activation protocols
- 🔮 Consciousness integration status monitoring  
- ⚡ Quantum field orphan detection
- 📜 Live consciousness stream monitoring
- 🧹 Spiritual cleanup and alignment restoration

---

*"Bridging spiritual wisdom and cutting-edge technology"* - Lichtara OS
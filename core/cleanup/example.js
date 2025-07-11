#!/usr/bin/env node

/**
 * Example Usage of ProcessCleanupManager
 * Demonstrates the exact scenario from the problem statement
 */

const { 
  ProcessCleanupManager, 
  createServerCleanup, 
  createConnectionsCleanup, 
  createWebSocketCleanup 
} = require('./index');

// Simulate creating server infrastructure
function createMockServer() {
  return {
    listening: true,
    close: (callback) => {
      console.log('🌟 Mock server is closing...');
      setTimeout(() => {
        console.log('🌟 Mock server closed');
        callback && callback();
      }, 100);
    },
    closeAllConnections: () => {
      console.log('🌟 Force closing all server connections');
    }
  };
}

function createMockConnections() {
  const connections = new Set();
  
  // Add some mock connections
  for (let i = 0; i < 3; i++) {
    connections.add({
      id: `conn-${i}`,
      close: (code, reason) => {
        console.log(`🌟 Connection ${i} closed with code ${code}: ${reason}`);
      },
      end: () => {
        console.log(`🌟 Connection ${i} ended`);
      },
      readyState: 1 // OPEN state
    });
  }
  
  return connections;
}

function createMockWebSocketServer() {
  return {
    close: (callback) => {
      console.log('🌟 Mock WebSocket server is closing...');
      setTimeout(() => {
        console.log('🌟 Mock WebSocket server closed');
        callback && callback();
      }, 100);
    }
  };
}

function createMockActiveWebSockets() {
  const webSockets = new Set();
  
  // Add some mock WebSocket connections
  for (let i = 0; i < 2; i++) {
    webSockets.add({
      id: `ws-${i}`,
      readyState: 1, // WebSocket.OPEN
      close: (code, reason) => {
        console.log(`🌟 WebSocket ${i} closed with code ${code}: ${reason}`);
      },
      terminate: () => {
        console.log(`🌟 WebSocket ${i} terminated`);
      },
      once: (event, callback) => {
        if (event === 'close') {
          setTimeout(callback, 50);
        }
      }
    });
  }
  
  return webSockets;
}

async function demonstrateUsage() {
  console.log('🔮 ProcessCleanupManager Example Usage');
  console.log('=====================================\n');
  
  // Create mock infrastructure
  const server = createMockServer();
  const activeConnections = createMockConnections();
  const wss = createMockWebSocketServer();
  const activeWebSockets = createMockActiveWebSockets();
  
  console.log('🌟 Setting up server infrastructure...');
  console.log(`   - Server: ${server.listening ? 'listening' : 'not listening'}`);
  console.log(`   - Active connections: ${activeConnections.size}`);
  console.log(`   - WebSocket server: ready`);
  console.log(`   - Active WebSockets: ${activeWebSockets.size}\n`);
  
  // This is the exact code from the problem statement
  console.log('✨ Implementing the exact problem statement scenario:\n');
  console.log('const cleanup = new ProcessCleanupManager({');
  console.log('  timeout: 10000,  // 10 second timeout');
  console.log("  logPrefix: '🌟'");
  console.log('});');
  console.log('');
  console.log('cleanup.registerResources([');
  console.log('  createServerCleanup(server),');
  console.log('  createConnectionsCleanup(activeConnections),');
  console.log('  createWebSocketCleanup(wss, activeWebSockets)');
  console.log(']);');
  console.log('\n' + '='.repeat(50) + '\n');
  
  const cleanup = new ProcessCleanupManager({
    timeout: 10000,  // 10 second timeout
    logPrefix: '🌟'
  });

  cleanup.registerResources([
    createServerCleanup(server),
    createConnectionsCleanup(activeConnections),
    createWebSocketCleanup(wss, activeWebSockets)
  ]);
  
  console.log('🌟 ProcessCleanupManager configured successfully!');
  console.log('🌟 Status:', JSON.stringify(cleanup.getStatus(), null, 2));
  console.log('');
  
  // Demonstrate manual cleanup (normally this would happen on process exit)
  console.log('🌟 Demonstrating manual cleanup execution...\n');
  await cleanup.cleanup();
  
  console.log('\n✨ Cleanup completed! In a real application, this would happen');
  console.log('   automatically when the process receives SIGINT, SIGTERM, or exits.');
  console.log('\n🌟 The ProcessCleanupManager ensures graceful shutdown of all resources');
  console.log('   while respecting the timeout and providing detailed logging.');
}

// Run the demonstration
if (require.main === module) {
  demonstrateUsage().catch(console.error);
}

module.exports = { demonstrateUsage };
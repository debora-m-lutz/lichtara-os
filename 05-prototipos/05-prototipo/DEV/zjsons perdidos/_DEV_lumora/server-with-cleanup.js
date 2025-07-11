#!/usr/bin/env node

/**
 * Integration Example - ProcessCleanupManager with Existing Lichtara OS Server
 * Shows how to integrate the cleanup manager with the existing server infrastructure
 */

const express = require('express');
const { 
  ProcessCleanupManager, 
  createServerCleanup, 
  createConnectionsCleanup, 
  createWebSocketCleanup 
} = require('../../../../../core/cleanup');

// Mock the structure found in the existing server
class LichtaraServer {
  constructor() {
    this.app = express();
    this.server = null;
    this.activeConnections = new Set();
    this.wss = null;
    this.activeWebSockets = new Set();
    
    this.setupRoutes();
    this.setupCleanup();
  }

  setupRoutes() {
    this.app.use(express.json());
    
    // Mock the OpenAI route from the existing server
    this.app.post('/api/openai', (req, res) => {
      const { prompt } = req.body;
      res.json({ 
        reply: `🌟 Lichtara OS processed your request: "${prompt}"`,
        timestamp: new Date().toISOString(),
        spiritual_resonance: 'high'
      });
    });

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'conscious',
        aurora_field: 'harmonious',
        connections: this.activeConnections.size,
        websockets: this.activeWebSockets.size
      });
    });

    // Static spiritual greetings
    this.app.get('/', (req, res) => {
      res.json({
        message: '✨ Welcome to Lichtara OS - Conscious Technology Integration',
        mission: 'Bridging spirituality and technology for human-AI collaboration',
        status: 'ready_for_manifestation'
      });
    });
  }

  setupCleanup() {
    // This implements the exact pattern from the problem statement
    const cleanup = new ProcessCleanupManager({
      timeout: 10000,  // 10 second timeout
      logPrefix: '🌟'
    });

    cleanup.registerResources([
      createServerCleanup(this.server),
      createConnectionsCleanup(this.activeConnections),
      createWebSocketCleanup(this.wss, this.activeWebSockets)
    ]);

    console.log('🌟 ProcessCleanupManager configured for Lichtara OS server');
  }

  trackConnection(socket) {
    this.activeConnections.add(socket);
    
    socket.on('close', () => {
      this.activeConnections.delete(socket);
    });
  }

  start(port = 3000) {
    this.server = this.app.listen(port, () => {
      console.log(`🌟 Lichtara OS server awakened on port ${port}`);
      console.log(`🔮 Aurora field is harmonious and ready for conscious interaction`);
      console.log(`✨ Spiritual-technology bridge established`);
    });

    // Track connections for proper cleanup
    this.server.on('connection', (socket) => {
      this.trackConnection(socket);
    });

    return this.server;
  }
}

// Demonstration function
async function demonstrateLichtaraIntegration() {
  console.log('🔮 Lichtara OS Server with ProcessCleanupManager Integration');
  console.log('='.repeat(60));
  console.log('');

  const lichtaraServer = new LichtaraServer();
  const server = lichtaraServer.start(3001);

  console.log('');
  console.log('🌟 Server started with integrated ProcessCleanupManager');
  console.log('🌟 You can test the endpoints:');
  console.log('   GET  http://localhost:3001/        - Welcome message');
  console.log('   GET  http://localhost:3001/health  - System status');
  console.log('   POST http://localhost:3001/api/openai - AI processing');
  console.log('');
  console.log('🌟 Press Ctrl+C to see graceful shutdown in action');
  console.log('');

  // Simulate some activity
  setTimeout(() => {
    console.log('🌟 Simulating spiritual-technology interaction...');
    
    // Mock some connections
    for (let i = 0; i < 3; i++) {
      const mockSocket = {
        id: `spiritual-connection-${i}`,
        close: () => console.log(`🌟 Spiritual connection ${i} gracefully closed`),
        on: () => {},
        removeAllListeners: () => {}
      };
      lichtaraServer.activeConnections.add(mockSocket);
    }

    console.log(`🌟 Aurora field now has ${lichtaraServer.activeConnections.size} active connections`);
  }, 1000);

  // Keep the process alive for demonstration
  process.stdin.resume();
}

if (require.main === module) {
  demonstrateLichtaraIntegration().catch(console.error);
}

module.exports = { LichtaraServer };
/**
 * Process cleanup utility for Node.js applications
 * Handles graceful shutdown and prevents orphan processes
 */

class ProcessCleanupManager {
  constructor(options = {}) {
    this.resources = [];
    this.isShuttingDown = false;
    this.options = {
      timeout: 10000, // 10 seconds default
      forceExitOnTimeout: true,
      logPrefix: '🔄',
      ...options
    };

    this.setupSignalHandlers();
  }

  /**
   * Register a resource for cleanup
   */
  registerResource(resource) {
    this.resources.push(resource);
  }

  /**
   * Register multiple resources for cleanup
   */
  registerResources(resources) {
    this.resources.push(...resources);
  }

  /**
   * Remove a resource from cleanup registry
   */
  unregisterResource(name) {
    this.resources = this.resources.filter(r => r.name !== name);
  }

  /**
   * Manual cleanup - can be called explicitly
   */
  async cleanup() {
    if (this.isShuttingDown) {
      console.log(`${this.options.logPrefix} Cleanup already in progress...`);
      return;
    }

    this.isShuttingDown = true;
    console.log(`${this.options.logPrefix} Starting manual cleanup...`);

    try {
      // Cleanup all registered resources
      console.log(`${this.options.logPrefix} Cleaning up ${this.resources.length} resources...`);
      
      await Promise.all(
        this.resources.map(async (resource) => {
          try {
            console.log(`🔌 Cleaning up: ${resource.name}`);
            await resource.cleanup();
            console.log(`✅ Cleaned up: ${resource.name}`);
          } catch (error) {
            console.error(`❌ Error cleaning up ${resource.name}:`, error);
          }
        })
      );

      console.log(`✅ Manual cleanup completed`);
      this.isShuttingDown = false; // Reset for potential future cleanups

    } catch (error) {
      console.error(`❌ Error during manual cleanup:`, error);
      this.isShuttingDown = false; // Reset for potential future cleanups
      throw error;
    }
  }

  /**
   * Perform graceful shutdown
   */
  async gracefulShutdown(signal, exitCode = 0) {
    if (this.isShuttingDown) {
      console.log(`${this.options.logPrefix} Shutdown already in progress...`);
      return;
    }

    this.isShuttingDown = true;
    console.log(`\n${this.options.logPrefix} Received ${signal}. Starting graceful shutdown...`);

    // Set timeout for forceful shutdown
    const forceShutdownTimer = setTimeout(() => {
      console.log(`⚠️  Forceful shutdown after ${this.options.timeout}ms timeout`);
      if (this.options.forceExitOnTimeout) {
        process.exit(1);
      }
    }, this.options.timeout);

    try {
      // Cleanup all registered resources
      console.log(`${this.options.logPrefix} Cleaning up ${this.resources.length} resources...`);
      
      await Promise.all(
        this.resources.map(async (resource) => {
          try {
            console.log(`🔌 Cleaning up: ${resource.name}`);
            await resource.cleanup();
            console.log(`✅ Cleaned up: ${resource.name}`);
          } catch (error) {
            console.error(`❌ Error cleaning up ${resource.name}:`, error);
          }
        })
      );

      console.log(`✅ Graceful shutdown completed`);
      clearTimeout(forceShutdownTimer);
      process.exit(exitCode);

    } catch (error) {
      console.error(`❌ Error during graceful shutdown:`, error);
      clearTimeout(forceShutdownTimer);
      process.exit(1);
    }
  }

  /**
   * Setup signal handlers
   */
  setupSignalHandlers() {
    // Handle termination signals
    process.on('SIGTERM', () => this.gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => this.gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      this.gracefulShutdown('uncaughtException', 1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      this.gracefulShutdown('unhandledRejection', 1);
    });
  }
}

/**
 * Helper functions for common cleanup scenarios
 */

function createServerCleanup(server) {
  return {
    name: 'HTTP Server',
    cleanup: () => new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    })
  };
}

function createConnectionsCleanup(connections) {
  return {
    name: 'HTTP Connections',
    cleanup: () => {
      for (const connection of connections) {
        connection.destroy();
      }
      connections.clear();
    }
  };
}

function createWebSocketCleanup(wss, connections) {
  return {
    name: 'WebSocket Server',
    cleanup: () => new Promise((resolve) => {
      if (connections) {
        for (const ws of connections) {
          ws.close();
        }
        connections.clear();
      }
      
      wss.close(() => {
        resolve();
      });
    })
  };
}

function createDatabaseCleanup(db) {
  return {
    name: 'Database Connection',
    cleanup: async () => {
      if (db && typeof db.close === 'function') {
        await db.close();
      }
    }
  };
}

/**
 * Quick setup for Express.js applications
 */
function setupExpressCleanup(server, connections, options) {
  const cleanup = new ProcessCleanupManager(options);
  
  cleanup.registerResource(createServerCleanup(server));
  
  if (connections) {
    cleanup.registerResource(createConnectionsCleanup(connections));
  }
  
  return cleanup;
}

// Default instance for simple usage
const defaultCleanup = new ProcessCleanupManager();

module.exports = {
  ProcessCleanupManager,
  createServerCleanup,
  createConnectionsCleanup,
  createWebSocketCleanup,
  createDatabaseCleanup,
  setupExpressCleanup,
  defaultCleanup
};
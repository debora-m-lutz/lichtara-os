/**
 * Process cleanup utility for Node.js applications
 * Handles graceful shutdown and prevents orphan processes
 */

export interface CleanupResource {
  name: string;
  cleanup: () => Promise<void> | void;
}

export interface CleanupOptions {
  timeout?: number; // Timeout in milliseconds for graceful shutdown
  forceExitOnTimeout?: boolean;
  logPrefix?: string;
}

export class ProcessCleanupManager {
  private resources: CleanupResource[] = [];
  private isShuttingDown = false;
  private options: CleanupOptions;

  constructor(options: CleanupOptions = {}) {
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
  registerResource(resource: CleanupResource): void {
    this.resources.push(resource);
  }

  /**
   * Register multiple resources for cleanup
   */
  registerResources(resources: CleanupResource[]): void {
    this.resources.push(...resources);
  }

  /**
   * Remove a resource from cleanup registry
   */
  unregisterResource(name: string): void {
    this.resources = this.resources.filter(r => r.name !== name);
  }

  /**
   * Perform graceful shutdown
   */
  async gracefulShutdown(signal: string, exitCode: number = 0): Promise<void> {
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
  private setupSignalHandlers(): void {
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

export function createServerCleanup(server: any): CleanupResource {
  return {
    name: 'HTTP Server',
    cleanup: () => new Promise<void>((resolve, reject) => {
      server.close((err: any) => {
        if (err) reject(err);
        else resolve();
      });
    })
  };
}

export function createConnectionsCleanup(connections: Set<any>): CleanupResource {
  return {
    name: 'HTTP Connections',
    cleanup: () => {
      connections.forEach((connection) => {
        connection.destroy();
      });
      connections.clear();
    }
  };
}

export function createWebSocketCleanup(wss: any, connections?: Set<any>): CleanupResource {
  return {
    name: 'WebSocket Server',
    cleanup: () => new Promise<void>((resolve) => {
      if (connections) {
        connections.forEach((ws) => {
          ws.close();
        });
        connections.clear();
      }
      
      wss.close(() => {
        resolve();
      });
    })
  };
}

export function createDatabaseCleanup(db: any): CleanupResource {
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
export function setupExpressCleanup(
  server: any, 
  connections?: Set<any>, 
  options?: CleanupOptions
): ProcessCleanupManager {
  const cleanup = new ProcessCleanupManager(options);
  
  cleanup.registerResource(createServerCleanup(server));
  
  if (connections) {
    cleanup.registerResource(createConnectionsCleanup(connections));
  }
  
  return cleanup;
}

// Default instance for simple usage (not auto-registered)
export function createDefaultCleanup(options?: CleanupOptions): ProcessCleanupManager {
  return new ProcessCleanupManager(options);
}
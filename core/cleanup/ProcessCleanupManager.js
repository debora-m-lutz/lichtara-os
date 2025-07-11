#!/usr/bin/env node

/**
 * ProcessCleanupManager - Advanced Process Cleanup and Resource Management
 * Part of Lichtara OS - Conscious Technology Integration Platform
 * 
 * Provides graceful process cleanup with timeout management and resource registration
 * for servers, connections, and WebSocket resources.
 */

class ProcessCleanupManager {
  constructor(options = {}) {
    this.timeout = options.timeout || 5000; // Default 5 second timeout
    this.logPrefix = options.logPrefix || '🌟'; // Default spiritual prefix
    this.resources = [];
    this.isShuttingDown = false;
    this.cleanupPromise = null;
    
    // Bind process exit handlers
    this.bindExitHandlers();
  }

  /**
   * Register cleanup resources
   * @param {Array|Function} resources - Array of cleanup functions or single cleanup function
   */
  registerResources(resources) {
    if (Array.isArray(resources)) {
      this.resources.push(...resources);
    } else if (typeof resources === 'function') {
      this.resources.push(resources);
    } else {
      throw new Error('Resources must be a function or array of functions');
    }
    
    this.log(`Registered ${Array.isArray(resources) ? resources.length : 1} cleanup resource(s)`);
  }

  /**
   * Register a single cleanup resource
   * @param {Function} cleanupFn - Cleanup function
   */
  registerResource(cleanupFn) {
    this.registerResources(cleanupFn);
  }

  /**
   * Bind process exit handlers for graceful shutdown
   */
  bindExitHandlers() {
    // Handle normal process termination
    process.on('exit', (code) => {
      this.log(`Process exiting with code ${code}`);
    });

    // Handle Ctrl+C
    process.on('SIGINT', () => {
      this.log('Received SIGINT (Ctrl+C), initiating graceful shutdown...');
      this.shutdown();
    });

    // Handle kill command
    process.on('SIGTERM', () => {
      this.log('Received SIGTERM, initiating graceful shutdown...');
      this.shutdown();
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      this.log(`Uncaught exception: ${error.message}`, 'error');
      console.error(error);
      this.shutdown(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      this.log(`Unhandled promise rejection: ${reason}`, 'error');
      console.error('Unhandled Promise Rejection at:', promise);
      this.shutdown(1);
    });
  }

  /**
   * Initiate graceful shutdown
   * @param {number} exitCode - Exit code for process.exit()
   */
  async shutdown(exitCode = 0) {
    if (this.isShuttingDown) {
      this.log('Shutdown already in progress...');
      return this.cleanupPromise;
    }

    this.isShuttingDown = true;
    this.log('Initiating graceful shutdown sequence...');

    // Create cleanup promise with timeout
    this.cleanupPromise = this.executeCleanup();
    
    try {
      await Promise.race([
        this.cleanupPromise,
        this.createTimeoutPromise()
      ]);
      
      this.log('Graceful shutdown completed successfully');
    } catch (error) {
      this.log(`Shutdown error: ${error.message}`, 'error');
    } finally {
      process.exit(exitCode);
    }
  }

  /**
   * Execute all registered cleanup functions
   */
  async executeCleanup() {
    const cleanupPromises = this.resources.map(async (cleanupFn, index) => {
      try {
        this.log(`Executing cleanup ${index + 1}/${this.resources.length}...`);
        
        if (typeof cleanupFn === 'function') {
          const result = cleanupFn();
          
          // Handle both sync and async cleanup functions
          if (result && typeof result.then === 'function') {
            await result;
          }
          
          this.log(`Cleanup ${index + 1} completed successfully`);
        } else {
          this.log(`Cleanup ${index + 1} is not a function, skipping`, 'warn');
        }
      } catch (error) {
        this.log(`Cleanup ${index + 1} failed: ${error.message}`, 'error');
        // Don't rethrow - continue with other cleanups
      }
    });

    await Promise.allSettled(cleanupPromises);
  }

  /**
   * Create a timeout promise for cleanup operations
   */
  createTimeoutPromise() {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Cleanup timeout after ${this.timeout}ms`));
      }, this.timeout);
    });
  }

  /**
   * Manual cleanup trigger (for testing or manual shutdown)
   */
  async cleanup() {
    if (this.isShuttingDown) {
      return this.cleanupPromise;
    }
    
    this.isShuttingDown = true;
    return this.executeCleanup();
  }

  /**
   * Logging utility with spiritual prefix
   * @param {string} message - Log message
   * @param {string} level - Log level (info, warn, error)
   */
  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = `${this.logPrefix} [${timestamp}]`;
    
    switch (level) {
      case 'error':
        console.error(`${prefix} ERROR: ${message}`);
        break;
      case 'warn':
        console.warn(`${prefix} WARN: ${message}`);
        break;
      default:
        console.log(`${prefix} ${message}`);
    }
  }

  /**
   * Get current status of the cleanup manager
   */
  getStatus() {
    return {
      isShuttingDown: this.isShuttingDown,
      resourceCount: this.resources.length,
      timeout: this.timeout,
      logPrefix: this.logPrefix
    };
  }
}

module.exports = ProcessCleanupManager;
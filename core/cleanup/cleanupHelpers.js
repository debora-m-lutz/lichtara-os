#!/usr/bin/env node

/**
 * Cleanup Helper Functions for Lichtara OS
 * Provides specialized cleanup functions for common server resources
 */

/**
 * Create a cleanup function for Express/HTTP servers
 * @param {http.Server|https.Server} server - The server instance to cleanup
 * @param {Object} options - Cleanup options
 * @returns {Function} Cleanup function
 */
function createServerCleanup(server, options = {}) {
  const { 
    timeout = 5000,
    forceCloseTimeout = 1000
  } = options;

  return async function serverCleanup() {
    return new Promise((resolve) => {
      if (!server || !server.listening) {
        resolve();
        return;
      }

      console.log('🌟 Closing server...');
      
      // Gracefully close the server
      server.close((err) => {
        if (err) {
          console.error('🌟 Error closing server:', err.message);
        } else {
          console.log('🌟 Server closed gracefully');
        }
        resolve();
      });

      // Force close if graceful close takes too long
      setTimeout(() => {
        if (server.listening) {
          console.log('🌟 Force closing server after timeout');
          server.closeAllConnections?.();
          resolve();
        }
      }, forceCloseTimeout);
    });
  };
}

/**
 * Create a cleanup function for active connections
 * @param {Set|Array|Map} activeConnections - Collection of active connections
 * @param {Object} options - Cleanup options
 * @returns {Function} Cleanup function
 */
function createConnectionsCleanup(activeConnections, options = {}) {
  const { 
    timeout = 3000,
    closeCode = 1000,
    closeReason = 'Server shutting down'
  } = options;

  return async function connectionsCleanup() {
    if (!activeConnections || activeConnections.size === 0) {
      return;
    }

    console.log(`🌟 Closing ${activeConnections.size} active connection(s)...`);

    const cleanupPromises = [];

    // Handle different collection types
    if (activeConnections instanceof Set) {
      activeConnections.forEach(connection => {
        cleanupPromises.push(cleanupSingleConnection(connection, closeCode, closeReason));
      });
    } else if (activeConnections instanceof Map) {
      activeConnections.forEach(connection => {
        cleanupPromises.push(cleanupSingleConnection(connection, closeCode, closeReason));
      });
    } else if (Array.isArray(activeConnections)) {
      activeConnections.forEach(connection => {
        cleanupPromises.push(cleanupSingleConnection(connection, closeCode, closeReason));
      });
    }

    // Wait for all connections to close with timeout
    try {
      await Promise.race([
        Promise.allSettled(cleanupPromises),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection cleanup timeout')), timeout)
        )
      ]);
      console.log('🌟 All connections closed');
    } catch (error) {
      console.error('🌟 Connection cleanup timeout, forcing close');
    }

    // Clear the collection
    if (typeof activeConnections.clear === 'function') {
      activeConnections.clear();
    }
  };
}

/**
 * Helper function to cleanup a single connection
 * @param {Object} connection - Connection object (socket, WebSocket, etc.)
 * @param {number} closeCode - Close code for WebSockets
 * @param {string} closeReason - Close reason for WebSockets
 */
async function cleanupSingleConnection(connection, closeCode, closeReason) {
  try {
    if (connection && typeof connection.close === 'function') {
      // WebSocket-like connection
      if (connection.readyState === 1) { // OPEN state
        connection.close(closeCode, closeReason);
      }
    } else if (connection && typeof connection.end === 'function') {
      // Socket-like connection
      connection.end();
    } else if (connection && typeof connection.destroy === 'function') {
      // Destroyable connection
      connection.destroy();
    }
  } catch (error) {
    console.error('🌟 Error closing connection:', error.message);
  }
}

/**
 * Create a cleanup function for WebSocket servers and active WebSocket connections
 * @param {WebSocketServer} wss - WebSocket server instance
 * @param {Set|Array|Map} activeWebSockets - Collection of active WebSocket connections
 * @param {Object} options - Cleanup options
 * @returns {Function} Cleanup function
 */
function createWebSocketCleanup(wss, activeWebSockets, options = {}) {
  const { 
    timeout = 3000,
    closeCode = 1000,
    closeReason = 'Server shutting down'
  } = options;

  return async function webSocketCleanup() {
    console.log('🌟 Initiating WebSocket cleanup...');

    const cleanupPromises = [];

    // Clean up individual WebSocket connections first
    if (activeWebSockets && activeWebSockets.size > 0) {
      console.log(`🌟 Closing ${activeWebSockets.size} WebSocket connection(s)...`);
      
      const connectionsArray = activeWebSockets instanceof Set 
        ? Array.from(activeWebSockets)
        : activeWebSockets instanceof Map
        ? Array.from(activeWebSockets.values())
        : Array.isArray(activeWebSockets)
        ? activeWebSockets
        : [];

      connectionsArray.forEach(ws => {
        if (ws && ws.readyState === 1) { // WebSocket.OPEN
          cleanupPromises.push(
            new Promise((resolve) => {
              ws.once('close', resolve);
              ws.close(closeCode, closeReason);
              
              // Force close after short timeout
              setTimeout(() => {
                if (ws.readyState !== 3) { // Not CLOSED
                  ws.terminate();
                }
                resolve();
              }, 1000);
            })
          );
        }
      });
    }

    // Clean up WebSocket server
    if (wss && typeof wss.close === 'function') {
      console.log('🌟 Closing WebSocket server...');
      cleanupPromises.push(
        new Promise((resolve) => {
          wss.close((err) => {
            if (err) {
              console.error('🌟 Error closing WebSocket server:', err.message);
            } else {
              console.log('🌟 WebSocket server closed');
            }
            resolve();
          });
        })
      );
    }

    // Wait for all cleanup operations with timeout
    try {
      await Promise.race([
        Promise.allSettled(cleanupPromises),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('WebSocket cleanup timeout')), timeout)
        )
      ]);
      console.log('🌟 WebSocket cleanup completed');
    } catch (error) {
      console.error('🌟 WebSocket cleanup timeout');
    }

    // Clear the active connections collection
    if (activeWebSockets && typeof activeWebSockets.clear === 'function') {
      activeWebSockets.clear();
    }
  };
}

module.exports = {
  createServerCleanup,
  createConnectionsCleanup,
  createWebSocketCleanup
};
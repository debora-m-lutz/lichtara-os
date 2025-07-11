#!/usr/bin/env node

/**
 * Main export file for Lichtara OS Process Cleanup System
 * Provides easy access to ProcessCleanupManager and helper functions
 */

const ProcessCleanupManager = require('./ProcessCleanupManager');
const { 
  createServerCleanup, 
  createConnectionsCleanup, 
  createWebSocketCleanup 
} = require('./cleanupHelpers');

module.exports = {
  ProcessCleanupManager,
  createServerCleanup,
  createConnectionsCleanup,
  createWebSocketCleanup
};
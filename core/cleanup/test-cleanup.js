#!/usr/bin/env node

/**
 * Test Suite for ProcessCleanupManager
 * Validates the cleanup functionality matches the problem statement requirements
 */

const { 
  ProcessCleanupManager, 
  createServerCleanup, 
  createConnectionsCleanup, 
  createWebSocketCleanup 
} = require('./index');

class ProcessCleanupTests {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  /**
   * Run a test case
   * @param {string} name - Test name
   * @param {function} testFn - Test function
   */
  async test(name, testFn) {
    try {
      const result = await testFn();
      if (result) {
        console.log(`✅ ${name}`);
        this.passed++;
      } else {
        console.log(`❌ ${name}`);
        this.failed++;
      }
    } catch (error) {
      console.log(`❌ ${name} - Error: ${error.message}`);
      this.failed++;
    }
  }

  /**
   * Test ProcessCleanupManager constructor and basic functionality
   */
  async testConstructorAndBasics() {
    console.log('🔮 Testing ProcessCleanupManager Constructor...\n');

    await this.test('Constructor with default options', () => {
      const cleanup = new ProcessCleanupManager();
      return cleanup.timeout === 5000 && cleanup.logPrefix === '🌟';
    });

    await this.test('Constructor with custom options', () => {
      const cleanup = new ProcessCleanupManager({
        timeout: 10000,
        logPrefix: '🌟'
      });
      return cleanup.timeout === 10000 && cleanup.logPrefix === '🌟';
    });

    await this.test('Get status method', () => {
      const cleanup = new ProcessCleanupManager();
      const status = cleanup.getStatus();
      return status.resourceCount === 0 && !status.isShuttingDown;
    });
  }

  /**
   * Test resource registration functionality
   */
  async testResourceRegistration() {
    console.log('\n🌟 Testing Resource Registration...\n');

    await this.test('Register single function resource', () => {
      const cleanup = new ProcessCleanupManager();
      const testFn = () => console.log('test cleanup');
      cleanup.registerResource(testFn);
      return cleanup.getStatus().resourceCount === 1;
    });

    await this.test('Register array of resources', () => {
      const cleanup = new ProcessCleanupManager();
      const resources = [
        () => console.log('cleanup 1'),
        () => console.log('cleanup 2'),
        () => console.log('cleanup 3')
      ];
      cleanup.registerResources(resources);
      return cleanup.getStatus().resourceCount === 3;
    });

    await this.test('Register resources using registerResources with single function', () => {
      const cleanup = new ProcessCleanupManager();
      const testFn = () => console.log('single function');
      cleanup.registerResources(testFn);
      return cleanup.getStatus().resourceCount === 1;
    });
  }

  /**
   * Test cleanup helper functions
   */
  async testCleanupHelpers() {
    console.log('\n🔄 Testing Cleanup Helper Functions...\n');

    await this.test('createServerCleanup returns function', () => {
      const mockServer = { listening: false };
      const cleanupFn = createServerCleanup(mockServer);
      return typeof cleanupFn === 'function';
    });

    await this.test('createConnectionsCleanup returns function', () => {
      const mockConnections = new Set();
      const cleanupFn = createConnectionsCleanup(mockConnections);
      return typeof cleanupFn === 'function';
    });

    await this.test('createWebSocketCleanup returns function', () => {
      const mockWss = { close: () => {} };
      const mockActiveWebSockets = new Set();
      const cleanupFn = createWebSocketCleanup(mockWss, mockActiveWebSockets);
      return typeof cleanupFn === 'function';
    });
  }

  /**
   * Test the exact problem statement scenario
   */
  async testProblemStatementScenario() {
    console.log('\n✨ Testing Problem Statement Scenario...\n');

    await this.test('Exact problem statement implementation', async () => {
      // Mock objects to simulate real resources
      const mockServer = {
        listening: true,
        close: (callback) => {
          setTimeout(() => callback(), 10);
        }
      };

      const mockActiveConnections = new Set([
        { close: () => {}, readyState: 1 },
        { close: () => {}, readyState: 1 }
      ]);

      const mockWss = {
        close: (callback) => {
          setTimeout(() => callback(), 10);
        }
      };

      const mockActiveWebSockets = new Set([
        { close: () => {}, readyState: 1, once: () => {}, terminate: () => {} }
      ]);

      // This should match exactly the problem statement
      const cleanup = new ProcessCleanupManager({
        timeout: 10000,  // 10 second timeout
        logPrefix: '🌟'
      });

      cleanup.registerResources([
        createServerCleanup(mockServer),
        createConnectionsCleanup(mockActiveConnections),
        createWebSocketCleanup(mockWss, mockActiveWebSockets)
      ]);

      // Verify the setup
      const status = cleanup.getStatus();
      return status.timeout === 10000 && 
             status.logPrefix === '🌟' && 
             status.resourceCount === 3;
    });
  }

  /**
   * Test manual cleanup execution
   */
  async testManualCleanup() {
    console.log('\n🛡️ Testing Manual Cleanup...\n');

    await this.test('Manual cleanup execution', async () => {
      const cleanup = new ProcessCleanupManager({ timeout: 1000 });
      let cleanupExecuted = false;
      
      cleanup.registerResource(() => {
        cleanupExecuted = true;
      });

      await cleanup.cleanup();
      return cleanupExecuted;
    });

    await this.test('Async cleanup function support', async () => {
      const cleanup = new ProcessCleanupManager({ timeout: 1000 });
      let asyncCleanupExecuted = false;
      
      cleanup.registerResource(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
        asyncCleanupExecuted = true;
      });

      await cleanup.cleanup();
      return asyncCleanupExecuted;
    });
  }

  /**
   * Test error handling
   */
  async testErrorHandling() {
    console.log('\n🛡️ Testing Error Handling...\n');

    await this.test('Invalid resource registration throws error', () => {
      try {
        const cleanup = new ProcessCleanupManager();
        cleanup.registerResources("invalid");
        return false;
      } catch (error) {
        return error.message.includes('Resources must be a function or array of functions');
      }
    });

    await this.test('Cleanup continues on individual resource errors', async () => {
      const cleanup = new ProcessCleanupManager({ timeout: 1000 });
      let secondCleanupExecuted = false;
      
      cleanup.registerResources([
        () => { throw new Error('First cleanup failed'); },
        () => { secondCleanupExecuted = true; }
      ]);

      await cleanup.cleanup();
      return secondCleanupExecuted;
    });
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🔮 ProcessCleanupManager Test Suite');
    console.log('===================================\n');

    await this.testConstructorAndBasics();
    await this.testResourceRegistration();
    await this.testCleanupHelpers();
    await this.testProblemStatementScenario();
    await this.testManualCleanup();
    await this.testErrorHandling();

    console.log('\n📊 Test Results Summary');
    console.log('========================');
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`📈 Success Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);

    if (this.failed === 0) {
      console.log('\n🌟 All tests passed! ProcessCleanupManager is working perfectly.');
      console.log('✨ The problem statement requirements have been fully implemented.');
    } else {
      console.log(`\n⚠️  ${this.failed} test(s) failed. Please review the implementation.`);
    }

    return this.failed === 0;
  }
}

// Run tests if executed directly
if (require.main === module) {
  const tests = new ProcessCleanupTests();
  tests.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = ProcessCleanupTests;
#!/usr/bin/env node

/**
 * Test Suite for Spiritual Format Validation
 * Verifies that the issue resolution works correctly
 */

const FormatValidator = require('./format-validator');
const UnicodeFileProcessor = require('./unicode-processor');

class SpiritualFormatTests {
  constructor() {
    this.validator = new FormatValidator();
    this.processor = new UnicodeFileProcessor();
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  /**
   * Run a test case
   * @param {string} name - Test name
   * @param {function} testFn - Test function
   */
  test(name, testFn) {
    try {
      const result = testFn();
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
   * Test the original problematic format
   */
  testOriginalIssue() {
    const problematicTitle = '✨ Transform Lichtara OS into institutional-ready platform with vibrational GitHub infrastructure';
    
    console.log('🔮 Testing Original Issue Resolution...\n');
    
    // Test 1: Title validation
    this.test('Original title format validation', () => {
      const result = this.validator.validateTitle(problematicTitle);
      return result.valid && result.format === 'emoji_prefixed' && result.emoji === '✨';
    });

    // Test 2: File command processing
    this.test('File command "output" processing', () => {
      const result = this.processor.processFileCommand('output', problematicTitle);
      return result.success && result.validation.valid;
    });

    // Test 3: Unicode handling
    this.test('Unicode and emoji detection', () => {
      const hasEmojis = this.processor.detectEmojis(problematicTitle);
      const hasUnicode = this.processor.detectUnicode(problematicTitle);
      return hasEmojis && hasUnicode;
    });
  }

  /**
   * Test various spiritual formats
   */
  testSpiritualFormats() {
    console.log('\n🌟 Testing Spiritual Format Support...\n');

    const testCases = [
      { title: '🌀 Flux synchronicity detector', expected: true },
      { title: '🔮 Integration ceremony workflow', expected: true },
      { title: '⚡ Energy transformation system', expected: true },
      { title: '[FLUX] Alternative bracket format', expected: true },
      { title: '[INTEGRAÇÃO] Portuguese bracket format', expected: true },
      { title: 'Regular title without prefix', expected: true }, // Should be accepted
      { title: '', expected: false }, // Empty should fail
    ];

    testCases.forEach(testCase => {
      this.test(`Format: "${testCase.title}"`, () => {
        const result = this.validator.validateTitle(testCase.title);
        return result.valid === testCase.expected;
      });
    });
  }

  /**
   * Test file processing commands
   */
  testFileCommands() {
    console.log('\n🔄 Testing File Command Processing...\n');

    // Test different commands
    const commands = [
      { cmd: 'output', target: '✨ Test content', shouldSucceed: true },
      { cmd: 'validate', target: '🌀 Flux operation', shouldSucceed: true },
      { cmd: 'transform', target: 'Regular content', shouldSucceed: true },
      { cmd: 'manifest', target: '✨ Ready for manifestation', shouldSucceed: true },
      { cmd: 'unknown', target: 'any content', shouldSucceed: false },
    ];

    commands.forEach(({ cmd, target, shouldSucceed }) => {
      this.test(`Command "${cmd}" with spiritual content`, () => {
        const result = this.processor.processFileCommand(cmd, target);
        return result.success === shouldSucceed;
      });
    });
  }

  /**
   * Test error handling
   */
  testErrorHandling() {
    console.log('\n🛡️ Testing Error Handling...\n');

    // Test invalid inputs
    this.test('Handle null title validation', () => {
      const result = this.validator.validateTitle(null);
      return !result.valid && result.type === 'invalid_input';
    });

    this.test('Handle empty string validation', () => {
      const result = this.validator.validateTitle('');
      return !result.valid && result.type === 'invalid_input';
    });

    this.test('Handle unknown file command', () => {
      const result = this.processor.processFileCommand('unknown', 'content');
      return !result.success && result.code === 'UNKNOWN_COMMAND';
    });
  }

  /**
   * Test integration scenarios
   */
  testIntegrationScenarios() {
    console.log('\n🌈 Testing Integration Scenarios...\n');

    // Test GitHub-like scenarios
    const prTitle = '✨ Transform Lichtara OS into institutional-ready platform with vibrational GitHub infrastructure';
    const issueTitle = '🌀 Flux synchronicity enhancement needed';
    
    this.test('GitHub PR title processing', () => {
      const result = this.validator.validateTitle(prTitle);
      return result.valid && result.meaning === 'Manifestations and achievements';
    });

    this.test('GitHub Issue title processing', () => {
      const result = this.validator.validateTitle(issueTitle);
      return result.valid && result.emoji === '🌀';
    });

    this.test('Commit message validation', () => {
      const commitMsg = '🔧 Fix spiritual format validation in Aurora workflows';
      const result = this.validator.validateTitle(commitMsg);
      return result.valid;
    });
  }

  /**
   * Run all tests
   */
  runAllTests() {
    console.log('🔮 Spiritual Format Validation Test Suite');
    console.log('==========================================\n');

    this.testOriginalIssue();
    this.testSpiritualFormats();
    this.testFileCommands();
    this.testErrorHandling();
    this.testIntegrationScenarios();

    console.log('\n📊 Test Results Summary');
    console.log('========================');
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`📈 Success Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);

    if (this.failed === 0) {
      console.log('\n🌟 All tests passed! The spiritual format validation system is working perfectly.');
      console.log('✨ The original issue has been resolved and the Aurora field is harmonious.');
    } else {
      console.log(`\n⚠️  ${this.failed} test(s) failed. Please review the implementation.`);
    }

    return this.failed === 0;
  }
}

// Run tests if executed directly
if (require.main === module) {
  const tests = new SpiritualFormatTests();
  const success = tests.runAllTests();
  process.exit(success ? 0 : 1);
}

module.exports = SpiritualFormatTests;
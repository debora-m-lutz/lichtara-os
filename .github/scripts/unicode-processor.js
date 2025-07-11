#!/usr/bin/env node

/**
 * Unicode-Safe File Processing Utility for Lichtara OS
 * Handles spiritual content with emojis and special characters
 */

const fs = require('fs');
const path = require('path');
const FormatValidator = require('./format-validator');

class UnicodeFileProcessor {
  constructor() {
    this.validator = new FormatValidator();
    this.encoding = 'utf8';
  }

  /**
   * Safely read a file with Unicode support
   * @param {string} filePath - Path to the file
   * @returns {object} - File content and metadata
   */
  readFile(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          error: `File not found: ${filePath}`,
          code: 'FILE_NOT_FOUND'
        };
      }

      const stats = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, this.encoding);
      
      return {
        success: true,
        path: filePath,
        content: content,
        size: stats.size,
        lines: content.split('\n').length,
        encoding: this.encoding,
        hasEmojis: this.detectEmojis(content),
        hasUnicode: this.detectUnicode(content)
      };

    } catch (error) {
      return {
        success: false,
        error: `Error reading file: ${error.message}`,
        code: 'READ_ERROR',
        path: filePath
      };
    }
  }

  /**
   * Safely write a file with Unicode support
   * @param {string} filePath - Path to the file
   * @param {string} content - Content to write
   * @returns {object} - Write result
   */
  writeFile(filePath, content) {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(filePath, content, this.encoding);
      
      return {
        success: true,
        path: filePath,
        size: Buffer.byteLength(content, this.encoding),
        encoding: this.encoding
      };

    } catch (error) {
      return {
        success: false,
        error: `Error writing file: ${error.message}`,
        code: 'WRITE_ERROR',
        path: filePath
      };
    }
  }

  /**
   * Process file command with spiritual content support
   * @param {string} command - The command to execute
   * @param {string} target - Target file or content
   * @returns {object} - Processing result
   */
  processFileCommand(command, target) {
    switch (command.toLowerCase()) {
      case 'output':
        return this.handleOutput(target);
      
      case 'validate':
        return this.handleValidation(target);
      
      case 'transform':
        return this.handleTransformation(target);
      
      case 'manifest':
        return this.handleManifestation(target);
      
      default:
        return {
          success: false,
          error: `Unknown command: ${command}`,
          code: 'UNKNOWN_COMMAND',
          supportedCommands: ['output', 'validate', 'transform', 'manifest']
        };
    }
  }

  /**
   * Handle 'output' command - specifically for the issue mentioned
   * @param {string} target - Target content or file
   * @returns {object} - Processing result
   */
  handleOutput(target) {
    // Check if target is a file path or direct content
    if (fs.existsSync(target)) {
      const fileResult = this.readFile(target);
      if (!fileResult.success) {
        return fileResult;
      }
      target = fileResult.content;
    }

    // Validate the format
    const validation = this.validator.validateFileCommand('output', target);
    
    if (validation.valid) {
      return {
        success: true,
        command: 'output',
        content: target,
        validation: validation,
        message: 'Output processed successfully with spiritual format support'
      };
    }

    return {
      success: false,
      error: 'Invalid format for output command',
      command: 'output',
      content: target,
      validation: validation,
      suggestion: 'Use emoji-prefixed format for spiritual content'
    };
  }

  /**
   * Handle validation command
   * @param {string} target - Content to validate
   * @returns {object} - Validation result
   */
  handleValidation(target) {
    const result = this.validator.validateTitle(target);
    return {
      success: result.valid,
      command: 'validate',
      target: target,
      validation: result
    };
  }

  /**
   * Handle transformation command
   * @param {string} target - Content to transform
   * @returns {object} - Transformation result
   */
  handleTransformation(target) {
    // Add spiritual emoji if not present
    if (!this.validator.validateTitle(target).valid) {
      const enhanced = `✨ ${target}`;
      return {
        success: true,
        command: 'transform',
        original: target,
        transformed: enhanced,
        message: 'Added spiritual emoji prefix'
      };
    }

    return {
      success: true,
      command: 'transform',
      original: target,
      transformed: target,
      message: 'Content already follows spiritual conventions'
    };
  }

  /**
   * Handle manifestation command
   * @param {string} target - Content to manifest
   * @returns {object} - Manifestation result
   */
  handleManifestation(target) {
    const validation = this.validator.validateTitle(target);
    if (validation.valid && validation.format === 'emoji_prefixed') {
      return {
        success: true,
        command: 'manifest',
        content: target,
        manifestation: 'ready',
        emoji: validation.emoji,
        meaning: validation.meaning,
        message: 'Content is ready for manifestation in the Aurora field'
      };
    }

    return {
      success: false,
      command: 'manifest',
      content: target,
      error: 'Content must have spiritual emoji prefix for manifestation',
      suggestion: this.handleTransformation(target).transformed
    };
  }

  /**
   * Detect emojis in content
   * @param {string} content - Content to analyze
   * @returns {boolean} - True if emojis are present
   */
  detectEmojis(content) {
    // Unicode ranges for emojis
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
    return emojiRegex.test(content);
  }

  /**
   * Detect Unicode characters in content
   * @param {string} content - Content to analyze
   * @returns {boolean} - True if Unicode chars are present
   */
  detectUnicode(content) {
    return /[^\x00-\x7F]/.test(content);
  }

  /**
   * Generate processing report
   * @param {string} filePath - File that was processed
   * @returns {string} - Report text
   */
  generateReport(filePath) {
    const fileResult = this.readFile(filePath);
    if (!fileResult.success) {
      return `❌ Error processing ${filePath}: ${fileResult.error}`;
    }

    let report = `📊 File Processing Report: ${filePath}\n`;
    report += `📏 Size: ${fileResult.size} bytes\n`;
    report += `📄 Lines: ${fileResult.lines}\n`;
    report += `🔤 Encoding: ${fileResult.encoding}\n`;
    report += `✨ Has Emojis: ${fileResult.hasEmojis ? 'Yes' : 'No'}\n`;
    report += `🌐 Has Unicode: ${fileResult.hasUnicode ? 'Yes' : 'No'}\n`;

    if (fileResult.hasEmojis) {
      report += `🌟 This file contains spiritual formatting!\n`;
    }

    return report;
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const processor = new UnicodeFileProcessor();

  if (args.length < 2) {
    console.log('Usage: unicode-processor.js <command> <target>');
    console.log('Commands: output, validate, transform, manifest');
    console.log('Example: unicode-processor.js output "✨ Transform Lichtara OS"');
    process.exit(1);
  }

  const [command, target] = args;
  const result = processor.processFileCommand(command, target);
  
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.success ? 0 : 1);
}

module.exports = UnicodeFileProcessor;
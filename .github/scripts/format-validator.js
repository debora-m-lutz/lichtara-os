#!/usr/bin/env node

/**
 * Format Validator for Lichtara OS
 * Handles emoji-prefixed titles and spiritual naming conventions
 */

const fs = require('fs');
const path = require('path');

// Supported emoji prefixes and their meanings
const SUPPORTED_FORMATS = {
  // Flux and synchronicity
  '🌀': 'Flux operations and synchronicities',
  '⚡': 'Energy and transformations',
  '✨': 'Manifestations and achievements',
  '🔮': 'Integration and wisdom',
  
  // Aurora operations
  '🌅': 'Aurora development and new beginnings',
  '💫': 'Active channeling and work in progress',
  '🌟': 'Completed manifestations',
  '🌸': 'Blessed and released features',
  
  // Community and collaboration
  '🤝': 'Community connections',
  '📚': 'Knowledge and documentation',
  '🌐': 'Global resonance and outreach',
  '💫': 'Harmony and integration',
  
  // Technical operations
  '🔧': 'Technical calibration and fixes',
  '🎯': 'Targeted features and goals',
  '🚀': 'Launch and deployment',
  '📊': 'Analytics and monitoring',
  
  // Spiritual integration
  '🙏': 'Gratitude and blessing',
  '🌊': 'Flow and natural progression',
  '🔥': 'Transformation and change',
  '💎': 'Clarity and precision'
};

class FormatValidator {
  constructor() {
    this.supportedEmojis = Object.keys(SUPPORTED_FORMATS);
  }

  /**
   * Validates if a title follows Lichtara OS format conventions
   * @param {string} title - The title to validate
   * @returns {object} - Validation result with success flag and details
   */
  validateTitle(title) {
    if (!title || typeof title !== 'string') {
      return {
        valid: false,
        error: 'Title must be a non-empty string',
        type: 'invalid_input'
      };
    }

    // Check for emoji prefix - need to handle multi-byte emojis properly
    const emojiMatch = title.match(/^([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/u);
    
    if (emojiMatch) {
      const firstEmoji = emojiMatch[1];
      if (this.supportedEmojis.includes(firstEmoji)) {
        return {
          valid: true,
          format: 'emoji_prefixed',
          emoji: firstEmoji,
          meaning: SUPPORTED_FORMATS[firstEmoji],
          content: title.substring(firstEmoji.length).trim()
        };
      }
    }

    // Check for bracket prefix format like [FLUX] or [INTEGRAÇÃO]
    const bracketMatch = title.match(/^\[([A-Z\u00C0-\u017F]+)\]/i);
    if (bracketMatch) {
      return {
        valid: true,
        format: 'bracket_prefixed',
        prefix: bracketMatch[1],
        content: title.substring(bracketMatch[0].length).trim()
      };
    }

    // For institutional or standard titles, allow them but mark as standard
    if (title.length > 5 && !title.startsWith('fix:') && !title.startsWith('feat:')) {
      return {
        valid: true,
        format: 'standard',
        content: title,
        suggestion: `Consider prefixing with spiritual emoji like: ✨ ${title}`
      };
    }

    return {
      valid: false,
      error: 'Title does not follow Lichtara OS spiritual naming conventions',
      type: 'format_mismatch',
      suggestion: 'Use emoji prefix (✨, 🌀, 🔮, etc.) or bracket format [CATEGORY]'
    };
  }

  /**
   * Validates file command output format
   * @param {string} command - The command type
   * @param {string} content - The content to validate
   * @returns {object} - Validation result
   */
  validateFileCommand(command, content) {
    if (command === 'output') {
      // Special handling for output commands with spiritual content
      if (content && content.includes('✨')) {
        const titleValidation = this.validateTitle(content);
        if (titleValidation.valid) {
          return {
            valid: true,
            command: 'output',
            format: 'spiritual_content',
            details: titleValidation
          };
        }
      }
    }

    return {
      valid: true,
      command: command,
      content: content,
      format: 'standard'
    };
  }

  /**
   * Process a file safely with Unicode support
   * @param {string} filePath - Path to the file
   * @returns {object} - Processing result
   */
  processFile(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          error: `File not found: ${filePath}`
        };
      }

      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      const validationResults = [];

      lines.forEach((line, index) => {
        if (line.trim()) {
          const validation = this.validateTitle(line.trim());
          if (!validation.valid) {
            validationResults.push({
              line: index + 1,
              content: line,
              error: validation.error,
              suggestion: validation.suggestion
            });
          }
        }
      });

      return {
        success: true,
        file: filePath,
        totalLines: lines.length,
        validationErrors: validationResults,
        valid: validationResults.length === 0
      };

    } catch (error) {
      return {
        success: false,
        error: `Error processing file: ${error.message}`
      };
    }
  }

  /**
   * Generate format help text
   * @returns {string} - Help documentation
   */
  getFormatHelp() {
    let help = '\n🌟 Lichtara OS Title Format Guide\n';
    help += '=====================================\n\n';
    help += 'Supported Emoji Prefixes:\n';
    
    Object.entries(SUPPORTED_FORMATS).forEach(([emoji, meaning]) => {
      help += `${emoji} - ${meaning}\n`;
    });

    help += '\nExamples:\n';
    help += '✨ Transform Lichtara OS into institutional-ready platform\n';
    help += '🌀 Flux synchronicity detector enhancement\n';
    help += '[FLUX] New energy detection algorithm\n';
    help += '[INTEGRAÇÃO] Community resonance board setup\n\n';

    return help;
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const validator = new FormatValidator();

  if (args[0] === 'validate') {
    if (args.length < 2) {
      console.log(JSON.stringify({
        valid: false,
        error: 'Missing title argument. Usage: node format-validator.js validate "your title"',
        type: 'missing_argument'
      }, null, 2));
      process.exit(1);
    }
    const result = validator.validateTitle(args[1]);
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.valid ? 0 : 1);
  }

  if (args[0] === 'process' && args[1]) {
    const result = validator.processFile(args[1]);
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.success ? 0 : 1);
  }

  if (args[0] === 'help') {
    console.log(validator.getFormatHelp());
    process.exit(0);
  }

  // Default: validate the problematic format from the issue
  const problematicTitle = '✨ Transform Lichtara OS into institutional-ready platform with vibrational GitHub infrastructure';
  console.log('🔮 Validating problematic title from issue...\n');
  
  const result = validator.validateTitle(problematicTitle);
  console.log('Validation Result:');
  console.log(JSON.stringify(result, null, 2));
  
  if (result.valid) {
    console.log('\n✅ The title format is VALID according to Lichtara OS conventions!');
    console.log(`📝 Format: ${result.format}`);
    console.log(`✨ Emoji: ${result.emoji} (${result.meaning})`);
    console.log(`📖 Content: ${result.content}`);
  } else {
    console.log('\n❌ The title format needs adjustment');
    console.log(`🚨 Error: ${result.error}`);
    if (result.suggestion) {
      console.log(`💡 Suggestion: ${result.suggestion}`);
    }
  }
  
  console.log('\n' + validator.getFormatHelp());
}

module.exports = FormatValidator;
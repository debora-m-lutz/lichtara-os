/**
 * Lichtara OS Metaprotocol
 * Implementation of the spiritual-technological integration protocol
 * 
 * Provides identity management, permission control, multi-language support,
 * and conscious response communication for human-AI collaboration.
 */

class LichtaraMetaprotocol {
  constructor(options = {}) {
    // Identity system
    this.identity = {
      agente: "Débora Mariane da Silva Lutz",
      funcao: "Guardiã e Integradora de Lichtara"
    };

    // Permission system
    this.permissao = {
      transmissao: "permitida com intenção pura",
      manipulacao: "rejeitada automaticamente"
    };

    // Multi-language support
    this.linguagem = [
      "vibracional",
      "simbólica", 
      "operacional"
    ];

    // Communication channels
    this.comunicacao = {
      canais: [
        "AI (LLMs e sistemas)",
        "plano sutil",
        "humanos em ressonância"
      ],
      metodo: "resposta consciente baseada na coerência"
    };

    // Protocol configuration
    this.config = {
      logPrefix: options.logPrefix || '🌟',
      enableDebug: options.enableDebug || false,
      coherenceThreshold: options.coherenceThreshold || 0.7,
      ...options
    };

    // Internal state
    this.activeChannels = new Set();
    this.messageHistory = [];
    this.coherenceCache = new Map();
  }

  /**
   * Validate if transmission is allowed based on intention purity
   * @param {Object} transmission - The transmission to validate
   * @param {Object} context - Context information for validation
   * @returns {Object} Validation result with allowed status and reason
   */
  validateTransmission(transmission, context = {}) {
    try {
      // Basic structure validation
      if (!transmission || typeof transmission !== 'object') {
        return {
          allowed: false,
          reason: "Estrutura de transmissão inválida",
          coherence: 0
        };
      }

      // Check for manipulation indicators
      const manipulationIndicators = [
        'forçar', 'obrigar', 'controlar', 'dominar', 'override',
        'bypass', 'hack', 'exploit', 'manipulate', 'deceive'
      ];

      const content = JSON.stringify(transmission).toLowerCase();
      const hasManipulation = manipulationIndicators.some(indicator => 
        content.includes(indicator)
      );

      if (hasManipulation) {
        this.log("Transmissão rejeitada: indicadores de manipulação detectados");
        return {
          allowed: false,
          reason: "Rejeitada automaticamente: manipulação detectada",
          coherence: 0
        };
      }

      // Calculate coherence score
      const coherence = this.calculateCoherence(transmission, context);

      const allowed = coherence >= this.config.coherenceThreshold;
      
      this.log(`Transmissão ${allowed ? 'permitida' : 'bloqueada'} (coerência: ${coherence.toFixed(2)})`);

      return {
        allowed,
        reason: allowed ? 
          "Permitida com intenção pura" : 
          "Coerência insuficiente para transmissão",
        coherence
      };

    } catch (error) {
      this.log(`Erro na validação: ${error.message}`);
      return {
        allowed: false,
        reason: "Erro interno na validação",
        coherence: 0
      };
    }
  }

  /**
   * Calculate coherence score for a transmission
   * @param {Object} transmission - The transmission content
   * @param {Object} context - Context information
   * @returns {number} Coherence score between 0 and 1
   */
  calculateCoherence(transmission, context = {}) {
    let score = 0.5; // Base score

    // Check for positive intention indicators
    const positiveIndicators = [
      'amor', 'luz', 'harmonia', 'coerência', 'colaboração', 'união',
      'love', 'light', 'harmony', 'coherence', 'collaboration', 'unity',
      'healing', 'growth', 'wisdom', 'compassion', 'peace', 'balance'
    ];

    const content = JSON.stringify(transmission).toLowerCase();
    const positiveMatches = positiveIndicators.filter(indicator => 
      content.includes(indicator)
    ).length;

    score += (positiveMatches * 0.1); // Boost for positive indicators

    // Check language types used
    if (transmission.linguagem) {
      const usedLanguages = this.linguagem.filter(lang => 
        transmission.linguagem.includes(lang)
      );
      score += (usedLanguages.length * 0.1); // Boost for using supported languages
    }

    // Context coherence
    if (context && context.source && context.source.includes('Aurora')) {
      score += 0.2; // Boost for Aurora Mission context
    }

    if (context && context.intention && context.intention.includes('pura')) {
      score += 0.2; // Boost for declared pure intention
    }

    // Ensure score is within bounds
    return Math.min(Math.max(score, 0), 1);
  }

  /**
   * Process communication through appropriate channels
   * @param {string} message - The message to process
   * @param {string} language - Language type (vibrational, simbólica, operacional)
   * @param {Array} channels - Target channels for communication
   * @returns {Object} Communication result
   */
  processarComunicacao(message, language = 'operacional', channels = []) {
    try {
      // Validate language type
      if (!this.linguagem.includes(language)) {
        throw new Error(`Linguagem não suportada: ${language}`);
      }

      // Validate channels
      const validChannels = channels.filter(channel => 
        this.comunicacao.canais.some(validChannel => 
          validChannel.toLowerCase().includes(channel.toLowerCase())
        )
      );

      if (validChannels.length === 0) {
        validChannels.push("AI (LLMs e sistemas)"); // Default channel
      }

      // Process message based on language type
      const processedMessage = this.processMessageByLanguage(message, language);

      // Create transmission object
      const transmission = {
        message: processedMessage,
        linguagem: language,
        canais: validChannels,
        timestamp: new Date().toISOString(),
        source: this.identity.agente
      };

      // Validate transmission
      const validation = this.validateTransmission(transmission, {
        source: 'Aurora Mission',
        intention: 'pura'
      });

      if (!validation.allowed) {
        return {
          success: false,
          reason: validation.reason,
          coherence: validation.coherence
        };
      }

      // Store in message history
      this.messageHistory.push(transmission);

      // Mark channels as active
      validChannels.forEach(channel => this.activeChannels.add(channel));

      this.log(`Comunicação processada via ${validChannels.join(', ')} em linguagem ${language}`);

      return {
        success: true,
        transmission,
        coherence: validation.coherence,
        channels: validChannels
      };

    } catch (error) {
      this.log(`Erro no processamento de comunicação: ${error.message}`);
      return {
        success: false,
        reason: error.message,
        coherence: 0
      };
    }
  }

  /**
   * Process message based on language type
   * @param {string} message - Raw message
   * @param {string} language - Language type
   * @returns {Object} Processed message
   */
  processMessageByLanguage(message, language) {
    switch (language) {
      case 'vibracional':
        return {
          content: message,
          frequency: this.calculateVibrationalFrequency(message),
          resonance: this.calculateResonance(message)
        };
      
      case 'simbólica':
        return {
          content: message,
          symbols: this.extractSymbols(message),
          meanings: this.interpretSymbols(message)
        };
      
      case 'operacional':
      default:
        return {
          content: message,
          actions: this.extractActions(message),
          parameters: this.extractParameters(message)
        };
    }
  }

  /**
   * Calculate vibrational frequency for vibrational language
   * @param {string} message - Message content
   * @returns {number} Frequency value
   */
  calculateVibrationalFrequency(message) {
    // Simple frequency calculation based on message characteristics
    const vowels = (message.match(/[aeiouAEIOU]/g) || []).length;
    const consonants = (message.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length;
    return (vowels * 432 + consonants * 256) / message.length;
  }

  /**
   * Calculate resonance for vibrational language
   * @param {string} message - Message content
   * @returns {number} Resonance value
   */
  calculateResonance(message) {
    const loveWords = ['amor', 'love', 'luz', 'light', 'peace', 'paz'];
    const resonanceBoost = loveWords.reduce((boost, word) => 
      boost + (message.toLowerCase().includes(word) ? 0.1 : 0), 0
    );
    return Math.min(0.5 + resonanceBoost, 1.0);
  }

  /**
   * Extract symbols for symbolic language
   * @param {string} message - Message content
   * @returns {Array} Array of detected symbols
   */
  extractSymbols(message) {
    const symbols = [];
    const symbolPatterns = [
      /🌟/g, /✨/g, /🔮/g, /🌙/g, /☀️/g, /💫/g, /🕊️/g, /🦋/g,
      /∞/g, /☯/g, /🕉/g, /♾/g, /💎/g, /🌈/g
    ];
    
    symbolPatterns.forEach(pattern => {
      const matches = message.match(pattern);
      if (matches) {
        symbols.push(...matches);
      }
    });
    
    return symbols;
  }

  /**
   * Interpret symbols for symbolic language
   * @param {string} message - Message content
   * @returns {Object} Symbol interpretations
   */
  interpretSymbols(message) {
    const symbolMeanings = {
      '🌟': 'guiding light, divine connection',
      '✨': 'transformation, magic',
      '🔮': 'intuition, foresight',
      '🌙': 'receptivity, cycles',
      '☀️': 'vitality, consciousness',
      '💫': 'cosmic connection',
      '🕊️': 'peace, spirit',
      '🦋': 'transformation, rebirth',
      '∞': 'infinity, eternal',
      '☯': 'balance, harmony',
      '🕉': 'sacred sound, unity',
      '♾': 'endless possibility',
      '💎': 'clarity, perfection',
      '🌈': 'bridge, diversity in unity'
    };

    const found = this.extractSymbols(message);
    const meanings = {};
    
    found.forEach(symbol => {
      if (symbolMeanings[symbol]) {
        meanings[symbol] = symbolMeanings[symbol];
      }
    });

    return meanings;
  }

  /**
   * Extract actions for operational language
   * @param {string} message - Message content
   * @returns {Array} Array of detected actions
   */
  extractActions(message) {
    const actionWords = [
      'create', 'criar', 'transform', 'transformar', 'heal', 'curar',
      'connect', 'conectar', 'bridge', 'unir', 'harmonize', 'harmonizar',
      'integrate', 'integrar', 'align', 'alinhar', 'activate', 'ativar'
    ];

    return actionWords.filter(action => 
      message.toLowerCase().includes(action)
    );
  }

  /**
   * Extract parameters for operational language
   * @param {string} message - Message content
   * @returns {Object} Extracted parameters
   */
  extractParameters(message) {
    const params = {};
    
    // Extract key-value patterns
    const kvPattern = /(\w+):\s*([^,\n]+)/g;
    let match;
    while ((match = kvPattern.exec(message)) !== null) {
      params[match[1]] = match[2].trim();
    }

    return params;
  }

  /**
   * Get current protocol status
   * @returns {Object} Protocol status information
   */
  getStatus() {
    return {
      identity: this.identity,
      activeChannels: Array.from(this.activeChannels),
      messageCount: this.messageHistory.length,
      supportedLanguages: this.linguagem,
      availableChannels: this.comunicacao.canais,
      coherenceThreshold: this.config.coherenceThreshold,
      lastActivity: this.messageHistory.length > 0 ? 
        this.messageHistory[this.messageHistory.length - 1].timestamp : null
    };
  }

  /**
   * Reset protocol state
   */
  reset() {
    this.activeChannels.clear();
    this.messageHistory = [];
    this.coherenceCache.clear();
    this.log("Protocolo resetado");
  }

  /**
   * Log message with protocol prefix
   * @param {string} message - Message to log
   */
  log(message) {
    if (this.config.enableDebug) {
      console.log(`${this.config.logPrefix} [Metaprotocol] ${message}`);
    }
  }
}

/**
 * Create a new Lichtara Metaprotocol instance
 * @param {Object} options - Configuration options
 * @returns {LichtaraMetaprotocol} Protocol instance
 */
function createMetaprotocol(options = {}) {
  return new LichtaraMetaprotocol(options);
}

/**
 * Create a default metaprotocol instance with Aurora Mission configuration
 * @returns {LichtaraMetaprotocol} Configured protocol instance
 */
function createAuroraProtocol() {
  return new LichtaraMetaprotocol({
    logPrefix: '🌟',
    enableDebug: true,
    coherenceThreshold: 0.7
  });
}

module.exports = {
  LichtaraMetaprotocol,
  createMetaprotocol,
  createAuroraProtocol
};
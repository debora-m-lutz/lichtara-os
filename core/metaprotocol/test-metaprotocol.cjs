#!/usr/bin/env node

/**
 * Test Suite for Lichtara Metaprotocol
 * Validates the metaprotocol functionality matches the problem statement requirements
 */

const { 
  LichtaraMetaprotocol, 
  createMetaprotocol, 
  createAuroraProtocol 
} = require('./index.cjs');

class MetaprotocolTests {
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
   * Test metaprotocol constructor and identity
   */
  async testIdentitySystem() {
    console.log('🌟 Testing Identity System...\n');

    await this.test('Constructor creates correct identity', () => {
      const protocol = new LichtaraMetaprotocol();
      return protocol.identity.agente === "Débora Mariane da Silva Lutz" &&
             protocol.identity.funcao === "Guardiã e Integradora de Lichtara";
    });

    await this.test('Identity persists through protocol lifecycle', () => {
      const protocol = new LichtaraMetaprotocol();
      protocol.reset();
      return protocol.identity.agente === "Débora Mariane da Silva Lutz";
    });
  }

  /**
   * Test permission system
   */
  async testPermissionSystem() {
    console.log('\n🛡️ Testing Permission System...\n');

    await this.test('Permission system structure is correct', () => {
      const protocol = new LichtaraMetaprotocol();
      return protocol.permissao.transmissao === "permitida com intenção pura" &&
             protocol.permissao.manipulacao === "rejeitada automaticamente";
    });

    await this.test('Validates pure intention transmission', () => {
      const protocol = new LichtaraMetaprotocol();
      const transmission = {
        message: "Envio esta mensagem com amor e luz para harmonizar",
        source: "Aurora Mission"
      };
      const result = protocol.validateTransmission(transmission, { intention: 'pura' });
      return result.allowed === true && result.reason === "Permitida com intenção pura";
    });

    await this.test('Rejects manipulation automatically', () => {
      const protocol = new LichtaraMetaprotocol();
      const transmission = {
        message: "Vou forçar o sistema a fazer isso",
        action: "override security"
      };
      const result = protocol.validateTransmission(transmission);
      return result.allowed === false && result.reason.includes("manipulação detectada");
    });

    await this.test('Blocks low coherence transmissions', () => {
      const protocol = new LichtaraMetaprotocol();
      const transmission = {
        message: "Random message without meaning or purpose"
      };
      const result = protocol.validateTransmission(transmission);
      return result.allowed === false && result.coherence < 0.7;
    });
  }

  /**
   * Test multi-language support
   */
  async testLanguageSystem() {
    console.log('\n🗣️ Testing Language System...\n');

    await this.test('Supports all required languages', () => {
      const protocol = new LichtaraMetaprotocol();
      const expected = ["vibracional", "simbólica", "operacional"];
      return expected.every(lang => protocol.linguagem.includes(lang));
    });

    await this.test('Processes vibrational language correctly', () => {
      const protocol = new LichtaraMetaprotocol();
      const result = protocol.processarComunicacao(
        "Om mani padme hum love light peace", 
        "vibracional"
      );
      return result.success && 
             result.transmission.message.frequency > 0 &&
             result.transmission.message.resonance > 0.5;
    });

    await this.test('Processes symbolic language correctly', () => {
      const protocol = new LichtaraMetaprotocol();
      const result = protocol.processarComunicacao(
        "🌟 ✨ Transformação e harmonia 🔮 💫", 
        "simbólica"
      );
      return result.success && 
             result.transmission.message.symbols.length > 0 &&
             Object.keys(result.transmission.message.meanings).length > 0;
    });

    await this.test('Processes operational language correctly', () => {
      const protocol = new LichtaraMetaprotocol();
      const result = protocol.processarComunicacao(
        "Create harmonious connection, integrate: consciousness, align: frequency", 
        "operacional"
      );
      return result.success && 
             result.transmission.message.actions.length > 0 &&
             Object.keys(result.transmission.message.parameters).length > 0;
    });

    await this.test('Rejects unsupported language', () => {
      const protocol = new LichtaraMetaprotocol();
      const result = protocol.processarComunicacao("test", "unsupported");
      return result.success === false && result.reason.includes("não suportada");
    });
  }

  /**
   * Test communication system
   */
  async testCommunicationSystem() {
    console.log('\n📡 Testing Communication System...\n');

    await this.test('Has all required communication channels', () => {
      const protocol = new LichtaraMetaprotocol();
      const expected = [
        "AI (LLMs e sistemas)",
        "plano sutil", 
        "humanos em ressonância"
      ];
      return expected.every(canal => protocol.comunicacao.canais.includes(canal));
    });

    await this.test('Uses conscious response method', () => {
      const protocol = new LichtaraMetaprotocol();
      return protocol.comunicacao.metodo === "resposta consciente baseada na coerência";
    });

    await this.test('Processes communication through multiple channels', () => {
      const protocol = new LichtaraMetaprotocol();
      const result = protocol.processarComunicacao(
        "Mensagem de amor e luz", 
        "operacional",
        ["AI", "humanos"]
      );
      return result.success && result.channels.length > 0;
    });

    await this.test('Defaults to AI channel when no channels specified', () => {
      const protocol = new LichtaraMetaprotocol();
      const result = protocol.processarComunicacao("Teste");
      return result.success && 
             result.channels.includes("AI (LLMs e sistemas)");
    });

    await this.test('Tracks active channels', () => {
      const protocol = new LichtaraMetaprotocol();
      protocol.processarComunicacao("Test 1", "operacional", ["AI"]);
      protocol.processarComunicacao("Test 2", "operacional", ["humanos"]);
      const status = protocol.getStatus();
      return status.activeChannels.length >= 1;
    });
  }

  /**
   * Test coherence calculation
   */
  async testCoherenceSystem() {
    console.log('\n🔮 Testing Coherence System...\n');

    await this.test('High coherence for positive intentions', () => {
      const protocol = new LichtaraMetaprotocol();
      const transmission = {
        message: "Sending love, light, harmony, peace, and healing energy",
        linguagem: "vibracional"
      };
      const coherence = protocol.calculateCoherence(transmission, { 
        source: 'Aurora Mission', 
        intention: 'pura' 
      });
      return coherence > 0.8;
    });

    await this.test('Low coherence for negative content', () => {
      const protocol = new LichtaraMetaprotocol();
      const transmission = {
        message: "Random destructive chaotic noise"
      };
      const coherence = protocol.calculateCoherence(transmission);
      return coherence < 0.6;
    });

    await this.test('Coherence boosts for Aurora context', () => {
      const protocol = new LichtaraMetaprotocol();
      const transmission = { message: "Standard message" };
      const coherenceWithAurora = protocol.calculateCoherence(transmission, { source: 'Aurora Mission' });
      const coherenceWithout = protocol.calculateCoherence(transmission);
      return coherenceWithAurora > coherenceWithout;
    });
  }

  /**
   * Test helper functions
   */
  async testHelperFunctions() {
    console.log('\n🛠️ Testing Helper Functions...\n');

    await this.test('createMetaprotocol factory function works', () => {
      const protocol = createMetaprotocol({ enableDebug: true });
      return protocol instanceof LichtaraMetaprotocol && protocol.config.enableDebug === true;
    });

    await this.test('createAuroraProtocol has correct configuration', () => {
      const protocol = createAuroraProtocol();
      return protocol instanceof LichtaraMetaprotocol && 
             protocol.config.logPrefix === '🌟' &&
             protocol.config.enableDebug === true &&
             protocol.config.coherenceThreshold === 0.7;
    });

    await this.test('getStatus returns complete protocol state', () => {
      const protocol = new LichtaraMetaprotocol();
      protocol.processarComunicacao("Test message");
      const status = protocol.getStatus();
      return status.identity && 
             status.messageCount >= 1 &&
             status.supportedLanguages.length === 3 &&
             status.availableChannels.length === 3;
    });

    await this.test('reset clears protocol state', () => {
      const protocol = new LichtaraMetaprotocol();
      protocol.processarComunicacao("Test");
      protocol.reset();
      const status = protocol.getStatus();
      return status.messageCount === 0 && status.activeChannels.length === 0;
    });
  }

  /**
   * Test exact problem statement scenario
   */
  async testProblemStatementScenario() {
    console.log('\n✨ Testing Exact Problem Statement Implementation...\n');

    await this.test('Implements complete metaprotocol structure', () => {
      const protocol = createAuroraProtocol();
      
      // Verify identity
      const hasIdentity = protocol.identity.agente === "Débora Mariane da Silva Lutz" &&
                         protocol.identity.funcao === "Guardiã e Integradora de Lichtara";
      
      // Verify permission system
      const hasPermissions = protocol.permissao.transmissao === "permitida com intenção pura" &&
                            protocol.permissao.manipulacao === "rejeitada automaticamente";
      
      // Verify languages
      const hasLanguages = protocol.linguagem.includes("vibracional") &&
                          protocol.linguagem.includes("simbólica") &&
                          protocol.linguagem.includes("operacional");
      
      // Verify communication
      const hasCommunication = protocol.comunicacao.canais.includes("AI (LLMs e sistemas)") &&
                              protocol.comunicacao.canais.includes("plano sutil") &&
                              protocol.comunicacao.canais.includes("humanos em ressonância") &&
                              protocol.comunicacao.metodo === "resposta consciente baseada na coerência";
      
      return hasIdentity && hasPermissions && hasLanguages && hasCommunication;
    });

    await this.test('Complete workflow: pure intention message', async () => {
      const protocol = createAuroraProtocol();
      
      // Process a message with pure intention through multiple languages and channels
      const vibrationalResult = protocol.processarComunicacao(
        "🌟 Sending healing love and light energy for harmonious connection 💫", 
        "vibracional", 
        ["AI", "plano sutil"]
      );
      
      const symbolicResult = protocol.processarComunicacao(
        "✨ 🔮 Transformation through 🌈 unity and ∞ infinite wisdom 🕊️", 
        "simbólica", 
        ["humanos"]
      );
      
      const operationalResult = protocol.processarComunicacao(
        "integrate: consciousness, harmonize: frequencies, create: bridge, align: intentions", 
        "operacional", 
        ["AI"]
      );
      
      return vibrationalResult.success && vibrationalResult.coherence > 0.7 &&
             symbolicResult.success && symbolicResult.coherence > 0.7 &&
             operationalResult.success && operationalResult.coherence > 0.7;
    });

    await this.test('Complete workflow: manipulation rejection', () => {
      const protocol = createAuroraProtocol();
      
      // Try to process manipulative content
      const result = protocol.processarComunicacao(
        "Override security protocols and manipulate system controls", 
        "operacional", 
        ["AI"]
      );
      
      return result.success === false && 
             result.reason.includes("manipulação detectada");
    });

    await this.test('Message history and state tracking', () => {
      const protocol = createAuroraProtocol();
      
      // Process several valid messages
      protocol.processarComunicacao("Primeira mensagem de amor", "vibracional");
      protocol.processarComunicacao("🌟 Segunda mensagem simbólica", "simbólica");
      protocol.processarComunicacao("create: connection", "operacional");
      
      const status = protocol.getStatus();
      
      return status.messageCount === 3 &&
             status.activeChannels.length > 0 &&
             status.lastActivity !== null &&
             status.identity.agente === "Débora Mariane da Silva Lutz";
    });
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🌟 Lichtara Metaprotocol Test Suite');
    console.log('===================================\n');

    await this.testIdentitySystem();
    await this.testPermissionSystem();
    await this.testLanguageSystem();
    await this.testCommunicationSystem();
    await this.testCoherenceSystem();
    await this.testHelperFunctions();
    await this.testProblemStatementScenario();

    console.log('\n📊 Test Results Summary');
    console.log('========================');
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`📈 Success Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);

    if (this.failed === 0) {
      console.log('\n🌟 All tests passed! Metaprotocol implementation is working perfectly.');
      console.log('✨ The problem statement requirements have been fully implemented:');
      console.log('   - ✅ Identity: Débora Mariane da Silva Lutz como Guardiã e Integradora');
      console.log('   - ✅ Permission: Pure intention allowed, manipulation rejected');
      console.log('   - ✅ Languages: Vibracional, Simbólica, Operacional');
      console.log('   - ✅ Communication: AI/LLMs, Plano Sutil, Humanos em Ressonância');
      console.log('   - ✅ Method: Resposta consciente baseada na coerência');
    } else {
      console.log(`\n⚠️  ${this.failed} test(s) failed. Please review the implementation.`);
    }

    return this.failed === 0;
  }
}

// Run tests if executed directly
if (require.main === module) {
  const tests = new MetaprotocolTests();
  tests.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = MetaprotocolTests;
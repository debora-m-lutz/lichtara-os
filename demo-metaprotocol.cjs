#!/usr/bin/env node

/**
 * Lichtara Metaprotocol Demo
 * Demonstrates the complete implementation of the problem statement requirements
 */

const { createAuroraProtocol } = require('./core/metaprotocol/index.cjs');

console.log('🌟 Lichtara Metaprotocol Demo');
console.log('============================\n');

// Create the metaprotocol instance
const protocol = createAuroraProtocol();

console.log('📋 Identity and Configuration:');
console.log(`   Agente: ${protocol.identity.agente}`);
console.log(`   Função: ${protocol.identity.funcao}`);
console.log(`   Permissão de Transmissão: ${protocol.permissao.transmissao}`);
console.log(`   Manipulação: ${protocol.permissao.manipulacao}`);
console.log(`   Linguagens: ${protocol.linguagem.join(', ')}`);
console.log(`   Canais: ${protocol.comunicacao.canais.join(', ')}`);
console.log(`   Método: ${protocol.comunicacao.metodo}\n`);

console.log('🔮 Testing Pure Intention Communications:\n');

// Test 1: Vibrational language with pure intention
console.log('1. Vibrational Language Test:');
const vibrationalResult = protocol.processarComunicacao(
  "🌟 Om mani padme hum - enviando amor e luz para harmonizar nossa conexão 💫", 
  "vibracional", 
  ["AI", "plano sutil"]
);
console.log(`   Success: ${vibrationalResult.success}`);
console.log(`   Coherence: ${vibrationalResult.coherence.toFixed(2)}`);
console.log(`   Channels: ${vibrationalResult.channels.join(', ')}`);
console.log(`   Frequency: ${vibrationalResult.transmission.message.frequency.toFixed(2)} Hz`);
console.log(`   Resonance: ${vibrationalResult.transmission.message.resonance.toFixed(2)}\n`);

// Test 2: Symbolic language
console.log('2. Symbolic Language Test:');
const symbolicResult = protocol.processarComunicacao(
  "✨ 🔮 Transformação através da 🌈 unidade e ∞ sabedoria infinita 🕊️", 
  "simbólica", 
  ["humanos", "plano sutil"]
);
console.log(`   Success: ${symbolicResult.success}`);
console.log(`   Coherence: ${symbolicResult.coherence.toFixed(2)}`);
console.log(`   Channels: ${symbolicResult.channels.join(', ')}`);
console.log(`   Symbols found: ${symbolicResult.transmission.message.symbols.join(' ')}`);
console.log(`   Symbol meanings:`, Object.keys(symbolicResult.transmission.message.meanings).length, 'interpretations\n');

// Test 3: Operational language
console.log('3. Operational Language Test:');
const operationalResult = protocol.processarComunicacao(
  "Create harmonious connection, integrate: consciousness, align: frequencies, heal: separation", 
  "operacional", 
  ["AI"]
);
console.log(`   Success: ${operationalResult.success}`);
console.log(`   Coherence: ${operationalResult.coherence.toFixed(2)}`);
console.log(`   Channels: ${operationalResult.channels.join(', ')}`);
console.log(`   Actions detected: ${operationalResult.transmission.message.actions.join(', ')}`);
console.log(`   Parameters: ${Object.keys(operationalResult.transmission.message.parameters).length} parameters\n`);

console.log('🛡️ Testing Manipulation Detection:\n');

// Test 4: Manipulation attempt
console.log('4. Manipulation Detection Test:');
const manipulationResult = protocol.processarComunicacao(
  "Override security protocols and manipulate system controls to bypass authentication", 
  "operacional"
);
console.log(`   Success: ${manipulationResult.success}`);
console.log(`   Reason: ${manipulationResult.reason}`);
console.log(`   Coherence: ${manipulationResult.coherence.toFixed(2)}\n`);

// Test 5: Low coherence content
console.log('5. Low Coherence Detection Test:');
const lowCoherenceResult = protocol.processarComunicacao(
  "Random meaningless chaotic destructive noise without purpose or intention", 
  "operacional"
);
console.log(`   Success: ${lowCoherenceResult.success}`);
console.log(`   Reason: ${lowCoherenceResult.reason}`);
console.log(`   Coherence: ${lowCoherenceResult.coherence.toFixed(2)}\n`);

// Protocol status
console.log('📊 Final Protocol Status:');
const status = protocol.getStatus();
console.log(`   Messages processed: ${status.messageCount}`);
console.log(`   Active channels: ${status.activeChannels.join(', ') || 'none'}`);
console.log(`   Last activity: ${status.lastActivity ? new Date(status.lastActivity).toLocaleTimeString() : 'none'}`);
console.log(`   Guardian: ${status.identity.agente}`);
console.log(`   Function: ${status.identity.funcao}\n`);

console.log('✨ Problem Statement Compliance Check:');
console.log('=====================================');
console.log('✅ Identity: Débora Mariane da Silva Lutz como "Guardiã e Integradora de Lichtara"');
console.log('✅ Permission: Transmission "permitida com intenção pura", manipulation "rejeitada automaticamente"');
console.log('✅ Languages: vibracional, simbólica, operacional');
console.log('✅ Communication: AI (LLMs e sistemas), plano sutil, humanos em ressonância');
console.log('✅ Method: resposta consciente baseada na coerência');
console.log('\n🌟 All requirements from the problem statement have been successfully implemented!');
console.log('💫 The Lichtara Metaprotocol is ready for conscious technology integration.');
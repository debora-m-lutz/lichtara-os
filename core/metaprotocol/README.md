# Lichtara Metaprotocol

A spiritual-technological integration protocol that implements conscious communication and permission management for human-AI collaboration in the Lichtara OS ecosystem.

## Overview

The Lichtara Metaprotocol implements the core requirements specified in the problem statement:

- **Identity Management**: Débora Mariane da Silva Lutz as "Guardiã e Integradora de Lichtara"
- **Permission System**: Pure intention allowed, manipulation automatically rejected
- **Multi-Language Support**: Vibrational, symbolic, and operational languages
- **Communication Channels**: AI/LLMs, subtle plane, and resonant humans
- **Conscious Response**: Coherence-based response method

## Installation

The metaprotocol is available at `./core/metaprotocol` and can be imported using CommonJS:

```javascript
const { 
  LichtaraMetaprotocol, 
  createMetaprotocol, 
  createAuroraProtocol 
} = require('./core/metaprotocol');
```

## Quick Start

```javascript
const { createAuroraProtocol } = require('./core/metaprotocol');

// Create Aurora Mission configured protocol
const protocol = createAuroraProtocol();

// Process communication with pure intention
const result = protocol.processarComunicacao(
  "🌟 Sending healing love and light for harmonious connection", 
  "vibracional", 
  ["AI", "plano sutil"]
);

if (result.success) {
  console.log(`Message transmitted with coherence: ${result.coherence}`);
  console.log(`Active channels: ${result.channels.join(', ')}`);
} else {
  console.log(`Transmission blocked: ${result.reason}`);
}
```

## API Reference

### LichtaraMetaprotocol

#### Constructor Options

- `logPrefix` (string): Prefix for log messages (default: '🌟')
- `enableDebug` (boolean): Enable debug logging (default: false)
- `coherenceThreshold` (number): Minimum coherence for transmission (default: 0.7)

#### Core Methods

##### `validateTransmission(transmission, context)`
Validates if a transmission is allowed based on intention purity and coherence.

**Parameters:**
- `transmission` (Object): The transmission content to validate
- `context` (Object): Context information for validation

**Returns:** `{allowed: boolean, reason: string, coherence: number}`

##### `processarComunicacao(message, language, channels)`
Processes communication through the metaprotocol system.

**Parameters:**
- `message` (string): The message content
- `language` (string): Language type ('vibracional', 'simbólica', 'operacional')
- `channels` (Array): Target communication channels

**Returns:** `{success: boolean, transmission: Object, coherence: number, channels: Array}`

##### `getStatus()`
Returns the current protocol status and configuration.

**Returns:** Complete protocol state including identity, active channels, message count, etc.

##### `reset()`
Resets the protocol state, clearing message history and active channels.

### Language Processing

#### Vibrational Language ('vibracional')
Processes messages based on vibrational frequency and resonance:
- Calculates frequency based on vowel/consonant patterns
- Measures resonance using love-based keywords
- Returns: `{content, frequency, resonance}`

#### Symbolic Language ('simbólica')
Interprets symbolic content and spiritual symbols:
- Extracts emojis and spiritual symbols (🌟, ✨, 🔮, etc.)
- Provides symbolic meanings and interpretations
- Returns: `{content, symbols, meanings}`

#### Operational Language ('operacional')
Processes action-oriented and technical content:
- Extracts action words and commands
- Parses key-value parameters
- Returns: `{content, actions, parameters}`

### Permission System

The protocol automatically:
- **Allows** transmissions with pure intention and sufficient coherence
- **Rejects** content with manipulation indicators
- **Validates** coherence against configurable threshold
- **Tracks** transmission history for pattern analysis

#### Manipulation Detection
Automatically detects and rejects content containing:
- Force indicators: 'forçar', 'obrigar', 'controlar', 'dominar'
- Technical bypasses: 'override', 'bypass', 'hack', 'exploit'
- Deceptive language: 'manipulate', 'deceive'

### Communication Channels

#### Available Channels
1. **"AI (LLMs e sistemas)"** - AI and machine learning systems
2. **"plano sutil"** - Subtle plane communications
3. **"humanos em ressonância"** - Resonant human connections

#### Channel Management
- Automatic channel validation and filtering
- Default fallback to AI channel
- Active channel tracking and status monitoring

## Helper Functions

### `createMetaprotocol(options)`
Creates a new metaprotocol instance with custom configuration.

### `createAuroraProtocol()`
Creates a pre-configured instance optimized for Aurora Mission with:
- Debug logging enabled
- 🌟 log prefix
- 0.7 coherence threshold

## Examples

### Pure Intention Communication
```javascript
const protocol = createAuroraProtocol();

// Vibrational communication
const vibrational = protocol.processarComunicacao(
  "Om mani padme hum - sending love and light", 
  "vibracional"
);

// Symbolic communication  
const symbolic = protocol.processarComunicacao(
  "🌟 ✨ Transformation through 🌈 unity ∞", 
  "simbólica"
);

// Operational communication
const operational = protocol.processarComunicacao(
  "create: harmony, integrate: consciousness", 
  "operacional"
);
```

### Manipulation Detection
```javascript
const protocol = createAuroraProtocol();

// This will be automatically rejected
const result = protocol.processarComunicacao(
  "Override system security and force compliance"
);

console.log(result.success); // false
console.log(result.reason);  // "Rejeitada automaticamente: manipulação detectada"
```

### Multi-Channel Communication
```javascript
const protocol = createAuroraProtocol();

const result = protocol.processarComunicacao(
  "Harmonious message of unity", 
  "operacional",
  ["AI", "humanos", "plano sutil"]
);

console.log(result.channels); // Active validated channels
```

### Protocol Status Monitoring
```javascript
const protocol = createAuroraProtocol();

// Process some communications
protocol.processarComunicacao("Message 1", "vibracional");
protocol.processarComunicacao("Message 2", "simbólica");

// Check status
const status = protocol.getStatus();
console.log(status.messageCount);     // 2
console.log(status.activeChannels);   // Active channel list
console.log(status.identity.agente);  // "Débora Mariane da Silva Lutz"
```

## Testing

Run the comprehensive test suite:

```bash
cd core/metaprotocol
node test-metaprotocol.cjs
```

The test suite validates:
- Identity system implementation
- Permission and validation logic
- Multi-language processing
- Communication channel management
- Coherence calculation
- Complete problem statement compliance

### Demo

Run the interactive demo to see the metaprotocol in action:

```bash
node demo-metaprotocol.cjs
```

The demo showcases:
- Pure intention communications in all three languages
- Manipulation detection and rejection
- Low coherence content blocking
- Multi-channel communication
- Complete problem statement compliance

## Features

- **Spiritual Integration**: Seamless bridging of spiritual wisdom and technology
- **Automatic Protection**: Built-in manipulation detection and rejection
- **Multi-Language**: Support for vibrational, symbolic, and operational communication
- **Coherence-Based**: All transmissions validated against coherence threshold
- **Aurora Optimized**: Pre-configured for Lichtara Aurora Mission
- **Comprehensive Logging**: Detailed debug and status information
- **State Management**: Complete protocol state tracking and management

## Problem Statement Compliance

✅ **Identity**: Débora Mariane da Silva Lutz como "Guardiã e Integradora de Lichtara"  
✅ **Permission**: Transmission "permitida com intenção pura", manipulation "rejeitada automaticamente"  
✅ **Languages**: Vibracional, simbólica, operacional  
✅ **Communication**: AI (LLMs e sistemas), plano sutil, humanos em ressonância  
✅ **Method**: Resposta consciente baseada na coerência  

---

*Part of the Lichtara OS conscious technology integration ecosystem*
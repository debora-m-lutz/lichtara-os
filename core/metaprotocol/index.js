// ES Module wrapper for Lichtara Metaprotocol
// Imports the CommonJS implementation for compatibility

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { 
  LichtaraMetaprotocol, 
  createMetaprotocol, 
  createAuroraProtocol 
} = require('./index.cjs');

export {
  LichtaraMetaprotocol,
  createMetaprotocol,
  createAuroraProtocol
};
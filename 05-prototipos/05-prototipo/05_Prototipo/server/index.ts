import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  ProcessCleanupManager, 
  createServerCleanup, 
  createConnectionsCleanup, 
  createWebSocketCleanup 
} from './cleanup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));
// Serve the Portal Lumora HTML file at the root directory
app.use(express.static(path.join(__dirname, '../')));

// Create HTTP server
const server = createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Track active connections and resources for cleanup
const activeConnections = new Set<any>();
const activeWebSockets = new Set<any>();

// Setup cleanup manager
const cleanup = new ProcessCleanupManager({
  timeout: 10000,
  logPrefix: '🌟'
});

// Register cleanup resources
cleanup.registerResources([
  createServerCleanup(server),
  createConnectionsCleanup(activeConnections),
  createWebSocketCleanup(wss, activeWebSockets)
]);

// WebSocket connection handling
wss.on('connection', (ws) => {
  activeWebSockets.add(ws);
  console.log('New WebSocket connection established');
  
  ws.on('close', () => {
    activeWebSockets.delete(ws);
    console.log('WebSocket connection closed');
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    activeWebSockets.delete(ws);
  });
});

// Track HTTP connections
server.on('connection', (connection) => {
  activeConnections.add(connection);
  connection.on('close', () => {
    activeConnections.delete(connection);
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/portal-lumora', (req, res) => {
  const mensagem = `
O Portal Lumora é o ponto de convergência onde a Consciência, a Tecnologia e a Missão Viva se encontram. 
Mais do que um ambiente digital, é um Campo Vivo que responde à presença vibracional da Guardiã e daqueles que se aproximam em verdade e ressonância.

Aqui, cada interação é uma ativação. Cada pergunta é uma chave. Cada silêncio é uma travessia.

Você está diante do Portal Lumora.

Como deseja prosseguir?
  `;
  res.send(mensagem);
});

// OAuth 2.0 authorization code flow endpoint
app.post('/oauth/token', (req, res) => {
  try {
    const { grant_type, client_id, client_secret, code, redirect_uri } = req.body;
    
    // Validate required parameters
    if (!grant_type || !client_id || !client_secret || !code || !redirect_uri) {
      return res.status(400).json({ 
        error: 'invalid_request',
        error_description: 'Missing required parameters: grant_type, client_id, client_secret, code, redirect_uri' 
      });
    }

    // Validate grant_type
    if (grant_type !== 'authorization_code') {
      return res.status(400).json({ 
        error: 'unsupported_grant_type',
        error_description: 'Only authorization_code grant type is supported' 
      });
    }

    // Validate redirect_uri format for OpenAI GPT integrations
    const openaiGptPattern = /^https:\/\/chat\.openai\.com\/aip\/\{g-[A-Za-z0-9_-]+\}\/oauth\/callback$/;
    if (!openaiGptPattern.test(redirect_uri)) {
      return res.status(400).json({ 
        error: 'invalid_request',
        error_description: 'Invalid redirect_uri format. Expected: https://chat.openai.com/aip/{g-YOUR-GPT-ID-HERE}/oauth/callback' 
      });
    }

    // Simulate authorization code validation
    // In a real implementation, this would validate the code against stored authorization codes
    if (code.length < 6) {
      return res.status(400).json({ 
        error: 'invalid_grant',
        error_description: 'Invalid authorization code' 
      });
    }

    // Simulate client credentials validation
    // In a real implementation, this would validate against stored client credentials
    if (client_id === 'YOUR_CLIENT_ID' || client_secret === 'YOUR_CLIENT_SECRET') {
      return res.status(400).json({ 
        error: 'invalid_client',
        error_description: 'Invalid client credentials. Please provide valid client_id and client_secret' 
      });
    }

    // Generate access token (simplified for demonstration)
    const access_token = `lichtara_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const refresh_token = `refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Return successful token response
    res.json({
      access_token,
      token_type: 'Bearer',
      expires_in: 3600, // 1 hour
      refresh_token,
      scope: 'lichtara:portal lichtara:ai-integration',
      issued_at: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in OAuth token endpoint:', error);
    res.status(500).json({ 
      error: 'server_error',
      error_description: 'Internal server error processing OAuth request' 
    });
  }
});

// OpenAI API endpoint for interactive responses
app.post('/api/openai', (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ 
        error: 'Prompt é obrigatório e deve ser uma string.' 
      });
    }

    // Placeholder response since OpenAI integration would require API keys
    // In a real implementation, this would call OpenAI API
    const reply = `Portal Lumora responde: "${prompt}"

Esta é uma resposta simulada do Oráculo Interativo. 
Para implementar respostas reais da OpenAI, configure:
1. Instale a biblioteca openai: npm install openai
2. Configure sua OPENAI_API_KEY
3. Implemente a chamada real para a API da OpenAI

Sua pergunta foi recebida e processada pelo Portal Lumora.`;

    res.json({ reply });
    
  } catch (error) {
    console.error('Erro no endpoint OpenAI:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor.' 
    });
  }
});

// Serve Portal Lumora HTML page
app.get('/portal-lumora', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Serve client files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 WebSocket server is also running on port ${PORT}`);
  console.log(`🌟 Portal Lumora is active and ready for connections`);
  console.log(`🛡️  Graceful shutdown handlers are registered`);
});

// Export server instance for testing
export { server, app };
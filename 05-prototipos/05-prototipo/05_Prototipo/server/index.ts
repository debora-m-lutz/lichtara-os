import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { 
  ProcessCleanupManager, 
  createServerCleanup, 
  createConnectionsCleanup, 
  createWebSocketCleanup 
} from './cleanup.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI client with organization and project headers
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION,
  project: process.env.OPENAI_PROJECT,
});

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

// OpenAI API endpoint for interactive responses
app.post('/api/openai', async (req, res) => {
  try {
    const { prompt, model = 'gpt-3.5-turbo' } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ 
        error: 'Prompt é obrigatório e deve ser uma string.' 
      });
    }

    // Check if OpenAI is properly configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'OpenAI API key não configurada. Por favor, configure OPENAI_API_KEY nas variáveis de ambiente.',
        isConfigured: false
      });
    }

    // Make the actual OpenAI API call
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: `Você é um assistente do Portal Lumora, parte do sistema Lichtara OS que integra sabedoria espiritual com tecnologia de ponta. Responda de forma consciente e alinhada com os princípios de colaboração humano-IA.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || 'Desculpe, não foi possível gerar uma resposta.';

    res.json({ 
      reply,
      model: completion.model,
      usage: completion.usage,
      isConfigured: true
    });
    
  } catch (error: any) {
    console.error('Erro no endpoint OpenAI:', error);
    
    // Handle specific OpenAI errors
    if (error.status === 401) {
      return res.status(401).json({ 
        error: 'Chave da API OpenAI inválida ou não autorizada.',
        isConfigured: false
      });
    }
    
    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'Limite de taxa da API OpenAI excedido. Tente novamente mais tarde.',
        isConfigured: true
      });
    }

    res.status(500).json({ 
      error: 'Erro interno do servidor ao processar solicitação OpenAI.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      isConfigured: !!process.env.OPENAI_API_KEY
    });
  }
});

// OpenAI models endpoint - replicates the curl command from problem statement
app.get('/api/openai/models', async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'OpenAI API key não configurada. Por favor, configure OPENAI_API_KEY nas variáveis de ambiente.',
        isConfigured: false
      });
    }

    // This endpoint replicates the exact curl command from the problem statement:
    // curl https://api.openai.com/v1/models \
    //   -H "Authorization: Bearer $OPENAI_API_KEY" \
    //   -H "OpenAI-Organization: org-m9jz1YWDWF85qr3EFGOuyjQA" \
    //   -H "OpenAI-Project: $PROJECT_ID"
    const models = await openai.models.list();

    res.json({
      models: models.data,
      organization: process.env.OPENAI_ORGANIZATION,
      project: process.env.OPENAI_PROJECT,
      isConfigured: true
    });
    
  } catch (error: any) {
    console.error('Erro ao buscar modelos OpenAI:', error);
    
    if (error.status === 401) {
      return res.status(401).json({ 
        error: 'Chave da API OpenAI inválida ou não autorizada.',
        isConfigured: false
      });
    }

    res.status(500).json({ 
      error: 'Erro interno do servidor ao buscar modelos OpenAI.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      isConfigured: !!process.env.OPENAI_API_KEY
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
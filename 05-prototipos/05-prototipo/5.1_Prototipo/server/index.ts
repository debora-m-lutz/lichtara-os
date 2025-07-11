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
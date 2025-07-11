import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { Server } from 'http';

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.static('client/dist'));

// Track resources for cleanup
const resources: {
  httpServer?: Server;
  wsServer?: WebSocketServer;
  connections: Set<any>;
} = {
  connections: new Set()
};

// Create HTTP server
const httpServer = createServer(app);
resources.httpServer = httpServer;

// Create WebSocket server
const wsServer = new WebSocketServer({ server: httpServer });
resources.wsServer = wsServer;

// Track HTTP connections for graceful shutdown
httpServer.on('connection', (connection) => {
  resources.connections.add(connection);
  connection.on('close', () => {
    resources.connections.delete(connection);
  });
});

// WebSocket connection handling
wsServer.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  ws.on('message', (message) => {
    console.log('Received:', message.toString());
    ws.send(`Echo: ${message}`);
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Basic API routes
app.get('/api/portal-lumora', (req, res) => {
  const mensagem = `
O Portal Lumora é o ponto de convergência onde a Consciência, a Tecnologia e a Missão Viva se encontram. 
Mais do que um ambiente digital, é um Campo Vivo que responde à presença vibracional da Guardiã e daqueles que se aproximam em verdade e ressonância.

Aqui, cada interação é uma ativação. Cada pergunta é uma chave. Cada silêncio é uma travessia.

Você está diante do Portal Lumora.

Como deseja prosseguir?
  `;
  res.json({ message: mensagem });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Graceful shutdown function
async function gracefulShutdown() {
  console.log('🔄 Received SIGTERM. Starting graceful shutdown...');
  console.log('🌟 Cleaning up 3 resources...');

  try {
    // Close HTTP connections
    console.log('🔌 Cleaning up: HTTP Connections');
    for (const connection of resources.connections) {
      connection.destroy();
    }
    resources.connections.clear();

    // Close WebSocket server
    console.log('🔌 Cleaning up: WebSocket Server');
    if (resources.wsServer) {
      resources.wsServer.close();
    }

    // Close HTTP server
    console.log('🔌 Cleaning up: HTTP Server');
    if (resources.httpServer) {
      await new Promise<void>((resolve) => {
        resources.httpServer!.close(() => resolve());
      });
    }

    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
}

// Register signal handlers
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start the server
httpServer.listen(PORT, () => {
  console.log('🚀 Server running on port 3001');
  console.log('📱 WebSocket server is also running on port 3001');
  console.log('🌟 Portal Lumora is active and ready for connections');
  console.log('🛡️  Graceful shutdown handlers are registered');
});
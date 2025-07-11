const express = require('express');
require('dotenv').config();

// Only initialize OpenAI if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  const OpenAI = require('openai');
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.log('⚠️  OpenAI API key not found. OpenAI features will be disabled.');
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rota principal para receber prompts
app.post('/api/openai', async (req, res) => {
  const { prompt } = req.body;

  if (!openai) {
    return res.status(503).json({ 
      error: 'OpenAI service unavailable. API key not configured.' 
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt || 'Olá, quem é você?',
        },
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error('Erro na chamada à OpenAI:', error);
    res.status(500).json({ error: 'Erro ao gerar resposta.' });
  }
});

// Track active connections for cleanup
const activeConnections = new Set();

// Start server and track connections
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Track HTTP connections for cleanup
server.on('connection', (connection) => {
  activeConnections.add(connection);
  connection.on('close', () => {
    activeConnections.delete(connection);
  });
});

// Graceful shutdown handling
let isShuttingDown = false;

function gracefulShutdown(signal) {
  if (isShuttingDown) {
    console.log('Shutdown already in progress...');
    return;
  }
  
  isShuttingDown = true;
  console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`);
  
  // Set a timeout for forceful shutdown
  const forceShutdownTimer = setTimeout(() => {
    console.log('⚠️  Forceful shutdown after timeout');
    process.exit(1);
  }, 5000); // 5 seconds timeout
  
  // Close active connections
  console.log('🔌 Closing active connections...');
  for (const connection of activeConnections) {
    connection.destroy();
  }
  activeConnections.clear();
  
  // Close server
  console.log('🛑 Closing server...');
  server.close((err) => {
    if (err) {
      console.error('❌ Error closing server:', err);
      process.exit(1);
    } else {
      console.log('✅ Graceful shutdown completed');
      clearTimeout(forceShutdownTimer);
      process.exit(0);
    }
  });
}

// Register signal handlers for graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

console.log('🌟 Server started with graceful shutdown handlers');
// Exemplo de chamada para a OpenAI
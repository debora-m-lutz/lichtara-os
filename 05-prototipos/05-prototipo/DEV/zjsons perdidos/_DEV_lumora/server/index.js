const express = require('express');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Inicializa a OpenAI com sua chave secreta
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Rota principal para receber prompts
app.post('/api/openai', async (req, res) => {
  const { prompt } = req.body;

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

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
// Exemplo de chamada para a OpenAI
import { Request, Response } from 'express';

/**
 * Test webhook endpoint that simulates Notion webhook calls
 * This is for development and testing purposes
 */
export function testWebhookEndpoint(req: Request, res: Response) {
  try {
    console.log('🧪 Test webhook called with:', req.body);
    
    // Simulate a webhook response
    const testResponse = {
      message: 'Test webhook received successfully',
      timestamp: new Date().toISOString(),
      receivedData: req.body,
      headers: {
        'content-type': req.headers['content-type'],
        'user-agent': req.headers['user-agent']
      }
    };

    res.json(testResponse);
  } catch (error) {
    console.error('Error in test webhook:', error);
    res.status(500).json({ 
      error: 'Test webhook failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Create a manual test page in Notion for testing the integration
 */
export function createTestPage(req: Request, res: Response) {
  const testPageData = {
    title: `Test Page from Lichtara OS - ${new Date().toISOString()}`,
    content: `Esta é uma página de teste criada pela integração Lichtara OS com Notion.

Criada em: ${new Date().toLocaleString('pt-BR')}

Portal Lumora está conectado e funcionando!

✨ Características da integração:
- Webhook para receber atualizações do Notion
- API para criar páginas
- API para listar páginas
- Testes automatizados

Este é apenas um teste de conectividade.`
  };

  // Forward to the main createNotionPage function
  req.body = testPageData;
  
  // Import and call the main function
  import('./notion-webhook.js').then(({ createNotionPage }) => {
    createNotionPage(req, res);
  }).catch((error) => {
    console.error('Error importing notion-webhook:', error);
    res.status(500).json({ error: 'Failed to create test page' });
  });
}
import { Client } from '@notionhq/client';
import crypto from 'crypto';
import { Request, Response } from 'express';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

/**
 * Verify webhook signature from Notion
 */
export function verifyNotionWebhook(req: Request): boolean {
  const signature = req.headers['notion-webhook-signature'] as string;
  const timestamp = req.headers['notion-webhook-timestamp'] as string;
  const body = JSON.stringify(req.body);
  
  if (!signature || !timestamp || !process.env.NOTION_WEBHOOK_SECRET) {
    return false;
  }

  // Create the signature string
  const sigString = `${timestamp}.${body}`;
  
  // Calculate the expected signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.NOTION_WEBHOOK_SECRET)
    .update(sigString)
    .digest('hex');
  
  // Compare signatures
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

/**
 * Handle incoming webhook from Notion
 */
export async function handleNotionWebhook(req: Request, res: Response) {
  try {
    // Verify webhook signature for security
    // Note: In development, we'll skip verification to allow testing
    if (process.env.NODE_ENV === 'production' && !verifyNotionWebhook(req)) {
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    const { type, data } = req.body;
    
    console.log('🔗 Received Notion webhook:', { type, data });

    // Handle different webhook events
    switch (type) {
      case 'page_created':
        await handlePageCreated(data);
        break;
      case 'page_updated':
        await handlePageUpdated(data);
        break;
      case 'database_updated':
        await handleDatabaseUpdated(data);
        break;
      default:
        console.log(`Unhandled webhook type: ${type}`);
    }

    res.status(200).json({ 
      message: 'Webhook processed successfully',
      type,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing Notion webhook:', error);
    res.status(500).json({ 
      error: 'Failed to process webhook',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Handle page created events
 */
async function handlePageCreated(data: any) {
  console.log('📄 New page created in Notion:', data.id);
  // Add custom logic here for when pages are created
  // For example: sync to local database, send notifications, etc.
}

/**
 * Handle page updated events
 */
async function handlePageUpdated(data: any) {
  console.log('✏️ Page updated in Notion:', data.id);
  // Add custom logic here for when pages are updated
}

/**
 * Handle database updated events
 */
async function handleDatabaseUpdated(data: any) {
  console.log('🗄️ Database updated in Notion:', data.id);
  // Add custom logic here for when databases are updated
}

/**
 * Create a new page in Notion workspace
 */
export async function createNotionPage(req: Request, res: Response) {
  try {
    const { title, content, parentId } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Create page properties
    const pageData: any = {
      parent: parentId ? { page_id: parentId } : { type: 'workspace' },
      properties: {
        title: {
          title: [
            {
              text: {
                content: title
              }
            }
          ]
        }
      }
    };

    // Add content if provided
    if (content) {
      pageData.children = [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: content
                }
              }
            ]
          }
        }
      ];
    }

    const response = await notion.pages.create(pageData);

    console.log('✨ Created new Notion page:', response.id);

    res.json({
      success: true,
      pageId: response.id,
      message: 'Page created successfully'
    });

  } catch (error) {
    console.error('Error creating Notion page:', error);
    res.status(500).json({
      error: 'Failed to create page',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Get pages from Notion workspace
 */
export async function getNotionPages(req: Request, res: Response) {
  try {
    // Search for pages in the workspace
    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'page'
      },
      sort: {
        direction: 'descending',
        timestamp: 'last_edited_time'
      }
    });

    const pages = response.results.map((page: any) => ({
      id: page.id,
      title: page.properties?.title?.title?.[0]?.text?.content || 
             page.properties?.Name?.title?.[0]?.text?.content || 
             'Untitled',
      lastEdited: page.last_edited_time,
      created: page.created_time
    }));

    res.json({
      success: true,
      pages,
      count: pages.length
    });

  } catch (error) {
    console.error('Error fetching Notion pages:', error);
    res.status(500).json({
      error: 'Failed to fetch pages',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Test Notion API connection
 */
export async function testNotionConnection(req: Request, res: Response) {
  try {
    // Try to search for pages to test the connection instead of using users.me()
    const testSearch = await notion.search({
      filter: {
        property: 'object',
        value: 'page'
      },
      page_size: 1
    });
    
    res.json({
      success: true,
      message: 'Notion API connection successful',
      connectionTest: {
        status: 'connected',
        resultsFound: testSearch.results.length,
        hasMore: testSearch.has_more
      }
    });

  } catch (error) {
    console.error('Error testing Notion connection:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to connect to Notion API',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export { notion };
/**
 * Security middleware for Lichtara OS
 * Provides validation and protection for sensitive operations
 */

import { Request, Response, NextFunction } from 'express';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

/**
 * Rate limiting middleware
 */
export function createRateLimit(options: RateLimitOptions) {
  const { windowMs, maxRequests, message = 'Too many requests' } = options;
  
  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    
    const clientData = rateLimitStore.get(clientId);
    
    if (!clientData || now > clientData.resetTime) {
      // Reset window
      rateLimitStore.set(clientId, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }
    
    if (clientData.count >= maxRequests) {
      return res.status(429).json({
        error: message,
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
      });
    }
    
    clientData.count++;
    next();
  };
}

/**
 * API key validation middleware
 */
export function validateApiKey(req: Request, res: Response, next: NextFunction) {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({
      error: 'Service unavailable: API key not configured',
      code: 'API_KEY_NOT_CONFIGURED',
      suggestion: 'Configure OPENAI_API_KEY in your environment variables'
    });
  }
  
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey.startsWith('sk-')) {
    return res.status(500).json({
      error: 'Invalid API key format',
      code: 'INVALID_API_KEY_FORMAT'
    });
  }
  
  next();
}

/**
 * Input validation middleware for OpenAI requests
 */
export function validateOpenAIInput(req: Request, res: Response, next: NextFunction) {
  const { prompt, model } = req.body;
  
  // Validate prompt
  if (!prompt) {
    return res.status(400).json({
      error: 'Prompt is required',
      code: 'MISSING_PROMPT'
    });
  }
  
  if (typeof prompt !== 'string') {
    return res.status(400).json({
      error: 'Prompt must be a string',
      code: 'INVALID_PROMPT_TYPE'
    });
  }
  
  if (prompt.length > 4000) {
    return res.status(400).json({
      error: 'Prompt too long. Maximum 4000 characters.',
      code: 'PROMPT_TOO_LONG',
      maxLength: 4000,
      currentLength: prompt.length
    });
  }
  
  if (prompt.trim().length === 0) {
    return res.status(400).json({
      error: 'Prompt cannot be empty',
      code: 'EMPTY_PROMPT'
    });
  }
  
  // Validate model if provided
  if (model && typeof model !== 'string') {
    return res.status(400).json({
      error: 'Model must be a string',
      code: 'INVALID_MODEL_TYPE'
    });
  }
  
  const allowedModels = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4o-mini', 'gpt-4o'];
  if (model && !allowedModels.includes(model)) {
    return res.status(400).json({
      error: `Invalid model. Allowed models: ${allowedModels.join(', ')}`,
      code: 'INVALID_MODEL',
      allowedModels
    });
  }
  
  next();
}

/**
 * Security headers middleware
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Prevent XSS attacks
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // HTTPS enforcement in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
  );
  
  next();
}

/**
 * Environment validation - checks if required environment variables are set
 */
export function validateEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  if (majorVersion < 18) {
    errors.push(`Node.js version ${nodeVersion} is not supported. Please use Node.js 18 or higher.`);
  }
  
  // Check for .env file existence (development)
  if (process.env.NODE_ENV !== 'production') {
    try {
      const fs = require('fs');
      const path = require('path');
      if (!fs.existsSync(path.join(process.cwd(), '.env'))) {
        console.log('⚠️  .env file not found. Copy .env.example to .env and configure your values.');
      }
    } catch (error) {
      // Silent fail - .env is optional
    }
  }
  
  // Validate API key format if provided
  if (process.env.OPENAI_API_KEY) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey.startsWith('sk-')) {
      errors.push('OPENAI_API_KEY has invalid format. Expected format: sk-...');
    }
    if (apiKey.length < 20) {
      errors.push('OPENAI_API_KEY appears to be incomplete.');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Clean sensitive data from error responses
 */
export function sanitizeError(error: any): any {
  const sanitized = { ...error };
  
  // Remove sensitive fields
  delete sanitized.apiKey;
  delete sanitized.token;
  delete sanitized.password;
  delete sanitized.secret;
  
  // In production, remove stack traces
  if (process.env.NODE_ENV === 'production') {
    delete sanitized.stack;
  }
  
  return sanitized;
}

/**
 * Audit logging middleware
 */
export function auditLog(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    };
    
    // Only log API calls and errors
    if (req.url.startsWith('/api') || res.statusCode >= 400) {
      console.log('🔍 API Call:', JSON.stringify(logData));
    }
  });
  
  next();
}

export default {
  createRateLimit,
  validateApiKey,
  validateOpenAIInput,
  securityHeaders,
  validateEnvironment,
  sanitizeError,
  auditLog
};
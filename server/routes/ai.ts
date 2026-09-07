// AUREA Server - Express API Routes for AI Engine
// All Gemini API calls happen here, keeping the API key secure

import { Router } from 'express';
import type { Request, Response } from 'express';
import {
  understandInput,
  assessPriority,
  analyzeDocument,
  generateTasks,
  getInsights,
  generateWeeklyBriefing,
  chat,
} from '../lib/ai/gemini.js';

import type { LifeItem, ChatMessage } from '../lib/ai/types.js';

const router = Router();

// Middleware to validate request body
function validateBody(...fields: string[]) {
  return (req: Request, res: Response, next: Function) => {
    const missing = fields.filter(f => req.body[f] === undefined);
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missing.join(', ')}`,
        timestamp: new Date().toISOString(),
      });
    }
    next();
  };
}

// Rate limiting (simple in-memory)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function rateLimit(req: Request, res: Response, next: Function) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return next();
  }

  if (entry.count >= RATE_LIMIT) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please try again later.',
      timestamp: new Date().toISOString(),
    });
  }

  entry.count++;
  next();
}

// Apply rate limiting to all AI routes
router.use(rateLimit);

// POST /api/ai/understand - Natural Language Understanding
router.post('/understand', validateBody('input'), async (req: Request, res: Response) => {
  try {
    const { input, context } = req.body as { input: string; context?: LifeItem[] };
    const result = await understandInput(input, context);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
});

// POST /api/ai/priority - Priority Assessment
router.post('/priority', validateBody('item'), async (req: Request, res: Response) => {
  try {
    const { item, allItems } = req.body as { item: LifeItem; allItems?: LifeItem[] };
    const result = await assessPriority(item, allItems);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
});

// POST /api/ai/document - Document Analysis
router.post('/document', validateBody('content'), async (req: Request, res: Response) => {
  try {
    const { content, type } = req.body as { content: string; type?: string };

    // Validate content length
    if (content.length > 50000) {
      return res.status(400).json({
        success: false,
        error: 'Document content exceeds maximum length of 50,000 characters.',
        timestamp: new Date().toISOString(),
      });
    }

    const result = await analyzeDocument(content, type);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
});

// POST /api/ai/tasks - Smart Task Generation
router.post('/tasks', validateBody('input'), async (req: Request, res: Response) => {
  try {
    const { input, context } = req.body as { input: string; context?: LifeItem[] };
    const result = await generateTasks(input, context);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
});

// POST /api/ai/insights - AI Insights
router.post('/insights', validateBody('items'), async (req: Request, res: Response) => {
  try {
    const { items } = req.body as { items: LifeItem[] };

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: 'Items must be an array.',
        timestamp: new Date().toISOString(),
      });
    }

    const result = await getInsights(items);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
});

// POST /api/ai/briefing - Weekly Briefing
router.post('/briefing', validateBody('items'), async (req: Request, res: Response) => {
  try {
    const { items } = req.body as { items: LifeItem[] };

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: 'Items must be an array.',
        timestamp: new Date().toISOString(),
      });
    }

    const result = await generateWeeklyBriefing(items);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
});

// POST /api/ai/chat - Conversational AI
router.post('/chat', validateBody('messages'), async (req: Request, res: Response) => {
  try {
    const { messages, context } = req.body as { messages: ChatMessage[]; context?: LifeItem[] };

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Messages must be a non-empty array.',
        timestamp: new Date().toISOString(),
      });
    }

    // Limit conversation history
    const trimmedMessages = messages.slice(-20);

    const result = await chat(trimmedMessages, context);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/ai/health - Health check
router.get('/health', (_req: Request, res: Response) => {
  const apiKeyConfigured = !!process.env.GEMINI_API_KEY;
  res.json({
    success: true,
    data: {
      status: 'healthy',
      geminiConfigured: apiKeyConfigured,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  });
});

export default router;

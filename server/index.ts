// AUREA Server - Main Entry Point
// Express server that serves the frontend and provides secure AI API endpoints

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import aiRoutes from './routes/ai.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Security headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Never expose API key to frontend
  res.setHeader('X-AUREA-Engine', 'active');
  next();
});

// API Routes
app.use('/api/ai', aiRoutes);

// Serve static frontend files in production
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[AUREA Server Error]', err.message);
  res.status(500).json({
    success: false,
    error: 'Internal server error. Please try again later.',
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║   AUREA - Personal Life Operating System         ║
║   AI Engine Server v1.0.0                        ║
║                                                  ║
║   Server running on port ${PORT}                    ║
║   API endpoint: http://localhost:${PORT}/api/ai    ║
║   Gemini configured: ${process.env.GEMINI_API_KEY ? '✓ Yes' : '✗ No (set GEMINI_API_KEY)'}         ║
║                                                  ║
╚══════════════════════════════════════════════════╝
  `);
});

export default app;

# AUREA - AI-Powered Personal Life Operating System

## AI Engine Architecture

```
Frontend (React + Vite)
   ↓ HTTP requests to /api/ai/*
AUREA API (Express Server)
   ↓ Secure server-side calls
AI Engine (/lib/ai/)
   ↓ Gemini API integration
Google Gemini API
```

## Security

- **API Key**: Stored in `GEMINI_API_KEY` environment variable
- **Never exposed to frontend**: All Gemini calls happen server-side
- **Rate limiting**: 30 requests per minute per IP
- **Input validation**: All endpoints validate request bodies
- **Security headers**: XSS protection, frame denial, content-type sniffing prevention

## Core Engine Capabilities

### 1. Natural Language Understanding
- Understands user questions and commands
- Identifies intent and category
- Extracts dates, amounts, names, deadlines, and actions
- Returns structured JSON with confidence scores

### 2. Life Data Analysis
Analyzes user data across categories:
- Bills
- Tasks
- Subscriptions
- Documents
- Appointments
- Warranties
- Deadlines
- Important dates

### 3. Priority Engine
Determines priority based on:
- **Urgency** (40%): Days until due date
- **Financial Impact** (35%): Amount and recurring nature
- **Time Sensitivity** (25%): Fixed windows, combined dates

Priority levels: `critical` | `high` | `medium` | `low`

### 4. Document Intelligence
Extracts structured information from documents:
```json
{
  "type": "bill",
  "title": "Electric Bill - December",
  "provider": "City Power Co",
  "amount": 145.50,
  "currency": "USD",
  "dueDate": "2024-12-15",
  "expirationDate": "",
  "summary": "Monthly electricity bill...",
  "recommendedAction": "Pay before due date",
  "confidence": 0.92,
  "extractedEntities": [...]
}
```

### 5. Smart Task Generation
Detects actions from user messages and documents, generates prioritized tasks.

### 6. AI Insights
Identifies:
- Upcoming deadlines
- Overdue items
- Recurring expenses
- Expiring warranties
- Spending patterns
- Optimization opportunities

### 7. Weekly Briefing
Generates a concise summary including:
- Overall status
- Critical items
- Upcoming deadlines
- Financial overview
- Recommended actions

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/understand` | Natural language understanding |
| POST | `/api/ai/priority` | Priority assessment |
| POST | `/api/ai/document` | Document analysis |
| POST | `/api/ai/tasks` | Task generation |
| POST | `/api/ai/insights` | AI insights |
| POST | `/api/ai/briefing` | Weekly briefing |
| POST | `/api/ai/chat` | Conversational AI |
| GET | `/api/ai/health` | Health check |

## Project Structure

```
├── .env.example              # GEMINI_API_KEY=
├── src/
│   ├── App.tsx               # Main dashboard
│   ├── components/           # React UI components
│   └── lib/
│       └── ai/
│           ├── types.ts      # TypeScript interfaces
│           ├── prompts.ts    # Gemini prompt templates
│           ├── gemini.ts     # Gemini API service
│           ├── priority.ts   # Local priority engine
│           └── engine.ts     # Main orchestrator
├── server/
│   ├── index.ts              # Express server
│   └── routes/
│       └── ai.ts             # AI API endpoints
└── dist/                     # Built frontend
```

## Setup

1. Copy `.env.example` to `.env`
2. Add your Gemini API key: `GEMINI_API_KEY=your_key_here`
3. Install dependencies: `npm install`
4. Build frontend: `npm run build`
5. Start server: `node --loader ts-node/esm server/index.ts`

## Output Rules

- ✅ Use structured JSON for machine-readable data
- ✅ Validate all Gemini responses before processing
- ✅ Never invent information not in source data
- ✅ Never claim action completed unless actually done
- ✅ Destructive actions require user confirmation
- ✅ Handle errors, rate limits, and timeouts gracefully

## Model Agnostic Design

The engine is modular. To add a new AI model:
1. Create a new service file in `/lib/ai/` (e.g., `openai.ts`)
2. Implement the same interface as `gemini.ts`
3. Update `engine.ts` to use the new service
4. No frontend changes needed

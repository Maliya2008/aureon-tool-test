import { Shield, Server, Brain, Monitor, ArrowDown, Lock, Database, Globe } from 'lucide-react';

export function ArchitectureView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
          <Shield size={22} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">System Architecture</h2>
          <p className="text-sm text-gray-400">Secure, modular design with server-side AI processing</p>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-8">
        <div className="flex flex-col items-center gap-4">
          {/* Frontend */}
          <div className="w-full max-w-md rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Monitor size={20} className="text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-blue-300">Frontend (React + Vite)</h4>
                <p className="text-xs text-gray-400">Dashboard, Chat, Document Analysis UI</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500 bg-gray-950/50 rounded-lg p-2">
              No API keys • No direct Gemini access • Only calls /api/ai endpoints
            </div>
          </div>

          <ArrowDown size={20} className="text-gray-600" />

          {/* API Layer */}
          <div className="w-full max-w-md rounded-xl border border-violet-500/30 bg-violet-500/5 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Server size={20} className="text-violet-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-violet-300">AUREA API (Express Server)</h4>
                <p className="text-xs text-gray-400">Secure endpoints, rate limiting, validation</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-950/50 rounded p-2 text-gray-400">POST /api/ai/understand</div>
              <div className="bg-gray-950/50 rounded p-2 text-gray-400">POST /api/ai/priority</div>
              <div className="bg-gray-950/50 rounded p-2 text-gray-400">POST /api/ai/document</div>
              <div className="bg-gray-950/50 rounded p-2 text-gray-400">POST /api/ai/tasks</div>
              <div className="bg-gray-950/50 rounded p-2 text-gray-400">POST /api/ai/insights</div>
              <div className="bg-gray-950/50 rounded p-2 text-gray-400">POST /api/ai/briefing</div>
              <div className="bg-gray-950/50 rounded p-2 text-gray-400">POST /api/ai/chat</div>
              <div className="bg-gray-950/50 rounded p-2 text-gray-400">GET /api/ai/health</div>
            </div>
          </div>

          <ArrowDown size={20} className="text-gray-600" />

          {/* AI Engine */}
          <div className="w-full max-w-md rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Brain size={20} className="text-emerald-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-emerald-300">AI Engine (/lib/ai/)</h4>
                <p className="text-xs text-gray-400">Modular, reusable, model-agnostic</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-950/50 rounded p-2 text-gray-400">gemini.ts - API calls</div>
              <div className="bg-gray-950/50 rounded p-2 text-gray-400">priority.ts - Scoring</div>
              <div className="bg-gray-950/50 rounded p-2 text-gray-400">prompts.ts - Templates</div>
              <div className="bg-gray-950/50 rounded p-2 text-gray-400">engine.ts - Orchestrator</div>
              <div className="bg-gray-950/50 rounded p-2 text-gray-400">types.ts - Interfaces</div>
              <div className="bg-gray-950/50 rounded p-2 text-gray-400">[future].ts - Other models</div>
            </div>
          </div>

          <ArrowDown size={20} className="text-gray-600" />

          {/* Gemini API */}
          <div className="w-full max-w-md rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Globe size={20} className="text-amber-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-amber-300">Google Gemini API</h4>
                <p className="text-xs text-gray-400">Model: gemini-2.0-flash</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500 bg-gray-950/50 rounded-lg p-2 flex items-center gap-2">
              <Lock size={12} className="text-amber-400" />
              API key stored in GEMINI_API_KEY env variable (server-side only)
            </div>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-5">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Lock size={14} className="text-emerald-400" />
            Security Measures
          </h4>
          <ul className="space-y-2 text-xs text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              API key never exposed to frontend
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              All Gemini calls happen server-side
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              Rate limiting (30 req/min per IP)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              Input validation on all endpoints
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              Security headers (XSS, CSRF protection)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              CORS configured for specific origins
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-5">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Database size={14} className="text-violet-400" />
            Modular Design
          </h4>
          <ul className="space-y-2 text-xs text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-violet-400 mt-0.5">→</span>
              AI model can be swapped (Gemini → OpenAI → Claude)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-400 mt-0.5">→</span>
              Priority engine works locally (no API needed)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-400 mt-0.5">→</span>
              Prompt templates are centralized and reusable
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-400 mt-0.5">→</span>
              Type-safe interfaces for all operations
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-400 mt-0.5">→</span>
              JSON validation on all AI responses
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-400 mt-0.5">→</span>
              Graceful error handling with fallbacks
            </li>
          </ul>
        </div>
      </div>

      {/* File Structure */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-5">
        <h4 className="font-semibold text-sm mb-3">Project Structure</h4>
        <pre className="text-xs text-gray-400 bg-gray-950 rounded-lg p-4 overflow-x-auto font-mono leading-relaxed">
{`├── .env.example              # GEMINI_API_KEY=
├── src/
│   ├── App.tsx               # Main dashboard
│   ├── components/           # React UI components
│   └── lib/
│       └── ai/
│           ├── types.ts      # All TypeScript interfaces
│           ├── prompts.ts    # Gemini prompt templates
│           ├── gemini.ts     # Gemini API service
│           ├── priority.ts   # Local priority engine
│           └── engine.ts     # Main orchestrator
├── server/
│   ├── index.ts              # Express server entry
│   └── routes/
│       └── ai.ts             # AI API endpoints
└── dist/                     # Built frontend (served)`}
        </pre>
      </div>

      {/* Environment Setup */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-5">
        <h4 className="font-semibold text-sm mb-3">Environment Setup</h4>
        <div className="space-y-3">
          <div className="bg-gray-950 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1"># .env (never committed to git)</p>
            <code className="text-xs text-emerald-400">GEMINI_API_KEY=your_actual_api_key_here</code>
          </div>
          <div className="bg-gray-950 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1"># .env.example (committed to git)</p>
            <code className="text-xs text-gray-400">GEMINI_API_KEY=</code>
          </div>
          <p className="text-xs text-gray-500">
            ⚠️ The API key is read from process.env.GEMINI_API_KEY on the server.
            It is never sent to the browser or included in any frontend bundle.
          </p>
        </div>
      </div>
    </div>
  );
}

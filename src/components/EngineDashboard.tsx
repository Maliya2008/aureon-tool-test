import { Brain, Zap, Shield, FileText, Target, MessageSquare, Lightbulb, Clock } from 'lucide-react';

const capabilities = [
  {
    icon: <MessageSquare size={24} />,
    title: 'Natural Language Understanding',
    description: 'Understands user questions and commands. Identifies intent, extracts dates, amounts, names, deadlines, and actions.',
    color: 'from-blue-500 to-cyan-500',
    status: 'active',
  },
  {
    icon: <Target size={24} />,
    title: 'Life Data Analysis',
    description: 'Analyzes bills, tasks, subscriptions, documents, appointments, warranties, and important dates.',
    color: 'from-violet-500 to-purple-500',
    status: 'active',
  },
  {
    icon: <Zap size={24} />,
    title: 'Priority Engine',
    description: 'Determines urgency based on due dates, expiration, overdue status, financial importance, and user priority.',
    color: 'from-amber-500 to-orange-500',
    status: 'active',
  },
  {
    icon: <FileText size={24} />,
    title: 'Document Intelligence',
    description: 'Analyzes uploaded documents and extracts structured information like amounts, dates, providers.',
    color: 'from-emerald-500 to-green-500',
    status: 'active',
  },
  {
    icon: <Lightbulb size={24} />,
    title: 'Smart Task Generation',
    description: 'Detects actions from user messages and documents. Generates prioritized, actionable tasks.',
    color: 'from-pink-500 to-rose-500',
    status: 'active',
  },
  {
    icon: <Brain size={24} />,
    title: 'AI Insights & Briefings',
    description: 'Identifies patterns, upcoming deadlines, recurring expenses, renewals, and things you may be forgetting.',
    color: 'from-indigo-500 to-blue-500',
    status: 'active',
  },
];

export function EngineDashboard() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900/40 via-gray-900 to-indigo-900/40 border border-violet-500/20 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Brain size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AUREA AI Engine</h2>
              <p className="text-violet-300 text-sm">Personal Life Operating System • v1.0.0</p>
            </div>
          </div>
          <p className="text-gray-300 max-w-2xl leading-relaxed">
            A modular, secure AI engine powered by Google Gemini. Processes life data server-side,
            never exposes API keys to the frontend, and provides structured JSON responses for all operations.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <Shield size={12} />
              Server-Side Only
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
              <Zap size={12} />
              Gemini 2.0 Flash
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium">
              <Clock size={12} />
              Structured JSON
            </div>
          </div>
        </div>
      </div>

      {/* Capabilities Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap size={18} className="text-violet-400" />
          Core Capabilities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilities.map((cap, i) => (
            <div
              key={i}
              className="group relative rounded-xl bg-gray-900/80 border border-gray-800 p-5 hover:border-gray-700 transition-all hover:shadow-lg hover:shadow-violet-500/5"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cap.color} flex items-center justify-center text-white mb-3`}>
                {cap.icon}
              </div>
              <h4 className="font-semibold text-sm mb-1.5">{cap.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{cap.description}</p>
              <div className="absolute top-3 right-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engine Status */}
      <div className="rounded-xl bg-gray-900/80 border border-gray-800 p-6">
        <h3 className="text-lg font-semibold mb-4">Engine Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard label="API Key" value="Configured via .env" status="secure" />
          <StatusCard label="Model" value="gemini-2.0-flash" status="active" />
          <StatusCard label="Rate Limit" value="30 req/min" status="active" />
          <StatusCard label="Response Format" value="Structured JSON" status="active" />
        </div>
      </div>

      {/* Output Rules */}
      <div className="rounded-xl bg-gray-900/80 border border-gray-800 p-6">
        <h3 className="text-lg font-semibold mb-4">Output Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Use structured JSON for machine-readable data',
            'Validate all Gemini responses before processing',
            'Never invent information not in source data',
            'Never claim action completed unless actually done',
            'Destructive actions require user confirmation',
            'Handle errors, rate limits, and timeouts gracefully',
          ].map((rule, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <div className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-violet-400 text-xs">✓</span>
              </div>
              {rule}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusCard({ label, value, status }: { label: string; value: string; status: string }) {
  const colors = {
    active: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    secure: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className={`rounded-lg border p-3 ${colors[status as keyof typeof colors] || colors.active}`}>
      <p className="text-xs opacity-70 mb-1">{label}</p>
      <p className="font-medium text-sm">{value}</p>
    </div>
  );
}

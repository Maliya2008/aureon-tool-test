import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles } from 'lucide-react';
import type { ChatMessage } from '../lib/ai/types';

const sampleResponses: Record<string, string> = {
  default: "I'm AUREA, your AI Life Operating System. I can help you manage bills, subscriptions, documents, appointments, and deadlines. What would you like help with?",
  bills: "I can see you have several bills to manage. Here's what needs attention:\n\n• **Car Insurance** - OVERDUE ($189.00) - This needs immediate attention\n• **Electric Bill** - Due tomorrow ($145.50)\n• **Netflix** - Due in 5 days ($22.99)\n\nWould you like me to help you prioritize these or set up reminders?",
  overdue: "You have 1 overdue item:\n\n🔴 **Car Insurance** - $189.00 (State Farm)\n   - Was due 2 days ago\n   - Late fees may apply\n   - Recommended: Pay immediately to avoid further penalties\n\nWould you like me to generate a task for this?",
  subscriptions: "Here are your active subscriptions:\n\n• **Netflix Premium** - $22.99/month (Next: Jan 15)\n• **Spotify Family** - $16.99/month (Next: Jan 8)\n• **iCloud+ 200GB** - $2.99/month (Next: Jan 3)\n\n**Total monthly: $42.97**\n\nI notice your iCloud plan might be more than you need. Would you like me to analyze your usage?",
  help: "Here's what I can help you with:\n\n📋 **Manage Bills** - Track, prioritize, and never miss a payment\n📄 **Analyze Documents** - Upload bills, contracts, or warranties\n⚡ **Smart Priorities** - AI determines what needs attention first\n🔍 **Find Insights** - Patterns, savings opportunities, reminders\n📅 **Weekly Briefing** - Know what's coming this week\n\nJust ask me anything about your responsibilities!",
  warranty: "I found your warranty information:\n\n🛡️ **MacBook Pro 16\" Warranty**\n   - Provider: Apple\n   - Coverage: AppleCare+\n   - Expires: March 15, 2026\n   - Status: Active (45 days remaining)\n\n💡 **Insight**: Your warranty expires in ~6 weeks. If you've had any issues with your MacBook, now is the time to file a claim before coverage ends.",
  tasks: "Based on your current data, here are your top tasks:\n\n1. 🔴 **Pay Car Insurance** - $189 (OVERDUE)\n2. 🟠 **Pay Electric Bill** - $145.50 (Due tomorrow)\n3. 🟡 **Confirm Dentist Appointment** - Jan 5\n4. 🟢 **Review Netflix subscription** - $22.99/mo\n5. 🟢 **File taxes** - Deadline in 60 days\n\nWant me to break any of these into smaller steps?",
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('bill') || lower.includes('payment')) return sampleResponses.bills;
  if (lower.includes('overdue') || lower.includes('late') || lower.includes('missed')) return sampleResponses.overdue;
  if (lower.includes('subscription') || lower.includes('netflix') || lower.includes('spotify')) return sampleResponses.subscriptions;
  if (lower.includes('warranty') || lower.includes('coverage') || lower.includes('apple')) return sampleResponses.warranty;
  if (lower.includes('task') || lower.includes('todo') || lower.includes('to-do') || lower.includes('what should')) return sampleResponses.tasks;
  if (lower.includes('help') || lower.includes('what can')) return sampleResponses.help;
  return "I understand you're asking about your life responsibilities. Based on your current data, you have a few items that need attention this week. Would you like me to show your priorities, analyze a document, or generate a weekly briefing?";
}

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm AUREA, your AI Life Operating System. I can help you manage bills, subscriptions, documents, appointments, and deadlines. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = getAIResponse(input);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        metadata: {
          intent: {
            intent: input,
            category: 'general',
            entities: [],
            confidence: 0.9,
          },
        },
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const quickActions = [
    'What bills are due soon?',
    'Show my overdue items',
    'What are my subscriptions?',
    'Generate my tasks',
    'Check my warranties',
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
          <MessageSquare size={22} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">AI Chat Interface</h2>
          <p className="text-sm text-gray-400">Natural language conversation with the AUREA engine</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => { setInput(action); }}
            className="px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-xs text-gray-300 hover:border-violet-500/50 hover:text-violet-300 transition-all"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/80 overflow-hidden">
        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-white" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-xl p-3 ${
                msg.role === 'user'
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-800 text-gray-200'
              }`}>
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.content.split('\n').map((line, j) => (
                    <span key={j}>
                      {line.replace(/\*\*(.*?)\*\*/g, '⟨$1⟩').split(/(⟨.*?⟩)/).map((part, k) => {
                        if (part.startsWith('⟨') && part.endsWith('⟩')) {
                          return <strong key={k} className="font-semibold">{part.slice(1, -1)}</strong>;
                        }
                        return <span key={k}>{part}</span>;
                      })}
                      {j < msg.content.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
                <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-violet-200' : 'text-gray-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <User size={14} className="text-gray-300" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <Bot size={14} className="text-white" />
              </div>
              <div className="bg-gray-800 rounded-xl p-3 flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-800 p-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask AUREA about your bills, tasks, subscriptions..."
              className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="px-4 py-2.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl bg-gray-900/80 border border-gray-800 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className="text-violet-400" />
          <h4 className="text-sm font-semibold">How It Works</h4>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          Messages are sent to the AUREA server, which calls the Gemini API server-side.
          The API key is never exposed to the browser. Responses include intent detection,
          entity extraction, and suggested actions. The engine validates all responses before
          returning them to the frontend.
        </p>
      </div>
    </div>
  );
}

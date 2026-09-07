import { useState } from 'react';
import { EngineDashboard } from './components/EngineDashboard';
import { PriorityDemo } from './components/PriorityDemo';
import { DocumentAnalyzer } from './components/DocumentAnalyzer';
import { ChatInterface } from './components/ChatInterface';
import { ArchitectureView } from './components/ArchitectureView';
import { InsightsPanel } from './components/InsightsPanel';
import {
  Brain,
  Target,
  FileText,
  MessageSquare,
  LayoutGrid,
  Lightbulb,
  Shield,
  Zap,
} from 'lucide-react';

type Tab = 'dashboard' | 'priority' | 'document' | 'chat' | 'insights' | 'architecture';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Engine Overview', icon: <LayoutGrid size={18} /> },
  { id: 'priority', label: 'Priority Engine', icon: <Target size={18} /> },
  { id: 'document', label: 'Document Intelligence', icon: <FileText size={18} /> },
  { id: 'chat', label: 'AI Chat', icon: <MessageSquare size={18} /> },
  { id: 'insights', label: 'AI Insights', icon: <Lightbulb size={18} /> },
  { id: 'architecture', label: 'Architecture', icon: <Shield size={18} /> },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Brain size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">AUREA</h1>
                <p className="text-xs text-gray-400 -mt-0.5">AI Life Operating System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Zap size={12} className="text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">Engine Active</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                <Shield size={12} className="text-violet-400" />
                <span className="text-xs font-medium text-violet-400">Gemini 2.0</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <EngineDashboard />}
        {activeTab === 'priority' && <PriorityDemo />}
        {activeTab === 'document' && <DocumentAnalyzer />}
        {activeTab === 'chat' && <ChatInterface />}
        {activeTab === 'insights' && <InsightsPanel />}
        {activeTab === 'architecture' && <ArchitectureView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            AUREA AI Engine • Powered by Google Gemini • Secure Server-Side Processing
          </p>
        </div>
      </footer>
    </div>
  );
}

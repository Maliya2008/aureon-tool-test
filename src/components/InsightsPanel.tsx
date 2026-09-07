import { useState } from 'react';
import { Lightbulb, AlertTriangle, Clock, DollarSign, RefreshCw, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import type { AIInsight, LifeItem, Priority, WeeklyBriefing } from '../lib/ai/types';
import { assessPriorityLocal } from '../lib/ai/priority';

const sampleItems: LifeItem[] = [
  {
    id: '1', type: 'bill', title: 'Electric Bill', provider: 'City Power',
    amount: 145.50, currency: 'USD',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'high', status: 'active',
  },
  {
    id: '2', type: 'subscription', title: 'Netflix Premium', provider: 'Netflix',
    amount: 22.99, currency: 'USD',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium', status: 'active',
  },
  {
    id: '3', type: 'subscription', title: 'Spotify Family', provider: 'Spotify',
    amount: 16.99, currency: 'USD',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium', status: 'active',
  },
  {
    id: '4', type: 'bill', title: 'Car Insurance', provider: 'State Farm',
    amount: 189.00, currency: 'USD',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'critical', status: 'overdue',
  },
  {
    id: '5', type: 'warranty', title: 'MacBook Warranty', provider: 'Apple',
    amount: 0, currency: 'USD',
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'low', status: 'active',
  },
  {
    id: '6', type: 'subscription', title: 'iCloud+ 200GB', provider: 'Apple',
    amount: 2.99, currency: 'USD',
    dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'low', status: 'active',
  },
  {
    id: '7', type: 'appointment', title: 'Dentist Checkup', provider: 'Dr. Smith',
    amount: 75, currency: 'USD',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium', status: 'active',
  },
  {
    id: '8', type: 'bill', title: 'Internet Bill', provider: 'Comcast',
    amount: 89.99, currency: 'USD',
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium', status: 'active',
  },
];

function generateLocalInsights(items: LifeItem[]): AIInsight[] {
  const insights: AIInsight[] = [];
  const today = new Date();

  // Overdue items
  const overdue = items.filter(i => i.status === 'overdue' || (i.dueDate && new Date(i.dueDate) < today));
  if (overdue.length > 0) {
    insights.push({
      id: 'ins-1',
      type: 'warning',
      title: `${overdue.length} overdue item${overdue.length > 1 ? 's' : ''} need attention`,
      description: `You have ${overdue.length} item(s) past their due date. Late fees may apply.`,
      priority: 'critical',
      affectedItems: overdue.map(i => i.id),
      suggestedAction: 'Pay overdue items immediately to avoid penalties.',
    });
  }

  // Upcoming deadlines (7 days)
  const upcoming = items.filter(i => {
    if (!i.dueDate) return false;
    const due = new Date(i.dueDate);
    const diff = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  });
  if (upcoming.length > 0) {
    insights.push({
      id: 'ins-2',
      type: 'deadline',
      title: `${upcoming.length} items due this week`,
      description: `You have ${upcoming.length} items with deadlines in the next 7 days totaling $${upcoming.reduce((sum, i) => sum + (i.amount || 0), 0).toFixed(2)}.`,
      priority: 'high',
      affectedItems: upcoming.map(i => i.id),
      suggestedAction: 'Review and schedule payments for these items.',
      dateRange: {
        start: today.toISOString().split('T')[0],
        end: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    });
  }

  // Recurring subscriptions
  const subscriptions = items.filter(i => i.type === 'subscription');
  if (subscriptions.length > 0) {
    const totalMonthly = subscriptions.reduce((sum, s) => sum + (s.amount || 0), 0);
    insights.push({
      id: 'ins-3',
      type: 'recurring',
      title: `${subscriptions.length} active subscriptions ($${totalMonthly.toFixed(2)}/mo)`,
      description: `Your monthly subscription costs total $${totalMonthly.toFixed(2)} ($${(totalMonthly * 12).toFixed(2)}/year). Consider reviewing if all are still needed.`,
      priority: 'medium',
      affectedItems: subscriptions.map(i => i.id),
      suggestedAction: 'Review subscriptions quarterly. Cancel any you no longer use.',
    });
  }

  // Expiring warranties
  const warranties = items.filter(i => {
    if (!i.expirationDate) return false;
    const exp = new Date(i.expirationDate);
    const diff = (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 60;
  });
  if (warranties.length > 0) {
    insights.push({
      id: 'ins-4',
      type: 'renewal',
      title: `${warranties.length} warranty expiring soon`,
      description: `Your ${warranties.map(w => w.title).join(', ')} coverage is ending soon. File any claims before expiration.`,
      priority: 'medium',
      affectedItems: warranties.map(i => i.id),
      suggestedAction: 'Check for any issues and file warranty claims before expiration.',
    });
  }

  // Financial pattern
  const totalDue = items.reduce((sum, i) => sum + (i.amount || 0), 0);
  if (totalDue > 0) {
    insights.push({
      id: 'ins-5',
      type: 'pattern',
      title: `Total financial obligations: $${totalDue.toFixed(2)}`,
      description: `Across all your current items, you have $${totalDue.toFixed(2)} in pending payments and costs.`,
      priority: totalDue > 500 ? 'high' : 'medium',
      affectedItems: items.filter(i => i.amount && i.amount > 0).map(i => i.id),
      suggestedAction: 'Ensure you have sufficient funds to cover all upcoming payments.',
    });
  }

  return insights;
}

function generateBriefing(items: LifeItem[]): WeeklyBriefing {
  const today = new Date();
  const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const critical = items.filter(i => {
    const a = assessPriorityLocal(i, items);
    return a.priority === 'critical' || a.priority === 'high';
  });

  const upcoming = items.filter(i => {
    if (!i.dueDate) return false;
    const due = new Date(i.dueDate);
    return due >= today && due <= weekEnd;
  });

  const totalDue = items.reduce((sum, i) => sum + (i.amount || 0), 0);
  const breakdown: { category: string; amount: number }[] = [];
  const categories = new Map<string, number>();
  items.forEach(i => {
    if (i.amount) {
      categories.set(i.type, (categories.get(i.type) || 0) + i.amount);
    }
  });
  categories.forEach((amount, category) => {
    breakdown.push({ category, amount });
  });

  return {
    period: {
      start: today.toISOString().split('T')[0],
      end: weekEnd.toISOString().split('T')[0],
    },
    summary: `You have ${critical.length} high-priority items and ${upcoming.length} deadlines this week. Total financial obligations: $${totalDue.toFixed(2)}.`,
    criticalItems: critical,
    upcomingDeadlines: upcoming,
    financialOverview: {
      totalDue,
      currency: 'USD',
      breakdown,
    },
    insights: generateLocalInsights(items),
    recommendedActions: [
      'Pay overdue car insurance immediately',
      'Schedule electric bill payment for tomorrow',
      'Confirm dentist appointment',
      'Review subscription costs this month',
    ],
  };
}

const insightTypeIcons: Record<string, React.ReactNode> = {
  deadline: <Clock size={14} />,
  recurring: <RefreshCw size={14} />,
  pattern: <TrendingUp size={14} />,
  warning: <AlertTriangle size={14} />,
  suggestion: <Sparkles size={14} />,
  renewal: <Calendar size={14} />,
};

const priorityColors: Record<Priority, string> = {
  critical: 'text-red-400 bg-red-500/10 border-red-500/30',
  high: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  low: 'text-green-400 bg-green-500/10 border-green-500/30',
};

export function InsightsPanel() {
  const [view, setView] = useState<'insights' | 'briefing'>('insights');
  const insights = generateLocalInsights(sampleItems);
  const briefing = generateBriefing(sampleItems);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
          <Lightbulb size={22} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">AI Insights & Briefing</h2>
          <p className="text-sm text-gray-400">Pattern detection, deadline tracking, and weekly summaries</p>
        </div>
      </div>

      {/* Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setView('insights')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            view === 'insights'
              ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
              : 'text-gray-400 bg-gray-800/50 border border-gray-700 hover:border-gray-600'
          }`}
        >
          <span className="flex items-center gap-2"><Lightbulb size={14} /> Insights</span>
        </button>
        <button
          onClick={() => setView('briefing')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            view === 'briefing'
              ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
              : 'text-gray-400 bg-gray-800/50 border border-gray-700 hover:border-gray-600'
          }`}
        >
          <span className="flex items-center gap-2"><Calendar size={14} /> Weekly Briefing</span>
        </button>
      </div>

      {view === 'insights' ? (
        <div className="space-y-3">
          {insights.map((insight) => (
            <div key={insight.id} className="rounded-xl border border-gray-800 bg-gray-900/80 p-4 hover:border-gray-700 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${priorityColors[insight.priority]}`}>
                    {insightTypeIcons[insight.type]}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <span className="text-xs text-gray-500 capitalize">{insight.type}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${priorityColors[insight.priority]}`}>
                  {insight.priority}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-2">{insight.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-violet-400">
                  → {insight.suggestedAction}
                </span>
                <span className="text-xs text-gray-500">
                  {insight.affectedItems.length} item(s)
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Briefing Header */}
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Weekly Briefing</h4>
              <span className="text-xs text-gray-400">
                {briefing.period.start} → {briefing.period.end}
              </span>
            </div>
            <p className="text-sm text-gray-300">{briefing.summary}</p>
          </div>

          {/* Financial Overview */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-5">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <DollarSign size={14} className="text-emerald-400" />
              Financial Overview
            </h4>
            <div className="text-2xl font-bold text-emerald-400 mb-3">
              ${briefing.financialOverview.totalDue.toFixed(2)}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {briefing.financialOverview.breakdown.map((item, i) => (
                <div key={i} className="rounded-lg bg-gray-950 p-2 border border-gray-800">
                  <p className="text-xs text-gray-500 capitalize">{item.category}</p>
                  <p className="text-sm font-medium">${item.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Items */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-5">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-400" />
              Critical Items ({briefing.criticalItems.length})
            </h4>
            <div className="space-y-2">
              {briefing.criticalItems.map(item => (
                <div key={item.id} className="flex items-center justify-between rounded-lg bg-gray-950 p-3 border border-gray-800">
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.provider} • {item.dueDate}</p>
                  </div>
                  <span className="text-sm font-medium text-red-400">
                    ${item.amount?.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-5">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-violet-400" />
              Recommended Actions
            </h4>
            <div className="space-y-2">
              {briefing.recommendedActions.map((action, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center text-xs text-violet-400">
                    {i + 1}
                  </div>
                  {action}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Engine Info */}
      <div className="rounded-xl bg-gray-900/80 border border-gray-800 p-4">
        <p className="text-xs text-gray-500">
          <span className="text-gray-400 font-medium">Note:</span> These insights are generated locally using the priority engine.
          When connected to the Gemini API, the engine provides deeper analysis including spending patterns,
          optimization suggestions, and personalized recommendations based on your history.
        </p>
      </div>
    </div>
  );
}

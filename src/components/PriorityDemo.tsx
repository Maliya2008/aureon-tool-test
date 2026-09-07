import { useState } from 'react';
import { Target, AlertTriangle, Clock, DollarSign, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { assessPriorityLocal } from '../lib/ai/priority';
import type { LifeItem, Priority } from '../lib/ai/types';

const sampleItems: LifeItem[] = [
  {
    id: '1',
    type: 'bill',
    title: 'Electric Bill - December',
    provider: 'City Power Co',
    amount: 145.50,
    currency: 'USD',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'high',
    status: 'active',
  },
  {
    id: '2',
    type: 'subscription',
    title: 'Netflix Premium',
    provider: 'Netflix',
    amount: 22.99,
    currency: 'USD',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium',
    status: 'active',
  },
  {
    id: '3',
    type: 'bill',
    title: 'Car Insurance',
    provider: 'State Farm',
    amount: 189.00,
    currency: 'USD',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'critical',
    status: 'overdue',
  },
  {
    id: '4',
    type: 'warranty',
    title: 'Laptop Warranty',
    provider: 'Apple',
    amount: 0,
    currency: 'USD',
    expirationDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'low',
    status: 'active',
  },
  {
    id: '5',
    type: 'appointment',
    title: 'Dentist Checkup',
    provider: 'Dr. Smith Dental',
    amount: 75,
    currency: 'USD',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium',
    status: 'active',
  },
  {
    id: '6',
    type: 'deadline',
    title: 'Tax Filing Deadline',
    provider: 'IRS',
    amount: 0,
    currency: 'USD',
    dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'low',
    status: 'active',
  },
];

const priorityColors: Record<Priority, string> = {
  critical: 'text-red-400 bg-red-500/10 border-red-500/30',
  high: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  low: 'text-green-400 bg-green-500/10 border-green-500/30',
};

const priorityIcons: Record<Priority, React.ReactNode> = {
  critical: <AlertTriangle size={14} />,
  high: <ArrowUp size={14} />,
  medium: <Minus size={14} />,
  low: <ArrowDown size={14} />,
};

export function PriorityDemo() {
  const [selectedItem, setSelectedItem] = useState<LifeItem | null>(null);
  const [assessments, setAssessments] = useState(() =>
    sampleItems.map(item => ({ item, assessment: assessPriorityLocal(item, sampleItems) }))
  );

  const handleAssess = (item: LifeItem) => {
    setSelectedItem(item);
    const assessment = assessPriorityLocal(item, sampleItems);
    setAssessments(prev =>
      prev.map(a => a.item.id === item.id ? { item, assessment } : a)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Target size={22} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Priority Engine</h2>
          <p className="text-sm text-gray-400">Local priority assessment based on urgency, financial impact, and time sensitivity</p>
        </div>
      </div>

      {/* Priority Legend */}
      <div className="flex flex-wrap gap-3">
        {(['critical', 'high', 'medium', 'low'] as Priority[]).map(p => (
          <div key={p} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${priorityColors[p]}`}>
            {priorityIcons[p]}
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </div>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {assessments.map(({ item, assessment }) => (
          <div
            key={item.id}
            onClick={() => handleAssess(item)}
            className={`rounded-xl border p-4 cursor-pointer transition-all hover:shadow-lg ${
              selectedItem?.id === item.id
                ? 'border-violet-500/50 bg-violet-500/5 shadow-violet-500/10'
                : 'border-gray-800 bg-gray-900/80 hover:border-gray-700'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-sm">{item.title}</h4>
                <p className="text-xs text-gray-400">{item.provider}</p>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${priorityColors[assessment.priority]}`}>
                {priorityIcons[assessment.priority]}
                {assessment.priority}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
              {item.amount ? (
                <span className="flex items-center gap-1">
                  <DollarSign size={12} />
                  {item.amount.toFixed(2)}
                </span>
              ) : null}
              {item.dueDate && (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {item.dueDate}
                </span>
              )}
              {item.expirationDate && (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  Exp: {item.expirationDate}
                </span>
              )}
            </div>

            {/* Score Bars */}
            <div className="space-y-2">
              <ScoreBar label="Urgency" score={assessment.urgencyScore} />
              <ScoreBar label="Financial" score={assessment.financialImpact} />
              <ScoreBar label="Time" score={assessment.timeSensitivity} />
            </div>

            {/* Reasons */}
            {selectedItem?.id === item.id && (
              <div className="mt-3 pt-3 border-t border-gray-800">
                <p className="text-xs font-medium text-gray-400 mb-1.5">Reasons:</p>
                <ul className="space-y-1">
                  {assessment.reasons.map((reason, i) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                      <span className="text-violet-400 mt-0.5">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Engine Info */}
      <div className="rounded-xl bg-gray-900/80 border border-gray-800 p-5">
        <h4 className="text-sm font-semibold mb-3">Priority Engine Algorithm</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-400">
          <div>
            <p className="font-medium text-gray-300 mb-1">Urgency Score (40%)</p>
            <p>Based on days until due date. Overdue = 100. Today = 95. Within 3 days = 75.</p>
          </div>
          <div>
            <p className="font-medium text-gray-300 mb-1">Financial Impact (35%)</p>
            <p>Based on amount. $1000+ = 90. $500+ = 70. Bills/subscriptions get +15 boost.</p>
          </div>
          <div>
            <p className="font-medium text-gray-300 mb-1">Time Sensitivity (25%)</p>
            <p>Fixed windows for warranties/appointments. Combined dates increase sensitivity.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 75 ? 'bg-red-500' : score >= 50 ? 'bg-orange-500' : score >= 25 ? 'bg-yellow-500' : 'bg-green-500';
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-14">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-8 text-right">{score}</span>
    </div>
  );
}

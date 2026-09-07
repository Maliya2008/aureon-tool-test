// AUREA AI Engine - Priority Engine
// Determines priority based on urgency, due dates, financial importance, and more

import type { LifeItem, Priority, PriorityAssessment } from './types';

// Calculate days until a date
function daysUntil(dateStr: string): number {
  if (!dateStr) return Infinity;
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Check if a date is overdue
function isOverdue(dateStr: string): boolean {
  return daysUntil(dateStr) < 0;
}

// Calculate urgency score (0-100)
function calculateUrgencyScore(item: LifeItem): number {
  let score = 0;

  if (item.status === 'overdue') return 100;

  if (item.dueDate) {
    const days = daysUntil(item.dueDate);
    if (days < 0) score = 100;
    else if (days === 0) score = 95;
    else if (days <= 1) score = 90;
    else if (days <= 3) score = 75;
    else if (days <= 7) score = 50;
    else if (days <= 14) score = 30;
    else if (days <= 30) score = 15;
    else score = 5;
  }

  if (item.expirationDate) {
    const days = daysUntil(item.expirationDate);
    const expScore = days < 0 ? 100 : days <= 7 ? 80 : days <= 30 ? 40 : 10;
    score = Math.max(score, expScore);
  }

  return Math.min(100, score);
}

// Calculate financial impact score (0-100)
function calculateFinancialImpact(item: LifeItem, allItems?: LifeItem[]): number {
  if (!item.amount) return 0;

  // Base score from amount
  let score = 0;
  if (item.amount >= 1000) score = 90;
  else if (item.amount >= 500) score = 70;
  else if (item.amount >= 100) score = 50;
  else if (item.amount >= 50) score = 30;
  else score = 10;

  // Boost if it's a bill or subscription (recurring impact)
  if (item.type === 'bill' || item.type === 'subscription') {
    score = Math.min(100, score + 15);
  }

  // Check if there are related items that amplify impact
  if (allItems) {
    const relatedItems = allItems.filter(
      i => i.id !== item.id &&
        (i.provider === item.provider || i.type === item.type)
    );
    if (relatedItems.length > 3) {
      score = Math.min(100, score + 10);
    }
  }

  return score;
}

// Calculate time sensitivity (0-100)
function calculateTimeSensitivity(item: LifeItem): number {
  let score = 0;

  // Items with both due date and expiration are more time-sensitive
  if (item.dueDate && item.expirationDate) {
    score += 30;
  }

  // Overdue items are maximally time-sensitive
  if (item.status === 'overdue') {
    score = 100;
  } else if (item.dueDate) {
    const days = daysUntil(item.dueDate);
    if (days <= 0) score = 100;
    else if (days <= 1) score = 90;
    else if (days <= 3) score = 70;
    else if (days <= 7) score = 40;
    else score = 10;
  }

  // Warranty/appointment types have fixed windows
  if (item.type === 'warranty' || item.type === 'appointment') {
    score = Math.max(score, 30);
  }

  return Math.min(100, score);
}

// Determine priority from scores
function determinePriority(urgency: number, financial: number, time: number, item: LifeItem): Priority {
  // Overdue is always critical or high
  if (item.status === 'overdue') {
    return item.amount && item.amount >= 100 ? 'critical' : 'high';
  }

  // Calculate composite score
  const composite = (urgency * 0.4) + (financial * 0.35) + (time * 0.25);

  if (composite >= 75) return 'critical';
  if (composite >= 50) return 'high';
  if (composite >= 25) return 'medium';
  return 'low';
}

// Generate reasons for priority assessment
function generateReasons(item: LifeItem, urgency: number, financial: number, time: number): string[] {
  const reasons: string[] = [];

  if (item.status === 'overdue') {
    reasons.push('This item is overdue and requires immediate attention.');
  }

  if (item.dueDate) {
    const days = daysUntil(item.dueDate);
    if (days < 0) reasons.push(`Due date was ${Math.abs(days)} day(s) ago.`);
    else if (days === 0) reasons.push('Due date is today.');
    else if (days <= 3) reasons.push(`Due in ${days} day(s) - very urgent.`);
    else if (days <= 7) reasons.push(`Due in ${days} days.`);
  }

  if (item.expirationDate) {
    const days = daysUntil(item.expirationDate);
    if (days < 0) reasons.push(`Expired ${Math.abs(days)} day(s) ago.`);
    else if (days <= 7) reasons.push(`Expires in ${days} day(s).`);
    else if (days <= 30) reasons.push(`Expires in ${days} days.`);
  }

  if (item.amount && item.amount >= 100) {
    reasons.push(`Financial impact: ${item.currency || '$'}${item.amount}.`);
  }

  if (item.type === 'subscription') {
    reasons.push('Recurring item - missed payment may cause service interruption.');
  }

  if (item.type === 'warranty') {
    reasons.push('Warranty-related - act before coverage expires.');
  }

  if (urgency < 20 && financial < 20 && time < 20) {
    reasons.push('No immediate urgency detected.');
  }

  return reasons.length > 0 ? reasons : ['Standard priority - no special factors detected.'];
}

// Main priority assessment function (local, no AI needed)
export function assessPriorityLocal(item: LifeItem, allItems?: LifeItem[]): PriorityAssessment {
  const urgencyScore = calculateUrgencyScore(item);
  const financialImpact = calculateFinancialImpact(item, allItems);
  const timeSensitivity = calculateTimeSensitivity(item);
  const priority = determinePriority(urgencyScore, financialImpact, timeSensitivity, item);
  const reasons = generateReasons(item, urgencyScore, financialImpact, timeSensitivity);

  return {
    itemId: item.id,
    priority,
    reasons,
    urgencyScore,
    financialImpact,
    timeSensitivity,
  };
}

// Batch assess priorities for all items
export function assessAllPriorities(items: LifeItem[]): PriorityAssessment[] {
  return items.map(item => assessPriorityLocal(item, items));
}

// Sort items by priority
export function sortByPriority(items: LifeItem[]): LifeItem[] {
  const priorityOrder: Record<Priority, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return [...items].sort((a, b) => {
    const aAssessment = assessPriorityLocal(a, items);
    const bAssessment = assessPriorityLocal(b, items);
    return priorityOrder[aAssessment.priority] - priorityOrder[bAssessment.priority];
  });
}

export const priorityEngine = {
  assessPriorityLocal,
  assessAllPriorities,
  sortByPriority,
  calculateUrgencyScore,
  calculateFinancialImpact,
  calculateTimeSensitivity,
};

export default priorityEngine;

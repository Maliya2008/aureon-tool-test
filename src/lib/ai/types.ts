// AUREA AI Engine - Type Definitions

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type LifeCategory = 
  | 'bill' 
  | 'task' 
  | 'subscription' 
  | 'document' 
  | 'appointment' 
  | 'warranty' 
  | 'deadline'
  | 'important_date';

export interface LifeItem {
  id: string;
  type: LifeCategory;
  title: string;
  description?: string;
  provider?: string;
  amount?: number;
  currency?: string;
  dueDate?: string;
  expirationDate?: string;
  priority: Priority;
  status: 'active' | 'completed' | 'overdue' | 'cancelled';
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface DocumentAnalysis {
  type: LifeCategory;
  title: string;
  provider: string;
  amount: number;
  currency: string;
  dueDate: string;
  expirationDate: string;
  summary: string;
  recommendedAction: string;
  confidence: number;
  extractedEntities: ExtractedEntity[];
}

export interface ExtractedEntity {
  type: 'date' | 'amount' | 'name' | 'deadline' | 'action' | 'currency';
  value: string;
  context: string;
}

export interface IntentResult {
  intent: string;
  category: LifeCategory | 'general' | 'query' | 'analysis';
  entities: ExtractedEntity[];
  confidence: number;
  suggestedAction?: string;
}

export interface PriorityAssessment {
  itemId: string;
  priority: Priority;
  reasons: string[];
  urgencyScore: number;
  financialImpact: number;
  timeSensitivity: number;
}

export interface TaskGeneration {
  title: string;
  description: string;
  dueDate?: string;
  priority: Priority;
  category: LifeCategory;
  relatedItemId?: string;
  estimatedEffort?: string;
}

export interface AIInsight {
  id: string;
  type: 'deadline' | 'recurring' | 'pattern' | 'warning' | 'suggestion' | 'renewal';
  title: string;
  description: string;
  priority: Priority;
  affectedItems: string[];
  suggestedAction: string;
  dateRange?: { start: string; end: string };
}

export interface WeeklyBriefing {
  period: { start: string; end: string };
  summary: string;
  criticalItems: LifeItem[];
  upcomingDeadlines: LifeItem[];
  financialOverview: {
    totalDue: number;
    currency: string;
    breakdown: { category: string; amount: number }[];
  };
  insights: AIInsight[];
  recommendedActions: string[];
}

export interface AIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  model?: string;
  timestamp: string;
  processingTime?: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    intent?: IntentResult;
    tasks?: TaskGeneration[];
    insights?: AIInsight[];
  };
}

export interface EngineConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
}

export interface AUREAEngine {
  understandInput(input: string, context?: LifeItem[]): Promise<AIResponse<IntentResult>>;
  analyzeLifeData(items: LifeItem[]): Promise<AIResponse<AIInsight[]>>;
  assessPriority(item: LifeItem, allItems?: LifeItem[]): Promise<AIResponse<PriorityAssessment>>;
  analyzeDocument(content: string, type?: string): Promise<AIResponse<DocumentAnalysis>>;
  generateTasks(input: string, context?: LifeItem[]): Promise<AIResponse<TaskGeneration[]>>;
  getInsights(items: LifeItem[]): Promise<AIResponse<AIInsight[]>>;
  generateWeeklyBriefing(items: LifeItem[]): Promise<AIResponse<WeeklyBriefing>>;
  chat(messages: ChatMessage[], context?: LifeItem[]): Promise<AIResponse<string>>;
}

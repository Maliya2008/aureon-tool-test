// AUREA AI Engine - Main Engine Module
// Orchestrates all AI capabilities into a unified interface

import type {
  AUREAEngine,
  AIResponse,
  IntentResult,
  PriorityAssessment,
  DocumentAnalysis,
  TaskGeneration,
  AIInsight,
  WeeklyBriefing,
  LifeItem,
  ChatMessage,
} from './types';

import {
  understandInput as geminiUnderstandInput,
  assessPriority as geminiAssessPriority,
  analyzeDocument as geminiAnalyzeDocument,
  generateTasks as geminiGenerateTasks,
  getInsights as geminiGetInsights,
  generateWeeklyBriefing as geminiGenerateWeeklyBriefing,
  chat as geminiChat,
} from './gemini';

import { assessPriorityLocal } from './priority';

// API base URL - will use relative path in production
const API_BASE = '/api/ai';

// Check if we should use server-side API or direct calls
function useServerAPI(): boolean {
  return typeof window !== 'undefined';
}

// Wrapper for server-side API calls
async function callServerEndpoint<T>(
  endpoint: string,
  body: Record<string, unknown>
): Promise<AIResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Server error' }));
      return {
        success: false,
        error: error.error || `HTTP ${response.status}`,
        timestamp: new Date().toISOString(),
      };
    }

    return response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
      timestamp: new Date().toISOString(),
    };
  }
}

// Create the AUREA Engine
export function createAUREAEngine(apiKey?: string): AUREAEngine {
  return {
    async understandInput(input: string, context?: LifeItem[]): Promise<AIResponse<IntentResult>> {
      if (useServerAPI()) {
        return callServerEndpoint<IntentResult>('understand', { input, context });
      }
      return geminiUnderstandInput(input, context, apiKey);
    },

    async analyzeLifeData(items: LifeItem[]): Promise<AIResponse<AIInsight[]>> {
      if (useServerAPI()) {
        return callServerEndpoint<AIInsight[]>('insights', { items });
      }
      return geminiGetInsights(items, apiKey);
    },

    async assessPriority(item: LifeItem, allItems?: LifeItem[]): Promise<AIResponse<PriorityAssessment>> {
      // Priority can be calculated locally for speed
      const localResult = assessPriorityLocal(item, allItems);

      // Optionally enhance with AI
      if (useServerAPI()) {
        try {
          const aiResult = await callServerEndpoint<PriorityAssessment>('priority', { item, allItems });
          if (aiResult.success && aiResult.data) {
            return aiResult;
          }
        } catch {
          // Fall back to local
        }
      }

      return {
        success: true,
        data: localResult,
        timestamp: new Date().toISOString(),
        processingTime: 0,
      };
    },

    async analyzeDocument(content: string, type?: string): Promise<AIResponse<DocumentAnalysis>> {
      if (useServerAPI()) {
        return callServerEndpoint<DocumentAnalysis>('document', { content, type });
      }
      return geminiAnalyzeDocument(content, type, apiKey);
    },

    async generateTasks(input: string, context?: LifeItem[]): Promise<AIResponse<TaskGeneration[]>> {
      if (useServerAPI()) {
        return callServerEndpoint<TaskGeneration[]>('tasks', { input, context });
      }
      return geminiGenerateTasks(input, context, apiKey);
    },

    async getInsights(items: LifeItem[]): Promise<AIResponse<AIInsight[]>> {
      if (useServerAPI()) {
        return callServerEndpoint<AIInsight[]>('insights', { items });
      }
      return geminiGetInsights(items, apiKey);
    },

    async generateWeeklyBriefing(items: LifeItem[]): Promise<AIResponse<WeeklyBriefing>> {
      if (useServerAPI()) {
        return callServerEndpoint<WeeklyBriefing>('briefing', { items });
      }
      return geminiGenerateWeeklyBriefing(items, apiKey);
    },

    async chat(messages: ChatMessage[], context?: LifeItem[]): Promise<AIResponse<string>> {
      if (useServerAPI()) {
        return callServerEndpoint<string>('chat', { messages, context });
      }
      return geminiChat(messages, context, apiKey);
    },
  };
}

// Default engine instance
export const engine = createAUREAEngine();

export default engine;

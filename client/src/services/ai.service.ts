import { api } from '../lib/api';
import { authService } from '@services/auth.service';

interface NLParsedTask {
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  assignees?: string[];
  labels?: string[];
  estimatedHours?: number;
}

interface AISuggestions {
  suggestions: string[];
  confidence: number;
}

export const aiService = {
  async parseNaturalLanguage(input: string): Promise<NLParsedTask> {
    try {
      return await api.post('/api/ai/parse-task', { input }, { token: authService.getToken() ?? '' })
    } catch (error) {
      console.warn('parseNaturalLanguage failed:', error);
      throw error;
    }
  },

  async getSuggestions(input: string): Promise<AISuggestions> {
    try {
      return await api.post('/api/ai/suggestions', { input }, { token: authService.getToken() ?? '' })
    } catch (error) {
      console.warn('getSuggestions failed:', error);
      throw error;
    }
  },

  async decomposeTask(taskId: string): Promise<any> {
    try {
      return await api.post(`/api/ai/decompose-task/${taskId}`, undefined, { token: authService.getToken() ?? '' })
    } catch (error) {
      console.warn('decomposeTask failed:', error);
      throw error;
    }
  },

  async getPrioritySuggestion(taskId: string): Promise<any> {
    try {
      return await api.get(`/api/ai/priority-suggestion/${taskId}`, { token: authService.getToken() ?? '' })
    } catch (error) {
      console.warn('getPrioritySuggestion failed:', error);
      throw error;
    }
  },

  async getSentimentAnalysis(taskId: string): Promise<any> {
    try {
      return await api.get(`/api/ai/sentiment/${taskId}`, { token: authService.getToken() ?? '' })
    } catch (error) {
      console.warn('getSentimentAnalysis failed:', error);
      throw error;
    }
  },

  async getProductivityInsights(timeRange: string): Promise<any> {
    try {
      return await api.get(`/api/ai/insights?timeRange=${timeRange}`, { token: authService.getToken() ?? '' })
    } catch (error) {
      console.warn('getProductivityInsights failed:', error);
      throw error;
    }
  },
}

import apiClient from '../client';

export interface AIGenerateRequest {
  text: string;
  action: 'summarize' | 'continue' | 'title'; 
}

export interface AIGenerateResponse {
  generated_text: string;
}

// NEW: Interface for grammar fixing
export interface AIFixGrammarResponse {
  improved_text: string;
}

export const aiService = {
  generate: async (payload: AIGenerateRequest): Promise<AIGenerateResponse> => {
    const response = await apiClient.post<AIGenerateResponse>('/api/ai/generate', payload);
    return response.data;
  },

  // NEW: Clean, abstracted method for the Magic Wand
  fixGrammar: async (text: string): Promise<AIFixGrammarResponse> => {
    const response = await apiClient.post<AIFixGrammarResponse>('/api/ai/fix-grammar', { text });
    return response.data;
  }
};
import { apiService } from './api';
import type { QuizResult } from '../types';

export const resultService = {
  // Get all results
  async getAll(): Promise<QuizResult[]> {
    return apiService.get<QuizResult[]>('/results');
  },

  // Get single result
  async getById(id: string): Promise<QuizResult> {
    return apiService.get<QuizResult>(`/results/${id}`);
  },

  // Create new result
  async create(result: Omit<QuizResult, 'id'>): Promise<QuizResult> {
    return apiService.post<QuizResult>('/results', result);
  },

  // Delete result
  async delete(id: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/results/${id}`);
  },

  // Delete all results
  async deleteAll(): Promise<{ message: string; deletedCount: number }> {
    return apiService.delete<{ message: string; deletedCount: number }>('/results');
  }
};

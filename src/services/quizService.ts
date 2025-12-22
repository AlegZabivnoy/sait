import { apiService } from './api';
import type { Quiz } from '../types';

export const quizService = {
  // Get all quizzes
  async getAll(): Promise<Quiz[]> {
    return apiService.get<Quiz[]>('/quizzes');
  },

  // Get single quiz
  async getById(id: string): Promise<Quiz> {
    return apiService.get<Quiz>(`/quizzes/${id}`);
  },

  // Create new quiz
  async create(quiz: Omit<Quiz, 'id' | 'createdAt'>): Promise<Quiz> {
    return apiService.post<Quiz>('/quizzes', quiz);
  },

  // Update quiz
  async update(id: string, quiz: Partial<Quiz>): Promise<Quiz> {
    return apiService.put<Quiz>(`/quizzes/${id}`, quiz);
  },

  // Delete quiz
  async delete(id: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/quizzes/${id}`);
  }
};

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { QuizResult } from '../types';

export interface ResultsState {
  results: QuizResult[];
}

const loadResultsFromStorage = (): QuizResult[] => {
  try {
    const stored = localStorage.getItem('results');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading results:', error);
    return [];
  }
};

const initialState: ResultsState = {
  results: loadResultsFromStorage(),
};

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    addResult: (state, action: PayloadAction<QuizResult>) => {
      state.results.unshift(action.payload);
      localStorage.setItem('results', JSON.stringify(state.results));
    },
    deleteResult: (state, action: PayloadAction<string>) => {
      state.results = state.results.filter(r => r.id !== action.payload);
      localStorage.setItem('results', JSON.stringify(state.results));
    },
    clearAllResults: (state) => {
      state.results = [];
      localStorage.setItem('results', JSON.stringify(state.results));
    },
    loadResults: (state) => {
      state.results = loadResultsFromStorage();
    },
  },
});

export const { addResult, deleteResult, clearAllResults, loadResults } = resultsSlice.actions;
export default resultsSlice.reducer;

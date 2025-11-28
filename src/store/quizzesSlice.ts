import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Quiz } from '../types';

export interface QuizzesState {
  quizzes: Quiz[];
  selectedQuiz: Quiz | null;
}

const loadQuizzesFromStorage = (): Quiz[] => {
  try {
    const stored = localStorage.getItem('quizzes');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading quizzes:', error);
    return [];
  }
};

const initialState: QuizzesState = {
  quizzes: loadQuizzesFromStorage(),
  selectedQuiz: null,
};

const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    addQuiz: (state, action: PayloadAction<Quiz>) => {
      state.quizzes.push(action.payload);
      localStorage.setItem('quizzes', JSON.stringify(state.quizzes));
    },
    updateQuiz: (state, action: PayloadAction<{ oldId: string; updatedQuiz: Quiz }>) => {
      const index = state.quizzes.findIndex(q => q.id === action.payload.oldId);
      if (index !== -1) {
        state.quizzes[index] = action.payload.updatedQuiz;
        localStorage.setItem('quizzes', JSON.stringify(state.quizzes));
      }
    },
    deleteQuiz: (state, action: PayloadAction<string>) => {
      state.quizzes = state.quizzes.filter(q => q.id !== action.payload);
      localStorage.setItem('quizzes', JSON.stringify(state.quizzes));
    },
    setSelectedQuiz: (state, action: PayloadAction<Quiz | null>) => {
      state.selectedQuiz = action.payload;
    },
    loadQuizzes: (state) => {
      state.quizzes = loadQuizzesFromStorage();
    },
  },
});

export const { addQuiz, updateQuiz, deleteQuiz, setSelectedQuiz, loadQuizzes } = quizzesSlice.actions;
export default quizzesSlice.reducer;

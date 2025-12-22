import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Quiz } from '../types';
import { quizService } from '../services/quizService';

export interface QuizzesState {
  quizzes: Quiz[];
  selectedQuiz: Quiz | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuizzesState = {
  quizzes: [],
  selectedQuiz: null,
  loading: false,
  error: null,
};

// Async thunks for API calls
export const fetchQuizzes = createAsyncThunk(
  'quizzes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const quizzes = await quizService.getAll();
      return quizzes;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createQuiz = createAsyncThunk(
  'quizzes/create',
  async (quiz: Omit<Quiz, 'id' | 'createdAt'>, { rejectWithValue }) => {
    try {
      const newQuiz = await quizService.create(quiz);
      return newQuiz;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuizAsync = createAsyncThunk(
  'quizzes/update',
  async ({ id, quiz }: { id: string; quiz: Partial<Quiz> }, { rejectWithValue }) => {
    try {
      const updatedQuiz = await quizService.update(id, quiz);
      return updatedQuiz;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteQuizAsync = createAsyncThunk(
  'quizzes/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await quizService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    setSelectedQuiz: (state, action: PayloadAction<Quiz | null>) => {
      state.selectedQuiz = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch quizzes
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create quiz
    builder
      .addCase(createQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes.push(action.payload);
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update quiz
    builder
      .addCase(updateQuizAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuizAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.quizzes.findIndex(q => q.id === action.payload.id);
        if (index !== -1) {
          state.quizzes[index] = action.payload;
        }
      })
      .addCase(updateQuizAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete quiz
    builder
      .addCase(deleteQuizAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuizAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = state.quizzes.filter(q => q.id !== action.payload);
      })
      .addCase(deleteQuizAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedQuiz, clearError } = quizzesSlice.actions;
export default quizzesSlice.reducer;

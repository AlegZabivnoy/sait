import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { QuizResult } from '../types';
import { resultService } from '../services/resultService';

export interface ResultsState {
  results: QuizResult[];
  loading: boolean;
  error: string | null;
}

const initialState: ResultsState = {
  results: [],
  loading: false,
  error: null,
};

// Async thunks for API calls
export const fetchResults = createAsyncThunk(
  'results/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const results = await resultService.getAll();
      return results;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createResult = createAsyncThunk(
  'results/create',
  async (result: Omit<QuizResult, 'id'>, { rejectWithValue }) => {
    try {
      const newResult = await resultService.create(result);
      return newResult;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteResultAsync = createAsyncThunk(
  'results/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await resultService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAllResultsAsync = createAsyncThunk(
  'results/deleteAll',
  async (_, { rejectWithValue }) => {
    try {
      await resultService.deleteAll();
      return;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch results
    builder
      .addCase(fetchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create result
    builder
      .addCase(createResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createResult.fulfilled, (state, action) => {
        state.loading = false;
        state.results.unshift(action.payload);
      })
      .addCase(createResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete result
    builder
      .addCase(deleteResultAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteResultAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.results = state.results.filter(r => r.id !== action.payload);
      })
      .addCase(deleteResultAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete all results
    builder
      .addCase(deleteAllResultsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAllResultsAsync.fulfilled, (state) => {
        state.loading = false;
        state.results = [];
      })
      .addCase(deleteAllResultsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = resultsSlice.actions;
export default resultsSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import quizzesReducer from './quizzesSlice';
import resultsReducer from './resultsSlice';

export const store = configureStore({
  reducer: {
    quizzes: quizzesReducer,
    results: resultsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

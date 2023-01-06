import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slice';

export const appStore = configureStore({
  reducer: {
    appState: appReducer,
  },
});

export type AppState = ReturnType<typeof appStore.getState>;

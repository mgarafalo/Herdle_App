import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../Interfaces/Account';

export type State = {
  user: User;
  token: string;
};

export const initialState: State = {
  user: { email: '' },
  token: '',
};

export const appSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setUserState(state: State, action: PayloadAction<User>) {
      state.user = { ...state.user, ...action.payload };
    },
    setToken(state: State, action: PayloadAction<string>) {
      state.token = action.payload;
    },
  },
});

export const { setUserState, setToken } = appSlice.actions;

export const getAppState = (state: State) => state.user;

export default appSlice.reducer;

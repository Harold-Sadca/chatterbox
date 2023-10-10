import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface loginState {
  value: boolean;
}

const initialState: loginState = {
  value: true,
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
    signup: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { login, signup } = loginSlice.actions;

export default loginSlice.reducer;

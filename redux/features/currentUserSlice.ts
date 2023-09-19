import { TypeLoggedInUser } from '@/utils/types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface currentUserState {
  value: TypeLoggedInUser;
}

const initialState: currentUserState = {
  value: {
    email: '',
    accessToken: '',
    uid: '',
  },
};

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<TypeLoggedInUser>) => {
      state.value = action.payload;
    },
    logoutUser: (state) => {
      state = initialState;
    },
  },
});

export const { loginUser, logoutUser } = currentUserSlice.actions;

export default currentUserSlice.reducer;

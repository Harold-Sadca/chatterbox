import { TypeLoggedInUser } from '@/utils/types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface recipientState {
  value: TypeLoggedInUser;
}

const initialState: recipientState = {
  value: {
    email: '',
    accessToken: '',
    uid: '',
  },
};

export const recipientSlice = createSlice({
  name: 'recipient',
  initialState,
  reducers: {
    setRecipient: (state, action: PayloadAction<TypeLoggedInUser>) => {
      state.value = action.payload;
    },
  },
});

export const { setRecipient } = recipientSlice.actions;

export default recipientSlice.reducer;

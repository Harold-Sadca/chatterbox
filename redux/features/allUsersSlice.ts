import { TypeLoggedInUser } from '@/utils/types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface allUsersState {
  value: TypeLoggedInUser[];
}

const initialState: allUsersState = {
  value: [],
};

export const allUsersSlice = createSlice({
  name: 'allUsers',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<TypeLoggedInUser[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setUsers } = allUsersSlice.actions;

export default allUsersSlice.reducer;

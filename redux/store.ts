import currentUserReducer from './features/currentUserSlice';
import loginReducer from './features/loginSlice';
import allUserReducer from './features/allUsersSlice';
import recipientSliceReducer from './features/recipientSlice';
import { configureStore } from '@reduxjs/toolkit';
// ...

export const store = configureStore({
  reducer: {
    currentUserReducer,
    loginReducer,
    allUserReducer,
    recipientSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

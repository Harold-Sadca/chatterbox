import currentUserReducer from './features/currentUserSlice';
import loginReducer from './features/loginSlice';
import allUserReducer from './features/allUsersSlice';
import { configureStore } from '@reduxjs/toolkit';
// ...

export const store = configureStore({
  reducer: { currentUserReducer, loginReducer, allUserReducer },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

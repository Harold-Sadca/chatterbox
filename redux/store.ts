import currentUserReducer from './features/currentUserSlice';
import loginReducer from './features/loginSlice';
import { configureStore } from '@reduxjs/toolkit';
// ...

export const store = configureStore({
  reducer: { currentUserReducer, loginReducer },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

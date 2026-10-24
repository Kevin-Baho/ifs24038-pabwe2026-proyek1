import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/states/reducer';
import usersReducer from './features/users/states/reducer';
import dutiesReducer from './features/duties/states/reducer';

export const rootReducer = {
  auth: authReducer,
  users: usersReducer,
  duties: dutiesReducer,
};

const store = configureStore({ reducer: rootReducer });

export default store;

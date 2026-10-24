import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/states/reducer';

// Slice users & duties ditambahkan di langkah berikutnya
export const rootReducer = {
  auth: authReducer,
};

const store = configureStore({ reducer: rootReducer });

export default store;

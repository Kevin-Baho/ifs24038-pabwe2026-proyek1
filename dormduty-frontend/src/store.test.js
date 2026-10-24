import { describe, it, expect } from 'vitest';
import store from './store';

describe('store', () => {
  it('memiliki slice auth dengan state awal', () => {
    const state = store.getState();
    expect(state.auth).toMatchObject({ isLoading: false });
    expect(state.auth).toHaveProperty('token');
  });

  it('meneruskan action ke reducer auth', () => {
    store.dispatch({ type: 'auth/SET_LOADING', payload: { isLoading: true } });
    expect(store.getState().auth.isLoading).toBe(true);
    store.dispatch({ type: 'auth/SET_LOADING', payload: { isLoading: false } });
  });
});

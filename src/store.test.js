import { describe, it, expect } from 'vitest';
import store from './store';

describe('store', () => {
  it('memiliki slice auth, users, dan duties dengan state awal', () => {
    const state = store.getState();
    expect(state.auth).toMatchObject({ isLoading: false });
    expect(state.auth).toHaveProperty('token');
    expect(state.users).toEqual({ users: [], me: null, isLoading: false });
    expect(state.duties).toMatchObject({
      duties: [],
      duty: null,
      dutyStats: null,
      zones: [],
      isLoading: false,
    });
  });

  it('meneruskan action ke reducer auth', () => {
    store.dispatch({ type: 'auth/SET_LOADING', payload: { isLoading: true } });
    expect(store.getState().auth.isLoading).toBe(true);
    store.dispatch({ type: 'auth/SET_LOADING', payload: { isLoading: false } });
  });

  it('meneruskan action ke reducer users', () => {
    store.dispatch({ type: 'users/SET_USERS', payload: { users: [{ id: 1 }] } });
    expect(store.getState().users.users).toEqual([{ id: 1 }]);
    store.dispatch({ type: 'auth/LOGOUT' });
    expect(store.getState().users.users).toEqual([]);
  });

  it('meneruskan action ke reducer duties', () => {
    store.dispatch({ type: 'duties/SET_DUTIES', payload: { duties: [{ id: 1 }] } });
    expect(store.getState().duties.duties).toEqual([{ id: 1 }]);
    store.dispatch({ type: 'auth/LOGOUT' });
    expect(store.getState().duties.duties).toEqual([]);
  });
});

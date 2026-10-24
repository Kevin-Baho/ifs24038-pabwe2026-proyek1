import { describe, it, expect, beforeEach } from 'vitest';
import authReducer from './reducer';
import { setAuthActionCreator, setAuthLoadingActionCreator, logoutActionCreator } from './action';

describe('authReducer', () => {
  beforeEach(() => localStorage.clear());

  it('state awal tanpa sesi tersimpan', () => {
    expect(authReducer(undefined, {})).toEqual({ token: null, user: null, isLoading: false });
  });

  it('state awal memulihkan sesi dari localStorage', () => {
    localStorage.setItem('dormduty_token', 'tok');
    localStorage.setItem('dormduty_user', JSON.stringify({ name: 'Budi' }));
    expect(authReducer(undefined, {})).toEqual({ token: 'tok', user: { name: 'Budi' }, isLoading: false });
  });

  it('SET_AUTH, SET_LOADING, dan LOGOUT', () => {
    let state = authReducer(undefined, {});
    state = authReducer(state, setAuthActionCreator({ token: 't', user: { id: 1 } }));
    expect(state).toMatchObject({ token: 't', user: { id: 1 } });
    state = authReducer(state, setAuthLoadingActionCreator(true));
    expect(state.isLoading).toBe(true);
    state = authReducer(state, logoutActionCreator());
    expect(state).toMatchObject({ token: null, user: null });
  });

  it('action tak dikenal mengembalikan state yang sama', () => {
    const state = { token: 'a', user: null, isLoading: false };
    expect(authReducer(state, { type: 'x' })).toBe(state);
  });
});

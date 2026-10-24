import { describe, it, expect } from 'vitest';
import usersReducer from './reducer';
import { setUsersActionCreator, setMeActionCreator, setUsersLoadingActionCreator } from './action';
import { logoutActionCreator } from '../../auth/states/action';

describe('usersReducer', () => {
  it('state awal', () => {
    expect(usersReducer(undefined, {})).toEqual({ users: [], me: null, isLoading: false });
  });

  it('SET_USERS, SET_ME, SET_LOADING', () => {
    let state = usersReducer(undefined, {});
    state = usersReducer(state, setUsersActionCreator([{ id: 1 }]));
    state = usersReducer(state, setMeActionCreator({ id: 2 }));
    state = usersReducer(state, setUsersLoadingActionCreator(true));
    expect(state).toEqual({ users: [{ id: 1 }], me: { id: 2 }, isLoading: true });
  });

  it('LOGOUT mengosongkan state', () => {
    const state = { users: [{ id: 1 }], me: { id: 2 }, isLoading: false };
    expect(usersReducer(state, logoutActionCreator())).toEqual({ users: [], me: null, isLoading: false });
  });

  it('action tak dikenal', () => {
    const state = { users: [], me: null, isLoading: false };
    expect(usersReducer(state, { type: 'x' })).toBe(state);
  });
});

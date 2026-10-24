import { describe, it, expect, beforeEach, vi } from 'vitest';
import api, { getToken } from '../../../helpers/apiHelper';
import { authApi, saveSession, loadUser, clearSession } from './authApi';

describe('authApi', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('login memanggil POST /auth/login dan mengembalikan data', async () => {
    const spy = vi.spyOn(api, 'post').mockResolvedValue({ data: { token: 't', user: { id: 1 } } });
    const data = await authApi.login('budi@x.com', 'rahasia');
    expect(spy).toHaveBeenCalledWith('/auth/login', { identifier: 'budi@x.com', password: 'rahasia' });
    expect(data).toEqual({ token: 't', user: { id: 1 } });
  });

  it('register memanggil POST /auth/register', async () => {
    const spy = vi.spyOn(api, 'post').mockResolvedValue({ data: { id: 5 } });
    const data = await authApi.register({ nim: '1' });
    expect(spy).toHaveBeenCalledWith('/auth/register', { nim: '1' });
    expect(data).toEqual({ id: 5 });
  });

  it('saveSession menyimpan token & user, clearSession menghapusnya', () => {
    saveSession({ token: 'abc', user: { name: 'Budi' } });
    expect(getToken()).toBe('abc');
    expect(loadUser()).toEqual({ name: 'Budi' });
    clearSession();
    expect(getToken()).toBeNull();
    expect(loadUser()).toBeNull();
  });

  it('loadUser mengembalikan null jika JSON rusak', () => {
    localStorage.setItem('dormduty_user', '{rusak');
    expect(loadUser()).toBeNull();
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authApi } from '../api/authApi';
import { getToken } from '../../../helpers/apiHelper';
import { showError, showSuccess } from '../../../helpers/toolsHelper';
import {
  ActionType, asyncLogin, asyncRegister, asyncLogout,
  setAuthActionCreator, setAuthLoadingActionCreator, logoutActionCreator,
} from './action';

vi.mock('../../../helpers/toolsHelper', () => ({ showError: vi.fn(), showSuccess: vi.fn() }));

describe('auth actions', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('action creators menghasilkan action yang benar', () => {
    expect(setAuthActionCreator({ token: 't', user: { id: 1 } })).toEqual({
      type: ActionType.SET_AUTH, payload: { token: 't', user: { id: 1 } },
    });
    expect(setAuthLoadingActionCreator(true)).toEqual({ type: ActionType.SET_LOADING, payload: { isLoading: true } });
    expect(logoutActionCreator()).toEqual({ type: ActionType.LOGOUT });
  });

  it('asyncLogin sukses: simpan sesi, dispatch auth, return true', async () => {
    const session = { token: 'tok', user: { id: 1, name: 'Budi' } };
    vi.spyOn(authApi, 'login').mockResolvedValue(session);
    const dispatch = vi.fn();
    const ok = await asyncLogin({ identifier: 'a', password: 'b' })(dispatch);
    expect(ok).toBe(true);
    expect(getToken()).toBe('tok');
    expect(dispatch).toHaveBeenCalledWith(setAuthActionCreator(session));
    expect(dispatch).toHaveBeenLastCalledWith(setAuthLoadingActionCreator(false));
  });

  it('asyncLogin gagal: tampilkan error, return false', async () => {
    vi.spyOn(authApi, 'login').mockRejectedValue(new Error('Kredensial salah'));
    const dispatch = vi.fn();
    const ok = await asyncLogin({ identifier: 'a', password: 'b' })(dispatch);
    expect(ok).toBe(false);
    expect(showError).toHaveBeenCalledWith('Kredensial salah');
    expect(getToken()).toBeNull();
    expect(dispatch).toHaveBeenLastCalledWith(setAuthLoadingActionCreator(false));
  });

  it('asyncRegister sukses', async () => {
    vi.spyOn(authApi, 'register').mockResolvedValue({ id: 9 });
    const ok = await asyncRegister({ nim: '1' })(vi.fn());
    expect(ok).toBe(true);
    expect(showSuccess).toHaveBeenCalled();
  });

  it('asyncRegister gagal', async () => {
    vi.spyOn(authApi, 'register').mockRejectedValue(new Error('NIM sudah terdaftar'));
    const ok = await asyncRegister({ nim: '1' })(vi.fn());
    expect(ok).toBe(false);
    expect(showError).toHaveBeenCalledWith('NIM sudah terdaftar');
  });

  it('asyncLogout menghapus sesi dan dispatch logout', () => {
    localStorage.setItem('dormduty_token', 'x');
    const dispatch = vi.fn();
    asyncLogout()(dispatch);
    expect(getToken()).toBeNull();
    expect(dispatch).toHaveBeenCalledWith(logoutActionCreator());
  });
});

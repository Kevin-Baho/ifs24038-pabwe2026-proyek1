import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userApi } from '../api/userApi';
import { showError, showSuccess } from '../../../helpers/toolsHelper';
import {
  asyncFetchUsers, asyncFetchMe, asyncUpdateMe, asyncUploadPhoto, asyncChangePassword,
  setUsersActionCreator, setMeActionCreator, setUsersLoadingActionCreator, ActionType,
} from './action';

vi.mock('../../../helpers/toolsHelper', () => ({ showError: vi.fn(), showSuccess: vi.fn() }));

describe('users actions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('action creators', () => {
    expect(setUsersActionCreator([1])).toEqual({ type: ActionType.SET_USERS, payload: { users: [1] } });
    expect(setMeActionCreator({ id: 1 })).toEqual({ type: ActionType.SET_ME, payload: { me: { id: 1 } } });
    expect(setUsersLoadingActionCreator(true)).toEqual({ type: ActionType.SET_LOADING, payload: { isLoading: true } });
  });

  it('asyncFetchUsers sukses', async () => {
    vi.spyOn(userApi, 'list').mockResolvedValue([{ id: 1 }]);
    const dispatch = vi.fn();
    await asyncFetchUsers({ floor: '2' })(dispatch);
    expect(userApi.list).toHaveBeenCalledWith({ floor: '2' });
    expect(dispatch).toHaveBeenCalledWith(setUsersActionCreator([{ id: 1 }]));
    expect(dispatch).toHaveBeenLastCalledWith(setUsersLoadingActionCreator(false));
  });

  it('asyncFetchUsers gagal', async () => {
    vi.spyOn(userApi, 'list').mockRejectedValue(new Error('gagal'));
    const dispatch = vi.fn();
    await asyncFetchUsers()(dispatch);
    expect(showError).toHaveBeenCalledWith('gagal');
    expect(dispatch).toHaveBeenLastCalledWith(setUsersLoadingActionCreator(false));
  });

  it('asyncFetchMe sukses & gagal', async () => {
    const dispatch = vi.fn();
    vi.spyOn(userApi, 'getMe').mockResolvedValueOnce({ id: 1 });
    await asyncFetchMe()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(setMeActionCreator({ id: 1 }));
    vi.spyOn(userApi, 'getMe').mockRejectedValueOnce(new Error('x'));
    await asyncFetchMe()(dispatch);
    expect(showError).toHaveBeenCalledWith('x');
  });

  it('asyncUpdateMe sukses & gagal', async () => {
    const dispatch = vi.fn();
    vi.spyOn(userApi, 'updateMe').mockResolvedValueOnce({ id: 1, bio: 'b' });
    expect(await asyncUpdateMe({ bio: 'b' })(dispatch)).toBe(true);
    expect(showSuccess).toHaveBeenCalled();
    vi.spyOn(userApi, 'updateMe').mockRejectedValueOnce(new Error('err'));
    expect(await asyncUpdateMe({})(dispatch)).toBe(false);
    expect(showError).toHaveBeenCalledWith('err');
  });

  it('asyncUploadPhoto sukses & gagal', async () => {
    const dispatch = vi.fn();
    const getState = () => ({ users: { me: { id: 1, name: 'Budi' } } });
    const file = new File(['x'], 'a.png');
    vi.spyOn(userApi, 'uploadPhoto').mockResolvedValueOnce({ avatar_url: '/u/a.png' });
    expect(await asyncUploadPhoto(file)(dispatch, getState)).toBe(true);
    expect(dispatch).toHaveBeenCalledWith(setMeActionCreator({ id: 1, name: 'Budi', avatar_url: '/u/a.png' }));
    vi.spyOn(userApi, 'uploadPhoto').mockRejectedValueOnce(new Error('besar'));
    expect(await asyncUploadPhoto(file)(dispatch, getState)).toBe(false);
    expect(showError).toHaveBeenCalledWith('besar');
  });

  it('asyncChangePassword sukses & gagal', async () => {
    vi.spyOn(userApi, 'changePassword').mockResolvedValueOnce({});
    expect(await asyncChangePassword({ old_password: 'a', new_password: 'b' })()).toBe(true);
    expect(showSuccess).toHaveBeenCalled();
    vi.spyOn(userApi, 'changePassword').mockRejectedValueOnce(new Error('salah'));
    expect(await asyncChangePassword({})()).toBe(false);
    expect(showError).toHaveBeenCalledWith('salah');
  });
});

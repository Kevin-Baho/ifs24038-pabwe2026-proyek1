import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../../../helpers/apiHelper';
import { userApi } from './userApi';

describe('userApi', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('list memanggil GET /users dengan query', async () => {
    const spy = vi.spyOn(api, 'get').mockResolvedValue({ data: [{ id: 1 }] });
    expect(await userApi.list({ floor: '2' })).toEqual([{ id: 1 }]);
    expect(spy).toHaveBeenCalledWith('/users', { floor: '2' });
  });

  it('getMe memanggil GET /users/me', async () => {
    const spy = vi.spyOn(api, 'get').mockResolvedValue({ data: { id: 1 } });
    expect(await userApi.getMe()).toEqual({ id: 1 });
    expect(spy).toHaveBeenCalledWith('/users/me');
  });

  it('updateMe memanggil PUT /users/me', async () => {
    const spy = vi.spyOn(api, 'put').mockResolvedValue({ data: { id: 1, bio: 'x' } });
    expect(await userApi.updateMe({ bio: 'x' })).toEqual({ id: 1, bio: 'x' });
    expect(spy).toHaveBeenCalledWith('/users/me', { bio: 'x' });
  });

  it('uploadPhoto mengirim FormData dengan field photo', async () => {
    const spy = vi.spyOn(api, 'upload').mockResolvedValue({ data: { avatar_url: '/uploads/a.png' } });
    const file = new File(['x'], 'a.png', { type: 'image/png' });
    expect(await userApi.uploadPhoto(file)).toEqual({ avatar_url: '/uploads/a.png' });
    const [path, formData] = spy.mock.calls[0];
    expect(path).toBe('/users/me/photo');
    expect(formData.get('photo')).toBe(file);
  });

  it('changePassword memanggil PUT /users/me/password', async () => {
    const spy = vi.spyOn(api, 'put').mockResolvedValue({ success: true });
    await userApi.changePassword({ old_password: 'a', new_password: 'b' });
    expect(spy).toHaveBeenCalledWith('/users/me/password', { old_password: 'a', new_password: 'b' });
  });
});

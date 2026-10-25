import { describe, it, expect, beforeEach, vi } from 'vitest';
import api, { assetUrl, buildQuery, getToken, setToken, removeToken, TOKEN_KEY } from './apiHelper';

const mockFetch = (body, { ok = true, status = 200 } = {}) => {
  global.fetch = vi.fn().mockResolvedValue({ ok, status, json: async () => body });
};

describe('apiHelper', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubEnv('VITE_API_BASEURL', 'http://api.test/api/v1');
  });

  it('menyimpan, membaca, dan menghapus token', () => {
    setToken('abc');
    expect(localStorage.getItem(TOKEN_KEY)).toBe('abc');
    expect(getToken()).toBe('abc');
    removeToken();
    expect(getToken()).toBeNull();
  });

  it('buildQuery mengabaikan nilai kosong', () => {
    expect(buildQuery({ floor: 2, search: '', date: undefined, status: null })).toBe('?floor=2');
    expect(buildQuery({})).toBe('');
  });

  it('assetUrl menyusun URL absolut', () => {
    expect(assetUrl('/uploads/a.jpg')).toBe('http://api.test/uploads/a.jpg');
    expect(assetUrl('https://x.com/a.jpg')).toBe('https://x.com/a.jpg');
    expect(assetUrl(null)).toBeNull();
  });

  it('GET menyertakan Bearer token dan query', async () => {
    setToken('tok');
    mockFetch({ success: true, data: [] });
    await api.get('/duties', { floor: 2 });
    const [url, opts] = fetch.mock.calls[0];
    expect(url).toBe('http://api.test/api/v1/duties?floor=2');
    expect(opts.method).toBe('GET');
    expect(opts.headers.Authorization).toBe('Bearer tok');
  });

  it('tanpa token tidak mengirim header Authorization', async () => {
    mockFetch({ success: true });
    await api.get('/health');
    expect(fetch.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it('POST mengirim body JSON', async () => {
    mockFetch({ success: true });
    await api.post('/auth/login', { a: 1 });
    const [, opts] = fetch.mock.calls[0];
    expect(opts.method).toBe('POST');
    expect(opts.headers['Content-Type']).toBe('application/json');
    expect(opts.body).toBe(JSON.stringify({ a: 1 }));
  });

  it('PUT dan DELETE memakai method yang benar', async () => {
    mockFetch({ success: true });
    await api.put('/x', { b: 2 });
    await api.delete('/x');
    expect(fetch.mock.calls[0][1].method).toBe('PUT');
    expect(fetch.mock.calls[1][1].method).toBe('DELETE');
  });

  it('upload mengirim FormData tanpa Content-Type manual', async () => {
    mockFetch({ success: true });
    const fd = new FormData();
    fd.append('proof', new Blob(['x']), 'x.png');
    await api.upload('/duties/1/proof', fd);
    const [, opts] = fetch.mock.calls[0];
    expect(opts.body).toBe(fd);
    expect(opts.headers['Content-Type']).toBeUndefined();
  });

  it('melempar Error dengan pesan & status dari server', async () => {
    mockFetch({ success: false, message: 'Kredensial salah' }, { ok: false, status: 401 });
    await expect(api.post('/auth/login', {})).rejects.toMatchObject({ message: 'Kredensial salah', status: 401 });
  });

  it('memakai pesan default jika respons bukan JSON', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => { throw new Error('x'); } });
    await expect(api.get('/x')).rejects.toMatchObject({ message: 'Permintaan gagal (500)', status: 500 });
  });

  it('baseUrl bekerja ketika VITE_API_BASEURL kosong atau memiliki trailing slash', async () => {
    vi.stubEnv('VITE_API_BASEURL', 'http://api.test/api/v1/');
    mockFetch({ success: true });
    await api.get('/ping');
    expect(fetch.mock.calls[0][0]).toBe('http://api.test/api/v1/ping');

    vi.stubEnv('VITE_API_BASEURL', '');
    await api.get('/ping');
    expect(fetch.mock.calls[1][0]).toBe('/ping');
  });
});


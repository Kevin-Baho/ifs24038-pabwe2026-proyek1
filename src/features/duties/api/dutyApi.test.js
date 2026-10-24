import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../../../helpers/apiHelper';
import { dutyApi } from './dutyApi';

describe('dutyApi', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('list memanggil GET /duties dengan query params', async () => {
    const spy = vi.spyOn(api, 'get').mockResolvedValue({ data: [{ id: 1 }] });
    expect(await dutyApi.list({ floor: '2', status: 'pending' })).toEqual([{ id: 1 }]);
    expect(spy).toHaveBeenCalledWith('/duties', { floor: '2', status: 'pending' });
  });

  it('get memanggil GET /duties/:id', async () => {
    const spy = vi.spyOn(api, 'get').mockResolvedValue({ data: { id: 1 } });
    expect(await dutyApi.get(1)).toEqual({ id: 1 });
    expect(spy).toHaveBeenCalledWith('/duties/1');
  });

  it('create memanggil POST /duties dengan payload', async () => {
    const spy = vi.spyOn(api, 'post').mockResolvedValue({ data: { id: 1 } });
    const payload = { user_id: 1, zone_id: 2, scheduled_date: '2026-10-25', shift: 'pagi' };
    expect(await dutyApi.create(payload)).toEqual({ id: 1 });
    expect(spy).toHaveBeenCalledWith('/duties', payload);
  });

  it('update memanggil PUT /duties/:id dengan payload', async () => {
    const spy = vi.spyOn(api, 'put').mockResolvedValue({ data: { id: 1, shift: 'sore' } });
    expect(await dutyApi.update(1, { shift: 'sore' })).toEqual({ id: 1, shift: 'sore' });
    expect(spy).toHaveBeenCalledWith('/duties/1', { shift: 'sore' });
  });

  it('remove memanggil DELETE /duties/:id', async () => {
    const spy = vi.spyOn(api, 'delete').mockResolvedValue({ data: null, message: 'Jadwal dihapus' });
    expect(await dutyApi.remove(1)).toBeNull();
    expect(spy).toHaveBeenCalledWith('/duties/1');
  });

  it('uploadProof mengirim FormData dengan field proof dan note opsional', async () => {
    const spy = vi.spyOn(api, 'upload').mockResolvedValue({ data: { id: 1, status: 'submitted' } });
    const file = new File(['proof'], 'bukti.jpg', { type: 'image/jpeg' });

    // Dengan note
    expect(await dutyApi.uploadProof(1, file, 'sudah bersih')).toEqual({ id: 1, status: 'submitted' });
    let [path, formData] = spy.mock.calls[0];
    expect(path).toBe('/duties/1/proof');
    expect(formData.get('proof')).toBe(file);
    expect(formData.get('note')).toBe('sudah bersih');

    // Tanpa note
    await dutyApi.uploadProof(1, file);
    [, formData] = spy.mock.calls[1];
    expect(formData.get('note')).toBeNull();
  });

  it('verify memanggil PUT /duties/:id/verify', async () => {
    const spy = vi.spyOn(api, 'put').mockResolvedValue({ data: { id: 1, status: 'approved' } });
    expect(await dutyApi.verify(1, { status: 'approved', note: 'ok' })).toEqual({ id: 1, status: 'approved' });
    expect(spy).toHaveBeenCalledWith('/duties/1/verify', { status: 'approved', note: 'ok' });
  });

  it('stats memanggil GET /duties/stats dengan params', async () => {
    const spy = vi.spyOn(api, 'get').mockResolvedValue({ data: { total: 10 } });
    expect(await dutyApi.stats({ floor: '2' })).toEqual({ total: 10 });
    expect(spy).toHaveBeenCalledWith('/duties/stats', { floor: '2' });
  });

  it('zones memanggil GET /zones dengan params', async () => {
    const spy = vi.spyOn(api, 'get').mockResolvedValue({ data: [{ id: 1, name: 'Lorong' }] });
    expect(await dutyApi.zones({ floor: '2' })).toEqual([{ id: 1, name: 'Lorong' }]);
    expect(spy).toHaveBeenCalledWith('/zones', { floor: '2' });
  });
});


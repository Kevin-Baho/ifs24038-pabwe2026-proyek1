import { describe, it, expect, vi, beforeEach } from 'vitest';
import Swal from 'sweetalert2';
import {
  showSuccess,
  showError,
  showConfirm,
  formatDate,
  STATUS_META,
  generateTemporaryId,
} from './toolsHelper';

vi.mock('sweetalert2', () => ({ default: { fire: vi.fn() } }));

describe('toolsHelper', () => {
  beforeEach(() => vi.clearAllMocks());

  it('showSuccess memanggil Swal dengan ikon success', () => {
    showSuccess('Tersimpan');
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'success', text: 'Tersimpan' }));
  });

  it('showError memanggil Swal dengan ikon error', () => {
    showError('Oops', 'Judul');
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'error', title: 'Judul', text: 'Oops' }));
  });

  it('showConfirm mengembalikan true/false sesuai pilihan', async () => {
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });
    expect(await showConfirm({ title: 'Hapus?' })).toBe(true);
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });
    expect(await showConfirm()).toBe(false);
  });

  it('formatDate memformat tanggal Indonesia', () => {
    const out = formatDate('2026-10-24');
    expect(out).toContain('2026');
    expect(out).toContain('24');
    expect(out.toLowerCase()).toContain('okt');
  });

  it('formatDate menangani nilai kosong/tidak valid', () => {
    expect(formatDate(null)).toBe('-');
    expect(formatDate('bukan-tanggal')).toBe('-');
  });

  it('STATUS_META memuat 4 status', () => {
    expect(Object.keys(STATUS_META)).toEqual(['pending', 'submitted', 'approved', 'rejected']);
  });

  it('generateTemporaryId menghasilkan string ID dengan prefix temp_', () => {
    const id = generateTemporaryId();
    expect(typeof id).toBe('string');
    expect(id.startsWith('temp_')).toBe(true);
  });
});


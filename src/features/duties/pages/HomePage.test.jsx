import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test-utils';
import HomePage from './HomePage';
import { dutyApi } from '../api/dutyApi';
import { userApi } from '../../users/api/userApi';
import { showConfirm } from '../../../helpers/toolsHelper';
import dutiesReducer from '../states/reducer';
import authReducer from '../../auth/states/reducer';
import usersReducer from '../../users/states/reducer';

vi.mock('../../../helpers/toolsHelper', () => ({
  showError: vi.fn(),
  showSuccess: vi.fn(),
  showConfirm: vi.fn(),
  formatDate: (d) => `Formatted: ${d}`,
  SHIFT_LABEL: { pagi: 'Pagi', sore: 'Sore' },
  STATUS_META: {
    pending: { label: 'Menunggu Pengerjaan', className: 'badge-pending' },
    submitted: { label: 'Menunggu Verifikasi', className: 'badge-submitted' },
    approved: { label: 'Selesai & Disetujui', className: 'badge-approved' },
    rejected: { label: 'Ditolak / Wajib Ulang', className: 'badge-rejected' },
  },
}));

describe('HomePage', () => {
  const mockDuties = [
    {
      id: 1,
      user_name: 'Budi Santoso',
      user_nim: '210001',
      user_room: '201',
      zone_name: 'Koridor Barat',
      floor: 2,
      scheduled_date: '2026-10-25',
      shift: 'pagi',
      status: 'pending',
    },
    {
      id: 2,
      user_name: 'Siti Aminah',
      user_nim: '210002',
      user_room: '301',
      zone_name: 'Dapur Bersama',
      floor: 3,
      scheduled_date: '2026-10-26',
      shift: 'sore',
      status: 'submitted',
    },
  ];

  const mockStats = {
    total: 2,
    completed: 0,
    awaiting_verification: 1,
    rejected: 0,
    pending: 1,
    overdue: 0,
    completion_rate: 0,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    vi.spyOn(dutyApi, 'list').mockResolvedValue(mockDuties);
    vi.spyOn(dutyApi, 'stats').mockResolvedValue(mockStats);
    vi.spyOn(dutyApi, 'zones').mockResolvedValue([]);
    vi.spyOn(userApi, 'list').mockResolvedValue([]);
  });

  const renderComponent = (userRole = 'resident') => {
    return renderWithProviders(<HomePage />, {
      reducer: { duties: dutiesReducer, auth: authReducer, users: usersReducer },
      preloadedState: {
        auth: {
          token: 'token-123',
          user: { id: 1, name: 'Budi Santoso', role: userRole },
          isLoading: false,
        },
      },
    });
  };

  it('merender statistik dan daftar tugas dengan format yang benar', async () => {
    renderComponent('resident');

    expect(screen.getByRole('heading', { name: 'Manajemen Piket Asrama' })).toBeInTheDocument();
    expect(await screen.findByText('Total Tugas')).toBeInTheDocument();
    expect(screen.getByText('Budi Santoso')).toBeInTheDocument();
    expect(screen.getByText('Siti Aminah')).toBeInTheDocument();
    expect(screen.getByText('Formatted: 2026-10-25')).toBeInTheDocument();
    expect(screen.getByText('Menunggu Pengerjaan')).toBeInTheDocument();
    expect(screen.getAllByText('Menunggu Verifikasi').length).toBeGreaterThan(0);
  });

  it('tampilan berdasarkan peran pengguna (resident tidak punya tombol aksi kelola)', async () => {
    renderComponent('resident');

    await screen.findByText('Budi Santoso');
    expect(screen.queryByRole('button', { name: '+ Jadwalkan Piket' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Hapus' })).not.toBeInTheDocument();
  });

  it('koordinator dan admin dapat melihat tombol tambah dan hapus tugas', async () => {
    renderComponent('coordinator');

    await screen.findByText('Budi Santoso');
    expect(screen.getByRole('button', { name: '+ Jadwalkan Piket' })).toBeInTheDocument();
    const deleteButtons = screen.getAllByRole('button', { name: 'Hapus' });
    expect(deleteButtons.length).toBe(2);
  });

  it('berpindah tab memanggil API dengan parameter yang sesuai', async () => {
    renderComponent('resident');

    const meTab = screen.getByRole('button', { name: 'Tugas Saya' });
    await userEvent.click(meTab);
    expect(dutyApi.list).toHaveBeenCalledWith(expect.objectContaining({ is_me: '1' }));

    const submittedTab = screen.getByRole('button', { name: 'Menunggu Verifikasi' });
    await userEvent.click(submittedTab);
    expect(dutyApi.list).toHaveBeenCalledWith(expect.objectContaining({ status: 'submitted' }));

    const allTab = screen.getByRole('button', { name: 'Semua Jadwal' });
    await userEvent.click(allTab);
    expect(dutyApi.list).toHaveBeenCalledWith({});
  });

  it('filter lantai dan tanggal memanggil API dengan parameter', async () => {
    renderComponent('resident');

    await userEvent.selectOptions(screen.getByLabelText('Lantai:'), '2');
    expect(dutyApi.list).toHaveBeenCalledWith(expect.objectContaining({ floor: '2' }));

    fireEvent.change(screen.getByLabelText('Tanggal:'), { target: { value: '2026-10-25' } });
    expect(dutyApi.list).toHaveBeenCalledWith(
      expect.objectContaining({ floor: '2', date: '2026-10-25' })
    );

    const resetBtn = screen.getByRole('button', { name: 'Reset' });
    await userEvent.click(resetBtn);
    expect(dutyApi.list).toHaveBeenCalledWith(expect.objectContaining({ floor: '2' }));
  });

  it('menghapus jadwal dengan konfirmasi', async () => {
    vi.spyOn(dutyApi, 'remove').mockResolvedValue(null);
    showConfirm.mockResolvedValueOnce(false); // cancel first

    renderComponent('admin');
    await screen.findByText('Budi Santoso');

    const deleteButtons = screen.getAllByRole('button', { name: 'Hapus' });
    await userEvent.click(deleteButtons[0]);
    expect(showConfirm).toHaveBeenCalled();
    expect(dutyApi.remove).not.toHaveBeenCalled();

    showConfirm.mockResolvedValueOnce(true); // confirm
    await userEvent.click(deleteButtons[0]);
    expect(dutyApi.remove).toHaveBeenCalledWith(1);
  });

  it('tidak memanggil loadData saat penghapusan tugas gagal di API', async () => {
    vi.spyOn(dutyApi, 'remove').mockRejectedValue(new Error('Gagal hapus'));
    showConfirm.mockResolvedValueOnce(true);

    renderComponent('admin');
    await screen.findByText('Budi Santoso');

    const deleteButtons = screen.getAllByRole('button', { name: 'Hapus' });
    await userEvent.click(deleteButtons[0]);
    expect(dutyApi.remove).toHaveBeenCalledWith(1);
  });

  it('membuka modal tambah piket saat tombol diklik oleh admin dan dapat ditutup', async () => {
    renderComponent('admin');

    const addBtn = screen.getByRole('button', { name: '+ Jadwalkan Piket' });
    await userEvent.click(addBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Jadwalkan Piket Baru')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Batal' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('menampilkan pesan/state kosong saat daftar tugas piket bernilai array kosong []', async () => {
    vi.spyOn(dutyApi, 'list').mockResolvedValue([]);
    renderComponent('resident');

    expect(await screen.findByText('Belum ada jadwal piket yang sesuai.')).toBeInTheDocument();
    expect(screen.getByText('Coba sesuaikan tab atau filter lantai dan tanggal di atas.')).toBeInTheDocument();
  });

  it('menampilkan pesan kosong ketika filter per lantai tidak menghasilkan data', async () => {
    vi.spyOn(dutyApi, 'list').mockResolvedValue([]);
    renderComponent('resident');

    await userEvent.selectOptions(screen.getByLabelText('Lantai:'), '4');
    expect(dutyApi.list).toHaveBeenCalledWith(expect.objectContaining({ floor: '4' }));
    expect(await screen.findByText('Belum ada jadwal piket yang sesuai.')).toBeInTheDocument();
  });

  it('merender tugas dengan status atau shift khusus yang tidak ada di daftar meta', async () => {
    vi.spyOn(dutyApi, 'list').mockResolvedValue([
      {
        id: 99,
        user_name: 'Anto Kustom',
        user_nim: null,
        user_room: null,
        zone_name: 'Gudang',
        floor: 1,
        scheduled_date: '2026-10-28',
        shift: 'malam',
        status: 'custom_status',
      },
    ]);
    renderComponent('resident');

    expect(await screen.findByText('Anto Kustom')).toBeInTheDocument();
    expect(screen.getByText('malam')).toBeInTheDocument();
    expect(screen.getByText('custom_status')).toBeInTheDocument();
  });
});



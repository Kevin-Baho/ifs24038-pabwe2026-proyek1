import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import authReducer from './features/auth/states/reducer';
import usersReducer from './features/users/states/reducer';
import dutiesReducer from './features/duties/states/reducer';
import { userApi } from './features/users/api/userApi';
import { dutyApi } from './features/duties/api/dutyApi';
import App from './App';

vi.mock('./helpers/toolsHelper', () => ({
  showError: vi.fn(),
  showSuccess: vi.fn(),
  showConfirm: vi.fn(),
  formatDate: (d) => d || '-',
  SHIFT_LABEL: { pagi: 'Pagi', sore: 'Sore' },
  STATUS_META: {
    pending: { label: 'Menunggu Pengerjaan', className: '' },
    submitted: { label: 'Menunggu Verifikasi', className: '' },
    approved: { label: 'Selesai & Disetujui', className: '' },
    rejected: { label: 'Ditolak / Wajib Ulang', className: '' },
  },
}));

const loggedIn = {
  auth: { token: 't', user: { id: 1, name: 'Budi', role: 'resident' }, isLoading: false },
};
const opts = (route, preloadedState) => ({
  route,
  reducer: { auth: authReducer, users: usersReducer, duties: dutiesReducer },
  preloadedState,
});

describe('App routes', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.spyOn(userApi, 'list').mockResolvedValue([]);
    vi.spyOn(userApi, 'getMe').mockResolvedValue({
      id: 1,
      name: 'Budi',
      nim: '1',
      email: 'b@x.com',
      room_number: 'Kamar 1',
      floor: 1,
    });
    vi.spyOn(dutyApi, 'list').mockResolvedValue([]);
    vi.spyOn(dutyApi, 'stats').mockResolvedValue({
      total: 0,
      completed: 0,
      awaiting_verification: 0,
      rejected: 0,
      pending: 0,
      overdue: 0,
      completion_rate: 0,
    });
    vi.spyOn(dutyApi, 'get').mockResolvedValue({
      id: 1,
      user_id: 1,
      user_name: 'Budi',
      zone_name: 'Dapur',
      floor: 2,
      scheduled_date: '2026-10-25',
      shift: 'pagi',
      status: 'pending',
    });
  });

  it('/ tanpa token diarahkan ke halaman login', () => {
    renderWithProviders(<App />, opts('/'));
    expect(screen.getByRole('heading', { name: 'Masuk' })).toBeInTheDocument();
  });

  it('/auth mengarah ke login', () => {
    renderWithProviders(<App />, opts('/auth'));
    expect(screen.getByRole('heading', { name: 'Masuk' })).toBeInTheDocument();
  });

  it('/auth/register menampilkan form pendaftaran', () => {
    renderWithProviders(<App />, opts('/auth/register'));
    expect(screen.getByRole('heading', { name: 'Daftar Warga Asrama' })).toBeInTheDocument();
  });

  it('/ dengan token menampilkan dashboard / HomePage', async () => {
    renderWithProviders(<App />, opts('/', loggedIn));
    expect(await screen.findByRole('heading', { name: 'Manajemen Piket Asrama' })).toBeInTheDocument();
  });

  it('/duties/:id menampilkan detail tugas', async () => {
    renderWithProviders(<App />, opts('/duties/1', loggedIn));
    expect(await screen.findByRole('heading', { name: 'Detail Jadwal Piket' })).toBeInTheDocument();
  });

  it('/users menampilkan direktori warga', async () => {
    renderWithProviders(<App />, opts('/users', loggedIn));
    expect(screen.getByRole('heading', { name: 'Direktori Warga Asrama' })).toBeInTheDocument();
    expect(await screen.findByText('Tidak ada warga ditemukan.')).toBeInTheDocument();
  });

  it('/profile menampilkan profil saya', async () => {
    renderWithProviders(<App />, opts('/profile', loggedIn));
    expect(await screen.findByRole('heading', { name: 'Profil Saya' })).toBeInTheDocument();
  });

  it('rute tak dikenal diarahkan ke /', async () => {
    renderWithProviders(<App />, opts('/entah-apa', loggedIn));
    expect(await screen.findByRole('heading', { name: 'Manajemen Piket Asrama' })).toBeInTheDocument();
  });

  it('pengguna yang sudah login tidak bisa membuka /auth/login', async () => {
    renderWithProviders(<App />, opts('/auth/login', loggedIn));
    expect(await screen.findByRole('heading', { name: 'Manajemen Piket Asrama' })).toBeInTheDocument();
  });
});

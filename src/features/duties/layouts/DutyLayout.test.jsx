import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../../../test-utils';
import authReducer from '../../auth/states/reducer';
import DutyLayout from './DutyLayout';

const routes = (
  <Routes>
    <Route element={<DutyLayout />}>
      <Route path="/" element={<div>ISI DASHBOARD</div>} />
      <Route path="/users" element={<div>ISI WARGA</div>} />
      <Route path="/profile" element={<div>ISI PROFIL</div>} />
    </Route>
    <Route path="/auth/login" element={<div>HALAMAN LOGIN</div>} />
  </Routes>
);
const loggedIn = { auth: { token: 't', user: { name: 'Budi', role: 'resident' }, isLoading: false } };

describe('DutyLayout', () => {
  beforeEach(() => localStorage.clear());

  it('redirect ke login jika tidak ada token', () => {
    renderWithProviders(routes, { reducer: { auth: authReducer } });
    expect(screen.getByText('HALAMAN LOGIN')).toBeInTheDocument();
  });

  it('menampilkan header, nama pengguna, dan konten saat login', () => {
    renderWithProviders(routes, { reducer: { auth: authReducer }, preloadedState: loggedIn });
    expect(screen.getByText('ISI DASHBOARD')).toBeInTheDocument();
    expect(screen.getByText('Budi (resident)')).toBeInTheDocument();
  });

  it('menu navigasi berpindah halaman', async () => {
    renderWithProviders(routes, { reducer: { auth: authReducer }, preloadedState: loggedIn });
    await userEvent.click(screen.getByRole('link', { name: 'Warga' }));
    expect(screen.getByText('ISI WARGA')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('link', { name: 'Profil' }));
    expect(screen.getByText('ISI PROFIL')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('link', { name: 'Beranda' }));
    expect(screen.getByText('ISI DASHBOARD')).toBeInTheDocument();
  });

  it('tombol Keluar mengarahkan kembali ke login', async () => {
    renderWithProviders(routes, { reducer: { auth: authReducer }, preloadedState: loggedIn });
    await userEvent.click(screen.getByRole('button', { name: 'Keluar' }));
    expect(await screen.findByText('HALAMAN LOGIN')).toBeInTheDocument();
  });

  it('dapat membuka dan menutup sidebar mobile', async () => {
    renderWithProviders(routes, { reducer: { auth: authReducer }, preloadedState: loggedIn });
    const toggleBtn = screen.getByRole('button', { name: 'Toggle menu' });
    await userEvent.click(toggleBtn);
    expect(screen.getByTestId('sidebar-backdrop')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('sidebar-backdrop'));
    expect(screen.queryByTestId('sidebar-backdrop')).not.toBeInTheDocument();
  });
});

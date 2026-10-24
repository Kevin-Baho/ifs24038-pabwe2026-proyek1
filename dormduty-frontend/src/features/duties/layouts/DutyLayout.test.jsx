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
    </Route>
    <Route path="/auth/login" element={<div>HALAMAN LOGIN</div>} />
  </Routes>
);

describe('DutyLayout', () => {
  beforeEach(() => localStorage.clear());

  it('redirect ke login jika tidak ada token', () => {
    renderWithProviders(routes, { reducer: { auth: authReducer } });
    expect(screen.getByText('HALAMAN LOGIN')).toBeInTheDocument();
  });

  it('menampilkan header, nama pengguna, dan konten saat login', () => {
    renderWithProviders(routes, {
      reducer: { auth: authReducer },
      preloadedState: { auth: { token: 't', user: { name: 'Budi', role: 'resident' }, isLoading: false } },
    });
    expect(screen.getByText('ISI DASHBOARD')).toBeInTheDocument();
    expect(screen.getByText('Budi (resident)')).toBeInTheDocument();
  });

  it('tombol Keluar mengarahkan kembali ke login', async () => {
    renderWithProviders(routes, {
      reducer: { auth: authReducer },
      preloadedState: { auth: { token: 't', user: { name: 'Budi', role: 'resident' }, isLoading: false } },
    });
    await userEvent.click(screen.getByRole('button', { name: 'Keluar' }));
    expect(await screen.findByText('HALAMAN LOGIN')).toBeInTheDocument();
  });
});

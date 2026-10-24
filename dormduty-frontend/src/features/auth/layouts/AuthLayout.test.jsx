import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../../../test-utils';
import AuthLayout from './AuthLayout';

const routes = (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/auth/login" element={<div>FORM LOGIN</div>} />
    </Route>
    <Route path="/" element={<div>HOME</div>} />
  </Routes>
);

describe('AuthLayout', () => {
  it('menampilkan halaman anak saat belum login', () => {
    renderWithProviders(routes, { route: '/auth/login', preloadedState: { auth: { token: null } } });
    expect(screen.getByText('FORM LOGIN')).toBeInTheDocument();
    expect(screen.getByText('DormDuty')).toBeInTheDocument();
  });

  it('mengarahkan ke / saat sudah login', () => {
    renderWithProviders(routes, { route: '/auth/login', preloadedState: { auth: { token: 'tok' } } });
    expect(screen.getByText('HOME')).toBeInTheDocument();
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import authReducer from './features/auth/states/reducer';
import App from './App';

const loggedIn = { auth: { token: 't', user: { name: 'Budi', role: 'resident' }, isLoading: false } };
const opts = (route, preloadedState) => ({ route, reducer: { auth: authReducer }, preloadedState });

describe('App routes', () => {
  beforeEach(() => localStorage.clear());

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

  it('/ dengan token menampilkan dashboard', () => {
    renderWithProviders(<App />, opts('/', loggedIn));
    expect(screen.getByText(/Dashboard roster piket/)).toBeInTheDocument();
  });

  it('rute tak dikenal diarahkan ke /', () => {
    renderWithProviders(<App />, opts('/entah-apa', loggedIn));
    expect(screen.getByText(/Dashboard roster piket/)).toBeInTheDocument();
  });

  it('pengguna yang sudah login tidak bisa membuka /auth/login', () => {
    renderWithProviders(<App />, opts('/auth/login', loggedIn));
    expect(screen.getByText(/Dashboard roster piket/)).toBeInTheDocument();
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../../../test-utils';
import authReducer from '../states/reducer';
import { authApi } from '../api/authApi';
import { showError } from '../../../helpers/toolsHelper';
import LoginPage from './LoginPage';

vi.mock('../../../helpers/toolsHelper', () => ({ showError: vi.fn(), showSuccess: vi.fn() }));

const setup = () =>
  renderWithProviders(
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<div>HALAMAN DAFTAR</div>} />
      <Route path="/" element={<div>HOME</div>} />
    </Routes>,
    { route: '/auth/login', reducer: { auth: authReducer } }
  );

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('memiliki elemen id username, password, dan btn-submit untuk bot grading', () => {
    setup();
    expect(document.querySelector('#username')).toBeInTheDocument();
    expect(document.querySelector('#password')).toBeInTheDocument();
    expect(document.querySelector('#btn-submit')).toBeInTheDocument();
  });

  it('login sukses lalu pindah ke beranda', async () => {
    const spy = vi.spyOn(authApi, 'login').mockResolvedValue({ token: 't', user: { name: 'Budi' } });
    setup();
    await userEvent.type(screen.getByLabelText('NIM / Email'), 'budi@dormduty.test');
    await userEvent.type(screen.getByLabelText('Kata Sandi'), 'warga123');
    await userEvent.click(screen.getByRole('button', { name: 'Masuk' }));
    expect(spy).toHaveBeenCalledWith('budi@dormduty.test', 'warga123');
    expect(await screen.findByText('HOME')).toBeInTheDocument();
  });

  it('login gagal menampilkan error dan tetap di halaman', async () => {
    vi.spyOn(authApi, 'login').mockRejectedValue(new Error('Kredensial salah'));
    setup();
    await userEvent.type(screen.getByLabelText('NIM / Email'), 'x');
    await userEvent.type(screen.getByLabelText('Kata Sandi'), 'y');
    await userEvent.click(screen.getByRole('button', { name: 'Masuk' }));
    await waitFor(() => expect(showError).toHaveBeenCalledWith('Kredensial salah'));
    expect(screen.queryByText('HOME')).not.toBeInTheDocument();
  });

  it('memiliki tautan ke halaman daftar', async () => {
    setup();
    await userEvent.click(screen.getByRole('link', { name: 'Daftar' }));
    expect(screen.getByText('HALAMAN DAFTAR')).toBeInTheDocument();
  });
});
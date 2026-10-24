import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../../../test-utils';
import authReducer from '../states/reducer';
import { authApi } from '../api/authApi';
import { showError, showSuccess } from '../../../helpers/toolsHelper';
import RegisterPage from './RegisterPage';

vi.mock('../../../helpers/toolsHelper', () => ({ showError: vi.fn(), showSuccess: vi.fn() }));

const setup = () =>
  renderWithProviders(
    <Routes>
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/login" element={<div>HALAMAN LOGIN</div>} />
    </Routes>,
    { route: '/auth/register', reducer: { auth: authReducer } }
  );

const fillForm = async () => {
  await userEvent.type(screen.getByLabelText('NIM'), '210099');
  await userEvent.type(screen.getByLabelText('Nama Lengkap'), 'Andi');
  await userEvent.type(screen.getByLabelText('Email'), 'andi@dormduty.test');
  await userEvent.type(screen.getByLabelText('Nomor Kamar'), 'Kamar 210');
  await userEvent.type(screen.getByLabelText('Lantai'), '2');
  await userEvent.type(screen.getByLabelText('Kata Sandi'), 'rahasia1');
  await userEvent.click(screen.getByRole('button', { name: 'Daftar' }));
};

describe('RegisterPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('mendaftar dengan payload benar lalu pindah ke login', async () => {
    const spy = vi.spyOn(authApi, 'register').mockResolvedValue({ id: 1 });
    setup();
    await fillForm();
    expect(spy).toHaveBeenCalledWith({
      nim: '210099', name: 'Andi', email: 'andi@dormduty.test',
      password: 'rahasia1', room_number: 'Kamar 210', floor: 2,
    });
    expect(await screen.findByText('HALAMAN LOGIN')).toBeInTheDocument();
    expect(showSuccess).toHaveBeenCalled();
  });

  it('menampilkan error saat registrasi gagal', async () => {
    vi.spyOn(authApi, 'register').mockRejectedValue(new Error('NIM atau email sudah terdaftar'));
    setup();
    await fillForm();
    await waitFor(() => expect(showError).toHaveBeenCalledWith('NIM atau email sudah terdaftar'));
    expect(screen.queryByText('HALAMAN LOGIN')).not.toBeInTheDocument();
  });

  it('memiliki tautan ke halaman masuk', async () => {
    setup();
    await userEvent.click(screen.getByRole('link', { name: 'Masuk' }));
    expect(screen.getByText('HALAMAN LOGIN')).toBeInTheDocument();
  });
});

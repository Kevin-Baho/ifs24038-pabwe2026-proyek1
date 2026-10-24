import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test-utils';
import usersReducer from '../states/reducer';
import { userApi } from '../api/userApi';
import { showError } from '../../../helpers/toolsHelper';
import ProfilePage from './ProfilePage';

vi.mock('../../../helpers/toolsHelper', () => ({ showError: vi.fn(), showSuccess: vi.fn() }));

const me = { id: 1, name: 'Budi Santoso', nim: '210001', email: 'budi@dormduty.test', room_number: 'Kamar 204', floor: 2, bio: 'Halo', avatar_url: null };
const setup = () => renderWithProviders(<ProfilePage />, { reducer: { users: usersReducer } });

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    vi.spyOn(userApi, 'getMe').mockResolvedValue(me);
  });

  it('menampilkan profil dan mengisi formulir', async () => {
    setup();
    expect(screen.getByText('Memuat profil...')).toBeInTheDocument();
    expect(await screen.findByText('210001 · budi@dormduty.test')).toBeInTheDocument();
    expect(screen.getByLabelText('Bio')).toHaveValue('Halo');
    expect(screen.getByLabelText('Nomor Kamar')).toHaveValue('Kamar 204');
    expect(screen.getByLabelText('Lantai')).toHaveValue(2);
  });

  it('menyimpan perubahan profil', async () => {
    const spy = vi.spyOn(userApi, 'updateMe').mockResolvedValue({ ...me, room_number: 'Kamar 205' });
    setup();
    await screen.findByText('Budi Santoso');
    const room = screen.getByLabelText('Nomor Kamar');
    await userEvent.clear(room);
    await userEvent.type(room, 'Kamar 205');
    await userEvent.click(screen.getByRole('button', { name: 'Simpan Profil' }));
    await waitFor(() => expect(spy).toHaveBeenCalledWith({ bio: 'Halo', room_number: 'Kamar 205', floor: 2 }));
  });

  it('mengunggah foto profil', async () => {
    const spy = vi.spyOn(userApi, 'uploadPhoto').mockResolvedValue({ avatar_url: '/uploads/avatars/x.png' });
    setup();
    await screen.findByText('Budi Santoso');
    const file = new File(['x'], 'x.png', { type: 'image/png' });
    await userEvent.upload(screen.getByLabelText(/Pilih Foto/), file);
    await userEvent.click(screen.getByRole('button', { name: 'Unggah Foto' }));
    await waitFor(() => expect(spy).toHaveBeenCalledWith(file));
    expect(await screen.findByRole('img', { name: 'Budi Santoso' })).toBeInTheDocument();
  });

  it('meminta memilih foto jika belum ada file', async () => {
    setup();
    await screen.findByText('Budi Santoso');
    await userEvent.click(screen.getByRole('button', { name: 'Unggah Foto' }));
    expect(showError).toHaveBeenCalledWith('Pilih foto terlebih dahulu');
  });

  it('menolak jika konfirmasi sandi tidak cocok', async () => {
    const spy = vi.spyOn(userApi, 'changePassword');
    setup();
    await screen.findByText('Budi Santoso');
    await userEvent.type(screen.getByLabelText('Kata Sandi Lama'), 'lama123');
    await userEvent.type(screen.getByLabelText('Kata Sandi Baru'), 'baru1234');
    await userEvent.type(screen.getByLabelText('Konfirmasi Kata Sandi Baru'), 'beda1234');
    await userEvent.click(screen.getByRole('button', { name: 'Ubah Kata Sandi' }));
    expect(showError).toHaveBeenCalledWith('Konfirmasi kata sandi tidak cocok');
    expect(spy).not.toHaveBeenCalled();
  });

  it('mengubah kata sandi lalu mengosongkan form', async () => {
    const spy = vi.spyOn(userApi, 'changePassword').mockResolvedValue({});
    setup();
    await screen.findByText('Budi Santoso');
    await userEvent.type(screen.getByLabelText('Kata Sandi Lama'), 'lama123');
    await userEvent.type(screen.getByLabelText('Kata Sandi Baru'), 'baru1234');
    await userEvent.type(screen.getByLabelText('Konfirmasi Kata Sandi Baru'), 'baru1234');
    await userEvent.click(screen.getByRole('button', { name: 'Ubah Kata Sandi' }));
    await waitFor(() => expect(spy).toHaveBeenCalledWith({ old_password: 'lama123', new_password: 'baru1234' }));
    await waitFor(() => expect(screen.getByLabelText('Kata Sandi Lama')).toHaveValue(''));
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test-utils';
import usersReducer from '../states/reducer';
import { userApi } from '../api/userApi';
import UsersPage from './UsersPage';

vi.mock('../../../helpers/toolsHelper', () => ({ showError: vi.fn(), showSuccess: vi.fn() }));

const people = [
  { id: 1, name: 'Budi Santoso', nim: '210001', room_number: 'Kamar 204', floor: 2, role: 'resident' },
  { id: 2, name: 'Rina Koordinator', nim: '000002', room_number: 'Kamar 201', floor: 2, role: 'coordinator' },
];
const setup = () => renderWithProviders(<UsersPage />, { reducer: { users: usersReducer } });

describe('UsersPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('menampilkan daftar warga', async () => {
    vi.spyOn(userApi, 'list').mockResolvedValue(people);
    setup();
    expect(await screen.findByText('Budi Santoso')).toBeInTheDocument();
    expect(screen.getByText('Rina Koordinator')).toBeInTheDocument();
    expect(screen.getByText('Koordinator')).toBeInTheDocument();
    expect(userApi.list).toHaveBeenCalledWith({ floor: '', search: '' });
  });

  it('menampilkan pesan kosong', async () => {
    vi.spyOn(userApi, 'list').mockResolvedValue([]);
    setup();
    expect(await screen.findByText('Tidak ada warga ditemukan.')).toBeInTheDocument();
  });

  it('filter lantai memanggil API dengan parameter lantai', async () => {
    vi.spyOn(userApi, 'list').mockResolvedValue(people);
    setup();
    await screen.findByText('Budi Santoso');
    await userEvent.selectOptions(screen.getByLabelText('Filter lantai'), '3');
    await waitFor(() => expect(userApi.list).toHaveBeenLastCalledWith({ floor: '3', search: '' }));
  });

  it('pencarian memanggil API dengan kata kunci', async () => {
    vi.spyOn(userApi, 'list').mockResolvedValue(people);
    setup();
    await screen.findByText('Budi Santoso');
    await userEvent.type(screen.getByLabelText('Cari warga'), 'bud');
    await waitFor(() => expect(userApi.list).toHaveBeenLastCalledWith({ floor: '', search: 'bud' }));
  });
});

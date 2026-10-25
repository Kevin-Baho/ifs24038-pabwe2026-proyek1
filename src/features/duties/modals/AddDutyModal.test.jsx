import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test-utils';
import AddDutyModal from './AddDutyModal';
import { dutyApi } from '../api/dutyApi';
import { userApi } from '../../users/api/userApi';
import { showError } from '../../../helpers/toolsHelper';
import dutiesReducer from '../states/reducer';
import usersReducer from '../../users/states/reducer';

vi.mock('../../../helpers/toolsHelper', () => ({
  showError: vi.fn(),
  showSuccess: vi.fn(),
}));

describe('AddDutyModal', () => {
  const users = [{ id: 1, name: 'Budi Santoso', nim: '11001', room_number: '201' }];
  const zones = [{ id: 10, name: 'Koridor Barat', floor: 2 }];

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    vi.spyOn(userApi, 'list').mockResolvedValue(users);
    vi.spyOn(dutyApi, 'zones').mockResolvedValue(zones);
  });

  it('tidak merender apapun jika isOpen bernilai false', () => {
    renderWithProviders(<AddDutyModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('merender form input saat isOpen bernilai true', async () => {
    renderWithProviders(<AddDutyModal isOpen={true} onClose={vi.fn()} />, {
      reducer: { duties: dutiesReducer, users: usersReducer },
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Jadwalkan Piket Baru')).toBeInTheDocument();
    expect(await screen.findByText(/Budi Santoso/)).toBeInTheDocument();
    expect(await screen.findByText(/Koridor Barat/)).toBeInTheDocument();
  });

  it('menolak submit jika form belum lengkap', async () => {
    renderWithProviders(<AddDutyModal isOpen={true} onClose={vi.fn()} />, {
      reducer: { duties: dutiesReducer, users: usersReducer },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Jadwalkan' }));
    expect(showError).toHaveBeenCalledWith('Semua kolom wajib diisi');
  });

  it('berhasil submit payload jadwal baru lalu memanggil onSuccess dan onClose', async () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();
    vi.spyOn(dutyApi, 'create').mockResolvedValue({ id: 99 });

    renderWithProviders(
      <AddDutyModal isOpen={true} onClose={handleClose} onSuccess={handleSuccess} />,
      {
        reducer: { duties: dutiesReducer, users: usersReducer },
        preloadedState: {
          users: { users, me: null, isLoading: false },
          duties: { zones, duties: [], duty: null, dutyStats: null, isLoading: false },
        },
      }
    );

    await userEvent.selectOptions(screen.getByLabelText('Petugas Asrama'), '1');
    await userEvent.selectOptions(screen.getByLabelText('Zona Piket'), '10');
    fireEvent.change(screen.getByLabelText('Tanggal Pelaksanaan'), {
      target: { value: '2026-10-30' },
    });
    await userEvent.selectOptions(screen.getByLabelText('Shift'), 'sore');

    await userEvent.click(screen.getByRole('button', { name: 'Jadwalkan' }));

    expect(dutyApi.create).toHaveBeenCalledWith({
      user_id: 1,
      zone_id: 10,
      scheduled_date: '2026-10-30',
      shift: 'sore',
    });
    expect(handleSuccess).toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalled();
  });

  it('dapat ditutup dengan tombol Batal, tombol silang, Escape, atau klik backdrop', async () => {
    const handleClose = vi.fn();
    renderWithProviders(<AddDutyModal isOpen={true} onClose={handleClose} />, {
      reducer: { duties: dutiesReducer, users: usersReducer },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Batal' }));
    expect(handleClose).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: 'Tutup modal' }));
    expect(handleClose).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(3);

    fireEvent.click(screen.getByLabelText('Tutup'));
    expect(handleClose).toHaveBeenCalledTimes(4);
  });
});


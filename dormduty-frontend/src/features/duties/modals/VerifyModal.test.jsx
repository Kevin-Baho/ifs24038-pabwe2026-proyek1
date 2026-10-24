import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test-utils';
import VerifyModal from './VerifyModal';
import { dutyApi } from '../api/dutyApi';
import { showError } from '../../../helpers/toolsHelper';
import dutiesReducer from '../states/reducer';

vi.mock('../../../helpers/toolsHelper', () => ({
  showError: vi.fn(),
  showSuccess: vi.fn(),
}));

describe('VerifyModal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('tidak merender apapun jika isOpen bernilai false', () => {
    renderWithProviders(<VerifyModal isOpen={false} dutyId={1} onClose={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('berhasil verifikasi setujui (approve) tanpa catatan wajib', async () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();
    vi.spyOn(dutyApi, 'verify').mockResolvedValue({ id: 1, status: 'approved' });

    renderWithProviders(
      <VerifyModal
        isOpen={true}
        dutyId={1}
        initialStatus="approved"
        onClose={handleClose}
        onSuccess={handleSuccess}
      />,
      { reducer: { duties: dutiesReducer } }
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Konfirmasi Setujui' }));

    expect(dutyApi.verify).toHaveBeenCalledWith(1, { status: 'approved', note: '' });
    expect(handleSuccess).toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalled();
  });

  it('validasi catatan wajib diisi saat menolak (reject)', async () => {
    renderWithProviders(
      <VerifyModal
        isOpen={true}
        dutyId={1}
        initialStatus="rejected"
        onClose={vi.fn()}
      />,
      { reducer: { duties: dutiesReducer } }
    );

    await userEvent.click(screen.getByRole('button', { name: 'Konfirmasi Tolak' }));
    expect(showError).toHaveBeenCalledWith('Catatan alasan wajib diisi saat menolak');
  });

  it('berhasil tolak tugas saat catatan diisi', async () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();
    vi.spyOn(dutyApi, 'verify').mockResolvedValue({ id: 1, status: 'rejected' });

    renderWithProviders(
      <VerifyModal
        isOpen={true}
        dutyId={1}
        initialStatus="approved"
        onClose={handleClose}
        onSuccess={handleSuccess}
      />,
      { reducer: { duties: dutiesReducer } }
    );

    await userEvent.click(screen.getByLabelText(/Tolak \(Reject\)/i));
    await userEvent.type(
      screen.getByLabelText(/Catatan Evaluasi/i),
      'Lantai masih kotor berdebu'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Konfirmasi Tolak' }));

    expect(dutyApi.verify).toHaveBeenCalledWith(1, {
      status: 'rejected',
      note: 'Lantai masih kotor berdebu',
    });
    expect(handleSuccess).toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalled();
  });

  it('dapat ditutup lewat Batal, silang, Escape, atau backdrop', async () => {
    const handleClose = vi.fn();
    renderWithProviders(<VerifyModal isOpen={true} dutyId={1} onClose={handleClose} />, {
      reducer: { duties: dutiesReducer },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Batal' }));
    expect(handleClose).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: 'Tutup modal' }));
    expect(handleClose).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(3);

    fireEvent.click(screen.getByRole('dialog'));
    expect(handleClose).toHaveBeenCalledTimes(4);
  });
});


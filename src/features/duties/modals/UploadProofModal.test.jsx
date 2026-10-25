import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test-utils';
import UploadProofModal from './UploadProofModal';
import { dutyApi } from '../api/dutyApi';
import { showError } from '../../../helpers/toolsHelper';
import dutiesReducer from '../states/reducer';

vi.mock('../../../helpers/toolsHelper', () => ({
  showError: vi.fn(),
  showSuccess: vi.fn(),
}));

describe('UploadProofModal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  it('tidak merender apapun jika isOpen bernilai false', () => {
    renderWithProviders(<UploadProofModal isOpen={false} dutyId={1} onClose={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('memvalidasi format file tidak didukung', async () => {
    renderWithProviders(<UploadProofModal isOpen={true} dutyId={1} onClose={vi.fn()} />, {
      reducer: { duties: dutiesReducer },
    });

    const input = screen.getByLabelText(/Foto Bukti/i);
    const textFile = new File(['hello'], 'test.txt', { type: 'text/plain' });

    fireEvent.change(input, { target: { files: [textFile] } });
    expect(showError).toHaveBeenCalledWith('Format file harus berupa JPG, PNG, atau WEBP');
  });

  it('memvalidasi ukuran file melebihi 5 MB', async () => {
    renderWithProviders(<UploadProofModal isOpen={true} dutyId={1} onClose={vi.fn()} />, {
      reducer: { duties: dutiesReducer },
    });

    const input = screen.getByLabelText(/Foto Bukti/i);
    const largeFile = new File(['x'], 'large.jpg', { type: 'image/jpeg' });
    Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });

    fireEvent.change(input, { target: { files: [largeFile] } });
    expect(showError).toHaveBeenCalledWith('Ukuran file maksimal 5 MB');
  });

  it('menampilkan pratinjau ketika file valid dipilih', async () => {
    renderWithProviders(<UploadProofModal isOpen={true} dutyId={1} onClose={vi.fn()} />, {
      reducer: { duties: dutiesReducer },
    });

    const input = screen.getByLabelText(/Foto Bukti/i);
    const validFile = new File(['valid'], 'bukti.jpg', { type: 'image/jpeg' });

    fireEvent.change(input, { target: { files: [validFile] } });
    expect(screen.getByAltText('Pratinjau bukti')).toBeInTheDocument();
  });

  it('menolak submit jika belum memilih foto', async () => {
    renderWithProviders(<UploadProofModal isOpen={true} dutyId={1} onClose={vi.fn()} />, {
      reducer: { duties: dutiesReducer },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Unggah Bukti' }));
    expect(showError).toHaveBeenCalledWith('Foto bukti wajib diunggah');
  });

  it('berhasil upload bukti dan memanggil onSuccess serta onClose', async () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();
    vi.spyOn(dutyApi, 'uploadProof').mockResolvedValue({ id: 1, status: 'submitted' });

    renderWithProviders(
      <UploadProofModal
        isOpen={true}
        dutyId={1}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />,
      { reducer: { duties: dutiesReducer } }
    );

    const input = screen.getByLabelText(/Foto Bukti/i);
    const validFile = new File(['image-data'], 'bukti.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [validFile] } });

    await userEvent.type(
      screen.getByLabelText(/Catatan Pengerjaan/i),
      'Lantai koridor sudah dipel'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Unggah Bukti' }));

    expect(dutyApi.uploadProof).toHaveBeenCalledWith(1, validFile, 'Lantai koridor sudah dipel');
    expect(handleSuccess).toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalled();
  });

  it('dapat ditutup lewat tombol Batal, tombol silang, Escape, atau backdrop', async () => {
    const handleClose = vi.fn();
    renderWithProviders(<UploadProofModal isOpen={true} dutyId={1} onClose={handleClose} />, {
      reducer: { duties: dutiesReducer },
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


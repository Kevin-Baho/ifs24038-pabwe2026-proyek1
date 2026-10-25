import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal component', () => {
  it('tidak merender apapun jika isOpen bernilai false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Test Modal">
        <p>Konten</p>
      </Modal>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('merender dialog dengan judul, konten, dan footer saat isOpen true', () => {
    render(
      <Modal
        isOpen={true}
        onClose={vi.fn()}
        title="Judul Modal"
        footer={<button>Tutup</button>}
      >
        <p>Isi Modal</p>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Judul Modal')).toBeInTheDocument();
    expect(screen.getByText('Isi Modal')).toBeInTheDocument();
    expect(screen.getByText('Tutup')).toBeInTheDocument();
  });

  it('memanggil onClose saat tombol silang X diklik', async () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Modal Aksi">
        <p>Konten</p>
      </Modal>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Tutup modal' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('memanggil onClose saat backdrop diklik', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Modal Backdrop">
        <p>Konten</p>
      </Modal>
    );

    fireEvent.click(screen.getByRole('dialog'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('tidak memanggil onClose saat isi konten modal diklik', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Modal Klik Konten">
        <p>Konten Di Dalam</p>
      </Modal>
    );

    fireEvent.click(screen.getByText('Konten Di Dalam'));
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('memanggil onClose saat tombol Escape ditekan', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Modal Escape">
        <p>Konten</p>
      </Modal>
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});


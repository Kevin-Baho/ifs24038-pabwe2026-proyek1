import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
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

    fireEvent.click(screen.getByLabelText('Tutup'));
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

  it('mengurung fokus (focus trap) saat menekan Tab dan Shift+Tab', async () => {
    render(
      <Modal
        isOpen={true}
        onClose={vi.fn()}
        title="Trap Modal"
        footer={<button id="btn-footer">Aksi Footer</button>}
      >
        <input id="input-1" placeholder="Input Pertama" />
      </Modal>
    );

    const closeBtn = screen.getByRole('button', { name: 'Tutup modal' });
    const footerBtn = screen.getByRole('button', { name: 'Aksi Footer' });

    // Tunggu timer autofokus
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    // Ketika di elemen terakhir (footerBtn) dan tekan Tab -> lompat ke elemen pertama (closeBtn)
    footerBtn.focus();
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(document.activeElement).toBe(closeBtn);

    // Ketika di elemen pertama (closeBtn) dan tekan Shift+Tab -> lompat ke elemen terakhir (footerBtn)
    closeBtn.focus();
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(footerBtn);

    // Ketika di elemen tengah (input-1) dan tekan Tab / Shift+Tab -> tidak dipreventDefault
    const input1 = screen.getByPlaceholderText('Input Pertama');
    input1.focus();
    fireEvent.keyDown(window, { key: 'Tab' });
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });

    // Ketika fokus berada di luar dialog
    const outsideBtn = document.createElement('button');
    document.body.appendChild(outsideBtn);
    outsideBtn.focus();
    expect(document.activeElement).toBe(outsideBtn);

    fireEvent.keyDown(window, { key: 'Tab' });
    expect(document.activeElement).toBe(closeBtn);

    outsideBtn.focus();
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(footerBtn);

    document.body.removeChild(outsideBtn);
  });

  it('menangani Tab saat modal tidak memiliki elemen yang dapat difokus', async () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <p>Hanya teks biasa tanpa input</p>
      </Modal>
    );

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    // Menekan Tab tidak menimbulkan error
    fireEvent.keyDown(window, { key: 'Tab' });
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
  });

  it('mengembalikan fokus ke elemen sebelumnya saat modal ditutup', () => {
    const buttonBefore = document.createElement('button');
    document.body.appendChild(buttonBefore);
    buttonBefore.focus();
    expect(document.activeElement).toBe(buttonBefore);

    const { unmount } = render(
      <Modal isOpen={true} onClose={vi.fn()} title="Modal Fokus">
        <button id="btn-inside">Inside</button>
      </Modal>
    );

    unmount();
    expect(document.activeElement).toBe(buttonBefore);
    document.body.removeChild(buttonBefore);
  });

  it('tidak error saat activeElement sebelumnya tidak memiliki method focus', () => {
    const origActiveElement = Object.getOwnPropertyDescriptor(Document.prototype, 'activeElement');
    Object.defineProperty(document, 'activeElement', { value: null, configurable: true });

    const { unmount } = render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <p>Modal Tanpa Fokus Sebelumnya</p>
      </Modal>
    );

    unmount();

    if (origActiveElement) {
      Object.defineProperty(Document.prototype, 'activeElement', origActiveElement);
    }
  });

  it('mengabaikan tombol selain Escape dan Tab', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <p>Abaikan</p>
      </Modal>
    );
    fireEvent.keyDown(window, { key: 'ArrowDown' });
  });
});

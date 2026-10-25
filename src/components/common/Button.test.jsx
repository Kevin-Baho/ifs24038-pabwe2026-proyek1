import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button component', () => {
  it('merender teks tombol dengan benar', () => {
    render(<Button>Simpan</Button>);
    expect(screen.getByRole('button', { name: 'Simpan' })).toBeInTheDocument();
  });

  it('memanggil onClick saat diklik', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Klik Saya</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Klik Saya' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('tidak dapat diklik saat disabled', async () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Nonaktif</Button>);
    const button = screen.getByRole('button', { name: 'Nonaktif' });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('menampilkan spinner dan teks loading saat isLoading true', () => {
    render(<Button isLoading loadingText="Memproses...">Kirim</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByTestId('button-spinner')).toBeInTheDocument();
    expect(screen.getByText('Memproses...')).toBeInTheDocument();
  });

  it('menerapkan varian styling dengan benar', () => {
    const { rerender } = render(<Button variant="danger">Hapus</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-600');

    rerender(<Button variant="secondary">Batal</Button>);
    expect(screen.getByRole('button')).toHaveClass('border-slate-300');

    rerender(<Button variant="ghost">Lewati</Button>);
    expect(screen.getByRole('button')).toHaveClass('hover:bg-slate-100');
  });

  it('mendukung varian danger, secondary, ghost secara terpisah', () => {
    const { unmount } = render(<Button variant="danger">Bahaya</Button>);
    expect(screen.getByRole('button', { name: 'Bahaya' })).toHaveClass('bg-red-600');
    unmount();

    render(<Button variant="secondary">Batal</Button>);
    expect(screen.getByRole('button', { name: 'Batal' })).toHaveClass('border-slate-300');

    render(<Button variant="ghost">Hantu</Button>);
    expect(screen.getByRole('button', { name: 'Hantu' })).toHaveClass('hover:bg-slate-100');
  });

  it('menggunakan fallback varian primary ketika variant tidak dikenal', () => {
    render(<Button variant="custom-invalid">Default</Button>);
    expect(screen.getByRole('button', { name: 'Default' })).toHaveClass('from-indigo-600');
  });

  it('tetap merender children jika isLoading true tanpa loadingText', () => {
    render(<Button isLoading>Teks Asli</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('button-spinner')).toBeInTheDocument();
    expect(screen.getByText('Teks Asli')).toBeInTheDocument();
  });
});



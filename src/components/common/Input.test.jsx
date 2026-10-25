import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input component', () => {
  it('merender input beserta label dengan asosiasi htmlFor yang tepat', () => {
    render(<Input id="nama" label="Nama Pengguna" value="" onChange={vi.fn()} />);
    const label = screen.getByText(/Nama Pengguna/);
    const input = screen.getByLabelText(/Nama Pengguna/);
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'nama');
  });

  it('memanggil onChange saat pengguna mengetik', async () => {
    const handleChange = vi.fn();
    render(<Input id="email" label="Email" value="" onChange={handleChange} />);
    await userEvent.type(screen.getByLabelText('Email'), 'a');
    expect(handleChange).toHaveBeenCalled();
  });

  it('menampilkan pesan error saat prop error diberikan', () => {
    render(
      <Input
        id="nim"
        label="NIM"
        value=""
        onChange={vi.fn()}
        error="NIM wajib diisi"
      />
    );
    expect(screen.getByText('NIM wajib diisi')).toBeInTheDocument();
    expect(screen.getByLabelText(/NIM/)).toHaveClass('border-red-500');
  });

  it('menampilkan tanda bintang ketika required bernilai true', () => {
    render(<Input id="kamar" label="Nomor Kamar" required value="" onChange={vi.fn()} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});


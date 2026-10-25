import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Textarea from './Textarea';

describe('Textarea', () => {
  it('merender label dan textarea dengan benar', () => {
    render(
      <Textarea
        id="bio"
        label="Bio Singkat"
        value="Halo dunia"
        onChange={() => {}}
        required
      />
    );

    expect(screen.getByLabelText(/Bio Singkat/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bio Singkat/)).toHaveValue('Halo dunia');
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('merender tanpa label jika prop label tidak diberikan', () => {
    render(<Textarea id="note" value="Catatan" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('Catatan');
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('menampilkan pesan error saat prop error diberikan', () => {
    render(
      <Textarea
        id="note"
        value=""
        onChange={() => {}}
        error="Catatan wajib diisi"
      />
    );
    expect(screen.getByText('Catatan wajib diisi')).toBeInTheDocument();
  });

  it('memanggil onChange ketika isi teks berubah', () => {
    const handleChange = vi.fn();
    render(<Textarea id="note" value="" onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Teks baru' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('mendukung props disabled dan rows kustom', () => {
    render(<Textarea id="note" value="" onChange={() => {}} disabled rows={5} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveAttribute('rows', '5');
  });
});


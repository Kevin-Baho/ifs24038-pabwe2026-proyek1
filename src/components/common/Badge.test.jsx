import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from './Badge';

describe('Badge component', () => {
  it('merender badge dengan varian default', () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-slate-100');
  });

  it('mendukung varian warna primary, success, warning, danger, dan info', () => {
    const { rerender } = render(<Badge variant="primary">Aktif</Badge>);
    expect(screen.getByText('Aktif')).toHaveClass('bg-indigo-50');

    rerender(<Badge variant="success">Disetujui</Badge>);
    expect(screen.getByText('Disetujui')).toHaveClass('bg-green-100');

    rerender(<Badge variant="warning">Menunggu</Badge>);
    expect(screen.getByText('Menunggu')).toHaveClass('bg-yellow-100');

    rerender(<Badge variant="danger">Ditolak</Badge>);
    expect(screen.getByText('Ditolak')).toHaveClass('bg-red-100');

    rerender(<Badge variant="info">Info</Badge>);
    expect(screen.getByText('Info')).toHaveClass('bg-blue-100');
  });

  it('menggunakan fallback varian default ketika variant tidak dikenal', () => {
    render(<Badge variant="unknown-variant">Kustom</Badge>);
    expect(screen.getByText('Kustom')).toHaveClass('bg-slate-100');
  });

  it('menggabungkan className kustom', () => {
    render(<Badge className="text-sm px-4">Besar</Badge>);
    expect(screen.getByText('Besar')).toHaveClass('text-sm', 'px-4');
  });
});


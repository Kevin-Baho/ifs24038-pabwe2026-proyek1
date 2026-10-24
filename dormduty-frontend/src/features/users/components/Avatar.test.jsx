import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Avatar from './Avatar';

describe('Avatar', () => {
  it('menampilkan gambar jika ada avatar_url', () => {
    render(<Avatar user={{ name: 'Budi Santoso', avatar_url: '/uploads/avatars/a.png' }} />);
    const img = screen.getByRole('img', { name: 'Budi Santoso' });
    expect(img.getAttribute('src')).toContain('/uploads/avatars/a.png');
  });

  it('menampilkan inisial jika tidak ada foto', () => {
    render(<Avatar user={{ name: 'Budi Santoso' }} />);
    expect(screen.getByText('BS')).toBeInTheDocument();
  });

  it('aman tanpa user', () => {
    render(<Avatar />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });
});

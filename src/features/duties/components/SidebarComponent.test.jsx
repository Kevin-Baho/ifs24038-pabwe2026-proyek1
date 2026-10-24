import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test-utils';
import SidebarComponent from './SidebarComponent';

describe('SidebarComponent', () => {
  it('merender link menu Beranda, Warga, dan Profil', () => {
    renderWithProviders(<SidebarComponent isOpen={false} onClose={vi.fn()} />, { route: '/' });

    expect(screen.getByRole('link', { name: 'Beranda' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Warga' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Profil' })).toBeInTheDocument();
  });

  it('menyorot link yang aktif', () => {
    renderWithProviders(<SidebarComponent isOpen={false} onClose={vi.fn()} />, { route: '/users' });

    const wargaLink = screen.getByRole('link', { name: 'Warga' });
    expect(wargaLink.className).toContain('text-indigo-600');
  });

  it('menampilkan backdrop saat isOpen bernilai true di mobile dan memanggil onClose', async () => {
    const handleClose = vi.fn();
    renderWithProviders(<SidebarComponent isOpen={true} onClose={handleClose} />, { route: '/' });

    const backdrop = screen.getByTestId('sidebar-backdrop');
    expect(backdrop).toBeInTheDocument();
    await userEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);

    const closeBtn = screen.getByRole('button', { name: 'Tutup menu' });
    await userEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  it('memanggil onClose saat salah satu navigasi diklik', async () => {
    const handleClose = vi.fn();
    renderWithProviders(<SidebarComponent isOpen={true} onClose={handleClose} />, { route: '/' });

    await userEvent.click(screen.getByRole('link', { name: 'Profil' }));
    expect(handleClose).toHaveBeenCalled();
  });
});


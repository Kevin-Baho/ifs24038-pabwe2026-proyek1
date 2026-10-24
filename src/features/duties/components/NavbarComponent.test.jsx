import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test-utils';
import authReducer from '../../auth/states/reducer';
import NavbarComponent from './NavbarComponent';

describe('NavbarComponent', () => {
  const loggedInState = {
    auth: {
      token: 'valid-token',
      user: { name: 'Siti Aminah', role: 'coordinator', avatar_url: null },
      isLoading: false,
    },
  };

  it('menampilkan nama pengguna, peran, logo, dan avatar', () => {
    renderWithProviders(<NavbarComponent onToggleSidebar={vi.fn()} />, {
      reducer: { auth: authReducer },
      preloadedState: loggedInState,
    });

    expect(screen.getByText('DormDuty')).toBeInTheDocument();
    expect(screen.getByText('Siti Aminah (coordinator)')).toBeInTheDocument();
    expect(screen.getByLabelText('Inisial Siti Aminah')).toBeInTheDocument();
  });

  it('memanggil onToggleSidebar saat tombol hamburger diklik', async () => {
    const handleToggle = vi.fn();
    renderWithProviders(<NavbarComponent onToggleSidebar={handleToggle} />, {
      reducer: { auth: authReducer },
      preloadedState: loggedInState,
    });

    const toggleBtn = screen.getByRole('button', { name: 'Toggle menu' });
    await userEvent.click(toggleBtn);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('tombol Keluar mendispatch logout', async () => {
    const { store } = renderWithProviders(<NavbarComponent onToggleSidebar={vi.fn()} />, {
      reducer: { auth: authReducer },
      preloadedState: loggedInState,
    });

    const logoutBtn = screen.getByRole('button', { name: 'Keluar' });
    await userEvent.click(logoutBtn);
    expect(store.getState().auth.token).toBeNull();
  });

  it('dapat mengubah tema light/dark dengan tombol tema', async () => {
    renderWithProviders(<NavbarComponent onToggleSidebar={vi.fn()} />, {
      reducer: { auth: authReducer },
      preloadedState: loggedInState,
    });

    const themeBtn = screen.getByRole('button', { name: 'Toggle theme' });
    expect(themeBtn).toBeInTheDocument();
    await userEvent.click(themeBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    await userEvent.click(themeBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});


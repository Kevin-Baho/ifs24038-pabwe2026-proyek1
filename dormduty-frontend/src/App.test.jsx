import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import App from './App';
import api from './helpers/apiHelper';

vi.mock('./helpers/apiHelper', () => ({ default: { get: vi.fn() } }));

describe('App', () => {
  it('menampilkan status API saat terhubung', async () => {
    api.get.mockResolvedValue({ message: 'DormDuty API OK' });
    renderWithProviders(<App />);
    expect(screen.getByText('DormDuty')).toBeInTheDocument();
    expect(await screen.findByText('DormDuty API OK')).toBeInTheDocument();
  });

  it('menampilkan pesan gagal saat API tidak terjangkau', async () => {
    api.get.mockRejectedValue(new Error('Network error'));
    renderWithProviders(<App />);
    expect(await screen.findByText(/Gagal terhubung: Network error/)).toBeInTheDocument();
  });
});

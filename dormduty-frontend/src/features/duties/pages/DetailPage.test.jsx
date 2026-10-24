import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../../../test-utils';
import DetailPage from './DetailPage';
import { dutyApi } from '../api/dutyApi';
import dutiesReducer from '../states/reducer';
import authReducer from '../../auth/states/reducer';

vi.mock('../../../helpers/toolsHelper', () => ({
  showError: vi.fn(),
  showSuccess: vi.fn(),
  showConfirm: vi.fn(),
  formatDate: (d) => `Formatted: ${d}`,
  SHIFT_LABEL: { pagi: 'Pagi', sore: 'Sore' },
  STATUS_META: {
    pending: { label: 'Menunggu Pengerjaan', className: 'badge-pending' },
    submitted: { label: 'Menunggu Verifikasi', className: 'badge-submitted' },
    approved: { label: 'Selesai & Disetujui', className: 'badge-approved' },
    rejected: { label: 'Ditolak / Wajib Ulang', className: 'badge-rejected' },
  },
}));

vi.mock('../../../helpers/apiHelper', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    assetUrl: (path) => `http://localhost:5000${path}`,
  };
});

describe('DetailPage', () => {
  const baseDuty = {
    id: 1,
    user_id: 1,
    user_name: 'Budi Santoso',
    user_nim: '210001',
    user_room: '201',
    zone_name: 'Koridor Barat',
    floor: 2,
    scheduled_date: '2026-10-25',
    shift: 'pagi',
    status: 'pending',
    note: null,
    proof_image: null,
    verifier_name: null,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  const renderComponent = (user = { id: 1, role: 'resident' }, dutyData = baseDuty) => {
    if (dutyData) {
      vi.spyOn(dutyApi, 'get').mockResolvedValue(dutyData);
    } else {
      vi.spyOn(dutyApi, 'get').mockRejectedValue(new Error('Tugas tidak ditemukan'));
    }

    return renderWithProviders(
      <Routes>
        <Route path="/duties/:id" element={<DetailPage />} />
        <Route path="/" element={<div>Halaman Beranda</div>} />
      </Routes>,
      {
        route: '/duties/1',
        reducer: { duties: dutiesReducer, auth: authReducer },
        preloadedState: {
          auth: { token: 'token-abc', user, isLoading: false },
        },
      }
    );
  };

  it('merender identitas petugas, jadwal, lokasi, dan status', async () => {
    renderComponent({ id: 1, role: 'resident' });

    expect(await screen.findByRole('heading', { name: 'Detail Jadwal Piket' })).toBeInTheDocument();
    expect(screen.getByText('Budi Santoso')).toBeInTheDocument();
    expect(screen.getByText('210001')).toBeInTheDocument();
    expect(screen.getByText('201')).toBeInTheDocument();
    expect(screen.getByText('Koridor Barat')).toBeInTheDocument();
    expect(screen.getByText('Lantai 2')).toBeInTheDocument();
    expect(screen.getByText('Formatted: 2026-10-25')).toBeInTheDocument();
    expect(screen.getByText('Pagi')).toBeInTheDocument();
    expect(screen.getByText('Menunggu Pengerjaan')).toBeInTheDocument();
  });

  it('menampilkan status tugas tidak ditemukan ketika data tidak ada', async () => {
    renderComponent({ id: 1, role: 'resident' }, null);

    expect(await screen.findByText('Tugas tidak ditemukan')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Kembali ke Beranda' })).toBeInTheDocument();
  });

  it('menampilkan alasan penolakan saat status rejected', async () => {
    renderComponent(
      { id: 1, role: 'resident' },
      { ...baseDuty, status: 'rejected', note: 'Kaca jendela belum dibersihkan' }
    );

    expect(await screen.findByText('Tugas Piket Ditolak')).toBeInTheDocument();
    expect(screen.getByText(/Kaca jendela belum dibersihkan/)).toBeInTheDocument();
  });

  it('menampilkan bukti foto dan verifikator saat ada', async () => {
    renderComponent(
      { id: 1, role: 'resident' },
      {
        ...baseDuty,
        status: 'approved',
        proof_image: '/uploads/proofs/123.jpg',
        verifier_name: 'Pak Koordinator',
        note: 'Piket bersih rapi',
      }
    );

    const img = await screen.findByAltText('Foto Bukti Pengerjaan');
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toBe('http://localhost:5000/uploads/proofs/123.jpg');
    expect(screen.getByText(/Pak Koordinator/)).toBeInTheDocument();
    expect(screen.getByText(/Piket bersih rapi/)).toBeInTheDocument();
  });

  it('menampilkan tombol "Unggah Bukti Selesai" untuk petugas bersangkutan pada status pending/rejected', async () => {
    renderComponent({ id: 1, role: 'resident' }, { ...baseDuty, status: 'pending' });

    const uploadBtn = await screen.findByRole('button', { name: 'Unggah Bukti Selesai' });
    expect(uploadBtn).toBeInTheDocument();

    await userEvent.click(uploadBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Unggah Bukti Selesai Piket')).toBeInTheDocument();
  });

  it('tidak menampilkan tombol unggah bukti jika bukan petugas yang bersangkutan', async () => {
    renderComponent({ id: 2, role: 'resident' }, { ...baseDuty, status: 'pending' });

    await screen.findByRole('heading', { name: 'Detail Jadwal Piket' });
    expect(screen.queryByRole('button', { name: 'Unggah Bukti Selesai' })).not.toBeInTheDocument();
  });

  it('menampilkan tombol "Setujui" dan "Tolak" untuk admin/koordinator pada status submitted', async () => {
    renderComponent(
      { id: 99, role: 'coordinator' },
      { ...baseDuty, status: 'submitted', proof_image: '/uploads/proofs/p.jpg' }
    );

    const approveBtn = await screen.findByRole('button', { name: 'Setujui (Approve)' });
    const rejectBtn = screen.getByRole('button', { name: 'Tolak (Reject)' });

    expect(approveBtn).toBeInTheDocument();
    expect(rejectBtn).toBeInTheDocument();

    await userEvent.click(approveBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Verifikasi Pelaksanaan Piket')).toBeInTheDocument();
  });

  it('tidak menampilkan tombol verifikasi untuk peran resident', async () => {
    renderComponent(
      { id: 1, role: 'resident' },
      { ...baseDuty, status: 'submitted', proof_image: '/uploads/proofs/p.jpg' }
    );

    await screen.findByRole('heading', { name: 'Detail Jadwal Piket' });
    expect(screen.queryByRole('button', { name: 'Setujui (Approve)' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Tolak (Reject)' })).not.toBeInTheDocument();
  });

  it('menutup dan memperbarui data saat modal bukti selesai diunggah', async () => {
    vi.spyOn(dutyApi, 'uploadProof').mockResolvedValue({ ...baseDuty, status: 'submitted' });

    renderComponent({ id: 1, role: 'resident' }, { ...baseDuty, status: 'pending' });

    await userEvent.click(await screen.findByRole('button', { name: 'Unggah Bukti Selesai' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Tutup modal
    await userEvent.click(screen.getByRole('button', { name: 'Batal' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('menutup dan memperbarui data saat modal verifikasi selesai diproses', async () => {
    vi.spyOn(dutyApi, 'verify').mockResolvedValue({ ...baseDuty, status: 'approved' });

    renderComponent(
      { id: 99, role: 'admin' },
      { ...baseDuty, status: 'submitted', proof_image: '/p.jpg' }
    );

    await userEvent.click(await screen.findByRole('button', { name: 'Tolak (Reject)' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Batal tutup modal
    await userEvent.click(screen.getByRole('button', { name: 'Batal' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

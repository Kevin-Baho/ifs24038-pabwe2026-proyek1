import Swal from 'sweetalert2';

export const showSuccess = (message, title = 'Berhasil') =>
  Swal.fire({ icon: 'success', title, text: message, timer: 1800, showConfirmButton: false });

export const showError = (message, title = 'Gagal') =>
  Swal.fire({ icon: 'error', title, text: message });

export const showConfirm = async ({ title = 'Yakin?', text = '', confirmText = 'Ya' } = {}) => {
  const result = await Swal.fire({
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Batal',
  });
  return Boolean(result.isConfirmed);
};

/** Format tanggal Indonesia, mis. "2026-10-24" -> "24 Oktober 2026" */
export const formatDate = (value) => {
  if (!value) return '-';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  const date = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const SHIFT_LABEL = { pagi: 'Pagi', sore: 'Sore' };

export const STATUS_META = {
  pending: { label: 'Menunggu Pengerjaan', className: 'bg-yellow-100 text-yellow-800' },
  submitted: { label: 'Menunggu Verifikasi', className: 'bg-blue-100 text-blue-800' },
  approved: { label: 'Selesai & Disetujui', className: 'bg-green-100 text-green-800' },
  rejected: { label: 'Ditolak / Wajib Ulang', className: 'bg-red-100 text-red-800' },
};

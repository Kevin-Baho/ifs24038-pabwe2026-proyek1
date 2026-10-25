import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { asyncFetchDuty } from '../states/action';
import { assetUrl } from '../../../helpers/apiHelper';
import { formatDate, SHIFT_LABEL, STATUS_META } from '../../../helpers/toolsHelper';
import UploadProofModal from '../modals/UploadProofModal';
import VerifyModal from '../modals/VerifyModal';
import Button from '../../../components/common/Button';

export default function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { duty, isLoading } = useSelector((state) => state.duties);
  const { user } = useSelector((state) => state.auth);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [verifyModalState, setVerifyModalState] = useState({
    isOpen: false,
    initialStatus: 'approved',
  });

  useEffect(() => {
    dispatch(asyncFetchDuty(id));
  }, [dispatch, id]);

  const reloadDuty = () => {
    dispatch(asyncFetchDuty(id));
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center text-sm text-slate-500 dark:text-slate-400">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mb-2"></div>
        <p>Memuat detail jadwal piket...</p>
      </div>
    );
  }

  if (!duty) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Tugas tidak ditemukan</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Jadwal piket yang Anda cari tidak tersedia atau telah dihapus.
        </p>
        <Link
          to="/"
          className="inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const meta = STATUS_META[duty.status] || {
    label: duty.status,
    className: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  };

  const isAssignee = user?.id === duty.user_id || user?.role === 'admin';
  const canUploadProof = isAssignee && (duty.status === 'pending' || duty.status === 'rejected');
  const canVerify =
    (user?.role === 'admin' || user?.role === 'coordinator') && duty.status === 'submitted';

  return (
    <div className="space-y-6">
      {/* Tombol kembali & status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 mb-1.5 transition-colors"
          >
            ← Kembali ke Beranda
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            Detail Jadwal Piket
          </h1>
        </div>
        <div>
          <span
            className={`inline-flex items-center rounded-full px-3.5 py-1 text-sm font-semibold shadow-2xs ${meta.className}`}
          >
            {meta.label}
          </span>
        </div>
      </div>

      {/* Alert Alasan Penolakan */}
      {duty.status === 'rejected' && (
        <div className="rounded-2xl border border-red-200/80 bg-red-50/80 p-5 text-red-900 shadow-2xs dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold">
              !
            </span>
            <p className="font-bold text-sm">Tugas Piket Ditolak</p>
          </div>
          <p className="text-sm mt-2">
            <span className="font-semibold">Alasan Penolakan: </span>
            {duty.note || 'Tidak ada catatan penolakan spesifik.'}
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-2">
            Silakan lakukan piket ulang dan unggah bukti baru untuk diverifikasi kembali.
          </p>
        </div>
      )}

      {/* Grid Informasi Tugas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Identitas Petugas */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
            Identitas Petugas
          </h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Nama Petugas</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{duty.user_name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-300 font-medium">NIM</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{duty.user_nim || '-'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Nomor Kamar</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{duty.user_room || '-'}</span>
            </div>
          </div>
        </div>

        {/* Informasi Jadwal & Zona */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
            Jadwal & Lokasi
          </h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Tanggal</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(duty.scheduled_date)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Shift</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{SHIFT_LABEL[duty.shift] || duty.shift}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Zona Piket</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{duty.zone_name}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Lantai</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Lantai {duty.floor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Bukti Pengerjaan */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
          Bukti Pengerjaan & Catatan
        </h2>

        {duty.proof_image ? (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950">
              <img
                src={assetUrl(duty.proof_image)}
                alt="Foto Bukti Pengerjaan"
                className="max-h-96 w-full rounded-lg object-contain"
              />
            </div>
            {duty.note && (
              <div className="rounded-xl bg-slate-50 p-3.5 text-sm dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-200">Catatan Petugas: </span>
                <span className="text-slate-600 dark:text-slate-300">{duty.note}</span>
              </div>
            )}
            {duty.verifier_name && (
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Diverifikasi oleh: <span className="font-semibold text-slate-700 dark:text-slate-200">{duty.verifier_name}</span>
              </p>
            )}
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-slate-600 dark:text-slate-300 font-medium italic">
            Belum ada foto bukti yang diunggah untuk jadwal piket ini.
          </p>
        )}

        {/* Tombol Aksi Kondisional */}
        <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {canUploadProof && (
            <Button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
            >
              Unggah Bukti Selesai
            </Button>
          )}

          {canVerify && (
            <>
              <Button
                type="button"
                className="bg-green-600 hover:bg-green-700 shadow-green-600/20"
                onClick={() => setVerifyModalState({ isOpen: true, initialStatus: 'approved' })}
              >
                Setujui (Approve)
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => setVerifyModalState({ isOpen: true, initialStatus: 'rejected' })}
              >
                Tolak (Reject)
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Modal Unggah Bukti */}
      <UploadProofModal
        isOpen={isUploadModalOpen}
        dutyId={duty.id}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={reloadDuty}
      />

      {/* Modal Verifikasi */}
      <VerifyModal
        key={`${duty.id}-${verifyModalState.initialStatus}`}
        isOpen={verifyModalState.isOpen}
        dutyId={duty.id}
        initialStatus={verifyModalState.initialStatus}
        onClose={() => setVerifyModalState({ isOpen: false, initialStatus: 'approved' })}
        onSuccess={reloadDuty}
      />
    </div>
  );
}

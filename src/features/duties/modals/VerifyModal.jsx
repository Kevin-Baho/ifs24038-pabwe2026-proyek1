import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { asyncVerifyDuty } from '../states/action';
import { showError } from '../../../helpers/toolsHelper';

export default function VerifyModal({
  isOpen,
  onClose,
  dutyId,
  initialStatus = 'approved',
  onSuccess,
}) {
  const dispatch = useDispatch();

  const [status, setStatus] = useState(initialStatus);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setStatus(initialStatus);
    setNote('');
    setIsSubmitting(false);
  }, [initialStatus]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'rejected' && !note.trim()) {
      showError('Catatan alasan wajib diisi saat menolak');
      return;
    }

    setIsSubmitting(true);
    const success = await dispatch(
      asyncVerifyDuty(dutyId, {
        status,
        note: note.trim(),
      })
    );
    setIsSubmitting(false);

    if (success) {
      resetForm();
      onSuccess?.();
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all dark:bg-slate-900 dark:border dark:border-slate-800">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Verifikasi Pelaksanaan Piket</h2>
          <button
            type="button"
            aria-label="Tutup modal"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Keputusan Verifikasi</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${
                  status === 'approved'
                    ? 'border-green-600 bg-green-50 text-green-700 font-bold dark:border-green-600 dark:bg-green-950/40 dark:text-green-300 shadow-2xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="approved"
                  checked={status === 'approved'}
                  onChange={() => setStatus('approved')}
                  className="sr-only"
                />
                ✓ Setujui (Approve)
              </label>

              <label
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${
                  status === 'rejected'
                    ? 'border-red-600 bg-red-50 text-red-700 font-bold dark:border-red-600 dark:bg-red-950/40 dark:text-red-300 shadow-2xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="rejected"
                  checked={status === 'rejected'}
                  onChange={() => setStatus('rejected')}
                  className="sr-only"
                />
                ✕ Tolak (Reject)
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="verify_note" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Catatan Evaluasi {status === 'rejected' ? '(Wajib Diisi)' : '(Opsional)'}
            </label>
            <textarea
              id="verify_note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                status === 'rejected'
                  ? 'Jelaskan alasan penolakan dan bagian yang wajib diulang...'
                  : 'Catatan tambahan atau apresiasi...'
              }
              className="w-full rounded-xl border border-slate-300/80 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition-all disabled:opacity-50 ${
                status === 'approved'
                  ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20'
                  : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
              }`}
            >
              {isSubmitting
                ? 'Memproses...'
                : status === 'approved'
                ? 'Konfirmasi Setujui'
                : 'Konfirmasi Tolak'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

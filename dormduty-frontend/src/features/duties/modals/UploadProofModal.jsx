import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { asyncUploadProof } from '../states/action';
import { showError } from '../../../helpers/toolsHelper';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function UploadProofModal({ isOpen, onClose, dutyId, onSuccess }) {
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setNote('');
    setIsSubmitting(false);
  }, [previewUrl]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      showError('Format file harus berupa JPG, PNG, atau WEBP');
      e.target.value = '';
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      showError('Ukuran file maksimal 5 MB');
      e.target.value = '';
      return;
    }

    setFile(selected);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      showError('Foto bukti wajib diunggah');
      return;
    }

    setIsSubmitting(true);
    const success = await dispatch(asyncUploadProof(dutyId, file, note));
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
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all dark:bg-slate-900 dark:border dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Unggah Bukti Selesai Piket</h2>
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
            <label htmlFor="proof_file" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Foto Bukti (JPG/PNG/WEBP, maks 5 MB)
            </label>
            <input
              type="file"
              id="proof_file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-950/70 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900 transition-all"
            />
          </div>

          {previewUrl && (
            <div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Pratinjau Foto Bukti:</p>
              <img
                src={previewUrl}
                alt="Pratinjau bukti"
                className="h-48 w-full rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-2xs"
              />
            </div>
          )}

          <div>
            <label htmlFor="proof_note" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Catatan Pengerjaan (Opsional)
            </label>
            <textarea
              id="proof_note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Sudah disapu dan dipel sampai bersih..."
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
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Mengunggah...' : 'Unggah Bukti'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

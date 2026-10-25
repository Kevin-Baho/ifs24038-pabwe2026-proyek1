import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { asyncVerifyDuty } from '../states/action';
import { showError } from '../../../helpers/toolsHelper';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'rejected' && !note.trim()) {
      showError('Catatan alasan wajib diisi saat menolak');
      return;
    }

    setIsSubmitting(true);
    const success = await Promise.resolve(
      dispatch(
        asyncVerifyDuty(dutyId, {
          status,
          note: note.trim(),
        })
      )
    );
    setIsSubmitting(false);

    if (success) {
      resetForm();
      onSuccess?.();
      onClose();
    }
  };

  const confirmText = status === 'approved' ? 'Konfirmasi Setujui' : 'Konfirmasi Tolak';
  const submitButtonClass =
    status === 'approved'
      ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20'
      : 'bg-red-600 hover:bg-red-700 shadow-red-600/20';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Verifikasi Pelaksanaan Piket">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Keputusan Verifikasi
          </p>
          <div className="grid grid-cols-2 gap-3">
            <label
              htmlFor="status_approved"
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${
                status === 'approved'
                  ? 'border-green-600 bg-green-50 text-green-700 font-bold dark:border-green-600 dark:bg-green-950/40 dark:text-green-300 shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <input
                id="status_approved"
                type="radio"
                name="status"
                value="approved"
                checked={status === 'approved'}
                onChange={() => setStatus('approved')}
                className="sr-only"
              />
              <span>✓ Setujui (Approve)</span>
            </label>

            <label
              htmlFor="status_rejected"
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${
                status === 'rejected'
                  ? 'border-red-600 bg-red-50 text-red-700 font-bold dark:border-red-600 dark:bg-red-950/40 dark:text-red-300 shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <input
                id="status_rejected"
                type="radio"
                name="status"
                value="rejected"
                checked={status === 'rejected'}
                onChange={() => setStatus('rejected')}
                className="sr-only"
              />
              <span>✕ Tolak (Reject)</span>
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

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Batal
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingText="Memproses..."
            className={submitButtonClass}
          >
            {confirmText}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

VerifyModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  dutyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  initialStatus: PropTypes.string,
  onSuccess: PropTypes.func,
};


import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { asyncVerifyDuty } from '../states/action';
import { showError } from '../../../helpers/toolsHelper';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import Textarea from '../../../components/common/Textarea';
import useFormSubmit from '../../../hooks/useFormSubmit';

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

  const resetForm = useCallback(() => {
    setStatus(initialStatus);
    setNote('');
  }, [initialStatus]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const { isSubmitting, handleSubmit } = useFormSubmit(async () => {
    if (status === 'rejected' && !note.trim()) {
      showError('Catatan alasan wajib diisi saat menolak');
      return false;
    }

    const success = await Promise.resolve(
      dispatch(
        asyncVerifyDuty(dutyId, {
          status,
          note: note.trim(),
        })
      )
    );

    if (success) {
      resetForm();
      onSuccess?.();
      onClose();
      return true;
    }
    return false;
  });

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

        <Textarea
          id="verify_note"
          label={`Catatan Evaluasi ${status === 'rejected' ? '(Wajib Diisi)' : '(Opsional)'}`}
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={
            status === 'rejected'
              ? 'Jelaskan alasan penolakan dan bagian yang wajib diulang...'
              : 'Catatan tambahan atau apresiasi...'
          }
        />

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
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  dutyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  initialStatus: PropTypes.oneOf(['approved', 'rejected']),
  onSuccess: PropTypes.func,
};

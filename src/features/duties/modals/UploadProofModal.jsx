import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { asyncUploadProof } from '../states/action';
import { showError } from '../../../helpers/toolsHelper';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import Textarea from '../../../components/common/Textarea';
import useFormSubmit from '../../../hooks/useFormSubmit';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export default function UploadProofModal({ isOpen, onClose, dutyId, onSuccess }) {
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [note, setNote] = useState('');

  const resetForm = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setNote('');
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

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!ALLOWED_TYPES.has(selected.type)) {
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

  const { isSubmitting, handleSubmit } = useFormSubmit(async () => {
    if (!file) {
      showError('Foto bukti wajib diunggah');
      return false;
    }

    const success = await Promise.resolve(dispatch(asyncUploadProof(dutyId, file, note)));
    if (success) {
      resetForm();
      onSuccess?.();
      onClose();
      return true;
    }
    return false;
  });

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Unggah Bukti Selesai Piket">
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

        <Textarea
          id="proof_note"
          label="Catatan Pengerjaan (Opsional)"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Contoh: Sudah disapu dan dipel sampai bersih..."
        />

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Batal
          </Button>
          <Button type="submit" isLoading={isSubmitting} loadingText="Mengunggah...">
            Unggah Bukti
          </Button>
        </div>
      </form>
    </Modal>
  );
}

UploadProofModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  dutyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSuccess: PropTypes.func,
};

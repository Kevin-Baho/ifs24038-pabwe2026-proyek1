import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncFetchUsers } from '../../users/states/action';
import { asyncAddDuty, asyncFetchZones } from '../states/action';
import { showError } from '../../../helpers/toolsHelper';

const EMPTY_ARRAY = [];

export default function AddDutyModal({ isOpen, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users?.users) || EMPTY_ARRAY;
  const zones = useSelector((state) => state.duties?.zones) || EMPTY_ARRAY;

  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [shift, setShift] = useState('pagi');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setUserId('');
    setZoneId('');
    setScheduledDate('');
    setShift('pagi');
    setIsSubmitting(false);
  };

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      dispatch(asyncFetchUsers());
      dispatch(asyncFetchZones());
    }
  }, [isOpen, dispatch]);

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
    if (!userId || !zoneId || !scheduledDate || !shift) {
      showError('Semua kolom wajib diisi');
      return;
    }

    setIsSubmitting(true);
    const success = await dispatch(
      asyncAddDuty({
        user_id: Number(userId),
        zone_id: Number(zoneId),
        scheduled_date: scheduledDate,
        shift,
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
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Jadwalkan Piket Baru</h2>
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
            <label htmlFor="user_id" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Petugas Asrama
            </label>
            <select
              id="user_id"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full rounded-xl border border-slate-300/80 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">-- Pilih Petugas --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} (NIM: {u.nim || '-'}, Kamar: {u.room_number || '-'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="zone_id" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Zona Piket
            </label>
            <select
              id="zone_id"
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              className="w-full rounded-xl border border-slate-300/80 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">-- Pilih Zona --</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} (Lantai {z.floor})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="scheduled_date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Tanggal Pelaksanaan
            </label>
            <input
              type="date"
              id="scheduled_date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300/80 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label htmlFor="shift" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Shift
            </label>
            <select
              id="shift"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="w-full rounded-xl border border-slate-300/80 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="pagi">Pagi</option>
              <option value="sore">Sore</option>
            </select>
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
              {isSubmitting ? 'Menyimpan...' : 'Jadwalkan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

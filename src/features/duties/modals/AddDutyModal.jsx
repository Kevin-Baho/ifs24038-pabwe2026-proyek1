import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { asyncFetchUsers } from '../../users/states/action';
import { asyncAddDuty, asyncFetchZones } from '../states/action';
import { showError } from '../../../helpers/toolsHelper';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !zoneId || !scheduledDate || !shift) {
      showError('Semua kolom wajib diisi');
      return;
    }

    setIsSubmitting(true);
    const success = await Promise.resolve(
      dispatch(
        asyncAddDuty({
          user_id: Number(userId),
          zone_id: Number(zoneId),
          scheduled_date: scheduledDate,
          shift,
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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Jadwalkan Piket Baru">
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

        <Input
          id="scheduled_date"
          label="Tanggal Pelaksanaan"
          type="date"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
        />

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

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Batal
          </Button>
          <Button type="submit" isLoading={isSubmitting} loadingText="Menyimpan...">
            Jadwalkan
          </Button>
        </div>
      </form>
    </Modal>
  );
}

AddDutyModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
};


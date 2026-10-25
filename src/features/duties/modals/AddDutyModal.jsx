import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { asyncFetchUsers } from '../../users/states/action';
import { asyncAddDuty, asyncFetchZones } from '../states/action';
import { showError } from '../../../helpers/toolsHelper';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import useFormSubmit from '../../../hooks/useFormSubmit';

const EMPTY_ARRAY = [];

export default function AddDutyModal({ isOpen, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users?.users) || EMPTY_ARRAY;
  const zones = useSelector((state) => state.duties?.zones) || EMPTY_ARRAY;

  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [shift, setShift] = useState('pagi');

  const resetForm = useCallback(() => {
    setUserId('');
    setZoneId('');
    setScheduledDate('');
    setShift('pagi');
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  useEffect(() => {
    if (isOpen) {
      dispatch(asyncFetchUsers());
      dispatch(asyncFetchZones());
    }
  }, [isOpen, dispatch]);

  const { isSubmitting, handleSubmit } = useFormSubmit(async () => {
    if (!userId || !zoneId || !scheduledDate || !shift) {
      showError('Semua kolom wajib diisi');
      return false;
    }

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

    if (success) {
      resetForm();
      onSuccess?.();
      onClose();
      return true;
    }
    return false;
  });

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Jadwalkan Piket Baru">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          id="user_id"
          label="Petugas Asrama"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        >
          <option value="">-- Pilih Petugas --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} (NIM: {u.nim || '-'}, Kamar: {u.room_number || '-'})
            </option>
          ))}
        </Select>

        <Select
          id="zone_id"
          label="Zona Piket"
          value={zoneId}
          onChange={(e) => setZoneId(e.target.value)}
        >
          <option value="">-- Pilih Zona --</option>
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name} (Lantai {z.floor})
            </option>
          ))}
        </Select>

        <Input
          id="scheduled_date"
          label="Tanggal Pelaksanaan"
          type="date"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
        />

        <Select
          id="shift"
          label="Shift"
          value={shift}
          onChange={(e) => setShift(e.target.value)}
        >
          <option value="pagi">Pagi</option>
          <option value="sore">Sore</option>
        </Select>

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
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dutyApi } from '../api/dutyApi';
import { showError, showSuccess } from '../../../helpers/toolsHelper';
import {
  ActionType,
  setDutiesActionCreator,
  setDutyActionCreator,
  setDutyStatsActionCreator,
  setZonesActionCreator,
  setDutiesLoadingActionCreator,
  setIsDutyAddActionCreator,
  setIsDutyProofUploadActionCreator,
  setIsDutyVerifiedActionCreator,
  setIsDutyDeleteActionCreator,
  resetDutyMutationFlagsActionCreator,
  asyncFetchDuties,
  asyncFetchDuty,
  asyncFetchDutyStats,
  asyncFetchZones,
  asyncAddDuty,
  asyncUploadProof,
  asyncVerifyDuty,
  asyncDeleteDuty,
} from './action';

vi.mock('../../../helpers/toolsHelper', () => ({
  showError: vi.fn(),
  showSuccess: vi.fn(),
}));

describe('duties actions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('action creators membuat payload yang sesuai', () => {
    expect(setDutiesActionCreator([{ id: 1 }])).toEqual({
      type: ActionType.SET_DUTIES,
      payload: { duties: [{ id: 1 }] },
    });
    expect(setDutyActionCreator({ id: 2 })).toEqual({
      type: ActionType.SET_DUTY,
      payload: { duty: { id: 2 } },
    });
    expect(setDutyStatsActionCreator({ total: 5 })).toEqual({
      type: ActionType.SET_DUTY_STATS,
      payload: { dutyStats: { total: 5 } },
    });
    expect(setZonesActionCreator([{ id: 3 }])).toEqual({
      type: ActionType.SET_ZONES,
      payload: { zones: [{ id: 3 }] },
    });
    expect(setDutiesLoadingActionCreator(true)).toEqual({
      type: ActionType.SET_LOADING,
      payload: { isLoading: true },
    });
    expect(setIsDutyAddActionCreator(true)).toEqual({
      type: ActionType.SET_IS_DUTY_ADD,
      payload: { isDutyAdd: true },
    });
    expect(setIsDutyProofUploadActionCreator(true)).toEqual({
      type: ActionType.SET_IS_DUTY_PROOF_UPLOAD,
      payload: { isDutyProofUpload: true },
    });
    expect(setIsDutyVerifiedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_DUTY_VERIFIED,
      payload: { isDutyVerified: true },
    });
    expect(setIsDutyDeleteActionCreator(true)).toEqual({
      type: ActionType.SET_IS_DUTY_DELETE,
      payload: { isDutyDelete: true },
    });
    expect(resetDutyMutationFlagsActionCreator()).toEqual({
      type: ActionType.RESET_MUTATION_FLAGS,
    });
  });

  it('asyncFetchDuties sukses & gagal', async () => {
    const dispatch = vi.fn();
    vi.spyOn(dutyApi, 'list').mockResolvedValueOnce([{ id: 10 }]);

    await asyncFetchDuties({ floor: '2' })(dispatch);
    expect(dutyApi.list).toHaveBeenCalledWith({ floor: '2' });
    expect(dispatch).toHaveBeenCalledWith(setDutiesLoadingActionCreator(true));
    expect(dispatch).toHaveBeenCalledWith(setDutiesActionCreator([{ id: 10 }]));
    expect(dispatch).toHaveBeenLastCalledWith(setDutiesLoadingActionCreator(false));

    vi.spyOn(dutyApi, 'list').mockRejectedValueOnce(new Error('Gagal memuat tugas'));
    await asyncFetchDuties()(dispatch);
    expect(showError).toHaveBeenCalledWith('Gagal memuat tugas');
    expect(dispatch).toHaveBeenLastCalledWith(setDutiesLoadingActionCreator(false));
  });

  it('asyncFetchDuty sukses & gagal', async () => {
    const dispatch = vi.fn();
    vi.spyOn(dutyApi, 'get').mockResolvedValueOnce({ id: 1, shift: 'pagi' });

    await asyncFetchDuty(1)(dispatch);
    expect(dutyApi.get).toHaveBeenCalledWith(1);
    expect(dispatch).toHaveBeenCalledWith(setDutyActionCreator({ id: 1, shift: 'pagi' }));
    expect(dispatch).toHaveBeenLastCalledWith(setDutiesLoadingActionCreator(false));

    vi.spyOn(dutyApi, 'get').mockRejectedValueOnce(new Error('Tugas tidak ada'));
    await asyncFetchDuty(99)(dispatch);
    expect(showError).toHaveBeenCalledWith('Tugas tidak ada');
    expect(dispatch).toHaveBeenLastCalledWith(setDutiesLoadingActionCreator(false));
  });

  it('asyncFetchDutyStats sukses & gagal', async () => {
    const dispatch = vi.fn();
    vi.spyOn(dutyApi, 'stats').mockResolvedValueOnce({ total: 12 });

    await asyncFetchDutyStats({ floor: '3' })(dispatch);
    expect(dutyApi.stats).toHaveBeenCalledWith({ floor: '3' });
    expect(dispatch).toHaveBeenCalledWith(setDutyStatsActionCreator({ total: 12 }));

    vi.spyOn(dutyApi, 'stats').mockRejectedValueOnce(new Error('Gagal statistik'));
    await asyncFetchDutyStats()(dispatch);
    expect(showError).toHaveBeenCalledWith('Gagal statistik');
  });

  it('asyncFetchZones sukses & gagal', async () => {
    const dispatch = vi.fn();
    vi.spyOn(dutyApi, 'zones').mockResolvedValueOnce([{ id: 1, name: 'Dapur' }]);

    await asyncFetchZones({ floor: '2' })(dispatch);
    expect(dutyApi.zones).toHaveBeenCalledWith({ floor: '2' });
    expect(dispatch).toHaveBeenCalledWith(setZonesActionCreator([{ id: 1, name: 'Dapur' }]));

    vi.spyOn(dutyApi, 'zones').mockRejectedValueOnce(new Error('Gagal zona'));
    await asyncFetchZones()(dispatch);
    expect(showError).toHaveBeenCalledWith('Gagal zona');
  });

  it('asyncAddDuty sukses & gagal', async () => {
    const dispatch = vi.fn();
    const payload = { user_id: 1, zone_id: 1, scheduled_date: '2026-10-25', shift: 'pagi' };

    vi.spyOn(dutyApi, 'create').mockResolvedValueOnce({ id: 100 });
    const success = await asyncAddDuty(payload)(dispatch);
    expect(success).toBe(true);
    expect(dutyApi.create).toHaveBeenCalledWith(payload);
    expect(dispatch).toHaveBeenCalledWith(setIsDutyAddActionCreator(true));
    expect(showSuccess).toHaveBeenCalledWith('Jadwal piket berhasil dibuat');

    vi.spyOn(dutyApi, 'create').mockRejectedValueOnce(new Error('Validasi gagal'));
    const failed = await asyncAddDuty(payload)(dispatch);
    expect(failed).toBe(false);
    expect(showError).toHaveBeenCalledWith('Validasi gagal');
  });

  it('asyncUploadProof sukses & gagal', async () => {
    const dispatch = vi.fn();
    const file = new File(['proof'], 'p.jpg', { type: 'image/jpeg' });
    const updatedDuty = { id: 1, status: 'submitted', proof_image: '/p.jpg' };

    vi.spyOn(dutyApi, 'uploadProof').mockResolvedValueOnce(updatedDuty);
    const success = await asyncUploadProof(1, file, 'rapi')(dispatch);
    expect(success).toBe(true);
    expect(dutyApi.uploadProof).toHaveBeenCalledWith(1, file, 'rapi');
    expect(dispatch).toHaveBeenCalledWith(setDutyActionCreator(updatedDuty));
    expect(dispatch).toHaveBeenCalledWith(setIsDutyProofUploadActionCreator(true));
    expect(showSuccess).toHaveBeenCalledWith('Bukti piket berhasil diunggah');

    vi.spyOn(dutyApi, 'uploadProof').mockRejectedValueOnce(new Error('Ukuran terlalu besar'));
    const failed = await asyncUploadProof(1, file)(dispatch);
    expect(failed).toBe(false);
    expect(showError).toHaveBeenCalledWith('Ukuran terlalu besar');
  });

  it('asyncVerifyDuty sukses & gagal', async () => {
    const dispatch = vi.fn();
    const approvedDuty = { id: 1, status: 'approved' };

    vi.spyOn(dutyApi, 'verify').mockResolvedValueOnce(approvedDuty);
    const approvedSuccess = await asyncVerifyDuty(1, { status: 'approved' })(dispatch);
    expect(approvedSuccess).toBe(true);
    expect(dutyApi.verify).toHaveBeenCalledWith(1, { status: 'approved' });
    expect(dispatch).toHaveBeenCalledWith(setDutyActionCreator(approvedDuty));
    expect(dispatch).toHaveBeenCalledWith(setIsDutyVerifiedActionCreator(true));
    expect(showSuccess).toHaveBeenCalledWith('Tugas disetujui');

    const rejectedDuty = { id: 1, status: 'rejected' };
    vi.spyOn(dutyApi, 'verify').mockResolvedValueOnce(rejectedDuty);
    const rejectedSuccess = await asyncVerifyDuty(1, { status: 'rejected', note: 'kurang bersih' })(dispatch);
    expect(rejectedSuccess).toBe(true);
    expect(showSuccess).toHaveBeenCalledWith('Tugas ditolak');

    vi.spyOn(dutyApi, 'verify').mockRejectedValueOnce(new Error('Catatan wajib diisi'));
    const failed = await asyncVerifyDuty(1, { status: 'rejected' })(dispatch);
    expect(failed).toBe(false);
    expect(showError).toHaveBeenCalledWith('Catatan wajib diisi');
  });

  it('asyncDeleteDuty sukses & gagal', async () => {
    const dispatch = vi.fn();
    vi.spyOn(dutyApi, 'remove').mockResolvedValueOnce(null);

    const success = await asyncDeleteDuty(1)(dispatch);
    expect(success).toBe(true);
    expect(dutyApi.remove).toHaveBeenCalledWith(1);
    expect(dispatch).toHaveBeenCalledWith(setIsDutyDeleteActionCreator(true));
    expect(showSuccess).toHaveBeenCalledWith('Jadwal piket berhasil dihapus');

    vi.spyOn(dutyApi, 'remove').mockRejectedValueOnce(new Error('Tugas tidak ditemukan'));
    const failed = await asyncDeleteDuty(99)(dispatch);
    expect(failed).toBe(false);
    expect(showError).toHaveBeenCalledWith('Tugas tidak ditemukan');
  });
});


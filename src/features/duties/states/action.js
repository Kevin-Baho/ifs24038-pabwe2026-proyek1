import { dutyApi } from '../api/dutyApi';
import { showError, showSuccess } from '../../../helpers/toolsHelper';

export const ActionType = {
  SET_DUTIES: 'duties/SET_DUTIES',
  SET_DUTY: 'duties/SET_DUTY',
  SET_DUTY_STATS: 'duties/SET_DUTY_STATS',
  SET_ZONES: 'duties/SET_ZONES',
  SET_LOADING: 'duties/SET_LOADING',
  SET_IS_DUTY_ADD: 'duties/SET_IS_DUTY_ADD',
  SET_IS_DUTY_PROOF_UPLOAD: 'duties/SET_IS_DUTY_PROOF_UPLOAD',
  SET_IS_DUTY_VERIFIED: 'duties/SET_IS_DUTY_VERIFIED',
  SET_IS_DUTY_DELETE: 'duties/SET_IS_DUTY_DELETE',
  RESET_MUTATION_FLAGS: 'duties/RESET_MUTATION_FLAGS',
};

export const setDutiesActionCreator = (duties) => ({
  type: ActionType.SET_DUTIES,
  payload: { duties },
});

export const setDutyActionCreator = (duty) => ({
  type: ActionType.SET_DUTY,
  payload: { duty },
});

export const setDutyStatsActionCreator = (dutyStats) => ({
  type: ActionType.SET_DUTY_STATS,
  payload: { dutyStats },
});

export const setZonesActionCreator = (zones) => ({
  type: ActionType.SET_ZONES,
  payload: { zones },
});

export const setDutiesLoadingActionCreator = (isLoading) => ({
  type: ActionType.SET_LOADING,
  payload: { isLoading },
});

export const setIsDutyAddActionCreator = (isDutyAdd) => ({
  type: ActionType.SET_IS_DUTY_ADD,
  payload: { isDutyAdd },
});

export const setIsDutyProofUploadActionCreator = (isDutyProofUpload) => ({
  type: ActionType.SET_IS_DUTY_PROOF_UPLOAD,
  payload: { isDutyProofUpload },
});

export const setIsDutyVerifiedActionCreator = (isDutyVerified) => ({
  type: ActionType.SET_IS_DUTY_VERIFIED,
  payload: { isDutyVerified },
});

export const setIsDutyDeleteActionCreator = (isDutyDelete) => ({
  type: ActionType.SET_IS_DUTY_DELETE,
  payload: { isDutyDelete },
});

export const resetDutyMutationFlagsActionCreator = () => ({
  type: ActionType.RESET_MUTATION_FLAGS,
});

export function asyncFetchDuties(params = {}) {
  return async (dispatch) => {
    dispatch(setDutiesLoadingActionCreator(true));
    try {
      const duties = await dutyApi.list(params);
      dispatch(setDutiesActionCreator(duties));
    } catch (err) {
      showError(err.message);
    } finally {
      dispatch(setDutiesLoadingActionCreator(false));
    }
  };
}

export function asyncFetchDuty(id) {
  return async (dispatch) => {
    dispatch(setDutiesLoadingActionCreator(true));
    try {
      const duty = await dutyApi.get(id);
      dispatch(setDutyActionCreator(duty));
    } catch (err) {
      showError(err.message);
    } finally {
      dispatch(setDutiesLoadingActionCreator(false));
    }
  };
}

export function asyncFetchDutyStats(params = {}) {
  return async (dispatch) => {
    try {
      const stats = await dutyApi.stats(params);
      dispatch(setDutyStatsActionCreator(stats));
    } catch (err) {
      showError(err.message);
    }
  };
}

export function asyncFetchZones(params = {}) {
  return async (dispatch) => {
    try {
      const zones = await dutyApi.zones(params);
      dispatch(setZonesActionCreator(zones));
    } catch (err) {
      showError(err.message);
    }
  };
}

export function asyncAddDuty(payload) {
  return async (dispatch) => {
    try {
      await dutyApi.create(payload);
      dispatch(setIsDutyAddActionCreator(true));
      showSuccess('Jadwal piket berhasil dibuat');
      return true;
    } catch (err) {
      showError(err.message);
      return false;
    }
  };
}

export function asyncUploadProof(id, file, note) {
  return async (dispatch) => {
    try {
      const duty = await dutyApi.uploadProof(id, file, note);
      dispatch(setDutyActionCreator(duty));
      dispatch(setIsDutyProofUploadActionCreator(true));
      showSuccess('Bukti piket berhasil diunggah');
      return true;
    } catch (err) {
      showError(err.message);
      return false;
    }
  };
}

export function asyncVerifyDuty(id, payload) {
  return async (dispatch) => {
    try {
      const duty = await dutyApi.verify(id, payload);
      dispatch(setDutyActionCreator(duty));
      dispatch(setIsDutyVerifiedActionCreator(true));
      showSuccess(payload.status === 'approved' ? 'Tugas disetujui' : 'Tugas ditolak');
      return true;
    } catch (err) {
      showError(err.message);
      return false;
    }
  };
}

export function asyncDeleteDuty(id) {
  return async (dispatch) => {
    try {
      await dutyApi.remove(id);
      dispatch(setIsDutyDeleteActionCreator(true));
      showSuccess('Jadwal piket berhasil dihapus');
      return true;
    } catch (err) {
      showError(err.message);
      return false;
    }
  };
}


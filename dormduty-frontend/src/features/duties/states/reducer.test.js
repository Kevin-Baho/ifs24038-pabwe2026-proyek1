import { describe, it, expect } from 'vitest';
import dutiesReducer from './reducer';
import {
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
} from './action';
import { logoutActionCreator } from '../../auth/states/action';

describe('dutiesReducer', () => {
  const initial = {
    duties: [],
    duty: null,
    dutyStats: null,
    zones: [],
    isLoading: false,
    isDutyAdd: false,
    isDutyProofUpload: false,
    isDutyVerified: false,
    isDutyDelete: false,
  };

  it('state awal', () => {
    expect(dutiesReducer(undefined, {})).toEqual(initial);
  });

  it('menangani SET_DUTIES, SET_DUTY, SET_DUTY_STATS, SET_ZONES, SET_LOADING', () => {
    let state = dutiesReducer(undefined, {});
    state = dutiesReducer(state, setDutiesActionCreator([{ id: 1 }]));
    state = dutiesReducer(state, setDutyActionCreator({ id: 1, shift: 'pagi' }));
    state = dutiesReducer(state, setDutyStatsActionCreator({ total: 10 }));
    state = dutiesReducer(state, setZonesActionCreator([{ id: 2, name: 'Dapur' }]));
    state = dutiesReducer(state, setDutiesLoadingActionCreator(true));

    expect(state).toEqual({
      duties: [{ id: 1 }],
      duty: { id: 1, shift: 'pagi' },
      dutyStats: { total: 10 },
      zones: [{ id: 2, name: 'Dapur' }],
      isLoading: true,
      isDutyAdd: false,
      isDutyProofUpload: false,
      isDutyVerified: false,
      isDutyDelete: false,
    });
  });

  it('menangani flag mutasi dan RESET_MUTATION_FLAGS', () => {
    let state = dutiesReducer(undefined, {});
    state = dutiesReducer(state, setIsDutyAddActionCreator(true));
    state = dutiesReducer(state, setIsDutyProofUploadActionCreator(true));
    state = dutiesReducer(state, setIsDutyVerifiedActionCreator(true));
    state = dutiesReducer(state, setIsDutyDeleteActionCreator(true));

    expect(state.isDutyAdd).toBe(true);
    expect(state.isDutyProofUpload).toBe(true);
    expect(state.isDutyVerified).toBe(true);
    expect(state.isDutyDelete).toBe(true);

    state = dutiesReducer(state, resetDutyMutationFlagsActionCreator());
    expect(state.isDutyAdd).toBe(false);
    expect(state.isDutyProofUpload).toBe(false);
    expect(state.isDutyVerified).toBe(false);
    expect(state.isDutyDelete).toBe(false);
  });

  it('LOGOUT mengosongkan state kembali ke initialState', () => {
    const dirtyState = {
      duties: [{ id: 1 }],
      duty: { id: 1 },
      dutyStats: { total: 1 },
      zones: [{ id: 1 }],
      isLoading: true,
      isDutyAdd: true,
      isDutyProofUpload: true,
      isDutyVerified: true,
      isDutyDelete: true,
    };
    expect(dutiesReducer(dirtyState, logoutActionCreator())).toEqual(initial);
  });

  it('mengembalikan state asal pada action yang tidak dikenal', () => {
    const state = { ...initial, isLoading: true };
    expect(dutiesReducer(state, { type: 'UNKNOWN_ACTION' })).toBe(state);
  });
});


import { ActionType } from './action';
import { ActionType as AuthActionType } from '../../auth/states/action';

const initialState = {
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

export default function dutiesReducer(state = initialState, action = {}) {
  switch (action.type) {
    case ActionType.SET_DUTIES:
      return { ...state, duties: action.payload.duties };
    case ActionType.SET_DUTY:
      return { ...state, duty: action.payload.duty };
    case ActionType.SET_DUTY_STATS:
      return { ...state, dutyStats: action.payload.dutyStats };
    case ActionType.SET_ZONES:
      return { ...state, zones: action.payload.zones };
    case ActionType.SET_LOADING:
      return { ...state, isLoading: action.payload.isLoading };
    case ActionType.SET_IS_DUTY_ADD:
      return { ...state, isDutyAdd: action.payload.isDutyAdd };
    case ActionType.SET_IS_DUTY_PROOF_UPLOAD:
      return { ...state, isDutyProofUpload: action.payload.isDutyProofUpload };
    case ActionType.SET_IS_DUTY_VERIFIED:
      return { ...state, isDutyVerified: action.payload.isDutyVerified };
    case ActionType.SET_IS_DUTY_DELETE:
      return { ...state, isDutyDelete: action.payload.isDutyDelete };
    case ActionType.RESET_MUTATION_FLAGS:
      return {
        ...state,
        isDutyAdd: false,
        isDutyProofUpload: false,
        isDutyVerified: false,
        isDutyDelete: false,
      };
    case AuthActionType.LOGOUT:
      return initialState;
    default:
      return state;
  }
}


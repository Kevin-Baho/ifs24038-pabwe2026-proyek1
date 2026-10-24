import { ActionType } from './action';
import { ActionType as AuthActionType } from '../../auth/states/action';

const initialState = { users: [], me: null, isLoading: false };

export default function usersReducer(state = initialState, action = {}) {
  switch (action.type) {
    case ActionType.SET_USERS:
      return { ...state, users: action.payload.users };
    case ActionType.SET_ME:
      return { ...state, me: action.payload.me };
    case ActionType.SET_LOADING:
      return { ...state, isLoading: action.payload.isLoading };
    case AuthActionType.LOGOUT:
      return initialState;
    default:
      return state;
  }
}

import { ActionType } from './action';
import { getToken } from '../../../helpers/apiHelper';
import { loadUser } from '../api/authApi';

const createInitialState = () => {
  const token = getToken();
  return { token, user: token ? loadUser() : null, isLoading: false };
};

export default function authReducer(state = createInitialState(), action = {}) {
  switch (action.type) {
    case ActionType.SET_AUTH:
      return { ...state, token: action.payload.token, user: action.payload.user };
    case ActionType.SET_LOADING:
      return { ...state, isLoading: action.payload.isLoading };
    case ActionType.LOGOUT:
      return { ...state, token: null, user: null };
    default:
      return state;
  }
}

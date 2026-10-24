import { authApi, saveSession, clearSession } from '../api/authApi';
import { showError, showSuccess } from '../../../helpers/toolsHelper';

export const ActionType = {
  SET_AUTH: 'auth/SET_AUTH',
  SET_LOADING: 'auth/SET_LOADING',
  LOGOUT: 'auth/LOGOUT',
};

export const setAuthActionCreator = ({ token, user }) => ({
  type: ActionType.SET_AUTH,
  payload: { token, user },
});
export const setAuthLoadingActionCreator = (isLoading) => ({
  type: ActionType.SET_LOADING,
  payload: { isLoading },
});
export const logoutActionCreator = () => ({ type: ActionType.LOGOUT });

// Thunk mengembalikan true/false agar halaman tahu kapan harus berpindah rute
export function asyncLogin({ identifier, password }) {
  return async (dispatch) => {
    dispatch(setAuthLoadingActionCreator(true));
    try {
      const session = await authApi.login(identifier, password);
      saveSession(session);
      dispatch(setAuthActionCreator(session));
      return true;
    } catch (err) {
      showError(err.message);
      return false;
    } finally {
      dispatch(setAuthLoadingActionCreator(false));
    }
  };
}

export function asyncRegister(payload) {
  return async (dispatch) => {
    dispatch(setAuthLoadingActionCreator(true));
    try {
      await authApi.register(payload);
      showSuccess('Registrasi berhasil, silakan masuk');
      return true;
    } catch (err) {
      showError(err.message);
      return false;
    } finally {
      dispatch(setAuthLoadingActionCreator(false));
    }
  };
}

export function asyncLogout() {
  return (dispatch) => {
    clearSession();
    dispatch(logoutActionCreator());
  };
}

import { userApi } from '../api/userApi';
import { showError, showSuccess } from '../../../helpers/toolsHelper';

export const ActionType = {
  SET_USERS: 'users/SET_USERS',
  SET_ME: 'users/SET_ME',
  SET_LOADING: 'users/SET_LOADING',
};

export const setUsersActionCreator = (users) => ({ type: ActionType.SET_USERS, payload: { users } });
export const setMeActionCreator = (me) => ({ type: ActionType.SET_ME, payload: { me } });
export const setUsersLoadingActionCreator = (isLoading) => ({
  type: ActionType.SET_LOADING,
  payload: { isLoading },
});

export function asyncFetchUsers(params = {}) {
  return async (dispatch) => {
    dispatch(setUsersLoadingActionCreator(true));
    try {
      dispatch(setUsersActionCreator(await userApi.list(params)));
    } catch (err) {
      showError(err.message);
    } finally {
      dispatch(setUsersLoadingActionCreator(false));
    }
  };
}

export function asyncFetchMe() {
  return async (dispatch) => {
    try {
      dispatch(setMeActionCreator(await userApi.getMe()));
    } catch (err) {
      showError(err.message);
    }
  };
}

export function asyncUpdateMe(payload) {
  return async (dispatch) => {
    try {
      dispatch(setMeActionCreator(await userApi.updateMe(payload)));
      showSuccess('Profil diperbarui');
      return true;
    } catch (err) {
      showError(err.message);
      return false;
    }
  };
}

export function asyncUploadPhoto(file) {
  return async (dispatch, getState) => {
    try {
      const { avatar_url } = await userApi.uploadPhoto(file);
      dispatch(setMeActionCreator({ ...getState().users.me, avatar_url }));
      showSuccess('Foto profil diperbarui');
      return true;
    } catch (err) {
      showError(err.message);
      return false;
    }
  };
}

export function asyncChangePassword(payload) {
  return async () => {
    try {
      await userApi.changePassword(payload);
      showSuccess('Kata sandi berhasil diubah');
      return true;
    } catch (err) {
      showError(err.message);
      return false;
    }
  };
}

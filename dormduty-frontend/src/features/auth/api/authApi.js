import api, { setToken, removeToken } from '../../../helpers/apiHelper';

const USER_KEY = 'dormduty_user';

export const authApi = {
  login: (identifier, password) =>
    api.post('/auth/login', { identifier, password }).then((res) => res.data),
  register: (payload) => api.post('/auth/register', payload).then((res) => res.data),
};

export const saveSession = ({ token, user }) => {
  setToken(token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const loadUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};

export const clearSession = () => {
  removeToken();
  localStorage.removeItem(USER_KEY);
};

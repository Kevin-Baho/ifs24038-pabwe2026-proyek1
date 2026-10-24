import api from '../../../helpers/apiHelper';

export const userApi = {
  list: (params) => api.get('/users', params).then((res) => res.data),
  getMe: () => api.get('/users/me').then((res) => res.data),
  updateMe: (payload) => api.put('/users/me', payload).then((res) => res.data),
  uploadPhoto: (file) => {
    const formData = new FormData();
    formData.append('photo', file);
    return api.upload('/users/me/photo', formData).then((res) => res.data);
  },
  changePassword: (payload) => api.put('/users/me/password', payload),
};

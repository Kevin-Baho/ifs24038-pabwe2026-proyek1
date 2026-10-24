import api from '../../../helpers/apiHelper';

export const dutyApi = {
  list: (params) => api.get('/duties', params).then((res) => res.data),
  get: (id) => api.get(`/duties/${id}`).then((res) => res.data),
  create: (payload) => api.post('/duties', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/duties/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/duties/${id}`).then((res) => res.data),
  uploadProof: (id, file, note) => {
    const formData = new FormData();
    formData.append('proof', file);
    if (note) formData.append('note', note);
    return api.upload(`/duties/${id}/proof`, formData).then((res) => res.data);
  },
  verify: (id, { status, note }) =>
    api.put(`/duties/${id}/verify`, { status, note }).then((res) => res.data),
  stats: (params) => api.get('/duties/stats', params).then((res) => res.data),
  zones: (params) => api.get('/zones', params).then((res) => res.data),
};


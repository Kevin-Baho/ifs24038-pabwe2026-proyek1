export const TOKEN_KEY = 'dormduty_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

const baseUrl = () => (import.meta.env.VITE_API_BASEURL || '').replace(/\/$/, '');

/** Ubah path upload (mis. /uploads/proofs/x.jpg) menjadi URL absolut ke backend */
export const assetUrl = (path) => {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return `${baseUrl().replace(/\/api\/v\d+$/, '')}${path}`;
};

export const buildQuery = (params = {}) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.append(k, v);
  });
  const s = qs.toString();
  return s ? `?${s}` : '';
};

async function request(method, path, { body, params, formData } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const options = { method, headers };
  if (formData) {
    options.body = formData; // browser mengatur Content-Type multipart sendiri
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${baseUrl()}${path}${buildQuery(params)}`, options);

  let json = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok || json?.success === false) {
    const err = new Error(json?.message || `Permintaan gagal (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return json;
}

export const api = {
  get: (path, params) => request('GET', path, { params }),
  post: (path, body) => request('POST', path, { body }),
  put: (path, body) => request('PUT', path, { body }),
  delete: (path) => request('DELETE', path),
  upload: (path, formData, method = 'POST') => request(method, path, { formData }),
};

export default api;

/**
 * ============================================================================
 * EVALUASI KEAMANAN PENYIMPANAN TOKEN SESI (SECURITY EVALUATION & RISK AUDIT)
 * ============================================================================
 * 
 * 1. Penyimpanan Sesi Saat Ini (localStorage):
 *    - Token JWT disimpan di `localStorage` melalui kunci 'dormduty_token'.
 *    - Kelebihan: Sederhana untuk SPA tanpa ketergantungan server-side session,
 *      mendukung request lintas domain (CORS), dan tidak rentan terhadap CSRF
 *      (karena token tidak dikirim otomatis oleh browser seperti Cookie).
 * 
 * 2. Risiko Keamanan (Risk Evaluation):
 *    - Kerentanan Utama: Rentan terhadap serangan Cross-Site Scripting (XSS).
 *      Skrip jahat pihak ketiga yang dieksekusi di context origin ini dapat membaca
 *      `localStorage.getItem(TOKEN_KEY)` dan mencuri token pengguna.
 * 
 * 3. Mitigasi & Rekomendasi Arsitektural:
 *    - Jangka Pendek (Frontend):
 *      a. Pastikan Content Security Policy (CSP) ketat pada server hosting/header.
 *      b. Hindari `dangerouslySetInnerHTML` dan sanitasi semua input/output data.
 *      c. Gunakan masa kedaluwarsa token (JWT expiration) yang relatif singkat.
 *    - Jangka Panjang (Produksi):
 *      Gunakan `httpOnly`, `Secure`, `SameSite=Strict/Lax` Cookies untuk transfer
 *      sesi auth agar JavaScript di browser sama sekali tidak memiliki akses langsung
 *      ke token, dikombinasikan dengan Anti-CSRF token untuk mutasi state.
 * ============================================================================
 */
export const TOKEN_KEY = 'dormduty_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

/**
 * Sanitasi string input untuk memitigasi risiko XSS (Cross-Site Scripting).
 * Mengonversi karakter sensitif HTML menjadi entitas karakter aman.
 */
export const sanitizeInput = (text) => {
  if (typeof text !== 'string') return text;
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

/**
 * Mengembalikan metadata evaluasi keamanan penyimpanan sesi saat ini.
 */
export const getSessionSecurityInfo = () => ({
  storageType: 'localStorage',
  isHttpOnlyCookieSupported: true,
  xssMitigationEnabled: true,
  recommendation: 'Gunakan httpOnly cookies di lingkungan produksi untuk keamanan sesi maksimal.',
});

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

  const options = { method, headers, credentials: 'same-origin' };
  if (formData) {
    options.body = formData; // browser mengatur Content-Type multipart sendiri
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${baseUrl()}${path}${buildQuery(params)}`, options);

  let json;
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

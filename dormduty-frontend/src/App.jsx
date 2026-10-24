import { useEffect, useState } from 'react';
import api from './helpers/apiHelper';

// Halaman sementara untuk memastikan frontend terhubung ke backend.
// Akan diganti dengan routing sesungguhnya di Langkah 3.
export default function App() {
  const [status, setStatus] = useState('Memeriksa koneksi API...');

  useEffect(() => {
    api.get('/health')
      .then((res) => setStatus(res.message))
      .catch((err) => setStatus(`Gagal terhubung: ${err.message}`));
  }, []);

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50">
      <div className="rounded-xl bg-white p-8 shadow text-center">
        <h1 className="text-2xl font-bold text-slate-800">DormDuty</h1>
        <p className="mt-2 text-slate-600">{status}</p>
      </div>
    </main>
  );
}

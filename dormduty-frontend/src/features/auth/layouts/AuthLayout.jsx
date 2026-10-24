import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AuthLayout() {
  const token = useSelector((state) => state.auth.token);
  if (token) return <Navigate to="/" replace />;

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-800">DormDuty</h1>
          <p className="text-sm text-slate-500">Manajemen &amp; Verifikasi Piket Asrama</p>
        </div>
        <Outlet />
      </div>
    </main>
  );
}

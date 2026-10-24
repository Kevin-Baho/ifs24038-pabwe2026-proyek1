import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncLogout } from '../../auth/states/action';

// Cangkang sementara: proteksi rute + header sederhana.
// Navbar & Sidebar lengkap ditambahkan di langkah berikutnya.
export default function DutyLayout() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  if (!token) return <Navigate to="/auth/login" replace />;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between bg-white px-6 py-3 shadow">
        <span className="font-bold text-slate-800">DormDuty</span>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-600">{user?.name} ({user?.role})</span>
          <button onClick={() => dispatch(asyncLogout())} className="rounded-lg border px-3 py-1 hover:bg-slate-100">
            Keluar
          </button>
        </div>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}

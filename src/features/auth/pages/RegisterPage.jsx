import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../../../hooks/useInput';
import { asyncRegister } from '../states/action';

const inputClass =
  'mt-1 w-full rounded-xl border border-slate-300/80 px-3.5 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors';
const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.auth.isLoading);
  const [nim, onNim] = useInput('');
  const [name, onName] = useInput('');
  const [email, onEmail] = useInput('');
  const [roomNumber, onRoom] = useInput('');
  const [floor, onFloor] = useInput('');
  const [password, onPassword] = useInput('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const ok = await dispatch(
      asyncRegister({ nim, name, email, password, room_number: roomNumber, floor: Number(floor) })
    );
    if (ok) navigate('/auth/login', { replace: true });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Daftar Akun</h1>
      <div>
        <label htmlFor="nim" className={labelClass}>NIM</label>
        <input id="nim" className={inputClass} value={nim} onChange={onNim} required />
      </div>
      <div>
        <label htmlFor="name" className={labelClass}>Nama Lengkap</label>
        <input id="name" className={inputClass} value={name} onChange={onName} required />
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input id="email" type="email" className={inputClass} value={email} onChange={onEmail} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="room" className={labelClass}>Nomor Kamar</label>
          <input id="room" className={inputClass} placeholder="Kamar 204" value={roomNumber} onChange={onRoom} required />
        </div>
        <div>
          <label htmlFor="floor" className={labelClass}>Lantai</label>
          <input id="floor" type="number" min="1" className={inputClass} value={floor} onChange={onFloor} required />
        </div>
      </div>
      <div>
        <label htmlFor="reg-password" className={labelClass}>Kata Sandi</label>
        <input id="reg-password" type="password" minLength={6} className={inputClass} value={password} onChange={onPassword} required />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-2.5 font-semibold text-white shadow-md shadow-indigo-600/20 hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-60 transition-all active:scale-98"
      >
        {isLoading ? 'Memproses...' : 'Daftar'}
      </button>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Sudah punya akun? <Link to="/auth/login" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">Masuk</Link>
      </p>
    </form>
  );
}

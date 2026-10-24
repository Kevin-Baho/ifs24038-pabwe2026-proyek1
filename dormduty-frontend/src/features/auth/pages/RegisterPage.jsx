import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../../../hooks/useInput';
import { asyncRegister } from '../states/action';

const inputClass = 'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500';
const labelClass = 'text-sm font-medium text-slate-700';

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
      <h2 className="text-xl font-semibold text-slate-800">Daftar Warga Asrama</h2>
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
        className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {isLoading ? 'Memproses...' : 'Daftar'}
      </button>
      <p className="text-center text-sm text-slate-500">
        Sudah punya akun? <Link to="/auth/login" className="text-indigo-600 hover:underline">Masuk</Link>
      </p>
    </form>
  );
}

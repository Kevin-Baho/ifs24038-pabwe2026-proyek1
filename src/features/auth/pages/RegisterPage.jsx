import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../../../hooks/useInput';
import { asyncRegister } from '../states/action';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

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
    const ok = await Promise.resolve(
      dispatch(
        asyncRegister({ nim, name, email, password, room_number: roomNumber, floor: Number(floor) })
      )
    );
    if (ok) navigate('/auth/login', { replace: true });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Daftar Akun</h1>
      <Input id="nim" label="NIM" value={nim} onChange={onNim} required />
      <Input id="name" label="Nama Lengkap" value={name} onChange={onName} required />
      <Input id="email" type="email" label="Email" value={email} onChange={onEmail} required />
      <div className="grid grid-cols-2 gap-3">
        <Input id="room" label="Nomor Kamar" placeholder="Kamar 204" value={roomNumber} onChange={onRoom} required />
        <Input id="floor" type="number" min="1" label="Lantai" value={floor} onChange={onFloor} required />
      </div>
      <Input id="reg-password" type="password" minLength={6} label="Kata Sandi" value={password} onChange={onPassword} required />
      <Button
        type="submit"
        isLoading={isLoading}
        loadingText="Memproses..."
        className="w-full py-2.5"
      >
        Daftar
      </Button>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Sudah punya akun? <Link to="/auth/login" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">Masuk</Link>
      </p>
    </form>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../../../hooks/useInput';
import { asyncLogin } from '../states/action';

const inputClass = 'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.auth.isLoading);
  const [identifier, onIdentifierChange] = useInput('');
  const [password, onPasswordChange] = useInput('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const ok = await dispatch(asyncLogin({ identifier, password }));
    if (ok) navigate('/', { replace: true });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">Masuk</h2>
      <div>
        <label htmlFor="identifier" className="text-sm font-medium text-slate-700">NIM / Email</label>
        <input id="identifier" className={inputClass} value={identifier} onChange={onIdentifierChange} required />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-slate-700">Kata Sandi</label>
        <input id="password" type="password" className={inputClass} value={password} onChange={onPasswordChange} required />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {isLoading ? 'Memproses...' : 'Masuk'}
      </button>
      <p className="text-center text-sm text-slate-500">
        Belum punya akun? <Link to="/auth/register" className="text-indigo-600 hover:underline">Daftar</Link>
      </p>
    </form>
  );
}

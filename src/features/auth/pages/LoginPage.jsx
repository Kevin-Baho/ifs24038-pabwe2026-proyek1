import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../../../hooks/useInput';
import { asyncLogin } from '../states/action';

const inputClass =
  'mt-1 w-full rounded-xl border border-slate-300/80 px-3.5 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors';

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
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Masuk</h2>
      <div>
        <label htmlFor="username" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          NIM / Email
        </label>
        <input
          id="username"
          name="username"
          className={inputClass}
          value={identifier}
          onChange={onIdentifierChange}
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Kata Sandi
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className={inputClass}
          value={password}
          onChange={onPasswordChange}
          required
        />
      </div>
      <button
        type="submit"
        id="btn-submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-2.5 font-semibold text-white shadow-md shadow-indigo-600/20 hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-60 transition-all active:scale-98"
      >
        {isLoading ? 'Memproses...' : 'Masuk'}
      </button>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Belum punya akun?{' '}
        <Link to="/auth/register" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
          Daftar
        </Link>
      </p>
    </form>
  );
}
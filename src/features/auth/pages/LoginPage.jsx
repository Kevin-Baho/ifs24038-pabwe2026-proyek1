import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../../../hooks/useInput';
import { asyncLogin } from '../states/action';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.auth.isLoading);
  const [identifier, onIdentifierChange] = useInput('');
  const [password, onPasswordChange] = useInput('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const ok = await Promise.resolve(dispatch(asyncLogin({ identifier, password })));
    if (ok) navigate('/', { replace: true });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Masuk</h1>
      <Input
        id="username"
        name="username"
        label="NIM / Email"
        value={identifier}
        onChange={onIdentifierChange}
        required
      />
      <Input
        id="password"
        name="password"
        type="password"
        label="Kata Sandi"
        value={password}
        onChange={onPasswordChange}
        required
      />
      <Button
        type="submit"
        id="btn-submit"
        isLoading={isLoading}
        loadingText="Memproses..."
        className="w-full py-2.5"
      >
        Masuk
      </Button>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Belum punya akun?{' '}
        <Link to="/auth/register" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
          Daftar
        </Link>
      </p>
    </form>
  );
}

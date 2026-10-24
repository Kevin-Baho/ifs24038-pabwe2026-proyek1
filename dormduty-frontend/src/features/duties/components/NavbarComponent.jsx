import { useDispatch, useSelector } from 'react-redux';
import { asyncLogout } from '../../auth/states/action';
import Avatar from '../../users/components/Avatar';
import useTheme from '../../../hooks/useTheme';

export default function NavbarComponent({ onToggleSidebar }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [theme, toggleTheme] = useTheme();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 md:px-6 shadow-xs backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden transition-colors"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-sm shadow-indigo-500/20">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
            DormDuty
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Tombol Tema (Light / Dark) */}
        <button
          type="button"
          aria-label="Toggle theme"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white transition-all shadow-2xs"
        >
          {theme === 'dark' ? (
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>

        <div className="flex items-center gap-3 pl-1 border-l border-slate-200 dark:border-slate-800">
          <Avatar user={user} size="h-9 w-9" />
          <div className="hidden sm:block text-sm">
            <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">
              {user?.name} ({user?.role})
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => dispatch(asyncLogout())}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs md:text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-red-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-red-400 transition-colors shadow-2xs"
        >
          Keluar
        </button>
      </div>
    </header>
  );
}

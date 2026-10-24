import { NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
    isActive
      ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-2xs dark:bg-indigo-950/60 dark:text-indigo-400 dark:border dark:border-indigo-800/40'
      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
  }`;

export default function SidebarComponent({ isOpen = false, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          data-testid="sidebar-backdrop"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-xs md:hidden transition-opacity"
        />
      )}

      <aside
        data-testid="sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r border-slate-200/80 p-4 transition-all duration-200 ease-in-out dark:border-slate-800 dark:bg-slate-900 md:static md:inset-auto md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-4 flex items-center justify-between md:hidden pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="font-bold text-slate-800 dark:text-slate-200">Menu Navigasi</span>
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-1.5">
          <NavLink to="/" end className={navLinkClass} onClick={onClose}>
            <svg className="h-4.5 w-4.5 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Beranda
          </NavLink>
          <NavLink to="/users" className={navLinkClass} onClick={onClose}>
            <svg className="h-4.5 w-4.5 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Warga
          </NavLink>
          <NavLink to="/profile" className={navLinkClass} onClick={onClose}>
            <svg className="h-4.5 w-4.5 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Profil
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

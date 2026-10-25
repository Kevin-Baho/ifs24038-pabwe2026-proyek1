import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../../../hooks/useInput';
import useDebounce from '../../../hooks/useDebounce';
import { asyncFetchUsers } from '../states/action';
import Avatar from '../components/Avatar';

const ROLE_LABEL = { resident: 'Warga', coordinator: 'Koordinator', admin: 'Admin' };
const FLOORS = [1, 2, 3, 4, 5];

export default function UsersPage() {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.users);
  const [floor, onFloorChange] = useInput('');
  const [search, onSearchChange] = useInput('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    dispatch(asyncFetchUsers({ floor, search: debouncedSearch }));
  }, [dispatch, floor, debouncedSearch]);

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Direktori Warga Asrama</h1>
      <div className="flex flex-wrap gap-3">
        <input
          aria-label="Cari warga"
          placeholder="Cari nama, NIM, atau kamar"
          value={search}
          onChange={onSearchChange}
          className="min-w-64 flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
        />
        <select
          aria-label="Filter lantai"
          value={floor}
          onChange={onFloorChange}
          className="rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
        >
          <option value="">Semua Lantai</option>
          {FLOORS.map((f) => (
            <option key={f} value={f}>Lantai {f}</option>
          ))}
        </select>
      </div>

      {isLoading && <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Memuat...</p>}
      {!isLoading && users.length === 0 && <p className="text-slate-600 dark:text-slate-300 font-medium">Tidak ada warga ditemukan.</p>}

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((u) => (
          <li key={u.id} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xs border border-slate-100 dark:border-slate-800 dark:bg-slate-900 transition-colors">
            <Avatar user={u} />
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-800 dark:text-slate-100">{u.name}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{u.nim} · {u.room_number} · Lt. {u.floor}</p>
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{ROLE_LABEL[u.role] || u.role}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

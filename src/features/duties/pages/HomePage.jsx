import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { asyncDeleteDuty, asyncFetchDuties, asyncFetchDutyStats } from '../states/action';
import { formatDate, SHIFT_LABEL, STATUS_META, showConfirm } from '../../../helpers/toolsHelper';
import AddDutyModal from '../modals/AddDutyModal';

export default function HomePage() {
  const dispatch = useDispatch();
  const { duties, dutyStats, isLoading } = useSelector((state) => state.duties);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'me' | 'submitted'
  const [floorFilter, setFloorFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const canManage = user?.role === 'admin' || user?.role === 'coordinator';

  const loadData = useCallback(() => {
    const params = {};
    if (activeTab === 'me') params.is_me = '1';
    if (activeTab === 'submitted') params.status = 'submitted';
    if (floorFilter) params.floor = floorFilter;
    if (dateFilter) params.date = dateFilter;

    dispatch(asyncFetchDuties(params));

    const statsParams = {};
    if (activeTab === 'me') statsParams.is_me = '1';
    if (floorFilter) statsParams.floor = floorFilter;
    if (dateFilter) statsParams.date = dateFilter;
    dispatch(asyncFetchDutyStats(statsParams));
  }, [dispatch, activeTab, floorFilter, dateFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (duty) => {
    const confirmed = await showConfirm({
      title: 'Hapus Jadwal Piket?',
      text: `Yakin ingin menghapus jadwal untuk ${duty.user_name}?`,
      confirmText: 'Ya, Hapus',
    });

    if (confirmed) {
      const success = await Promise.resolve(dispatch(asyncDeleteDuty(duty.id)));
      if (success) {
        loadData();
      }
    }
  };

  const renderDutiesContent = () => {
    if (isLoading) {
      return (
        <div className="py-16 text-center text-sm text-slate-500 dark:text-slate-400">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mb-2"></div>
          <p>Memuat daftar jadwal piket...</p>
        </div>
      );
    }

    if (duties.length === 0) {
      return (
        <div className="py-16 text-center text-sm text-slate-500 dark:text-slate-400">
          <p className="font-medium text-slate-700 dark:text-slate-300">Belum ada jadwal piket yang sesuai.</p>
          <p className="text-xs mt-1">Coba sesuaikan tab atau filter lantai dan tanggal di atas.</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="border-b border-slate-200/80 bg-slate-50/75 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th scope="col" className="px-4 py-3">Tanggal</th>
              <th scope="col" className="px-4 py-3">Shift</th>
              <th scope="col" className="px-4 py-3">Zona</th>
              <th scope="col" className="px-4 py-3">Petugas</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {duties.map((duty) => {
              const meta = STATUS_META[duty.status] || {
                label: duty.status,
                className: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
              };
              return (
                <tr key={duty.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                    {formatDate(duty.scheduled_date)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {SHIFT_LABEL[duty.shift] || duty.shift}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{duty.zone_name}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">Lantai {duty.floor}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{duty.user_name}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      NIM: {duty.user_nim || '-'} • Kamar: {duty.user_room || '-'}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.className}`}
                    >
                      {meta.label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/duties/${duty.id}`}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-colors"
                      >
                        Detail
                      </Link>
                      {canManage && (
                        <button
                          type="button"
                          onClick={() => handleDelete(duty)}
                          className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40 transition-colors"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Tombol Tambah */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
              Manajemen Piket Asrama
            </h1>
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40">
              Roster Aktif
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Kelola, laporkan bukti, dan pantau status verifikasi kebersihan asrama secara real-time.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:from-indigo-700 hover:to-indigo-800 active:scale-98 transition-all"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            + Jadwalkan Piket
          </button>
        )}
      </div>

      {/* Kartu Ringkasan Statistik */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
        {/* Total Tugas */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all hover:shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Tugas</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            {dutyStats?.total ?? 0}
          </p>
        </div>

        {/* Selesai */}
        <div className="rounded-2xl border border-green-200/60 bg-gradient-to-b from-green-50/40 to-white p-4 shadow-xs transition-all hover:shadow-sm dark:border-green-900/40 dark:from-green-950/20 dark:to-slate-900">
          <p className="text-xs font-medium text-green-700 dark:text-green-400">Selesai</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-green-600 dark:text-green-400">
            {dutyStats?.completed ?? 0}
          </p>
        </div>

        {/* Menunggu Verifikasi */}
        <div className="rounded-2xl border border-blue-200/60 bg-gradient-to-b from-blue-50/40 to-white p-4 shadow-xs transition-all hover:shadow-sm dark:border-blue-900/40 dark:from-blue-950/20 dark:to-slate-900">
          <p className="text-xs font-medium text-blue-700 dark:text-blue-400">Menunggu Verifikasi</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
            {dutyStats?.awaiting_verification ?? 0}
          </p>
        </div>

        {/* Ditolak */}
        <div className="rounded-2xl border border-red-200/60 bg-gradient-to-b from-red-50/40 to-white p-4 shadow-xs transition-all hover:shadow-sm dark:border-red-900/40 dark:from-red-950/20 dark:to-slate-900">
          <p className="text-xs font-medium text-red-700 dark:text-red-400">Ditolak</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-red-600 dark:text-red-400">
            {dutyStats?.rejected ?? 0}
          </p>
        </div>

        {/* Lalai / Alfa */}
        <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-b from-amber-50/40 to-white p-4 shadow-xs transition-all hover:shadow-sm dark:border-amber-900/40 dark:from-amber-950/20 dark:to-slate-900">
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Lalai / Alfa</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
            {dutyStats?.overdue ?? 0}
          </p>
        </div>

        {/* Penyelesaian */}
        <div className="rounded-2xl border border-indigo-200/60 bg-gradient-to-b from-indigo-50/40 to-white p-4 shadow-xs transition-all hover:shadow-sm dark:border-indigo-900/40 dark:from-indigo-950/20 dark:to-slate-900">
          <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400">Penyelesaian</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
            {dutyStats?.completion_rate ?? 0}%
          </p>
        </div>
      </div>

      {/* Kontrol Tab & Filter */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 md:p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          {/* Tab Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Semua Jadwal
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('me')}
              className={`rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'me'
                  ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Tugas Saya
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('submitted')}
              className={`rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'submitted'
                  ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Menunggu Verifikasi
            </button>
          </div>

          {/* Filter Lantai & Tanggal */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="floor_filter" className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Lantai:
              </label>
              <select
                id="floor_filter"
                value={floorFilter}
                onChange={(e) => setFloorFilter(e.target.value)}
                className="rounded-lg border border-slate-300/80 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="">Semua Lantai</option>
                <option value="1">Lantai 1</option>
                <option value="2">Lantai 2</option>
                <option value="3">Lantai 3</option>
                <option value="4">Lantai 4</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="date_filter" className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Tanggal:
              </label>
              <input
                type="date"
                id="date_filter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="rounded-lg border border-slate-300/80 bg-white px-2.5 py-1 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
              {dateFilter && (
                <button
                  type="button"
                  onClick={() => setDateFilter('')}
                  className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabel Roster Jadwal Piket */}
        {renderDutiesContent()}
      </div>

      {/* Modal Tambah Jadwal */}
      <AddDutyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../../../hooks/useInput';
import { showError } from '../../../helpers/toolsHelper';
import { asyncFetchMe, asyncUpdateMe, asyncUploadPhoto, asyncChangePassword } from '../states/action';
import Avatar from '../components/Avatar';

const inputClass =
  'mt-1 w-full rounded-xl border border-slate-300/80 px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500';
const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';
const btnClass =
  'rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors';
const cardClass =
  'space-y-3 rounded-2xl bg-white p-5 shadow-xs border border-slate-100 dark:border-slate-800 dark:bg-slate-900 transition-colors';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const me = useSelector((state) => state.users.me);
  const [bio, onBioChange, , setBio] = useInput('');
  const [room, onRoomChange, , setRoom] = useInput('');
  const [floor, onFloorChange, , setFloor] = useInput('');
  const [oldPassword, onOldChange, resetOld] = useInput('');
  const [newPassword, onNewChange, resetNew] = useInput('');
  const [confirm, onConfirmChange, resetConfirm] = useInput('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    dispatch(asyncFetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (me) {
      setBio(me.bio || '');
      setRoom(me.room_number || '');
      setFloor(String(me.floor ?? ''));
    }
  }, [me, setBio, setRoom, setFloor]);

  if (!me) return <p className="text-slate-600 dark:text-slate-300 font-medium">Memuat profil...</p>;

  const onSaveProfile = (e) => {
    e.preventDefault();
    dispatch(asyncUpdateMe({ bio, room_number: room, floor: Number(floor) }));
  };

  const onUpload = async (e) => {
    e.preventDefault();
    if (!file) return showError('Pilih foto terlebih dahulu');
    const ok = await dispatch(asyncUploadPhoto(file));
    if (ok) setFile(null);
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) return showError('Konfirmasi kata sandi tidak cocok');
    const ok = await dispatch(asyncChangePassword({ old_password: oldPassword, new_password: newPassword }));
    if (ok) {
      resetOld();
      resetNew();
      resetConfirm();
    }
  };

  return (
    <section className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Profil Saya</h1>

      <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-xs border border-slate-100 dark:border-slate-800 dark:bg-slate-900 transition-colors">
        <Avatar user={me} size="h-16 w-16 text-xl" />
        <div>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{me.name}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{me.nim} · {me.email}</p>
        </div>
      </div>

      <form onSubmit={onSaveProfile} className={cardClass}>
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">Data Diri</h2>
        <div>
          <label htmlFor="bio" className={labelClass}>Bio</label>
          <textarea id="bio" rows={3} className={inputClass} value={bio} onChange={onBioChange} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="room" className={labelClass}>Nomor Kamar</label>
            <input id="room" className={inputClass} value={room} onChange={onRoomChange} required />
          </div>
          <div>
            <label htmlFor="floor" className={labelClass}>Lantai</label>
            <input id="floor" type="number" min="1" className={inputClass} value={floor} onChange={onFloorChange} required />
          </div>
        </div>
        <button type="submit" className={btnClass}>Simpan Profil</button>
      </form>

      <form onSubmit={onUpload} className={cardClass}>
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">Foto Profil</h2>
        <label htmlFor="photo" className={labelClass}>Pilih Foto (JPG/PNG/WEBP, maks 5 MB)</label>
        <input
          id="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-950/70 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900 transition-all"
          onChange={(e) => setFile(e.target.files[0] || null)}
        />
        <button type="submit" className={btnClass}>Unggah Foto</button>
      </form>

      <form onSubmit={onChangePassword} className={cardClass}>
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">Ubah Kata Sandi</h2>
        <div>
          <label htmlFor="old-password" className={labelClass}>Kata Sandi Lama</label>
          <input id="old-password" type="password" className={inputClass} value={oldPassword} onChange={onOldChange} required />
        </div>
        <div>
          <label htmlFor="new-password" className={labelClass}>Kata Sandi Baru</label>
          <input id="new-password" type="password" minLength={6} className={inputClass} value={newPassword} onChange={onNewChange} required />
        </div>
        <div>
          <label htmlFor="confirm-password" className={labelClass}>Konfirmasi Kata Sandi Baru</label>
          <input id="confirm-password" type="password" className={inputClass} value={confirm} onChange={onConfirmChange} required />
        </div>
        <button type="submit" className={btnClass}>Ubah Kata Sandi</button>
      </form>
    </section>
  );
}

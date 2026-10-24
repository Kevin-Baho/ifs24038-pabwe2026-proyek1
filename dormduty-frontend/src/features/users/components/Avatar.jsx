import { assetUrl } from '../../../helpers/apiHelper';

export default function Avatar({ user, size = 'h-10 w-10' }) {
  if (user?.avatar_url) {
    return <img src={assetUrl(user.avatar_url)} alt={user.name} className={`${size} rounded-full object-cover`} />;
  }
  const initials = (user?.name || '?').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <div
      aria-label={`Inisial ${user?.name || ''}`}
      className={`${size} grid place-items-center rounded-full bg-indigo-100 font-semibold text-indigo-700`}
    >
      {initials}
    </div>
  );
}

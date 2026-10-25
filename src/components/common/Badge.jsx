import PropTypes from 'prop-types';

const BADGE_VARIANTS = {
  default:
    'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50',
  primary:
    'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40',
  success:
    'bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300 border border-green-200/50 dark:border-green-800/40',
  warning:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300 border border-yellow-200/50 dark:border-yellow-800/40',
  danger:
    'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200/50 dark:border-red-800/40',
  info:
    'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/40',
};

/**
 * Komponen Badge reusable untuk label status dan tag pill.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Label atau isi badge
 * @param {'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'} [props.variant='default'] - Varian warna
 * @param {string} [props.className=''] - Kelas styling tambahan
 */
export default function Badge({ children, variant = 'default', className = '', ...props }) {
  const variantClass = BADGE_VARIANTS[variant] || BADGE_VARIANTS.default;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-2xs ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

Badge.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger', 'info']),
  className: PropTypes.string,
};


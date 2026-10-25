import PropTypes from 'prop-types';

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20 hover:from-indigo-700 hover:to-indigo-800',
  secondary:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
  danger:
    'bg-red-600 text-white shadow-md shadow-red-600/20 hover:bg-red-700',
  ghost:
    'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
};

/**
 * Komponen tombol reusable dengan dukungan varian dan status loading.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Label atau konten tombol
 * @param {'primary' | 'secondary' | 'danger' | 'ghost'} [props.variant='primary'] - Gaya varian tombol
 * @param {boolean} [props.isLoading=false] - Status loading tombol
 * @param {string} [props.loadingText] - Teks pengganti saat loading
 * @param {boolean} [props.disabled=false] - Status non-aktif
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - Tipe tombol HTML
 * @param {Function} [props.onClick] - Event klik tombol
 * @param {string} [props.className] - Kelas styling tambahan
 */
export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  loadingText,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed ${variantClass} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          data-testid="button-spinner"
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost']),
  isLoading: PropTypes.bool,
  loadingText: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  className: PropTypes.string,
};



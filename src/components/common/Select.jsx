import PropTypes from 'prop-types';

/**
 * Komponen Select form reusable dengan label semantik dan styling konsisten.
 * @param {Object} props
 * @param {string} props.id - ID unik select
 * @param {string} [props.label] - Label deskriptif
 * @param {any} props.value - Nilai controlled select
 * @param {Function} props.onChange - Event handler perubahan nilai
 * @param {React.ReactNode} props.children - Elemen `<option>` pilihan
 * @param {string} [props.className] - Kelas CSS tambahan
 * @param {boolean} [props.disabled=false] - Nonaktifkan select
 */
export default function Select({
  id,
  label,
  value,
  onChange,
  children,
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-label={props['aria-label'] || label}
        className={`w-full rounded-xl border border-slate-300/80 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 disabled:opacity-50 transition-colors ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

Select.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};


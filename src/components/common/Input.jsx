import PropTypes from 'prop-types';

/**
 * Komponen Input form reusable dengan label semantik dan tampilan error.
 * @param {Object} props
 * @param {string} props.id - ID unik input (digunakan juga untuk label htmlFor)
 * @param {string} [props.name] - Nama field input
 * @param {string} [props.label] - Label deskriptif input
 * @param {string} [props.type='text'] - Tipe HTML input
 * @param {any} props.value - Nilai controlled input
 * @param {Function} props.onChange - Event handler perubahan nilai
 * @param {string} [props.placeholder] - Teks petunjuk input
 * @param {string} [props.error] - Pesan validasi error
 * @param {boolean} [props.required=false] - Field wajib diisi
 * @param {boolean} [props.disabled=false] - Field non-aktif
 * @param {string} [props.className] - Kelas CSS tambahan
 */
export default function Input({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  const borderClass = error
    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
    : 'border-slate-300/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700';

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        name={name || id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full rounded-xl border bg-white px-3.5 py-2 text-sm text-slate-800 transition-colors focus:outline-none dark:bg-slate-800 dark:text-slate-100 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-900 ${borderClass} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

Input.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};



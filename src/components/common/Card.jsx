import PropTypes from 'prop-types';

/**
 * Komponen Card reusable untuk standarisasi container panel / kartu di seluruh aplikasi.
 * @param {Object} props
 * @param {React.ElementType} [props.as='div'] - Tag HTML yang dirender (div, li, section, form)
 * @param {React.ReactNode} props.children - Konten di dalam kartu
 * @param {string} [props.className=''] - Kelas CSS tambahan
 */
export default function Card({ as: Component = 'div', children, className = '', ...props }) {
  return (
    <Component
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

Card.propTypes = {
  as: PropTypes.elementType,
  children: PropTypes.node,
  className: PropTypes.string,
};


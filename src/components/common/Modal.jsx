import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from './ErrorBoundary';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]):not([tabindex="-1"]), [href], input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"]):not([disabled])';

/**
 * Komponen modal dialog yang dapat digunakan kembali dengan focus trap dan error boundary.
 * @param {Object} props
 * @param {boolean} props.isOpen - Status visibilitas modal
 * @param {Function} props.onClose - Fungsi callback penutupan modal
 * @param {string} [props.title] - Judul modal
 * @param {React.ReactNode} props.children - Isi konten modal
 * @param {React.ReactNode} [props.footer] - Bagian footer / tombol aksi
 * @param {string} [props.className] - Kelas tambahan pada container isi
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = 'w-full max-w-lg',
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousActiveElement = document.activeElement;

    const timer = setTimeout(() => {
      const focusable = dialogRef.current?.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusable && focusable.length > 0) {
        focusable[0].focus();
      }
    }, 0);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll(FOCUSABLE_SELECTOR);
        if (!focusable || focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || !dialogRef.current?.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else if (document.activeElement === lastElement || !dialogRef.current?.contains(document.activeElement)) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      globalThis.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      open
      aria-modal="true"
      className="fixed inset-0 z-50 m-0 flex h-full w-full max-h-none max-w-none items-center justify-center border-0 bg-transparent p-4"
    >
      <button
        type="button"
        aria-label="Tutup"
        onClick={onClose}
        tabIndex={-1}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-default"
      />
      <div
        className={`relative z-10 rounded-2xl bg-white p-6 shadow-2xl transition-all dark:bg-slate-900 dark:border dark:border-slate-800 max-h-[90vh] overflow-y-auto ${className}`}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h2>
            <button
              type="button"
              aria-label="Tutup modal"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        <ErrorBoundary>
          <div className="space-y-4">{children}</div>
        </ErrorBoundary>

        {footer && (
          <div className="mt-4 flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            {footer}
          </div>
        )}
      </div>
    </dialog>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  children: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.string,
};

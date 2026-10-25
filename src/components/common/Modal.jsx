import { useEffect } from 'react';

/**
 * Komponen modal dialog yang dapat digunakan kembali.
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
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
    >
      <div
        className={`rounded-2xl bg-white p-6 shadow-2xl transition-all dark:bg-slate-900 dark:border dark:border-slate-800 max-h-[90vh] overflow-y-auto ${className}`}
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

        <div className="space-y-4">{children}</div>

        {footer && (
          <div className="mt-4 flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}


import { useState, useCallback } from 'react';

/**
 * Custom hook untuk mengelola state loading, submission, dan error handling formulir.
 * @param {Function} asyncSubmitFn - Fungsi async yang dieksekusi saat form disubmit
 * @param {Object} [options]
 * @param {Function} [options.onSuccess] - Callback saat submit berhasil
 * @param {Function} [options.onError] - Callback saat terjadi error
 * @returns {{ isSubmitting: boolean, error: string|null, handleSubmit: Function, resetStatus: Function }}
 */
export default function useFormSubmit(asyncSubmitFn, { onSuccess, onError } = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const resetStatus = useCallback(() => {
    setIsSubmitting(false);
    setError(null);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      if (e?.preventDefault) {
        e.preventDefault();
      }
      setIsSubmitting(true);
      setError(null);
      try {
        const result = await asyncSubmitFn(e);
        if (result !== false) {
          onSuccess?.(result);
        }
        return result;
      } catch (err) {
        const message = err?.message || 'Terjadi kesalahan';
        setError(message);
        onError?.(err);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [asyncSubmitFn, onSuccess, onError]
  );

  return { isSubmitting, error, handleSubmit, resetStatus };
}


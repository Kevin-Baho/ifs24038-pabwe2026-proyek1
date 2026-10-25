import { useState, useEffect } from 'react';

/**
 * Custom hook untuk melakukan debounce terhadap suatu nilai.
 * @param {any} value - Nilai yang ingin di-debounce
 * @param {number} delay - Waktu jeda dalam milidetik (default: 300ms)
 * @returns {any} Nilai yang telah di-debounce
 */
export default function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}


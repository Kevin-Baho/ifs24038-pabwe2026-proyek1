import { useState, useCallback } from 'react';

/** Hook state input form: const [value, onChange, reset, setValue] = useInput('') */
export default function useInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const onChange = useCallback((e) => setValue(e?.target ? e.target.value : e), []);
  const reset = useCallback(() => setValue(initialValue), [initialValue]);
  return [value, onChange, reset, setValue];
}

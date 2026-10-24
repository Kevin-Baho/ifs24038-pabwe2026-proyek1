import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useInput from './useInput';

describe('useInput', () => {
  it('memakai nilai awal', () => {
    const { result } = renderHook(() => useInput('halo'));
    expect(result.current[0]).toBe('halo');
  });

  it('default nilai awal string kosong', () => {
    const { result } = renderHook(() => useInput());
    expect(result.current[0]).toBe('');
  });

  it('onChange menerima event', () => {
    const { result } = renderHook(() => useInput(''));
    act(() => result.current[1]({ target: { value: 'budi' } }));
    expect(result.current[0]).toBe('budi');
  });

  it('onChange menerima nilai langsung', () => {
    const { result } = renderHook(() => useInput(''));
    act(() => result.current[1]('langsung'));
    expect(result.current[0]).toBe('langsung');
  });

  it('reset mengembalikan nilai awal', () => {
    const { result } = renderHook(() => useInput('awal'));
    act(() => result.current[1]('ubah'));
    act(() => result.current[2]());
    expect(result.current[0]).toBe('awal');
  });

  it('setValue mengubah nilai', () => {
    const { result } = renderHook(() => useInput(''));
    act(() => result.current[3]('x'));
    expect(result.current[0]).toBe('x');
  });
});

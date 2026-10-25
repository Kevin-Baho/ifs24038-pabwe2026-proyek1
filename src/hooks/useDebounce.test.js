import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useDebounce from './useDebounce';

describe('useDebounce hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('mengembalikan nilai awal saat pertama kali dirender', () => {
    const { result } = renderHook(() => useDebounce('awal', 300));
    expect(result.current).toBe('awal');
  });

  it('tidak mengubah nilai sebelum delay berakhir', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 300), {
      initialProps: { val: 'awal' },
    });

    rerender({ val: 'berubah' });
    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(result.current).toBe('awal');
  });

  it('memperbarui nilai setelah delay terlewati', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 300), {
      initialProps: { val: 'awal' },
    });

    rerender({ val: 'berubah' });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('berubah');
  });

  it('membatalkan pembaruan sebelumnya jika nilai berubah cepat sebelum delay', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 300), {
      initialProps: { val: 'awal' },
    });

    rerender({ val: 'tengah' });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ val: 'akhir' });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Belum 300ms sejak 'akhir' di-set
    expect(result.current).toBe('awal');

    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Sekarang sudah 300ms sejak 'akhir'
    expect(result.current).toBe('akhir');
  });
});


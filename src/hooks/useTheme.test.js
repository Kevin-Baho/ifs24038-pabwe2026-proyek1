import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme, THEME_KEY } from './useTheme';

describe('useTheme hook', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('menggunakan default light ketika tidak ada di localStorage', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current[0]).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('dapat berpindah antara dark dan light mode', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current[1](); // toggle
    });

    expect(result.current[0]).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem(THEME_KEY)).toBe('dark');

    act(() => {
      result.current[1](); // toggle back
    });

    expect(result.current[0]).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem(THEME_KEY)).toBe('light');
  });

  it('mengambil tema yang tersimpan di localStorage', () => {
    localStorage.setItem(THEME_KEY, 'dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current[0]).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('menggunakan fallback tema dark ketika localStorage kosong dan matchMedia prefers-color-scheme dark bernilai true', () => {
    const originalMatchMedia = globalThis.matchMedia;
    globalThis.matchMedia = (query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });

    const { result } = renderHook(() => useTheme());
    expect(result.current[0]).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    globalThis.matchMedia = originalMatchMedia;
  });

  it('menggunakan fallback tema light ketika localStorage kosong dan matchMedia prefers-color-scheme dark bernilai false', () => {
    const originalMatchMedia = globalThis.matchMedia;
    globalThis.matchMedia = (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });

    const { result } = renderHook(() => useTheme());
    expect(result.current[0]).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    globalThis.matchMedia = originalMatchMedia;
  });
});


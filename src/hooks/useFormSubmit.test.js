import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useFormSubmit from './useFormSubmit';

describe('useFormSubmit', () => {
  it('menangani alur submit sukses', async () => {
    const mockAsync = vi.fn().mockResolvedValue('berhasil');
    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(() =>
      useFormSubmit(mockAsync, { onSuccess, onError })
    );

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBeNull();

    let res;
    await act(async () => {
      res = await result.current.handleSubmit();
    });

    expect(mockAsync).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith('berhasil');
    expect(onError).not.toHaveBeenCalled();
    expect(res).toBe('berhasil');
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('memanggil preventDefault jika event formulir diteruskan', async () => {
    const mockAsync = vi.fn().mockResolvedValue(true);
    const mockPreventDefault = vi.fn();
    const event = { preventDefault: mockPreventDefault };

    const { result } = renderHook(() => useFormSubmit(mockAsync));

    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(mockPreventDefault).toHaveBeenCalled();
  });

  it('tidak memanggil onSuccess jika fungsi async mengembalikan false', async () => {
    const mockAsync = vi.fn().mockResolvedValue(false);
    const onSuccess = vi.fn();

    const { result } = renderHook(() => useFormSubmit(mockAsync, { onSuccess }));

    let res;
    await act(async () => {
      res = await result.current.handleSubmit();
    });

    expect(res).toBe(false);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('menangani error ketika fungsi async melempar exception', async () => {
    const errorObj = new Error('Gagal memproses data');
    const mockAsync = vi.fn().mockRejectedValue(errorObj);
    const onError = vi.fn();

    const { result } = renderHook(() => useFormSubmit(mockAsync, { onError }));

    let res;
    await act(async () => {
      res = await result.current.handleSubmit();
    });

    expect(res).toBe(false);
    expect(onError).toHaveBeenCalledWith(errorObj);
    expect(result.current.error).toBe('Gagal memproses data');
    expect(result.current.isSubmitting).toBe(false);
  });

  it('menangani error tanpa properti message', async () => {
    const mockAsync = vi.fn().mockRejectedValue('error string');

    const { result } = renderHook(() => useFormSubmit(mockAsync));

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.error).toBe('Terjadi kesalahan');
  });

  it('dapat mereset status isSubmitting dan error dengan resetStatus', async () => {
    const mockAsync = vi.fn().mockRejectedValue(new Error('Ada kendala'));

    const { result } = renderHook(() => useFormSubmit(mockAsync));

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.error).toBe('Ada kendala');

    act(() => {
      result.current.resetStatus();
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBeNull();
  });
});


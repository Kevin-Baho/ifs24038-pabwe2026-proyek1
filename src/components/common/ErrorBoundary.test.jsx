import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropTypes from 'prop-types';
import ErrorBoundary from './ErrorBoundary';

function BuggyComponent({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('Simulated runtime error');
  }
  return <div>Komponen Normal</div>;
}

BuggyComponent.propTypes = {
  shouldThrow: PropTypes.bool,
};

describe('ErrorBoundary component', () => {
  const originalError = console.error;

  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('merender children secara normal jika tidak ada error', () => {
    render(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Komponen Normal')).toBeInTheDocument();
  });

  it('menampilkan default fallback UI saat terjadi runtime error', async () => {
    const handleError = vi.fn();

    const { rerender } = render(
      <ErrorBoundary onError={handleError}>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Terjadi Kesalahan Komponen')).toBeInTheDocument();
    expect(screen.getByText('Simulated runtime error')).toBeInTheDocument();
    expect(handleError).toHaveBeenCalled();

    // Klik tombol Coba Lagi untuk mereset
    rerender(
      <ErrorBoundary onError={handleError}>
        <BuggyComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Coba Lagi' }));
    expect(screen.getByText('Komponen Normal')).toBeInTheDocument();
  });

  it('menampilkan pesan fallback bawaan jika error tidak memiliki message', () => {
    function BrokenWithoutMessage() {
      throw new Error();
    }

    render(
      <ErrorBoundary>
        <BrokenWithoutMessage />
      </ErrorBoundary>
    );

    expect(screen.getByText('Gagal memuat komponen ini.')).toBeInTheDocument();
  });

  it('mendukung custom fallback node', () => {
    render(
      <ErrorBoundary fallback={<div>Custom Fallback UI</div>}>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Fallback UI')).toBeInTheDocument();
  });

  it('mendukung custom fallback fungsi dengan tombol reset', async () => {
    const { rerender } = render(
      <ErrorBoundary
        fallback={({ error, reset }) => (
          <div>
            <span>Error: {error.message}</span>
            <button onClick={reset}>Reset Kustom</button>
          </div>
        )}
      >
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error: Simulated runtime error')).toBeInTheDocument();

    rerender(
      <ErrorBoundary
        fallback={({ error, reset }) => (
          <div>
            <span>Error: {error.message}</span>
            <button onClick={reset}>Reset Kustom</button>
          </div>
        )}
      >
        <BuggyComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Reset Kustom' }));
    expect(screen.getByText('Komponen Normal')).toBeInTheDocument();
  });
});

import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorBoundary component untuk menangkap runtime error pada komponen anak
 * dan menampilkan fallback UI yang anggun tanpa merusak seluruh antarmuka aplikasi.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function'
          ? this.props.fallback({ error: this.state.error, reset: this.resetError })
          : this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="rounded-2xl border border-red-200/80 bg-red-50/80 p-5 text-red-900 shadow-xs dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200 space-y-3"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold">
              !
            </span>
            <h3 className="text-sm font-bold">Terjadi Kesalahan Komponen</h3>
          </div>
          <p className="text-xs text-red-700 dark:text-red-300">
            {this.state.error?.message || 'Gagal memuat komponen ini.'}
          </p>
          <button
            type="button"
            onClick={this.resetError}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onError: PropTypes.func,
};


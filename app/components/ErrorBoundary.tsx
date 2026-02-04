'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <div className="text-center">
            <div className="mb-3 text-3xl">⚠️</div>
            <h3 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
              Something went wrong
            </h3>
            <p className="mb-4 text-sm text-[var(--text-muted)]">
              This section failed to load.
            </p>
            <button
              onClick={() =>
                this.setState({ hasError: false, error: undefined })
              }
              className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-gray-900 transition-transform hover:scale-105 active:scale-95 dark:bg-yellow-300"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

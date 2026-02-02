'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-6 text-6xl">⚠️</div>
        <h1 className="mb-4 text-2xl font-bold text-gray-100">
          Something went wrong
        </h1>
        <p className="mb-6 text-gray-400">
          An unexpected error occurred. Please try again or contact support if
          the problem persists.
        </p>
        <button
          onClick={reset}
          className="rounded-full bg-yellow-300 px-6 py-3 font-semibold text-gray-900 transition-transform hover:scale-105"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

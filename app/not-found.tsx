import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-6 text-8xl font-bold text-yellow-500 dark:text-yellow-300">
          404
        </div>
        <h1 className="mb-4 text-2xl font-bold text-[var(--text-primary)]">
          Page Not Found
        </h1>
        <p className="mb-6 text-[var(--text-muted)]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block rounded-full bg-yellow-500 px-6 py-3 font-semibold text-gray-900 transition-transform hover:scale-105 active:scale-95 dark:bg-yellow-300"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

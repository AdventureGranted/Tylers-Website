import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="text-accent mb-6 text-8xl font-bold">404</div>
        <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-200">
          Page Not Found
        </h1>
        <p className="mb-6 text-gray-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="bg-accent-fill inline-block rounded-full px-6 py-3 font-semibold text-gray-900 transition-transform hover:scale-105 active:scale-95"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

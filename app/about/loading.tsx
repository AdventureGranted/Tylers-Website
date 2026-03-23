export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 h-10 w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="mx-auto h-5 w-96 max-w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-300 bg-white p-6 text-center shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mx-auto mb-2 h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mx-auto h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="mb-8 rounded-3xl border border-gray-300 bg-white p-8 shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-4 h-7 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ContactLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-12 md:py-20">
      <div className="w-full max-w-2xl md:max-w-4xl">
        <div className="mb-10 text-center md:mb-14">
          <div className="mx-auto mb-4 h-10 w-56 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="mx-auto mb-6 h-1 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="mx-auto h-5 w-96 max-w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 md:mb-10 md:gap-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-2xl border border-gray-300 bg-white p-6 shadow-md md:gap-6 md:rounded-3xl md:p-8 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-gray-200 md:h-16 md:w-16 dark:bg-gray-700" />
              <div className="flex-1">
                <div className="mb-2 h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-5 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
        <div className="mb-8 rounded-2xl border border-gray-300 bg-white p-6 shadow-md md:mb-10 md:rounded-3xl md:p-10 dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto mb-4 h-6 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="flex justify-center gap-4 md:gap-6">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-14 w-14 animate-pulse rounded-xl bg-gray-200 md:h-16 md:w-16 dark:bg-gray-700"
              />
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-md md:rounded-3xl md:p-10 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6 h-7 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-4">
            <div className="h-12 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="h-32 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="h-12 w-32 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

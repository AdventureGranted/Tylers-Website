export default function Loading() {
  return (
    <div className="relative min-h-screen">
      <main className="mx-6 pt-4 pb-16 lg:mx-25">
        {/* ProfileCard skeleton */}
        <div className="relative mx-auto mt-4 overflow-hidden rounded-3xl border border-gray-300 bg-white p-8 shadow-md xl:min-h-[280px] xl:py-12 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col items-center xl:flex-row xl:items-start xl:gap-8">
            <div className="mx-auto mb-6 h-40 w-48 animate-pulse rounded-3xl bg-gray-200 xl:mb-0 xl:h-[200px] xl:w-[200px] xl:shrink-0 dark:bg-gray-700" />
            <div className="flex w-full flex-col items-center text-center">
              <div className="mb-4 h-10 w-3/4 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="mb-2 h-5 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mb-6 h-5 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="flex gap-3">
                <div className="h-10 w-28 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div className="h-10 w-28 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        </div>

        {/* TechnicalSkills skeleton */}
        <div className="mt-8 rounded-3xl border border-gray-300 bg-white p-8 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6 h-8 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="mb-3 h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="flex flex-wrap gap-2">
                  {[...Array(5)].map((_, j) => (
                    <div
                      key={j}
                      className="h-8 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WorkExperience skeleton */}
        <div className="mt-8 rounded-3xl border border-gray-300 bg-white p-8 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6 h-8 w-56 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-2xl border border-gray-200 p-6 dark:border-gray-700"
              >
                <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1">
                  <div className="mb-2 h-6 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="mb-1 h-4 w-1/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="mt-3 space-y-2">
                    <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-3 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

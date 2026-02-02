export default function HobbiesLoading() {
  return (
    <div className="min-h-screen bg-gray-900 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header skeleton */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-10 w-48 animate-pulse rounded-lg bg-gray-800" />
          <div className="mx-auto h-6 w-96 animate-pulse rounded-lg bg-gray-800" />
        </div>

        {/* Grid skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl bg-gray-800 shadow-xl"
            >
              <div className="aspect-video animate-pulse bg-gray-700" />
              <div className="p-4">
                <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-700" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-700" />
                <div className="mt-1 h-4 w-2/3 animate-pulse rounded bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-gray-900 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header skeleton */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 h-10 w-48 animate-pulse rounded-lg bg-gray-800" />
          <div className="mx-auto h-6 w-80 animate-pulse rounded-lg bg-gray-800" />
        </div>

        {/* Projects grid skeleton */}
        <div className="grid gap-8 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl bg-gray-800 shadow-xl"
            >
              <div className="aspect-video animate-pulse bg-gray-700" />
              <div className="p-6">
                <div className="mb-2 h-7 w-3/4 animate-pulse rounded bg-gray-700" />
                <div className="mb-4 space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-700" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-gray-700" />
                </div>
                <div className="flex gap-2">
                  {[...Array(3)].map((_, j) => (
                    <div
                      key={j}
                      className="h-6 w-16 animate-pulse rounded-full bg-gray-700"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

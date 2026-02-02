export default function HobbyDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-900 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Back link skeleton */}
        <div className="mb-6 h-5 w-32 animate-pulse rounded bg-gray-800" />

        <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
          {/* Main content */}
          <div className="mx-auto max-w-4xl xl:flex-1">
            {/* Title skeleton */}
            <div className="mb-4 h-10 w-3/4 animate-pulse rounded-lg bg-gray-800" />

            {/* Description skeleton */}
            <div className="mb-6 space-y-2">
              <div className="h-6 w-full animate-pulse rounded bg-gray-800" />
              <div className="h-6 w-2/3 animate-pulse rounded bg-gray-800" />
            </div>

            {/* Image skeleton */}
            <div className="mb-8 rounded-2xl bg-gray-800 p-4">
              <div className="mb-3 h-5 w-32 animate-pulse rounded bg-gray-700" />
              <div className="aspect-video animate-pulse rounded-lg bg-gray-700" />
            </div>

            {/* Content skeleton */}
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-5 animate-pulse rounded bg-gray-800"
                  style={{ width: `${85 + Math.random() * 15}%` }}
                />
              ))}
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="hidden w-96 shrink-0 xl:block">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-gray-800 p-4">
                  <div className="mb-3 h-5 w-24 animate-pulse rounded bg-gray-700" />
                  <div className="h-16 animate-pulse rounded bg-gray-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

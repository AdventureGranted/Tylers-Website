export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-yellow-300" />
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--card-border)] border-t-yellow-500 dark:border-t-yellow-300" />
        <p className="text-[var(--text-muted)]">Loading...</p>
      </div>
    </div>
  );
}

export default function StudioLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-bg text-text-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-purple border-t-brand-cyan" />
        <p className="font-mono text-sm text-text-muted">Loading Sanity Studio...</p>
      </div>
    </div>
  );
}

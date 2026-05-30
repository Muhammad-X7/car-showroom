// src/app/loading.jsx
// Shown by Next.js App Router while the page chunk is loading
// Matches the home page grid skeleton for a seamless experience

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg)] px-6 md:px-10 py-8">
      {/* Header placeholder */}
      <div className="h-16 skeleton rounded-xl mb-8" />
      {/* Filter bar placeholder */}
      <div className="h-32 skeleton rounded-2xl mb-8" />
      {/* Grid skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden bg-[var(--bg-card)]
            border border-[var(--border)]">
            <div className="skeleton" style={{ aspectRatio: "4/3" }} />
            <div className="p-4 flex flex-col gap-3">
              <div className="skeleton h-5 rounded-md w-3/4" />
              <div className="skeleton h-6 rounded-md w-1/2" />
              <div className="flex gap-2">
                <div className="skeleton h-6 rounded-md w-14" />
                <div className="skeleton h-6 rounded-md w-18" />
              </div>
              <div className="skeleton h-4 rounded-md w-1/3 mt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
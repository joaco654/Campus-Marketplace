export default function MarketplaceLoading() {
  const skeletonCards = Array.from({ length: 6 })

  return (
    <div className="min-h-screen bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page heading skeleton */}
        <div className="mb-8 space-y-4">
          <div className="h-8 w-56 rounded-full bg-slate-800/80 loading-shimmer animate-shimmer-slow" />
          <div className="h-4 w-80 rounded-full bg-slate-800/60" />
        </div>

        {/* Filters skeleton */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 h-11 rounded-lg bg-slate-800/70 loading-shimmer animate-shimmer-slow" />
            <div className="w-32 h-11 rounded-lg bg-slate-800/70" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-10 rounded-lg bg-slate-900/60" />
            <div className="h-10 rounded-lg bg-slate-900/60" />
            <div className="h-10 rounded-lg bg-slate-900/60" />
          </div>
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skeletonCards.map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 shadow-lg"
            >
              <div className="space-y-3 mb-4">
                <div className="h-5 w-3/4 rounded-md bg-slate-800/90 loading-shimmer animate-shimmer-slow" />
                <div className="h-4 w-1/2 rounded-md bg-slate-800/70" />
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-4 w-full rounded-md bg-slate-800/50" />
                <div className="h-4 w-5/6 rounded-md bg-slate-800/40" />
                <div className="h-4 w-3/4 rounded-md bg-slate-800/30" />
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="h-7 w-24 rounded-full bg-slate-800/80" />
                <div className="h-7 w-16 rounded-full bg-slate-800/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


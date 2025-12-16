import { Sparkles } from 'lucide-react'

export default function AppLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="relative w-full max-w-md rounded-3xl glass-panel card-shadow-soft px-8 py-10 overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -right-10 h-56 w-56 rounded-full bg-primary-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-emerald-400/25 blur-3xl" />

        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-slate-900/80 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-sky-300 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300/80">
              Campus Marketplace
            </p>
            <p className="text-2xl font-semibold text-white">
              Getting things ready for you…
            </p>
            <p className="text-sm text-slate-300/80">
              Loading your personalized campus experience.
            </p>
          </div>

          <div className="w-full space-y-3 mt-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/80">
              <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-400 loading-shimmer animate-shimmer-slow" />
            </div>
            <p className="text-xs text-slate-400 text-center">
              Tip: You can earn money, get help, and grow your network all in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


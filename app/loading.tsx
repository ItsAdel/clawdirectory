export default function Loading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-8">
          {/* Hero skeleton */}
          <div className="text-center mb-12">
            <div className="h-12 bg-white/10 rounded-lg w-2/3 mx-auto mb-4"></div>
            <div className="h-6 bg-white/5 rounded-lg w-1/2 mx-auto"></div>
          </div>

          {/* Filters skeleton */}
          <div className="flex gap-4 mb-8">
            <div className="h-11 bg-white/10 rounded-lg flex-1"></div>
            <div className="h-11 bg-white/10 rounded-lg w-48"></div>
            <div className="h-11 bg-white/10 rounded-lg w-48"></div>
          </div>

          {/* Table skeleton */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-white/5 rounded-lg border border-white/10"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

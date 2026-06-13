// Shown instantly on navigation to /apartments while the server runs the
// (dynamic, searchParams-driven) Prisma query. Structure mirrors
// ApartmentsPageClient so the real page swaps in with no layout shift.
export default function ApartmentsLoading() {
  return (
    <div dir="rtl" className="bg-warm">
      {/* SecondaryHero band — keeps the 70px fixed-header offset */}
      <div className="relative w-full min-h-[30vh] md:min-h-[40vh] pt-[70px] bg-black/10 animate-pulse" />

      <div className="min-h-screen bg-warm pt-16 pb-32">
        <div className="mx-auto px-6">
          {/* Category pills */}
          <div className="flex justify-center gap-3 mb-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 w-28 rounded-2xl bg-black/5 animate-pulse" />
            ))}
          </div>

          {/* Filters + sort bar */}
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
            <div className="h-12 w-40 rounded-2xl bg-black/5 animate-pulse" />
            <div className="h-12 w-44 rounded-2xl bg-black/5 animate-pulse" />
          </div>

          {/* Card grid — identical columns/gap to the live grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:pl-20">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm"
              >
                <div className="aspect-[4/3] w-full bg-black/5 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-3/4 bg-black/5 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-black/5 rounded animate-pulse" />
                  <div className="flex gap-3 pt-1">
                    <div className="h-4 w-12 bg-black/5 rounded animate-pulse" />
                    <div className="h-4 w-12 bg-black/5 rounded animate-pulse" />
                    <div className="h-4 w-12 bg-black/5 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

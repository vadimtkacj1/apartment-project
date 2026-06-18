// Shown on the cold path for /apartments/[id]: when an id isn't in the
// prerendered manifest (new listing) or its ISR cache expired, the server
// blocks on getFullProperty before first paint. Warm/cached ids paint
// instantly and this barely flashes. Structure mirrors ApartmentDetailClient.
export default function ApartmentDetailLoading() {
  return (
    <div dir="rtl" className="min-h-screen bg-warm pt-24 pb-16">
      <div className="w-full">
        {/* Share / back-to-listing bar */}
        <div className="w-full px-6 lg:px-12 flex justify-between items-center mb-6">
          <div className="h-10 w-28 rounded-lg bg-black/5 animate-pulse" />
          <div className="h-10 w-36 rounded-lg bg-black/5 animate-pulse" />
        </div>

        {/* Title */}
        <div className="w-full px-6 lg:px-12 mb-6">
          <div className="h-8 w-2/3 md:w-1/2 bg-black/5 rounded animate-pulse" />
        </div>

        <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:px-12">
          {/* Main column: gallery + details */}
          <div className="lg:col-span-2">
            <div className="-mx-6 lg:mx-0">
              <div className="aspect-[16/10] w-full rounded-2xl bg-black/5 animate-pulse" />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3 px-6 lg:px-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-black/5 animate-pulse" />
              ))}
            </div>

            <div className="px-6 lg:px-0">
              {/* Specs row */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-black/5 animate-pulse" />
                ))}
              </div>

              {/* Description lines */}
              <div className="mt-8 space-y-2">
                <div className="h-4 w-full bg-black/5 rounded animate-pulse" />
                <div className="h-4 w-full bg-black/5 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-black/5 rounded animate-pulse" />
              </div>

              {/* Map placeholder — mirrors PropertyMap's own dynamic fallback */}
              <div className="mt-8 h-[450px] rounded-2xl bg-black/5 animate-pulse" />
            </div>
          </div>

          {/* Sidebar: price + contact (left side in RTL) */}
          <div className="lg:col-span-1 px-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
              <div className="h-8 w-40 bg-black/5 rounded animate-pulse" />
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-black/5 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-black/5 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-black/5 rounded animate-pulse" />
                </div>
              </div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 rounded-xl bg-black/5 animate-pulse" />
              ))}
              <div className="h-12 rounded-xl bg-black/10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

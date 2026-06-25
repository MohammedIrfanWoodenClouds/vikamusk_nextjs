export default function Loading() {
  return (
    <div className="overflow-hidden">
      {/* Navbar spacer */}
      <div className="h-24 lg:h-32 w-full bg-white" />

      {/* ── Breadcrumb Skeleton ── */}
      <div className="bg-white border-b border-gray-200 relative z-30">
        <div className="container-custom py-4">
          <div className="w-64 h-3 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>

      {/* ── Hero Skeleton ── */}
      <section className="bg-white pt-8 pb-16 lg:pt-12 lg:pb-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 xl:gap-16 items-start">
            
            {/* LEFT: Image Gallery Skeleton */}
            <div className="lg:sticky top-[120px] animate-pulse">
              <div 
                className="w-full aspect-square rounded-2xl bg-gray-100"
                style={{ border: '1px solid #e2e8f0' }}
              />
              <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1 pr-1">
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0 border-2 border-amber-500/20" />
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0" />
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0" />
              </div>
            </div>

            {/* RIGHT: Product Info Skeleton */}
            <div className="px-12 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-32 h-3 bg-gray-200 rounded-full" />
                <div className="w-24 h-6 bg-gray-100 rounded-full" />
              </div>

              <div className="w-3/4 h-10 bg-gray-200 rounded-xl mb-6" />
              <div className="w-full h-16 bg-gray-100 rounded-xl mb-6 border-l-4 border-amber-500/20" />

              <div className="grid grid-cols-2 gap-2.5 mb-6">
                <div className="h-16 bg-gray-50 rounded-xl border border-gray-100" />
                <div className="h-16 bg-gray-50 rounded-xl border border-gray-100" />
                <div className="h-16 bg-gray-50 rounded-xl border border-gray-100" />
                <div className="h-16 bg-gray-50 rounded-xl border border-gray-100" />
              </div>

              {/* Tab Navigation Skeleton */}
              <div className="h-14 bg-gray-100 rounded-full mb-8 mt-6" />

              {/* Tab Content Skeleton */}
              <div className="h-32 bg-gray-50 rounded-xl mb-12" />

              {/* CTA Skeleton */}
              <div className="h-64 bg-gray-50 rounded-3xl border border-gray-100" />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

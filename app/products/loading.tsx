import { Search, SlidersHorizontal, Package, ArrowUpDown, ChevronDown, Grid3X3, List } from 'lucide-react';

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 bg-gray-100 rounded-full" />
        <div className="h-5 w-3/4 bg-gray-100 rounded-full" />
        <div className="h-3 w-full bg-gray-100 rounded-full" />
        <div className="h-3 w-2/3 bg-gray-100 rounded-full" />
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-20 bg-gray-100 rounded-full" />
          <div className="h-5 w-24 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <>
      {/* ─── Hero Skeleton ─── */}
      <section 
        className="relative pb-24 lg:pb-32 bg-primary overflow-hidden"
        style={{ paddingTop: '160px' }}
      >
        <div className="absolute inset-0 bg-primary/90" />
        
        <div className="container-custom relative z-10 flex flex-col items-center text-center animate-pulse">
          <div className="w-64 h-6 bg-white/10 rounded-full mb-6" />
          <div className="w-80 h-12 sm:h-16 bg-white/10 rounded-xl mb-5" />
          <div className="w-full max-w-2xl h-12 bg-white/10 rounded-xl mb-4" />
          
          <div 
            className="relative w-full max-w-2xl mx-auto mt-4 mb-8"
          >
            <div className="w-full h-16 bg-white/10 rounded-[2rem]" />
          </div>
        </div>
      </section>

      {/* ─── Main Content Skeleton ─── */}
      <section className="bg-surface min-h-screen" style={{ paddingBottom: '3rem' }}>
        <div className="container-custom py-10 lg:py-14">

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-4 mb-8 animate-pulse">
            <div className="relative z-30" style={{ margin: '0.75rem' }}>
              <div className="w-48 h-11 bg-white border-2 border-border/60 rounded-xl" />
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <div className="w-40 h-11 bg-white border-2 border-border/60 rounded-xl" />
              <div className="w-24 h-11 bg-white rounded-xl border-2 border-border/60" />
            </div>
          </div>

          <div className="w-32 h-5 bg-gray-200 rounded-full mb-8 animate-pulse" />

          {/* Product Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

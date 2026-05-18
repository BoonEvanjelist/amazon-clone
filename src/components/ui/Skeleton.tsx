"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`skeleton rounded-xl ${className}`}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-1 pt-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-3 w-3 rounded-full" />
          ))}
          <Skeleton className="h-3 w-16 ml-2" />
        </div>
        <Skeleton className="h-6 w-28 mt-1" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="section py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image area */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex gap-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-xl" />
            ))}
          </div>
        </div>
        {/* Info area */}
        <div className="space-y-5 pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="space-y-3 pt-4">
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-14 w-full rounded-2xl" />
            <div className="flex gap-3">
              <Skeleton className="h-12 flex-1 rounded-2xl" />
              <Skeleton className="h-12 w-24 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductsPageSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

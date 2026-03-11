import { Skeleton } from "@/components/ui/skeleton";

const SearchCardSkeleton = () => (
  <div className="bg-card rounded-2xl border overflow-hidden animate-in fade-in duration-300">
    <div className="flex flex-col sm:flex-row">
      {/* Photo skeleton */}
      <Skeleton className="h-52 sm:h-44 sm:w-48 md:w-56 flex-shrink-0" />
      {/* Content */}
      <div className="flex-1 p-3.5 sm:p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3.5 w-1/2" />
          </div>
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <div className="flex items-end justify-between pt-1">
          <div className="space-y-1">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

export const SearchCardSkeletonList = ({ count = 4 }: { count?: number }) => (
  <div className="space-y-2.5 sm:space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <SearchCardSkeleton key={i} />
    ))}
  </div>
);

export default SearchCardSkeleton;

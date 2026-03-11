import { Skeleton } from "@/components/ui/skeleton";

const SpaceDetailsSkeleton = () => (
  <div className="min-h-screen bg-background">
    {/* Header */}
    <div className="bg-card border-b">
      <div className="container py-3 flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-md" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3.5 w-32" />
        </div>
      </div>
    </div>

    {/* Steps bar */}
    <div className="bg-card/80 border-b">
      <div className="container py-2.5 flex items-center justify-center gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-5 w-20 rounded-full" />
        ))}
      </div>
    </div>

    {/* Photo gallery skeleton */}
    <Skeleton className="w-full h-64 sm:h-80 lg:h-96" />

    {/* Content */}
    <div className="container py-5 space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>

      {/* Stats row */}
      <div className="flex gap-4">
        <Skeleton className="h-16 w-28 rounded-xl" />
        <Skeleton className="h-16 w-28 rounded-xl" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Features */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-48" />
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-5 w-32" />
          ))}
        </div>
      </div>

      {/* Owner */}
      <div className="flex items-center gap-3 pt-2">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3.5 w-20" />
        </div>
      </div>
    </div>

    {/* Sticky CTA */}
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>
    </div>
  </div>
);

export default SpaceDetailsSkeleton;

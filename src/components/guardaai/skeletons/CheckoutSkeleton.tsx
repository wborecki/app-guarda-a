import { Skeleton } from "@/components/ui/skeleton";

const CheckoutSkeleton = () => (
  <div className="min-h-screen bg-background">
    {/* Header */}
    <div className="bg-card border-b">
      <div className="container py-3 flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-5 w-36" />
        <div className="ml-auto flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-7 w-7 rounded-full" />
          ))}
        </div>
      </div>
    </div>

    <div className="container py-5 lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">
      {/* Main content */}
      <div className="space-y-5">
        {/* Auth section */}
        <div className="bg-card rounded-2xl border p-5 space-y-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Photo upload */}
        <div className="bg-card rounded-2xl border p-5 space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>

      {/* Summary sidebar */}
      <div className="mt-5 lg:mt-0">
        <div className="bg-card rounded-2xl border p-5 space-y-4">
          <Skeleton className="h-5 w-36" />
          <div className="flex gap-3">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3.5 w-1/2" />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CheckoutSkeleton;

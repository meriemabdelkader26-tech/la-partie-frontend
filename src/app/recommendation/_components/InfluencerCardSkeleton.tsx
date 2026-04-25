import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const InfluencerCardSkeleton = () => {
  return (
    <Card className="p-0 gap-0 bg-zinc-950 border border-zinc-900 overflow-hidden rounded-[2.5rem] h-full flex flex-col animate-pulse">
      {/* Image Section Skeleton */}
      <div className="relative h-64 bg-zinc-900" />

      {/* Content Section Skeleton */}
      <div className="p-8 lg:p-10 flex-1 flex flex-col bg-zinc-950 relative z-10">
        <div className="mb-8 bg-zinc-950 rounded-t-xl">
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-col gap-2 w-3/5">
              <Skeleton className="h-8 w-full rounded-lg bg-zinc-800" />
              <Skeleton className="h-4 w-2/3 rounded-lg bg-zinc-800" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full bg-zinc-800" />
          </div>
          
          <div className="flex gap-2">
            <Skeleton className="h-5 w-24 rounded-lg bg-zinc-800" />
            <Skeleton className="h-5 w-20 rounded-lg bg-zinc-800" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
            <Skeleton className="h-3 w-16 mb-2 rounded-full bg-zinc-800" />
            <Skeleton className="h-8 w-24 rounded-lg bg-zinc-800" />
          </div>
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
            <Skeleton className="h-3 w-16 mb-2 rounded-full bg-zinc-800" />
            <Skeleton className="h-8 w-24 rounded-lg bg-zinc-800" />
          </div>
        </div>

        {/* Action Button Skeleton */}
        <div className="mt-auto">
          <Skeleton className="w-full h-16 rounded-full bg-zinc-800" />
        </div>
      </div>
    </Card>
  );
};

export default InfluencerCardSkeleton;

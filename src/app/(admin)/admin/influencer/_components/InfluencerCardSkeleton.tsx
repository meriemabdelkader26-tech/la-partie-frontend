import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const InfluencerCardSkeleton = () => {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50 overflow-hidden backdrop-blur-sm">
      <div className="relative h-60 bg-slate-700 overflow-hidden">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="absolute top-3 right-3">
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>

      <div className="p-6">
        <Skeleton className="h-5 w-2/3 mb-2" />
        <Skeleton className="h-3 w-1/3 mb-4" />
        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-slate-700/50">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 flex-1 rounded-lg" />
        </div>
      </div>
    </Card>
  );
};

export default InfluencerCardSkeleton;
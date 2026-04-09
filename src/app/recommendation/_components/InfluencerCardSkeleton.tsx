import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const InfluencerCardSkeleton = () => {
  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden">
      <div className="bg-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-5 w-12" />
        </div>

        <div className="text-right space-y-1">
          <Skeleton className="h-3 w-16 ml-auto" />
          <Skeleton className="h-4 w-12 ml-auto" />
        </div>
      </div>

      <div className="p-6">
        <Skeleton className="h-7 w-3/4 mb-3" />
        <Skeleton className="h-6 w-24 rounded-full mb-4" />
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-14" />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InfluencerCardSkeleton;

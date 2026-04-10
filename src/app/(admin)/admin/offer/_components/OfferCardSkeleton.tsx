import { Skeleton } from "@/components/ui/skeleton";

const OfferCardSkeleton = () => {
  return (
    <div className="bg-slate-800/50 border-slate-700/50 p-6 backdrop-blur-sm rounded-2xl">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-4 w-6 rounded" />
      </div>
      <Skeleton className="h-7 w-3/4 mb-3" />
      <Skeleton className="h-3 w-16 mb-2" />
      <Skeleton className="h-4 w-full mb-4" />
      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-700/50">
        <div>
          <Skeleton className="h-3 w-24 mb-1" />
          <Skeleton className="h-7 w-8" />
        </div>
        <div>
          <Skeleton className="h-3 w-20 mb-1" />
          <Skeleton className="h-5 w-28" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="text-right">
          <Skeleton className="h-3 w-16 mb-1 ml-auto" />
          <Skeleton className="h-4 w-12 ml-auto" />
        </div>
      </div>
    </div>
  );
};

export default OfferCardSkeleton;
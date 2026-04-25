import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const InfluencerCardSkeleton = () => {
  return (
    <Card className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm flex flex-col h-full">
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="absolute top-4 right-4">
          <Skeleton className="h-7 w-20 rounded-xl" />
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <div className="mt-2">
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6 p-3 bg-gray-50 rounded-2xl border border-gray-100/50">
          <div className="flex flex-col items-center">
            <Skeleton className="h-2 w-10 mb-1" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex flex-col items-center border-x border-gray-200">
            <Skeleton className="h-2 w-10 mb-1" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex flex-col items-center">
            <Skeleton className="h-2 w-10 mb-1" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 flex-1 rounded-xl" />
        </div>
      </div>
    </Card>
  );
};

export default InfluencerCardSkeleton;
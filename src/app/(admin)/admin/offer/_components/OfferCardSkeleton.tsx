import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const OfferCardSkeleton = () => {
  return (
    <Card className="bg-white border border-gray-100 rounded-[28px] overflow-hidden shadow-sm flex flex-col h-full">
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-5">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-6 rounded" />
        </div>

        <div className="mb-5">
          <Skeleton className="h-7 w-3/4 mb-2" />
          <Skeleton className="h-3 w-20" />
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-6 w-10" />
            </div>
            <div className="flex flex-col">
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </div>

        <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex flex-col">
              <Skeleton className="h-2 w-10 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </div>
    </Card>
  );
};

export default OfferCardSkeleton;
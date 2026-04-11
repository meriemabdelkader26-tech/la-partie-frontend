import { CarouselItem } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

const HomeTrendingInfluencerCardSkeleton = () => {
  return (
    <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
      <div className="bg-linear-to-br from-pastel-blue to-pastel-dark-blue rounded-lg overflow-hidden border border-pastel-blue">
        {" "}
        <div className="relative h-40 bg-pastel-blue flex flex-col items-center justify-center gap-2">
          <Skeleton className="h-16 w-16 rounded-md" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="p-6">
          <Skeleton className="h-6 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/3 mb-4" />
          <div className="space-y-3 bg-pastel-blue/30 rounded-lg p-4">
            <div>
              <Skeleton className="h-3 w-24 mb-2" />
              <Skeleton className="h-8 w-32" />
            </div>

            <div className="flex gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CarouselItem>
  );
};

export default HomeTrendingInfluencerCardSkeleton;
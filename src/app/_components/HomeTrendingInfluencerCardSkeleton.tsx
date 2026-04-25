import { CarouselItem } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

const HomeTrendingInfluencerCardSkeleton = () => {
  return (
    <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
      <div className="h-full bg-[#0F172A] rounded-[2rem] overflow-hidden border border-slate-800 flex flex-col">
        {/* Profile Image Section Skeleton */}
        <Skeleton className="relative h-64 w-full bg-slate-800 rounded-none" />

        {/* Content Section Skeleton */}
        <div className="p-7 flex-1 flex flex-col -mt-12 relative z-10">
          <div className="mb-6 bg-[#0F172A] pt-4 rounded-t-xl">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-6 w-3/4 rounded-lg bg-slate-800" />
              <Skeleton className="h-4 w-4 rounded-full bg-slate-800" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20 rounded bg-slate-800" />
            </div>
          </div>

          {/* Stats Bar Skeleton */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <Skeleton className="h-2 w-12 mb-2 rounded-full bg-slate-800" />
              <Skeleton className="h-8 w-20 rounded-lg bg-slate-800" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <Skeleton className="h-2 w-12 mb-2 rounded-full bg-slate-800" />
              <Skeleton className="h-8 w-16 rounded-lg bg-slate-800" />
            </div>
          </div>

          {/* Category Tag Skeleton */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800">
            <Skeleton className="h-4 w-20 rounded bg-slate-800" />
            <Skeleton className="h-8 w-24 rounded-full bg-slate-800" />
          </div>
        </div>
      </div>
    </CarouselItem>
  );
};

export default HomeTrendingInfluencerCardSkeleton;

import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import HomeTrendingInfluencerCard from "./HomeTrendingInfluencerCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_RECOMMENDATION } from "@/config";
import { TInfluencer } from "./types";
import HomeTrendingInfluencerCardSkeleton from "./HomeTrendingInfluencerCardSkeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const HomeTrendingInfluencer = () => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const router = useRouter();

  const { isFetching, data } = useQuery<DataType>({
    queryKey: ["trendingInfluencers"],
    queryFn: () => axios.get(NEXT_PUBLIC_BASE_URL + NEXT_PUBLIC_RECOMMENDATION),
  });

  return (
    <section className="py-20 px-4 border-t border-rose-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-4">
          Trending Influencers
        </h2>
        <p className="text-center text-rose-500 mb-16 text-lg">
          Discover top creators in various categories
        </p>
        <Carousel
          plugins={[plugin.current]}
          onMouseEnter={() => plugin.current.stop()}
          onMouseLeave={() => plugin.current.play()}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {isFetching
              ? Array.from({ length: 6 }).map((_, index) => (
                  <HomeTrendingInfluencerCardSkeleton key={index} />
                ))
              : data?.data.recommendations.map((influencer) => (
                  <HomeTrendingInfluencerCard
                    key={influencer.rank}
                    influencer={influencer}
                  />
                ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>
      <div className="flex items-center justify-center mt-10">
        <Button
          className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 disabled:bg-pink-500/50 w-full lg:w-1/4"
          onClick={() => router.push("/recommendation")}
        >
          Load More
        </Button>
      </div>
    </section>
  );
};

export default HomeTrendingInfluencer;

export type DataType = {
  data: {
    recommendations: Array<TInfluencer>;
  };
};

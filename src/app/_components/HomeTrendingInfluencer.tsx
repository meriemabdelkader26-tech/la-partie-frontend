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
import { NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_TRENDING } from "@/config";
import { TInfluencer } from "./types";
import HomeTrendingInfluencerCardSkeleton from "./HomeTrendingInfluencerCardSkeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const HomeTrendingInfluencer = () => {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  const router = useRouter();

  const { isFetching, data } = useQuery<DataType>({
    queryKey: ["trendingInfluencers"],
    queryFn: () => axios.get(NEXT_PUBLIC_BASE_URL + NEXT_PUBLIC_TRENDING),
  });

  return (
    <section className="py-32 px-4 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fadeInUp">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-slate-900 text-sm font-bold mb-6 border border-slate-200">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-900"></span>
            </span>
            Live Updates
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-[#0F172A] mb-6 tracking-tighter">
            Trending Influencers
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Discover top creators in various categories and connect with the perfect match.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative group px-4">
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
                ? Array.from({ length: 4 }).map((_, index) => (
                    <HomeTrendingInfluencerCardSkeleton key={index} />
                  ))
                : data?.data.recommendations?.map((influencer, index) => (
                    <HomeTrendingInfluencerCard
                      key={influencer.username || index.toString()}
                      influencer={influencer}
                    />
                  ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="left-[-20px] bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-xl h-12 w-12" />
              <CarouselNext className="right-[-20px] bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-xl h-12 w-12" />
            </div>
          </Carousel>
        </div>

        {/* Load More Button */}
        <div className="flex items-center justify-center mt-16 animate-fadeInUp delay-300">
          <Button
            className="bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold px-12 py-7 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3"
            onClick={() => router.push("/recommendation")}
          >
            Explore Global Rankings
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Button>
        </div>
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

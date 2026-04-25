"use client";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import Sidebar from "./_components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { TInfluencer } from "../_components/types";
import axios from "axios";
import { NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_TRENDING } from "@/config";
import InfluencerCard from "./_components/InfluencerCard";
import InfluencerCardSkeleton from "./_components/InfluencerCardSkeleton";

export default function RecommendationsContent() {
  const [recommendationNumber, setRecommendationNumber] = useQueryState(
    "recommendation_number",
    parseAsInteger.withDefault(12)
  );

  const [category, setCategory] = useQueryState(
    "category",
    parseAsString.withDefault("Unknown")
  );
  const [country, setCountry] = useQueryState(
    "country",
    parseAsString.withDefault("USA")
  );

  const { isFetching, data } = useQuery<DataType>({
    queryKey: ["trending-data", category, country, recommendationNumber],
    queryFn: () =>
      axios.get(
        NEXT_PUBLIC_BASE_URL +
          `api/trending/?category=${category}&country=${country}&n=${recommendationNumber}`
      ),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Keep in garbage collection for 24 hours
  });

  const { isFetching: isLoading, data: stats } = useQuery<StatDataType>({
    queryKey: ["stats-data"],
    queryFn: () => axios.get(NEXT_PUBLIC_BASE_URL + "api/stats"),
    staleTime: 1000 * 60 * 60 * 24, // Stats rarely change, cache for 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });

  const categories = stats?.data.categories || [];
  const countries = stats?.data.countries || [];
  const totalInfluencers = stats?.data.total_influencers || 0;
  const recommendations = data?.data.recommendations || [];

  return (
    <main className="min-h-screen bg-black flex">
      <Sidebar
        totalInfluencers={totalInfluencers}
        numRecommendations={recommendations.length}
        categories={categories}
        countries={countries}
        category={category}
        country={country}
        setRecommendationNumber={setRecommendationNumber}
        setCategory={setCategory}
        setCountry={setCountry}
      />

      <div className="flex-1 ml-80">
        <div className="px-12 py-16">
          {/* Page Header */}
          <div className="mb-16 animate-fadeInUp">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-12 bg-white rounded-full"></div>
              <span className="text-slate-300 font-black text-xs uppercase tracking-[0.3em]">Discovery Engine</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Global <span className="text-slate-400">Trends</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl leading-relaxed font-medium">
              Real-time directory of the world&apos;s most impactful digital creators. 
              Analyze performance metrics and find your next brand partnership.
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 bg-zinc-950 rounded-[3rem] border border-zinc-900 shadow-sm">
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-white text-2xl font-black tracking-tight">Syncing Database...</p>
              <p className="text-slate-400 font-medium mt-2">Fetching global creator metrics</p>
            </div>
          ) : isFetching ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-10">
              {Array.from({ length: 6 }).map((_, index) => (
                <InfluencerCardSkeleton key={index} />
              ))}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-32 bg-zinc-950 rounded-[3rem] border border-dashed border-zinc-900 animate-fadeInUp">
              <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-white text-2xl font-black tracking-tight mb-2">No creators found</p>
              <p className="text-slate-400 font-medium">Try broadening your category or country filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-10">
              {recommendations.map((rec, idx) => (
                <div key={rec.id || idx} className="animate-fadeInUp" style={{ animationDelay: `${idx * 100}ms` }}>
                  <InfluencerCard recommendation={rec} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export type DataType = {
  data: {
    recommendations: Array<TInfluencer>;
  };
};

export type StatDataType = {
  data: {
    total_influencers: number;
    categories: Array<string>;
    countries: Array<string>;
  };
};

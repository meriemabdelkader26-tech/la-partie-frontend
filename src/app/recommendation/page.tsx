"use client";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import Sidebar from "./_components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { TInfluencer } from "../_components/types";
import axios from "axios";
import { NEXT_PUBLIC_BASE_URL } from "@/config";
import InfluencerCard from "./_components/InfluencerCard";
import InfluencerCardSkeleton from "./_components/InfluencerCardSkeleton";

export default function RecommendationsContent() {
  const [recommendationNumber, setRecommendationNumber] = useQueryState(
    "recommendation_number",
    parseAsInteger.withDefault(5)
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
    queryKey: ["recommendations-data", category, country, recommendationNumber],
    queryFn: () =>
      axios.get(
        NEXT_PUBLIC_BASE_URL +
          `api/recommend/?category=${category}&country=${country}&n=${recommendationNumber}`
      ),
  });

  const { isFetching: isLoading, data: stats } = useQuery<StatDataType>({
    queryKey: ["stats-data"],
    queryFn: () => axios.get(NEXT_PUBLIC_BASE_URL + "api/stats"),
  });

  const categories = stats?.data.categories || [];
  const countries = stats?.data.countries || [];
  const totalInfluencers = stats?.data.total_influencers || 0;
  const recommendations = data?.data.recommendations || [];

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex">
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
        <div className="px-8 py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-slate-400">Loading initial data...</p>
            </div>
          ) : isFetching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <InfluencerCardSkeleton key={index} />
              ))}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">No recommendations found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <InfluencerCard key={rec.rank} recommendation={rec} />
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

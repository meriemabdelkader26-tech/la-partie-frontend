import { Influencer } from "@/app/types";
import InfluencerCard from "./InfluencerCard";
import InfluencerCardSkeleton from "./InfluencerCardSkeleton";
import { SearchX } from "lucide-react";

interface Props {
  influencers: Influencer[];
  isLoading: boolean;
  itemsPerPage: number;
}

const InfluencerGrid = (props: Props) => {
  const { influencers, isLoading, itemsPerPage } = props;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <InfluencerCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (influencers.length === 0) {
    return (
      <div className="bg-white border border-gray-100 border-dashed rounded-[32px] p-16 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
          <SearchX className="h-10 w-10 text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No influencers found</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
          We couldn&apos;t find any influencers matching your current filters. Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {influencers.map((influencer) => (
        <InfluencerCard key={influencer.id} influencer={influencer} />
      ))}
    </div>
  );
};

export default InfluencerGrid;
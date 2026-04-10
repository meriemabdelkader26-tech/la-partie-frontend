import { Influencer } from "@/app/types";
import InfluencerCard from "./InfluencerCard";
import InfluencerCardSkeleton from "./InfluencerCardSkeleton";
import { Card } from "@/components/ui/card";

interface Props {
  influencers: Influencer[];
  isLoading: boolean;
  itemsPerPage: number;
}

const InfluencerGrid = (props: Props) => {
  const { influencers, isLoading, itemsPerPage } = props;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <InfluencerCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (influencers.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50 p-12 text-center backdrop-blur-sm">
        <p className="text-slate-400 text-lg">No Influencers found</p>
        <p className="text-slate-500 text-sm mt-2">
          Try adjusting your filters or search query
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6">
      {influencers.map((influencer) => (
        <InfluencerCard key={influencer.id} influencer={influencer} />
      ))}
    </div>
  );
};

export default InfluencerGrid;
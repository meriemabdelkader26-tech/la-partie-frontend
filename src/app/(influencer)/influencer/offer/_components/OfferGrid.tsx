import { Offer } from "@/app/types";
import { Card } from "@/components/ui/card";
import OfferCard from "./OfferCard";
import OfferCardSkeleton from "./OfferCardSkeleton";

interface OfferGridProps {
  offers: Offer[];
  isLoading: boolean;
  itemsPerPage: number;
}

export const OfferGrid = ({
  offers,
  isLoading,
  itemsPerPage,
}: OfferGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <OfferCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50 p-12 text-center backdrop-blur-sm">
        <p className="text-slate-400 text-lg">No offers found</p>
        <p className="text-slate-500 text-sm mt-2">
          Try adjusting your filters or search query
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6">
      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} />
      ))}
    </div>
  );
};

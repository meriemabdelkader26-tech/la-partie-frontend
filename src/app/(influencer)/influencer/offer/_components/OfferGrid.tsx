import { Offer } from "@/app/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
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
      <Card className="bg-gray-50/50 border-2 border-black/5 p-20 text-center rounded-[40px] shadow-soft animate-fadeInUp">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-soft border border-black/5">
          <Search className="w-10 h-10 text-gray-200" />
        </div>
        <h3 className="text-2xl font-black text-black mb-2">No offers found</h3>
        <p className="text-gray-500 font-medium max-w-sm mx-auto">
          We couldn&apos;t find any offers matching your current filters. Try adjusting your search or clearing filters.
        </p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()} 
          className="mt-8 bg-white border-2 border-black/10 rounded-2xl px-8 py-6 font-bold hover:bg-black hover:text-white transition-all"
        >
          Reset View
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {offers.map((offer, idx) => (
        <OfferCard 
          key={offer.id} 
          offer={offer} 
          style={{ animationDelay: `${idx * 100}ms` }}
        />
      ))}
    </div>
  );
};

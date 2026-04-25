"use client";
import { Offer } from "@/app/types";
import { calculateBudgetRange, daysRemaining } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CheckCircle2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { SAVE_OFFER } from "@/lib/queries/messages-queries";
import { toast } from "sonner";
import { OFFERS_KEY } from "@/constant";

interface Props {
  offer: Offer;
  className?: string;
  style?: React.CSSProperties;
}

const OfferCard = (props: Props) => {
  const { offer, className, style } = props;
  const router = useRouter();
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async () => {
      return await graphqlClient.request(SAVE_OFFER, { offerId: offer.id });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: [OFFERS_KEY] });
      queryClient.invalidateQueries({ queryKey: ["savedOffers"] });
      toast.success(data.saveOffer.message);
    },
    onError: () => {
      toast.error("Failed to update saved offer status");
    },
  });

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    saveMutation.mutate();
  };

  return (
    <div
      key={offer.id}
      className={cn(
        "bg-white border-2 border-black/5 p-8 shadow-soft hover:shadow-large hover:border-black/20 transition-all duration-500 group cursor-pointer rounded-[32px] animate-fadeInUp relative overflow-hidden",
        offer.isApplied && "bg-gray-50/50 border-black/10",
        className
      )}
      style={style}
      onClick={() => router.push(`/influencer/offer/detail/${offer.id}`)}
    >
      {offer.isApplied && (
        <div className="absolute top-0 right-0">
          <div className="bg-black text-white px-6 py-2 rounded-bl-3xl flex items-center gap-2 shadow-soft">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Applied</span>
          </div>
        </div>
      )}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            title={offer.isSaved ? "Unsave offer" : "Save offer"}
            className={cn(
              "p-2 rounded-xl transition-all duration-300 z-10",
              offer.isSaved 
                ? "bg-yellow-400 text-white shadow-soft" 
                : "bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-600"
            )}
          >
            <Star className={cn("w-5 h-5", offer.isSaved && "fill-current")} />
            <span className="sr-only">{offer.isSaved ? "Unsave offer" : "Save offer"}</span>
          </button>

          <div className="inline-block bg-black px-4 py-1.5 rounded-full shadow-medium group-hover:scale-105 transition-transform">
            <span className="text-[10px] font-black uppercase tracking-widest text-white">
              {calculateBudgetRange(offer.minBudget, offer.maxBudget) ===
                "under-25k" && "Under $25K"}
              {calculateBudgetRange(offer.minBudget, offer.maxBudget) ===
                "25k-50k" && "$25K - $50K"}
              {calculateBudgetRange(offer.minBudget, offer.maxBudget) ===
                "50k-100k" && "$50K - $100K"}
              {calculateBudgetRange(offer.minBudget, offer.maxBudget) ===
                "over-100k" && "Over $100K"}
            </span>
          </div>
        </div>
      </div>
      <h3 className="text-2xl font-black text-black mb-4 group-hover:text-gray-700 transition-colors line-clamp-1 tracking-tight">
        {offer.title}
      </h3>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase text-gray-400 font-black tracking-[0.2em]">
          Objective
        </p>
        {offer.isApplied && offer.applicationStatus && (
          <span className={cn(
            "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
            offer.applicationStatus === "Approved" ? "bg-green-100 text-green-700" :
            offer.applicationStatus === "Rejected" ? "bg-red-100 text-red-700" :
            "bg-blue-100 text-blue-700"
          )}>
            Status: {offer.applicationStatus}
          </span>
        )}
      </div>
      <p className="text-base text-gray-600 font-medium mb-8 line-clamp-2 leading-relaxed">
        {offer.objectif}
      </p>
      <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b-2 border-black/5">
        <div>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Talent Needed</p>
          <p className="text-3xl font-black text-black">
            {offer.influencerNumber}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Budget Range</p>
          <p className="text-xl font-black text-black group-hover:scale-105 transition-transform origin-left">
            {Number.parseFloat(offer.minBudget) >= 1000
              ? `$${(Number.parseFloat(offer.minBudget) / 1000).toFixed(0)}K`
              : `$${Number.parseFloat(offer.minBudget).toLocaleString()}`}
            {" - "}
            {Number.parseFloat(offer.maxBudget) >= 1000
              ? `$${(Number.parseFloat(offer.maxBudget) / 1000).toFixed(0)}K`
              : `$${Number.parseFloat(offer.maxBudget).toLocaleString()}`}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-black/5 shadow-inner-soft">
            <span className="text-[10px] font-black">{offer.createdBy.name[0]}</span>
          </div>
          <p className="text-xs text-gray-400 font-medium">
            By <span className="text-black font-black uppercase tracking-widest text-[10px]">{offer.createdBy.name}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Ends in</p>
          <p className="text-sm font-black text-black group-hover:text-yellow-600 transition-colors">
            {daysRemaining(offer.endDate)} days
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;

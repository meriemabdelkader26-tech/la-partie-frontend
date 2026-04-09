"use client";
import { Offer } from "@/app/types";
import { calculateBudgetRange, daysRemaining } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Props {
  offer: Offer;
}

const OfferCard = (props: Props) => {
  const { offer } = props;
  const router = useRouter();
  return (
    <div
      key={offer.id}
      className="bg-slate-800/50 border-slate-700/50 p-6 backdrop-blur-sm hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 transition-all group cursor-pointer rounded-2xl"
      onClick={() => router.push(`/influencer/offer/detail/${offer.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="inline-block bg-green-500/20 px-3 py-1 rounded-full">
          <span className="text-xs font-semibold text-green-400">
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
        {/* <ActionsButtons data={offer} /> */}
      </div>
      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-green-400 transition-colors line-clamp-1">
        {offer.title}
      </h3>
      <p className="text-xs uppercase text-slate-500 font-semibold mb-2">
        Objective
      </p>
      <p className="text-sm text-slate-300 mb-4 line-clamp-1">
        {offer.objectif}
      </p>
      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-700/50">
        <div>
          <p className="text-xs text-slate-500 mb-1">Influencers Needed</p>
          <p className="text-lg font-bold text-blue-400">
            {offer.influencerNumber}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Budget Range</p>
          <p className="text-sm font-bold text-green-400">
            ${(Number.parseFloat(offer.minBudget) / 1000).toFixed(0)}K - $
            {(Number.parseFloat(offer.maxBudget) / 1000).toFixed(0)}K
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">
          By{" "}
          <span className="text-slate-400 font-medium">
            {offer.createdBy.name}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 mb-1">Expires in</p>
          <p className="text-sm font-bold text-yellow-400">
            {daysRemaining(offer.endDate)} days
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;

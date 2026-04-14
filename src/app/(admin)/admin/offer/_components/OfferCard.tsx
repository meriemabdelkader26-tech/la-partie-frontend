"use client";
import { Offer } from "@/app/types";
import { calculateBudgetRange, daysRemaining } from "@/lib/utils";
import ActionsButtons from "./ActionsButtons";
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
      className="bg-surface border border-muted p-6 shadow-soft hover:shadow-lg hover:shadow-primary/10 transition-all group cursor-pointer rounded-2xl"
      onClick={() => router.push(`/admin/offer/detail/${offer.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="inline-block bg-info/10 px-3 py-1 rounded-full border border-info/30 shadow-soft">
          <span className="text-xs font-semibold text-info">
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
        <ActionsButtons data={offer} />
      </div>
      <h3 className="text-lg font-bold text-title mb-3 group-hover:text-primary transition-colors line-clamp-1">
        {offer.title}
      </h3>
      <p className="text-xs uppercase text-muted font-semibold mb-2">
        Objective
      </p>
      <p className="text-base text-text mb-4 line-clamp-1">
        {offer.objectif}
      </p>
      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-muted">
        <div>
          <p className="text-xs text-muted mb-1">Influencers Needed</p>
          <p className="text-lg font-bold text-info">
            {offer.influencerNumber}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">Budget Range</p>
          <p className="text-base font-bold text-success">
            ${(Number.parseFloat(offer.minBudget) / 1000).toFixed(0)}K - $
            {(Number.parseFloat(offer.maxBudget) / 1000).toFixed(0)}K
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted">
          By{" "}
          <span className="text-title font-medium">
            {offer.createdBy.name}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted mb-1">Expires in</p>
          <p className="text-base font-bold text-warning">
            {daysRemaining(offer.endDate)} days
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
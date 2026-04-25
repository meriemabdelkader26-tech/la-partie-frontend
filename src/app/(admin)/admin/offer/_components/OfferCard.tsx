"use client";
import { Offer } from "@/app/types";
import { calculateBudgetRange, daysRemaining } from "@/lib/utils";
import ActionsButtons from "./ActionsButtons";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { 
  Calendar, 
  Users, 
  Target, 
  Wallet, 
  Clock, 
  ArrowUpRight,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  offer: Offer;
}

const OfferCard = (props: Props) => {
  const { offer } = props;
  const router = useRouter();
  
  const budgetRange = calculateBudgetRange(offer.minBudget, offer.maxBudget);
  const remainingDays = daysRemaining(offer.endDate);
  const isUrgent = remainingDays <= 7;

  return (
    <Card
      key={offer.id}
      className="group bg-white border border-gray-100 rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-500 flex flex-col h-full relative"
    >
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-5">
          <div className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
            budgetRange === "under-25k" && "bg-blue-50 text-blue-700 border-blue-100",
            budgetRange === "25k-50k" && "bg-emerald-50 text-emerald-700 border-emerald-100",
            budgetRange === "50k-100k" && "bg-indigo-50 text-indigo-700 border-indigo-100",
            budgetRange === "over-100k" && "bg-amber-50 text-amber-700 border-amber-100"
          )}>
            {budgetRange.replace('-', ' ')}
          </div>
          <ActionsButtons data={offer} />
        </div>

        <div className="mb-5 cursor-pointer" onClick={() => router.push(`/admin/offer/detail/${offer.id}`)}>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1 mb-2">
            {offer.title}
          </h3>
          <div className="flex items-center gap-2 text-gray-400 group/link">
            <span className="text-[10px] font-bold uppercase tracking-widest">View details</span>
            <ArrowUpRight className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Objective</span>
            </div>
            <p className="text-sm font-medium text-gray-600 line-clamp-2 leading-relaxed">
              {offer.objectif}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 mb-1">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Influencers</span>
              </div>
              <span className="text-lg font-black text-gray-900 leading-none">{offer.influencerNumber}</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 mb-1">
                <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Budget</span>
              </div>
              <span className="text-lg font-black text-emerald-600 leading-none">
                {Number.parseFloat(offer.minBudget) >= 1000
                  ? `$${(Number.parseFloat(offer.minBudget) / 1000).toFixed(0)}K+`
                  : `$${Number.parseFloat(offer.minBudget).toLocaleString()}+`}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 border border-white shadow-sm">
              {offer.createdBy.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Brand</span>
              <span className="text-xs font-bold text-gray-700">{offer.createdBy.name}</span>
            </div>
          </div>
          
          <div className={cn(
            "flex flex-col items-end px-3 py-1.5 rounded-xl border transition-colors",
            isUrgent ? "bg-rose-50 border-rose-100" : "bg-gray-50 border-gray-100"
          )}>
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest leading-none mb-1",
              isUrgent ? "text-rose-500" : "text-gray-400"
            )}>
              {isUrgent ? "Urgent" : "Expires"}
            </span>
            <div className="flex items-center gap-1">
              <Clock className={cn("w-3 h-3", isUrgent ? "text-rose-500" : "text-gray-400")} />
              <span className={cn("text-xs font-black", isUrgent ? "text-rose-600" : "text-gray-700")}>
                {remainingDays}d left
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OfferCard;
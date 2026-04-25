"use client";

import React from "react";
import { usePersonalizedOffers } from "@/app/hooks/use-recommendations";
import { OfferCard, OfferCardSkeleton } from ".";
import { Offer } from "@/app/types";
import { motion } from "framer-motion";
import { Sparkles, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const RecommendedOffersSection = () => {
  const { data: recommendations, isLoading } = usePersonalizedOffers();

  if (isLoading) {
    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="p-2 bg-black text-white rounded-xl shadow-soft">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-black text-black tracking-tight">Recommended for You</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <OfferCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mb-12 animate-fadeIn">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-black text-white rounded-xl shadow-soft">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-black tracking-tight uppercase tracking-[0.1em]">AI Match Engine</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Personalized opportunities</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.map((rec, idx) => (
          <div key={rec.offer_id} className="relative group">
            <div className="absolute -top-3 -right-3 z-20">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-yellow-400 text-black px-4 py-2 rounded-2xl shadow-large flex items-center gap-2 cursor-help border-2 border-white group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="w-3 h-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {Math.round(rec.score * 100)}% Match
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[250px] p-4 bg-black text-white rounded-2xl border-none shadow-large">
                    <p className="text-xs font-medium leading-relaxed">{rec.explanation}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {/* We need to transform RecommendedOffer to Offer type for OfferCard */}
            <OfferCard 
              offer={{
                id: rec.offer_id.toString(),
                title: rec.title,
                objectif: rec.objectif || "",
                requirement: rec.requirement || "",
                minBudget: rec.min_budget.toString(),
                maxBudget: rec.max_budget.toString(),
                influencerNumber: rec.influencer_number || 0,
                startDate: "",
                endDate: rec.end_date || "",
                createdAt: "",
                createdBy: { name: rec.created_by_name || "AI Match" } as any
              }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

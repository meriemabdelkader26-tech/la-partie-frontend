"use client";

import React from "react";
import { useOfferRecommendations } from "@/app/hooks/use-recommendations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Users, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { decodeId } from "@/lib/utils";

interface Props {
  offerId: string;
}

export const RecommendedInfluencers = ({ offerId }: Props) => {
  // Handle Global ID if necessary
  const numericId = !isNaN(parseInt(offerId)) 
    ? parseInt(offerId) 
    : (() => {
        const decoded = decodeId(offerId);
        if (decoded) {
          const parts = decoded.split(':');
          return parts.length > 1 ? parseInt(parts[1]) : NaN;
        }
        return NaN;
      })();

  const { data: recommendations, isLoading } = useOfferRecommendations(numericId);

  if (isLoading) {
    return (
      <div className="mt-8 space-y-4">
        <Skeleton className="h-10 w-64 bg-gray-100 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 bg-gray-100 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65 }}
      className="mt-8"
    >
      <Card className="bg-white border border-gray-200/60 rounded-3xl shadow-sm overflow-hidden">
        <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between gap-4 flex-wrap border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-yellow-400 text-black rounded-xl shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">AI Match: Top Influencers</CardTitle>
              <CardDescription className="font-medium text-gray-500">Highest potential for this campaign</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec, idx) => (
              <motion.div
                key={rec.influencer_id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className="group p-6 bg-gray-50/50 hover:bg-white rounded-3xl border border-gray-100 hover:border-yellow-400 transition-all duration-500 hover:shadow-large"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xl shadow-soft">
                    {rec.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                      {Math.round(rec.score * 100)}% Match
                    </span>
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-black transition-colors">{rec.name}</h4>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">@{rec.pseudo}</p>
                
                <div className="p-3 bg-white rounded-2xl border border-gray-100 mb-4">
                  <p className="text-[11px] font-medium text-slate-600 leading-relaxed italic">
                    &quot;{rec.explanation}&quot;
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="text-left">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Reach</p>
                    <p className="text-sm font-black text-slate-900">{rec.followers.toLocaleString()}</p>
                  </div>
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-black hover:text-white transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ArrowLeft, 
  MessageSquare, 
  Star, 
  MapPin, 
  Users, 
  Zap,
  Filter,
  CheckCircle2,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_ALL_INFLUENCERS } from "@/lib/queries/admin-queries";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function NewChatPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["allInfluencersList"],
    queryFn: () => graphqlClient.request<any>(GET_ALL_INFLUENCERS, { 
      first: 50,
      minFollowers: 0
    }),
  });

  const formatNumber = (num: number) => {
    if (!num) return "0";
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(num);
  };

  const formatEngagement = (num: any) => {
    const val = parseFloat(num);
    if (isNaN(val)) return "0.00";
    return val.toFixed(2);
  };

  const influencers = data?.allInfluencers?.edges?.map((edge: any) => edge.node) || [];
  
  const filteredInfluencers = influencers.filter((inf: any) => 
    inf.pseudo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inf.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inf.localisation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/company/messages" className="inline-flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-6 group">
            <div className="p-2 rounded-xl bg-gray-100 group-hover:bg-black group-hover:text-white transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Back to Inbox</span>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-black text-white rounded-xl shadow-lg">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
            <span className="text-[10px] font-black text-black uppercase tracking-[0.3em]">Talent Discovery</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-black tracking-tighter leading-none uppercase">
            Find Your <span className="text-gray-400">Match</span> ✨
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full md:w-96"
        >
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
            <Input 
              placeholder="Search by name, handle, or location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-16 pl-16 bg-white border-black/5 rounded-4xl shadow-large focus:ring-4 focus:ring-black/5 font-bold transition-all text-lg"
            />
          </div>
        </motion.div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-white border-black/5 rounded-[3rem] p-8 shadow-soft overflow-hidden">
              <div className="flex items-center gap-6 mb-8">
                <Skeleton className="size-20 rounded-[1.8rem]" />
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-14 w-full rounded-2xl" />
              </div>
            </Card>
          ))
        ) : (
          <AnimatePresence>
            {filteredInfluencers.map((influencer: any, idx: number) => (
              <motion.div
                key={influencer.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <Card className="group bg-white border-black/5 rounded-[3rem] p-8 shadow-soft hover:shadow-large hover:border-black/10 transition-all duration-500 overflow-hidden relative h-full flex flex-col">
                  {/* Premium Badge */}
                  <div className="absolute top-0 right-0 p-8">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shadow-inner group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mb-8">
                    <Avatar className="size-20 rounded-[1.8rem] shadow-xl border-4 border-white group-hover:scale-105 transition-transform duration-500">
                      <AvatarImage src={influencer.profilePicture} className="object-cover" />
                      <AvatarFallback className="bg-black text-white font-black text-2xl">
                        {influencer.user?.name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-2xl font-black text-black leading-none mb-1 group-hover:text-gray-700 transition-colors">
                        {influencer.user?.name}
                      </h3>
                      <p className="text-sm font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 fill-emerald-500" />
                        @{influencer.instagramUsername || influencer.pseudo}
                      </p>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-black/5 space-y-1">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Followers</span>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-black" />
                        <span className="text-lg font-black text-black">
                          {formatNumber(influencer.statistiquesGlobales?.followersTotaux) || "10k+"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-black/5 space-y-1">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Engagement</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <span className="text-lg font-black text-black">
                          {formatEngagement(influencer.statistiquesGlobales?.engagementMoyenGlobal || 4.2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio Area */}
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {influencer.selectedCategories?.slice(0, 3).map((cat: any) => (
                        <Badge key={cat.id} className="bg-white border-black/5 text-black font-black text-[9px] uppercase tracking-widest rounded-lg px-3 py-1 shadow-sm">
                          {cat.name}
                        </Badge>
                      ))}
                    </div>
                    
                    <p className="text-gray-500 font-medium text-sm line-clamp-2 leading-relaxed">
                      {influencer.biography || "Professional content creator specialized in high-conversion campaigns and authentic brand storytelling."}
                    </p>

                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs font-bold">{influencer.localisation || "Global / remote"}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link href={`/company/messages?userId=${influencer.user?.id}`} className="mt-8">
                    <Button className="w-full h-16 bg-black hover:bg-gray-800 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-black/20 hover:-translate-y-1 active:scale-95 transition-all group/btn relative overflow-hidden">
                      <div className="absolute inset-0 bg-linear-to-r from-indigo-500/10 to-emerald-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                      <MessageSquare className="w-6 h-6 mr-3 group-hover/btn:rotate-12 transition-transform" />
                      Initiate Chat
                      <ChevronRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Empty State */}
      {!isLoading && filteredInfluencers.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-40 text-center"
        >
          <div className="size-32 bg-gray-50 rounded-[3rem] flex items-center justify-center mb-8 border border-black/5 shadow-inner">
            <Search className="size-12 text-gray-200" />
          </div>
          <h2 className="text-3xl font-black text-black tracking-tight mb-2 uppercase">No Talent Found</h2>
          <p className="text-gray-400 font-medium max-w-sm">Try adjusting your search terms or filters to find the right influencer for your brand.</p>
        </motion.div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_MY_OFFERS } from "@/lib/queries/offer-queries";
import { Offer, ApplicationStatus, GetMyOffersResponse, OfferEdge } from "@/lib/types/offer-types";
import { 
  Megaphone, 
  Calendar, 
  Users, 
  DollarSign, 
  Plus, 
  Search, 
  CheckCircle, 
  XCircle
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

const OfferCard = ({ offer, index }: { offer: Offer; index: number }) => {
  const now = new Date();
  const startDate = new Date(offer.startDate);
  const endDate = new Date(offer.endDate);

  const isActive = now >= startDate && now <= endDate;
  const isUpcoming = now < startDate;

  // Calculer la progression temporelle
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = now.getTime() - startDate.getTime();
  const progressPercent = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);

  const applications = offer.applications || [];
  const pendingCount = applications.filter(
    (app) => app.status === ApplicationStatus.PENDING
  ).length;
  const approvedCount = applications.filter(
    (app) => app.status === ApplicationStatus.APPROVED
  ).length;

  const getStatusBadge = () => {
    if (isActive) {
      return (
        <Badge className="bg-white/80 text-emerald-600 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
          Mission Active
        </Badge>
      );
    }
    if (isUpcoming) {
      return (
        <Badge className="bg-white/80 text-amber-600 border border-amber-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md shadow-sm">
          <Calendar className="w-3.5 h-3.5 mr-2" />
          Upcoming
        </Badge>
      );
    }
    return (
      <Badge className="bg-white/80 text-gray-500 border border-gray-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md shadow-sm">
        <CheckCircle className="w-3.5 h-3.5 mr-2" />
        Completed
      </Badge>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1, 
        ease: [0.23, 1, 0.32, 1] 
      }}
      whileHover={{ y: -8 }}
    >
      <Card className="group relative bg-white border border-gray-100/50 rounded-4xl shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-500 overflow-hidden cursor-pointer">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-gray-50/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-3xl" />
        
        <div className="absolute top-6 right-6 z-20">
          {getStatusBadge()}
        </div>

        <CardHeader className="p-8 pb-4">
          <div className="flex flex-col gap-6 mb-4">
            <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-105 group-hover:-rotate-3 transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Megaphone className="w-8 h-8 relative z-10" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Campaign #{offer.id.slice(-6).toUpperCase()}</span>
              <CardTitle className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-gray-600 transition-colors line-clamp-1 font-sans">
                {offer.title}
              </CardTitle>
            </div>
          </div>
          
          <p className="text-slate-600 font-normal text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
            {offer.objectif}
          </p>
        </CardHeader>

        <CardContent className="p-8 pt-4 space-y-8">
          {/* Timeline Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Timeline</span>
              <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">
                {isActive ? `${Math.round(progressPercent)}%` : isUpcoming ? '0%' : '100%'}
              </span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                className={`h-full rounded-full ${isActive ? 'bg-black' : 'bg-gray-300'}`}
              />
            </div>
            <div className="flex justify-between text-[10px] font-medium text-gray-400 pt-1">
              <span>{startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span>{endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-white border border-gray-100 rounded-2xl group-hover:border-gray-200 group-hover:bg-gray-50/50 transition-all duration-300 space-y-1.5">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Budget</span>
              </div>
              <p className="text-xl font-bold text-slate-900">${offer.maxBudget.toLocaleString()}</p>
            </div>
            
            <div className="p-5 bg-white border border-gray-100 rounded-2xl group-hover:border-gray-200 group-hover:bg-gray-50/50 transition-all duration-300 space-y-1.5">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-black" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Influencers</span>
              </div>
              <p className="text-xl font-bold text-slate-900">{offer.influencerNumber}</p>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between py-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(Math.min(approvedCount || 3, 3))].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-emerald-50 border-2 border-white flex items-center justify-center z-10">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    </div>
                  ))}
                  {(approvedCount || 0) === 0 && (
                     <div className="w-8 h-8 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center z-10">
                      <Users className="w-4 h-4 text-gray-300" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-600">{approvedCount || 0} secured</span>
              </div>
              <div className="text-right flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                 <span className="text-sm font-bold text-slate-900">{pendingCount}</span>
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">New</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href={`/company/campaigns/${offer.id}`} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full h-12 border border-gray-200 hover:border-black hover:bg-black hover:text-white font-semibold rounded-xl transition-all active:scale-95 text-sm"
                >
                  View Details
                </Button>
              </Link>
              {pendingCount > 0 && (
                <Link href={`/company/campaigns/${offer.id}/applications`} className="flex-1">
                  <Button
                    className="w-full h-12 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
                  >
                    Review Queue
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CampaignsPage = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await graphqlClient.request<GetMyOffersResponse>(GET_MY_OFFERS);
      const mappedOffers = data.myOffers?.edges?.map((edge: OfferEdge) => edge.node) || [];
      setOffers(mappedOffers);
    } catch (error: unknown) {
      console.error("Error fetching offers:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load campaigns";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = () => {
    let filtered = offers;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (offer) =>
          offer.title.toLowerCase().includes(searchLower) ||
          offer.objectif.toLowerCase().includes(searchLower) ||
          (offer.requirement && offer.requirement.toLowerCase().includes(searchLower))
      );
    }

    const now = new Date();
    if (activeTab === "active") {
      filtered = filtered.filter((offer) => {
        const start = new Date(offer.startDate);
        const end = new Date(offer.endDate);
        return now >= start && now <= end;
      });
    } else if (activeTab === "upcoming") {
      filtered = filtered.filter((offer) => {
        const start = new Date(offer.startDate);
        return now < start;
      });
    } else if (activeTab === "completed") {
      filtered = filtered.filter((offer) => {
        const end = new Date(offer.endDate);
        return now > end;
      });
    }

    return filtered;
  };

  const results = filteredOffers();

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="flex justify-between items-center px-2">
          <div className="h-16 w-1/3 bg-slate-100 rounded-2xl" />
          <div className="h-14 w-40 bg-slate-100 rounded-2xl" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 px-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-128 bg-slate-100 rounded-4xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10 text-rose-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900 font-sans">System Error</h3>
            <p className="text-slate-500 font-medium">{error}</p>
          </div>
          <Button onClick={() => fetchOffers()} className="bg-slate-900 hover:bg-slate-800 text-white font-semibold h-12 px-8 rounded-xl shadow-md transition-all mt-4">
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 border border-gray-200 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
            <Megaphone className="w-3 h-3 text-gray-500" />
            <span>Campaign Manager</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-2 font-sans">
            Manage your <span className="text-slate-400">Campaigns</span> 🚀
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Track performance and review influencer applications.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/company/campaigns/new">
            <Button className="h-14 px-8 bg-slate-900 hover:bg-black text-white font-semibold text-base rounded-2xl shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              New Campaign
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Search and Tabs Container */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 px-2">
          <div className="flex-1 relative group max-w-2xl">
            <div className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10">
              <Search className="text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors" />
            </div>
            <Input
              placeholder="Filter by mission title, objective or requirements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 h-14 bg-white border border-gray-200 focus:border-black focus:ring-4 focus:ring-black/5 text-slate-900 font-medium placeholder:text-gray-400 rounded-2xl shadow-sm transition-all text-base"
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="h-14 bg-white p-1 rounded-2xl border border-gray-200 shadow-sm">
              <TabsTrigger 
                value="all" 
                className="h-full px-6 rounded-xl font-semibold text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all"
              >
                All ({offers.length})
              </TabsTrigger>
              <TabsTrigger 
                value="active" 
                className="h-full px-6 rounded-xl font-semibold text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all"
              >
                Active
              </TabsTrigger>
              <TabsTrigger 
                value="upcoming" 
                className="h-full px-6 rounded-xl font-semibold text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all"
              >
                Upcoming
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className="h-full px-6 rounded-xl font-semibold text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all"
              >
                Ended
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="px-2">
          <AnimatePresence mode="wait">
            {results.length > 0 ? (
              <motion.div 
                key={activeTab + searchTerm}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              >
                {results.map((offer, idx) => (
                  <OfferCard key={offer.id} offer={offer} index={idx} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="bg-white border-dashed border-2 border-gray-200 rounded-4xl shadow-sm">
                  <CardContent className="flex flex-col items-center justify-center py-24">
                    <div className="p-6 bg-gray-100 text-gray-500 rounded-full mb-6">
                      <Megaphone className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center font-sans">No campaigns found</h3>
                    <p className="text-slate-500 text-center mb-8 max-w-md font-medium text-base">
                      {searchTerm
                        ? "Try adjusting your search terms to find what you're looking for."
                        : "You haven't created any campaigns in this category yet."}
                    </p>
                    {!searchTerm && (
                      <Link href="/company/campaigns/new">
                        <Button className="bg-slate-900 hover:bg-black text-white font-semibold px-8 h-12 rounded-xl shadow-md transition-all">
                          Create your first offer
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;

"use client";

import { useState, useEffect } from "react";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_ALL_INFLUENCERS } from "@/lib/queries/admin-queries";
import { Influencer } from "@/lib/types/admin-types";
import { 
  Search, 
  MapPin, 
  Users, 
  TrendingUp, 
  Filter, 
  Send, 
  Instagram, 
  Globe, 
  Heart, 
  MessageCircle, 
  ChevronDown,
  X,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Filters {
  localisation: string;
  disponibilite: string;
  minFollowers: number;
  categoryIds: string[];
  searchTerm: string;
}

const InfluencerCard = ({ influencer, index }: { influencer: Influencer; index: number }) => {
  const router = useRouter();
  const stats = influencer.statistiquesGlobales;

  const formatNumber = (num: number | undefined | null) => {
    if (num === undefined || num === null) return "0";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="bg-white border-black/5 hover:border-black/20 transition-all duration-500 overflow-hidden group shadow-soft hover:shadow-large rounded-[2.5rem]">
        <div className="relative h-64 overflow-hidden">
          {influencer.profilePicture || influencer.instagramData?.profile_pic_url ? (
            <Image
              src={influencer.profilePicture || influencer.instagramData.profile_pic_url}
              alt={influencer.pseudo || "Influencer"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <Users className="w-16 h-16 text-gray-300" />
            </div>
          )}
          
          {/* Overlay for aesthetic */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute top-4 right-4">
            <Badge
              className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-none shadow-lg ${
                influencer.disponibiliteCollaboration === "DISPONIBLE"
                  ? "bg-emerald-500 text-white"
                  : influencer.disponibiliteCollaboration === "PARTIELLEMENT_DISPONIBLE"
                  ? "bg-amber-500 text-white"
                  : "bg-rose-500 text-white"
              }`}
            >
              {influencer.disponibiliteCollaboration === "DISPONIBLE"
                ? "Available"
                : influencer.disponibiliteCollaboration === "PARTIELLEMENT_DISPONIBLE"
                ? "Partial"
                : "Busy"}
            </Badge>
          </div>
        </div>

        <CardHeader className="relative -mt-12 bg-white mx-6 rounded-3xl shadow-large border border-black/5 p-6 group-hover:-mt-14 transition-all duration-500">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl font-black text-black tracking-tight group-hover:text-gray-700 transition-colors">
              {influencer.pseudo || influencer.user?.name || "Anonymous Influencer"}
            </CardTitle>
            {influencer.instagramUsername && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <Instagram className="w-3.5 h-3.5" />
                <span>@{influencer.instagramUsername}</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="px-8 pt-6 pb-8 space-y-6">
          <p className="text-sm font-medium text-gray-500 line-clamp-2 leading-relaxed">
            {influencer.biography || "No biography available"}
          </p>

          {/* Categories */}
          {influencer.selectedCategories && influencer.selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {influencer.selectedCategories.slice(0, 2).map((category) => (
                <span
                  key={category.id}
                  className="px-3 py-1.5 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-xl border border-black/5"
                >
                  {category.name}
                </span>
              ))}
              {influencer.selectedCategories.length > 2 && (
                <span className="px-3 py-1.5 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl">
                  +{influencer.selectedCategories.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-3 gap-2 py-4 border-y border-black/5">
              <div className="text-center">
                <p className="text-sm font-black text-black">{formatNumber(stats.followersTotaux)}</p>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-black">{formatNumber(0)}</p>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-black">{(stats.engagementMoyenGlobal || 0).toFixed(1)}%</p>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Engage</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Link href={`/company/influencers/${influencer.id}`} className="flex-1">
              <Button
                variant="outline"
                className="w-full h-11 border-2 border-black/5 hover:bg-black hover:text-white font-bold rounded-xl transition-all duration-300"
              >
                Profile
              </Button>
            </Link>
            <Button
              className="flex-1 h-11 bg-black hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg hover:shadow-black/20 transition-all duration-300"
              onClick={() => router.push(`/company/messages?userId=${influencer.user?.id}`)}
            >
              <Send className="w-4 h-4 mr-2" />
              Pitch
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const InfluencerSearchPage = () => {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [filteredInfluencers, setFilteredInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    localisation: "",
    disponibilite: "",
    minFollowers: 0,
    categoryIds: [],
    searchTerm: "",
  });

  useEffect(() => {
    fetchInfluencers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, influencers]);

  const fetchInfluencers = async () => {
    try {
      setLoading(true);
      const data = await graphqlClient.request(GET_ALL_INFLUENCERS, {});
      const mappedInfluencers = data.allInfluencers?.edges?.map((edge: any) => edge.node) || [];
      setInfluencers(mappedInfluencers);
      setFilteredInfluencers(mappedInfluencers);
    } catch (error) {
      console.error("Error fetching influencers:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!Array.isArray(influencers)) {
      setFilteredInfluencers([]);
      return;
    }
    let filtered = [...influencers];

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (inf) =>
          inf.pseudo?.toLowerCase().includes(searchLower) ||
          inf.instagramUsername?.toLowerCase().includes(searchLower) ||
          inf.biography?.toLowerCase().includes(searchLower) ||
          inf.user?.name?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.localisation) {
      filtered = filtered.filter((inf) =>
        inf.localisation?.toLowerCase().includes(filters.localisation.toLowerCase())
      );
    }

    if (filters.disponibilite) {
      filtered = filtered.filter(
        (inf) => inf.disponibiliteCollaboration === filters.disponibilite
      );
    }

    if (filters.minFollowers > 0) {
      filtered = filtered.filter(
        (inf) =>
          inf.statistiquesGlobales &&
          (inf.statistiquesGlobales.followersTotaux || 0) >= filters.minFollowers
      );
    }

    setFilteredInfluencers(filtered);
  };

  const resetFilters = () => {
    setFilters({
      localisation: "",
      disponibilite: "",
      minFollowers: 0,
      categoryIds: [],
      searchTerm: "",
    });
  };

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="h-20 w-3/4 bg-black/5 rounded-4xl" />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-128 bg-black/5 rounded-[2.5rem]" />
          ))}
        </div>
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
            <Sparkles className="w-3 h-3 text-yellow-400" />
            <span>Discover Talent</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter mb-2">
            Find the perfect <span className="text-gray-400">Match</span> 🔍
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Browse through our curated list of professional influencers.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4"
        >
          <div className="bg-white px-6 py-4 rounded-3xl shadow-soft border border-black/5 flex flex-col items-center">
            <span className="text-3xl font-black text-black tracking-tighter">{filteredInfluencers.length}</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Influencers</span>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-white border-black/5 rounded-[2.5rem] shadow-large overflow-hidden">
          <CardHeader className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 relative w-full group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors" />
                <Input
                  placeholder="Search by name, pseudo, @username..."
                  value={filters.searchTerm}
                  onChange={(e) =>
                    setFilters({ ...filters, searchTerm: e.target.value })
                  }
                  className="pl-12 h-14 bg-gray-50 border-transparent focus:bg-white focus:border-black/10 text-black font-bold placeholder:text-gray-400 rounded-2xl transition-all"
                />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className={`h-14 px-8 rounded-2xl font-black transition-all duration-300 ${
                  showFilters ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
                <ChevronDown
                  className={`w-4 h-4 ml-2 transition-transform duration-500 ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </div>
          </CardHeader>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <CardContent className="p-8 pt-0 border-t border-black/5 bg-gray-50/30">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Location
                      </label>
                      <div className="relative group">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="e.g. Paris, France"
                          value={filters.localisation}
                          onChange={(e) =>
                            setFilters({ ...filters, localisation: e.target.value })
                          }
                          className="pl-10 h-12 bg-white border-black/5 rounded-xl font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Availability
                      </label>
                      <Select
                        value={filters.disponibilite}
                        onValueChange={(value) =>
                          setFilters({ ...filters, disponibilite: value })
                        }
                      >
                        <SelectTrigger className="h-12 bg-white border-black/5 rounded-xl font-bold">
                          <SelectValue placeholder="All status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-black/5 shadow-large">
                          <SelectItem value="DISPONIBLE">Available</SelectItem>
                          <SelectItem value="PARTIELLEMENT_DISPONIBLE">
                            Partial
                          </SelectItem>
                          <SelectItem value="OCCUPE">Busy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Min Followers
                      </label>
                      <div className="relative group">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="number"
                          placeholder="e.g. 10000"
                          value={filters.minFollowers || ""}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              minFollowers: parseInt(e.target.value) || 0,
                            })
                          }
                          className="pl-10 h-12 bg-white border-black/5 rounded-xl font-bold"
                        />
                      </div>
                    </div>

                    <div className="flex items-end gap-2">
                      <Button
                        variant="outline"
                        onClick={resetFilters}
                        className="flex-1 h-12 border-2 border-black/5 hover:bg-black hover:text-white font-black rounded-xl transition-all"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Results */}
      {filteredInfluencers.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredInfluencers.map((influencer, idx) => (
            <InfluencerCard key={influencer.id} influencer={influencer} index={idx} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-white border-black/5 rounded-[3rem] border-dashed border-2 shadow-soft">
            <CardContent className="flex flex-col items-center justify-center py-24">
              <div className="p-8 bg-gray-50 rounded-full mb-8">
                <Search className="w-16 h-16 text-gray-300" />
              </div>
              <h3 className="text-3xl font-black text-black mb-3">No influencers found</h3>
              <p className="text-gray-500 text-center mb-10 max-w-md font-medium text-lg leading-relaxed">
                We couldn't find anyone matching your current filters. Try broadening your search.
              </p>
              <Button
                onClick={resetFilters}
                className="bg-black hover:bg-gray-800 text-white font-black px-10 h-14 rounded-2xl shadow-xl transition-all"
              >
                Clear all filters
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default InfluencerSearchPage;

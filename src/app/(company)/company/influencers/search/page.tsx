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
import Image from "next/image";

interface Filters {
  localisation: string;
  disponibilite: string;
  minFollowers: number;
  categoryIds: string[];
  searchTerm: string;
}

const InfluencerCard = ({ influencer }: { influencer: Influencer }) => {
  const stats = influencer.statistiquesGlobales;
  const [showProposalModal, setShowProposalModal] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card className="bg-slate-900 border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 overflow-hidden group">
      <div className="relative h-48 bg-linear-to-br from-emerald-500/20 to-blue-500/20">
        {influencer.instagramData?.profile_pic_url ? (
          <Image
            src={influencer.instagramData.profile_pic_url}
            alt={influencer.pseudo || "Influencer"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Users className="w-16 h-16 text-slate-700" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge
            className={`${
              influencer.disponibiliteCollaboration === "DISPONIBLE"
                ? "bg-emerald-500/90 text-white"
                : influencer.disponibiliteCollaboration === "PARTIELLEMENT_DISPONIBLE"
                ? "bg-yellow-500/90 text-white"
                : "bg-red-500/90 text-white"
            }`}
          >
            {influencer.disponibiliteCollaboration === "DISPONIBLE"
              ? "Disponible"
              : influencer.disponibiliteCollaboration === "PARTIELLEMENT_DISPONIBLE"
              ? "Partiellement"
              : "Occupé"}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-lg mb-1">
              {influencer.pseudo || influencer.user.name}
            </CardTitle>
            {influencer.instagramUsername && (
              <div className="flex items-center gap-1 text-sm text-slate-400">
                <Instagram className="w-4 h-4" />
                <span>@{influencer.instagramUsername}</span>
              </div>
            )}
          </div>
        </div>
        <CardDescription className="text-slate-400 line-clamp-2 mt-2">
          {influencer.biography || "Aucune biographie disponible"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Categories */}
        {influencer.selectedCategories && influencer.selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {influencer.selectedCategories.slice(0, 3).map((category) => (
              <Badge
                key={category.id}
                variant="outline"
                className="border-emerald-500/30 text-emerald-400 text-xs"
              >
                {category.name}
              </Badge>
            ))}
            {influencer.selectedCategories.length > 3 && (
              <Badge
                variant="outline"
                className="border-slate-500/30 text-slate-400 text-xs"
              >
                +{influencer.selectedCategories.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Location */}
        {influencer.localisation && (
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{influencer.localisation}</span>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-400 font-semibold">
                <Users className="w-4 h-4" />
                <span className="text-sm">{formatNumber(stats.nombreAbonnes)}</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Abonnés</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-400 font-semibold">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{formatNumber(stats.nombrePublications)}</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Posts</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-pink-400 font-semibold">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">{stats.tauxEngagement.toFixed(1)}%</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Engagement</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
            asChild
          >
            <Link href={`/company/influencers/${influencer.id}`}>
              Voir Profil
            </Link>
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
            onClick={() => setShowProposalModal(true)}
          >
            <Send className="w-4 h-4 mr-2" />
            Proposer
          </Button>
        </div>
      </CardContent>
    </Card>
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
      setInfluencers(data.allInfluencers);
      setFilteredInfluencers(data.allInfluencers);
    } catch (error) {
      console.error("Error fetching influencers:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...influencers];

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (inf) =>
          inf.pseudo?.toLowerCase().includes(searchLower) ||
          inf.instagramUsername?.toLowerCase().includes(searchLower) ||
          inf.biography?.toLowerCase().includes(searchLower) ||
          inf.user.name?.toLowerCase().includes(searchLower)
      );
    }

    // Location filter
    if (filters.localisation) {
      filtered = filtered.filter((inf) =>
        inf.localisation?.toLowerCase().includes(filters.localisation.toLowerCase())
      );
    }

    // Availability filter
    if (filters.disponibilite) {
      filtered = filtered.filter(
        (inf) => inf.disponibiliteCollaboration === filters.disponibilite
      );
    }

    // Min followers filter
    if (filters.minFollowers > 0) {
      filtered = filtered.filter(
        (inf) =>
          inf.statistiquesGlobales &&
          inf.statistiquesGlobales.nombreAbonnes >= filters.minFollowers
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
      <div className="space-y-6">
        <Skeleton className="h-12 w-full bg-slate-800" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-96 bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Recherche d&apos;Influenceurs 🔍
          </h1>
          <p className="text-slate-400">
            Trouvez les meilleurs influenceurs pour vos campagnes
          </p>
        </div>
        <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
          {filteredInfluencers.length} résultat{filteredInfluencers.length > 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Search and Filters */}
      <Card className="bg-slate-900 border-emerald-500/10">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Rechercher par nom, pseudo, @username..."
                value={filters.searchTerm}
                onChange={(e) =>
                  setFilters({ ...filters, searchTerm: e.target.value })
                }
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres
              <ChevronDown
                className={`w-4 h-4 ml-2 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>
        </CardHeader>

        {showFilters && (
          <CardContent className="border-t border-slate-800 pt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Localisation
                </label>
                <Input
                  placeholder="Ex: Paris, France"
                  value={filters.localisation}
                  onChange={(e) =>
                    setFilters({ ...filters, localisation: e.target.value })
                  }
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Disponibilité
                </label>
                <Select
                  value={filters.disponibilite}
                  onValueChange={(value) =>
                    setFilters({ ...filters, disponibilite: value })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Toutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes</SelectItem>
                    <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                    <SelectItem value="PARTIELLEMENT_DISPONIBLE">
                      Partiellement disponible
                    </SelectItem>
                    <SelectItem value="OCCUPE">Occupé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Abonnés minimum
                </label>
                <Input
                  type="number"
                  placeholder="Ex: 10000"
                  value={filters.minFollowers || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minFollowers: parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Réinitialiser
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Results */}
      {filteredInfluencers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredInfluencers.map((influencer) => (
            <InfluencerCard key={influencer.id} influencer={influencer} />
          ))}
        </div>
      ) : (
        <Card className="bg-slate-900 border-emerald-500/10">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Search className="w-16 h-16 text-slate-700 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-slate-400 text-center mb-4">
              Essayez de modifier vos critères de recherche
            </p>
            <Button
              onClick={resetFilters}
              variant="outline"
              className="border-emerald-500/30 text-emerald-400"
            >
              Réinitialiser les filtres
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InfluencerSearchPage;

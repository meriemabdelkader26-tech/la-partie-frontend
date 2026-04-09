"use client";

import { useEffect, useState } from "react";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_MY_OFFERS } from "@/lib/queries/offer-queries";
import { Offer, ApplicationStatus } from "@/lib/types/offer-types";
import {
  Megaphone,
  Calendar,
  Users,
  DollarSign,
  Plus,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  FileText,
  Target,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OfferCard = ({ offer }: { offer: Offer }) => {
  const now = new Date();
  const startDate = new Date(offer.startDate);
  const endDate = new Date(offer.endDate);

  const isActive = now >= startDate && now <= endDate;
  const isUpcoming = now < startDate;
  const isCompleted = now > endDate;

  const daysRemaining = isActive
    ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const applications = offer.applications || [];
  const pendingCount = applications.filter(
    (app) => app.status === ApplicationStatus.PENDING
  ).length;
  const approvedCount = applications.filter(
    (app) => app.status === ApplicationStatus.APPROVED
  ).length;
  const rejectedCount = applications.filter(
    (app) => app.status === ApplicationStatus.REJECTED
  ).length;

  const getStatusBadge = () => {
    if (isActive) {
      return (
        <Badge className="bg-emerald-500/90 text-white">
          <Clock className="w-3 h-3 mr-1" />
          En cours
        </Badge>
      );
    }
    if (isUpcoming) {
      return (
        <Badge className="bg-blue-500/90 text-white">
          <Calendar className="w-3 h-3 mr-1" />
          À venir
        </Badge>
      );
    }
    return (
      <Badge className="bg-slate-500/90 text-white">
        <CheckCircle className="w-3 h-3 mr-1" />
        Terminée
      </Badge>
    );
  };

  return (
    <Card className="bg-slate-900 border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-white text-lg">{offer.title}</CardTitle>
              {getStatusBadge()}
            </div>
            <CardDescription className="text-slate-400 line-clamp-2">
              {offer.objectif}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
              <Link href={`/company/campaigns/${offer.id}`}>
                <DropdownMenuItem className="text-slate-300 hover:text-white cursor-pointer">
                  <Eye className="w-4 h-4 mr-2" />
                  Voir détails
                </DropdownMenuItem>
              </Link>
              <Link href={`/company/campaigns/${offer.id}/edit`}>
                <DropdownMenuItem className="text-slate-300 hover:text-white cursor-pointer">
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
              </Link>
              <Link href={`/company/campaigns/${offer.id}/applications`}>
                <DropdownMenuItem className="text-slate-300 hover:text-white cursor-pointer">
                  <Users className="w-4 h-4 mr-2" />
                  Gérer les candidatures
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Budget */}
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">
            Budget: <span className="text-white font-semibold">${offer.minBudget} - ${offer.maxBudget}</span>
          </span>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">
            {new Date(offer.startDate).toLocaleDateString("fr-FR")} -{" "}
            {new Date(offer.endDate).toLocaleDateString("fr-FR")}
          </span>
        </div>

        {/* Influencers needed */}
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">
            {offer.influencerNumber} influenceurs recherchés
          </span>
        </div>

        {/* Days remaining (if active) */}
        {isActive && daysRemaining !== null && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-medium">
              {daysRemaining} jour{daysRemaining > 1 ? "s" : ""} restant{daysRemaining > 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Applications Stats */}
        <div className="pt-4 border-t border-slate-800">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-400">{pendingCount}</div>
              <div className="text-xs text-slate-400">En attente</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">{approvedCount}</div>
              <div className="text-xs text-slate-400">Approuvées</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{rejectedCount}</div>
              <div className="text-xs text-slate-400">Rejetées</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
            asChild
          >
            <Link href={`/company/campaigns/${offer.id}`}>
              <Eye className="w-4 h-4 mr-2" />
              Voir détails
            </Link>
          </Button>
          {pendingCount > 0 && (
            <Button
              size="sm"
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              asChild
            >
              <Link href={`/company/campaigns/${offer.id}/applications`}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Examiner ({pendingCount})
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const CampaignsPage = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await graphqlClient.request(GET_MY_OFFERS);
      setOffers(data.myOffers || []);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOffers = () => {
    let filtered = offers;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (offer) =>
          offer.title.toLowerCase().includes(searchLower) ||
          offer.objectif.toLowerCase().includes(searchLower) ||
          offer.requirement.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
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

  const filteredOffers = filterOffers();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full bg-slate-800" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
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
            Gestion des Offres �
          </h1>
          <p className="text-slate-400">
            Gérez vos offres de collaboration et examinez les candidatures d&apos;influenceurs
          </p>
        </div>
        <Link href="/company/campaigns/new">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Offre
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="bg-slate-900 border-emerald-500/10">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Rechercher une offre par titre, objectif..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-900 border border-emerald-500/10">
          <TabsTrigger value="all" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            Toutes ({offers.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            <Clock className="w-4 h-4 mr-2" />
            Actives
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            <Calendar className="w-4 h-4 mr-2" />
            À venir
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Terminées
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredOffers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          ) : (
            <Card className="bg-slate-900 border-emerald-500/10">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Megaphone className="w-16 h-16 text-slate-700 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Aucune offre trouvée
                </h3>
                <p className="text-slate-400 text-center mb-4">
                  {searchTerm
                    ? "Essayez de modifier votre recherche"
                    : "Créez votre première offre pour commencer"}
                </p>
                {!searchTerm && (
                  <Link href="/company/campaigns/new">
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Créer une offre
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignsPage;

"use client";

import { useEffect, useState } from "react";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_COMPANY_DASHBOARD_STATS } from "@/lib/queries/offer-queries";
import { GET_MY_COMPANY_PROFILE } from "@/lib/queries/company-queries";
import { CompanyDashboardStats } from "@/lib/types/offer-types";
import { Company } from "@/lib/types/company-types";
import { 
  Briefcase, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, icon, description, trend }: StatCardProps) => {
  return (
    <Card className="bg-slate-900 border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">
          {title}
        </CardTitle>
        <div className="text-emerald-400">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        {description && (
          <p className="text-xs text-slate-400">{description}</p>
        )}
        {trend && (
          <div className={`text-xs flex items-center gap-1 mt-2 ${
            trend.isPositive ? "text-emerald-400" : "text-red-400"
          }`}>
            <TrendingUp className="w-3 h-3" />
            <span>{trend.value}% depuis le mois dernier</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const OfferCard = ({ offer }: { offer: any }) => {
  const daysUntilStart = Math.ceil(
    (new Date(offer.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="bg-slate-900 border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-lg mb-2">{offer.title}</CardTitle>
            <CardDescription className="text-slate-400">
              Budget: ${offer.minBudget} - ${offer.maxBudget}
            </CardDescription>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            daysUntilStart > 0 
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
          }`}>
            {daysUntilStart > 0 ? `Dans ${daysUntilStart}j` : "En cours"}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>
              {new Date(offer.startDate).toLocaleDateString("fr-FR")} - {" "}
              {new Date(offer.endDate).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>{offer.influencerNumber} influenceurs recherchés</span>
          </div>
          <Link href={`/company/campaigns/${offer.id}`}>
            <Button variant="outline" size="sm" className="w-full mt-2 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10">
              Voir les détails
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const ApplicationCard = ({ application }: { application: any }) => {
  const statusConfig = {
    Pending: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", label: "En attente" },
    Approved: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Approuvé" },
    Rejected: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: "Rejeté" },
    Withdraw: { color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20", label: "Retiré" },
  };

  const status = statusConfig[application.status as keyof typeof statusConfig] || statusConfig.Pending;

  return (
    <Card className="bg-slate-900 border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-base mb-1">{application.offer.title}</CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              {application.user.name} - {application.user.email}
            </CardDescription>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color} border ${status.border}`}>
            {status.label}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-slate-300">
            <span className="text-slate-400">Prix demandé:</span>{" "}
            <span className="font-semibold text-emerald-400">${application.askingPrice}</span>
          </div>
          <div className="text-xs text-slate-400">
            Soumis le {new Date(application.submittedAt).toLocaleDateString("fr-FR")}
          </div>
          <Link href={`/company/campaigns/applications/${application.id}`}>
            <Button variant="outline" size="sm" className="w-full mt-2 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10">
              Voir la proposition
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardPage = () => {
  const [stats, setStats] = useState<CompanyDashboardStats | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch company profile
        const companyData = await graphqlClient.request(GET_MY_COMPANY_PROFILE);
        setCompany(companyData.myCompanyProfile);

        // Fetch dashboard stats
        const statsData = await graphqlClient.request(GET_COMPANY_DASHBOARD_STATS);
        setStats(statsData.companyDashboardStats);
        
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64 bg-slate-800" />
          <Skeleton className="h-10 w-40 bg-slate-800" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="bg-red-500/10 border-red-500/20">
          <CardHeader>
            <CardTitle className="text-red-400">Erreur</CardTitle>
            <CardDescription className="text-red-300">{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Bienvenue, {company?.companyName || "Entreprise"} 👋
          </h1>
          <p className="text-slate-400">
            Voici un aperçu de vos campagnes et propositions
          </p>
        </div>
        <Link href="/company/campaigns/new">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Briefcase className="w-4 h-4 mr-2" />
            Nouvelle Campagne
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Campagnes Totales"
          value={stats?.totalOffers || 0}
          icon={<Briefcase className="w-5 h-5" />}
          description="Total de campagnes créées"
        />
        <StatCard
          title="Campagnes Actives"
          value={stats?.activeOffers || 0}
          icon={<TrendingUp className="w-5 h-5" />}
          description="En cours actuellement"
        />
        <StatCard
          title="Propositions Totales"
          value={stats?.totalApplications || 0}
          icon={<Users className="w-5 h-5" />}
          description="Reçues au total"
        />
        <StatCard
          title="En Attente"
          value={stats?.pendingApplications || 0}
          icon={<Clock className="w-5 h-5" />}
          description="À examiner"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-slate-900 border-emerald-500/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Propositions Approuvées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-emerald-400">
              {stats?.approvedApplications || 0}
            </div>
            <p className="text-slate-400 text-sm mt-2">Collaborations confirmées</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-emerald-500/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              Propositions Rejetées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-400">
              {stats?.rejectedApplications || 0}
            </div>
            <p className="text-slate-400 text-sm mt-2">Non retenues</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Offers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Campagnes Récentes</h2>
          <Link href="/company/campaigns">
            <Button variant="ghost" className="text-emerald-400 hover:text-emerald-300">
              Voir tout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        {stats?.recentOffers && stats.recentOffers.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stats.recentOffers.slice(0, 3).map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        ) : (
          <Card className="bg-slate-900 border-emerald-500/10">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Briefcase className="w-12 h-12 text-slate-600 mb-4" />
              <p className="text-slate-400 text-center mb-4">
                Aucune campagne pour le moment
              </p>
              <Link href="/company/campaigns/new">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  Créer votre première campagne
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Applications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Propositions Récentes</h2>
          <Link href="/company/campaigns">
            <Button variant="ghost" className="text-emerald-400 hover:text-emerald-300">
              Voir tout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        {stats?.recentApplications && stats.recentApplications.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stats.recentApplications.slice(0, 3).map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        ) : (
          <Card className="bg-slate-900 border-emerald-500/10">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Users className="w-12 h-12 text-slate-600 mb-4" />
              <p className="text-slate-400 text-center">
                Aucune proposition reçue pour le moment
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
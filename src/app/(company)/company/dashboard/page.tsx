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
    <Card className="bg-pastel-dark-blue border-pastel-green/10 hover:border-pastel-green/30 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-pastel-blue">
          {title}
        </CardTitle>
        <div className="text-pastel-green">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-pastel-dark-blue mb-1">{value}</div>
        {description && (
          <p className="text-xs text-pastel-blue">{description}</p>
        )}
        {trend && (
          <div className={`text-xs flex items-center gap-1 mt-2 ${
            trend.isPositive ? "text-pastel-green" : "text-pastel-red"
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
    <Card className="bg-pastel-dark-blue border-pastel-green/10 hover:border-pastel-green/30 transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-pastel-dark-blue text-lg mb-2">{offer.title}</CardTitle>
            <CardDescription className="text-pastel-blue">
              Budget: ${offer.minBudget} - ${offer.maxBudget}
            </CardDescription>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            daysUntilStart > 0 
              ? "bg-pastel-green/10 text-pastel-green border border-pastel-green/20" 
              : "bg-pastel-blue/10 text-pastel-blue border border-pastel-blue/20"
          }`}>
            {daysUntilStart > 0 ? `Dans ${daysUntilStart}j` : "En cours"}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-pastel-blue">
            <Calendar className="w-4 h-4 text-pastel-green" />
            <span>
              {new Date(offer.startDate).toLocaleDateString("fr-FR")} - {" "}
              {new Date(offer.endDate).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-pastel-blue">
            <Users className="w-4 h-4 text-pastel-green" />
            <span>{offer.influencerNumber} influenceurs recherchés</span>
          </div>
          <Link href={`/company/campaigns/${offer.id}`}>
            <Button variant="outline" size="sm" className="w-full mt-2 border-pastel-green/20 text-pastel-green hover:bg-pastel-green/10">
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
    Pending: { color: "text-pastel-blue", bg: "bg-pastel-blue/10", border: "border-pastel-blue/20", label: "En attente" },
    Approved: { color: "text-pastel-green", bg: "bg-pastel-green/10", border: "border-pastel-green/20", label: "Approuvé" },
    Rejected: { color: "text-pastel-red", bg: "bg-pastel-red/10", border: "border-pastel-red/20", label: "Rejeté" },
    Withdraw: { color: "text-pastel-dark-blue", bg: "bg-pastel-dark-blue/10", border: "border-pastel-dark-blue/20", label: "Retiré" },
  };

  const status = statusConfig[application.status as keyof typeof statusConfig] || statusConfig.Pending;

  return (
    <Card className="bg-pastel-dark-blue border-pastel-green/10 hover:border-pastel-green/30 transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-pastel-blue text-base mb-1">{application.offer.title}</CardTitle>
            <CardDescription className="text-pastel-blue text-sm">
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
          <div className="text-sm text-pastel-blue">
            <span className="text-pastel-dark-blue">Prix demandé:</span>{" "}
            <span className="font-semibold text-pastel-green">${application.askingPrice}</span>
          </div>
          <div className="text-xs text-pastel-blue">
            Soumis le {new Date(application.submittedAt).toLocaleDateString("fr-FR")}
          </div>
          <Link href={`/company/campaigns/applications/${application.id}`}>
            <Button variant="outline" size="sm" className="w-full mt-2 border-pastel-green/20 text-pastel-green hover:bg-pastel-green/10">
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
          <h1 className="text-3xl font-bold text-pastel-blue mb-2">
            Bienvenue, {company?.companyName || "Entreprise"} 👋
          </h1>
          <p className="text-pastel-blue">
            Voici un aperçu de vos campagnes et propositions
          </p>
        </div>
        <Link href="/company/campaigns/new">
          <Button className="bg-pastel-green hover:bg-pastel-red text-pastel-dark-blue">
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
        <Card className="bg-pastel-dark-blue border-pastel-green/10">
          <CardHeader>
            <CardTitle className="text-pastel-blue flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-pastel-green" />
              Propositions Approuvées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-pastel-green">
              {stats?.approvedApplications || 0}
            </div>
            <p className="text-pastel-blue text-sm mt-2">Collaborations confirmées</p>
          </CardContent>
        </Card>

        <Card className="bg-pastel-dark-blue border-pastel-green/10">
          <CardHeader>
            <CardTitle className="text-pastel-blue flex items-center gap-2">
              <XCircle className="w-5 h-5 text-pastel-red" />
              Propositions Rejetées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-pastel-red">
              {stats?.rejectedApplications || 0}
            </div>
            <p className="text-pastel-blue text-sm mt-2">Non retenues</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Offers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-pastel-blue">Campagnes Récentes</h2>
          <Link href="/company/campaigns">
            <Button variant="ghost" className="text-pastel-green hover:text-pastel-red">
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
          <Card className="bg-pastel-dark-blue border-pastel-green/10">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Briefcase className="w-12 h-12 text-pastel-blue mb-4" />
              <p className="text-pastel-blue text-center mb-4">
                Aucune campagne pour le moment
              </p>
              <Link href="/company/campaigns/new">
                <Button className="bg-pastel-green hover:bg-pastel-red text-pastel-dark-blue">
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
          <h2 className="text-2xl font-bold text-pastel-blue">Propositions Récentes</h2>
          <Link href="/company/campaigns">
            <Button variant="ghost" className="text-pastel-green hover:text-pastel-red">
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
          <Card className="bg-pastel-dark-blue border-pastel-green/10">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Users className="w-12 h-12 text-pastel-blue mb-4" />
              <p className="text-pastel-blue text-center">
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
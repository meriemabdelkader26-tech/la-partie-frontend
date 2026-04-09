"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Mail,
  User,
} from "lucide-react";
import { request, gql } from "graphql-request";

interface Offer {
  id: string;
  title: string;
  applications?: OfferApplication[];
}

interface OfferApplication {
  id: string;
  influencer: {
    id: string;
    username: string;
    email: string;
    profile?: {
      fullName?: string;
      profilePicture?: string;
      bio?: string;
    };
  };
  message: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "WITHDRAW";
  createdAt: string;
}

const GET_OFFER_APPLICATIONS = gql`
  query GetOfferApplications($id: ID!) {
    offer(id: $id) {
      id
      title
      applications {
        id
        influencer {
          id
          username
          email
          profile {
            fullName
            profilePicture
            bio
          }
        }
        message
        status
        createdAt
      }
    }
  }
`;

const APPROVE_APPLICATION = gql`
  mutation ApproveApplication($applicationId: ID!) {
    approveApplication(applicationId: $applicationId) {
      application {
        id
        status
      }
    }
  }
`;

const REJECT_APPLICATION = gql`
  mutation RejectApplication($applicationId: ID!) {
    rejectApplication(applicationId: $applicationId) {
      application {
        id
        status
      }
    }
  }
`;

export default function ApplicationsManagementPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = params.id as string;

  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [offerId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

      if (!token) {
        router.push("/auth/login");
        return;
      }

      const data: any = await request(
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
        GET_OFFER_APPLICATIONS,
        { id: offerId },
        { Authorization: `JWT ${token}` }
      );

      setOffer(data.offer);
    } catch (err: any) {
      console.error("Erreur lors du chargement des candidatures:", err);
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId: string) => {
    try {
      setActionLoading(applicationId);

      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

      if (!token) {
        router.push("/auth/login");
        return;
      }

      await request(
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
        APPROVE_APPLICATION,
        { applicationId },
        { Authorization: `JWT ${token}` }
      );

      // Refresh applications
      await fetchApplications();
    } catch (err: any) {
      console.error("Erreur lors de l'approbation:", err);
      alert(err.message || "Erreur lors de l'approbation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (applicationId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir rejeter cette candidature ?")) {
      return;
    }

    try {
      setActionLoading(applicationId);

      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

      if (!token) {
        router.push("/auth/login");
        return;
      }

      await request(
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
        REJECT_APPLICATION,
        { applicationId },
        { Authorization: `JWT ${token}` }
      );

      // Refresh applications
      await fetchApplications();
    } catch (err: any) {
      console.error("Erreur lors du rejet:", err);
      alert(err.message || "Erreur lors du rejet");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: "En attente", className: "bg-yellow-500" },
      APPROVED: { label: "Approuvée", className: "bg-green-500" },
      REJECTED: { label: "Rejetée", className: "bg-red-500" },
      WITHDRAW: { label: "Retirée", className: "bg-gray-500" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      className: "bg-gray-500",
    };

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "WITHDRAW":
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const filterApplications = (applications: OfferApplication[], status?: string) => {
    let filtered = applications;

    // Filter by status
    if (status && status !== "all") {
      filtered = filtered.filter((app) => app.status === status.toUpperCase());
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.influencer.username
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          app.influencer.profile?.fullName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          app.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg mb-4">
          {error || "Offre non trouvée"}
        </p>
        <Button onClick={() => router.push("/company/campaigns")}>
          Retour aux offres
        </Button>
      </div>
    );
  }

  const applications = offer.applications || [];
  const pendingCount = applications.filter((app) => app.status === "PENDING").length;
  const approvedCount = applications.filter((app) => app.status === "APPROVED").length;
  const rejectedCount = applications.filter((app) => app.status === "REJECTED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/company/campaigns/${offerId}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Gestion des candidatures
            </h1>
            <p className="text-slate-600 mt-1">{offer.title}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-slate-600">Total</p>
                <p className="text-2xl font-bold">{applications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-slate-600">En attente</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-slate-600">Approuvées</p>
                <p className="text-2xl font-bold">{approvedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-slate-600">Rejetées</p>
                <p className="text-2xl font-bold">{rejectedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par nom d'influenceur ou message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Applications List with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            Toutes ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            En attente ({pendingCount})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approuvées ({approvedCount})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejetées ({rejectedCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ApplicationsList
            applications={filterApplications(applications)}
            onApprove={handleApprove}
            onReject={handleReject}
            actionLoading={actionLoading}
            getStatusBadge={getStatusBadge}
            getStatusIcon={getStatusIcon}
          />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <ApplicationsList
            applications={filterApplications(applications, "pending")}
            onApprove={handleApprove}
            onReject={handleReject}
            actionLoading={actionLoading}
            getStatusBadge={getStatusBadge}
            getStatusIcon={getStatusIcon}
          />
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <ApplicationsList
            applications={filterApplications(applications, "approved")}
            onApprove={handleApprove}
            onReject={handleReject}
            actionLoading={actionLoading}
            getStatusBadge={getStatusBadge}
            getStatusIcon={getStatusIcon}
          />
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <ApplicationsList
            applications={filterApplications(applications, "rejected")}
            onApprove={handleApprove}
            onReject={handleReject}
            actionLoading={actionLoading}
            getStatusBadge={getStatusBadge}
            getStatusIcon={getStatusIcon}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ApplicationsListProps {
  applications: OfferApplication[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  actionLoading: string | null;
  getStatusBadge: (status: string) => React.ReactElement;
  getStatusIcon: (status: string) => React.ReactElement;
}

function ApplicationsList({
  applications,
  onApprove,
  onReject,
  actionLoading,
  getStatusBadge,
  getStatusIcon,
}: ApplicationsListProps) {
  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <User className="h-12 w-12 mx-auto mb-3 text-slate-400" />
          <p className="text-slate-600">Aucune candidature trouvée</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id} className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                {application.influencer.profile?.profilePicture ? (
                  <img
                    src={application.influencer.profile.profilePicture}
                    alt={application.influencer.username}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-700 font-semibold text-lg">
                      {application.influencer.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {application.influencer.profile?.fullName ||
                      application.influencer.username}
                  </h3>
                  <p className="text-sm text-slate-600">
                    @{application.influencer.username}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Mail className="h-3 w-3 text-slate-400" />
                    <p className="text-xs text-slate-500">
                      {application.influencer.email}
                    </p>
                  </div>
                  {application.influencer.profile?.bio && (
                    <p className="text-sm text-slate-600 mt-2">
                      {application.influencer.profile.bio}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(application.status)}
                {getStatusBadge(application.status)}
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-slate-700 mb-2">
                Message de candidature :
              </p>
              <p className="text-slate-700">{application.message}</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Postulé le{" "}
                {new Date(application.createdAt).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              {application.status === "PENDING" && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReject(application.id)}
                    disabled={actionLoading === application.id}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Rejeter
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onApprove(application.id)}
                    disabled={actionLoading === application.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Approuver
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

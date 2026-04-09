"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  DollarSign,
  Users,
  Target,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { request, gql } from "graphql-request";

interface Offer {
  id: string;
  title: string;
  objectif: string;
  requirement: string;
  minBudget: number;
  maxBudget: number;
  startDate: string;
  endDate: string;
  influencerNumber: number;
  createdAt: string;
  applications?: OfferApplication[];
}

interface OfferApplication {
  id: string;
  influencer: {
    id: string;
    username: string;
    profile?: {
      fullName?: string;
      profilePicture?: string;
    };
  };
  message: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "WITHDRAW";
  createdAt: string;
}

const GET_OFFER = gql`
  query GetOffer($id: ID!) {
    offer(id: $id) {
      id
      title
      objectif
      requirement
      minBudget
      maxBudget
      startDate
      endDate
      influencerNumber
      createdAt
      applications {
        id
        influencer {
          id
          username
          profile {
            fullName
            profilePicture
          }
        }
        message
        status
        createdAt
      }
    }
  }
`;

const DELETE_OFFER = gql`
  mutation DeleteOffer($offerId: ID!) {
    deleteOffer(offerId: $offerId) {
      success
      message
    }
  }
`;

export default function OfferDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = params.id as string;

  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchOffer();
  }, [offerId]);

  const fetchOffer = async () => {
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
        GET_OFFER,
        { id: offerId },
        { Authorization: `JWT ${token}` }
      );

      setOffer(data.offer);
    } catch (err: any) {
      console.error("Erreur lors du chargement de l'offre:", err);
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

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
        DELETE_OFFER,
        { offerId },
        { Authorization: `JWT ${token}` }
      );

      router.push("/company/campaigns");
    } catch (err: any) {
      console.error("Erreur lors de la suppression:", err);
      alert(err.message || "Erreur lors de la suppression");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
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

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg mb-4">{error || "Offre non trouvée"}</p>
        <Button onClick={() => router.push("/company/campaigns")}>
          Retour aux offres
        </Button>
      </div>
    );
  }

  const pendingApplications = offer.applications?.filter(
    (app) => app.status === "PENDING"
  ).length || 0;
  const approvedApplications = offer.applications?.filter(
    (app) => app.status === "APPROVED"
  ).length || 0;
  const totalApplications = offer.applications?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {offer.title}
          </h1>
          <p className="text-slate-600">
            Créée le {new Date(offer.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/company/campaigns/${offerId}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setShowDeleteModal(true)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm text-slate-600">Candidatures</p>
                <p className="text-2xl font-bold">{totalApplications}</p>
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
                <p className="text-2xl font-bold">{pendingApplications}</p>
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
                <p className="text-2xl font-bold">{approvedApplications}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-slate-600">Objectif</p>
                <p className="text-2xl font-bold">{offer.influencerNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Offer Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Objectif de la collaboration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 whitespace-pre-wrap">{offer.objectif}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Exigences</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 whitespace-pre-wrap">
              {offer.requirement}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Budget</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Budget minimum:</span>
                <span className="font-semibold">
                  {offer.minBudget.toLocaleString()} €
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Budget maximum:</span>
                <span className="font-semibold">
                  {offer.maxBudget.toLocaleString()} €
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Période</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Date de début:</span>
                <span className="font-semibold">
                  {new Date(offer.startDate).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Date de fin:</span>
                <span className="font-semibold">
                  {new Date(offer.endDate).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Candidatures reçues</span>
            </span>
            {totalApplications > 0 && (
              <Button
                onClick={() =>
                  router.push(`/company/campaigns/${offerId}/applications`)
                }
              >
                Gérer les candidatures
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {totalApplications === 0 ? (
            <div className="text-center py-8 text-slate-600">
              <Users className="h-12 w-12 mx-auto mb-3 text-slate-400" />
              <p>Aucune candidature pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {offer.applications?.map((application) => (
                <div
                  key={application.id}
                  className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {application.influencer.profile?.profilePicture ? (
                        <img
                          src={application.influencer.profile.profilePicture}
                          alt={application.influencer.username}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <span className="text-emerald-700 font-semibold">
                            {application.influencer.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">
                          {application.influencer.profile?.fullName ||
                            application.influencer.username}
                        </p>
                        <p className="text-sm text-slate-600">
                          @{application.influencer.username}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(application.status)}
                      {getStatusBadge(application.status)}
                    </div>
                  </div>
                  <p className="text-slate-700 mb-2">{application.message}</p>
                  <p className="text-xs text-slate-500">
                    Postulé le{" "}
                    {new Date(application.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center space-x-2">
                <Trash2 className="h-5 w-5" />
                <span>Confirmer la suppression</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700">
                Êtes-vous sûr de vouloir supprimer l'offre "{offer.title}" ?
                Cette action est irréversible.
              </p>
              {totalApplications > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Cette offre a {totalApplications} candidature(s). Toutes les
                    candidatures seront également supprimées.
                  </p>
                </div>
              )}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                >
                  Annuler
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Suppression..." : "Supprimer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  ArrowLeft,
  Briefcase,
  ArrowUpRight,
  ChevronRight
} from "lucide-react";
import { graphqlClient } from "@/lib/graphql-client";
import { gql } from "graphql-request";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { RecommendedInfluencers } from "./_components/RecommendedInfluencers";

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
  user: {
    id: string;
    name: string;
    email: string;
    influencerProfile?: {
      pseudo?: string;
      profilePicture?: string;
    };
  };
  proposal: string;
  status: "Pending" | "Approved" | "Rejected" | "Withdraw";
  submittedAt: string;
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
        user {
          id
          name
          email
          influencerProfile {
            profilePicture
            pseudo
          }
        }
        proposal
        status
        submittedAt
      }
    }
  }
`;

const DELETE_OFFER = gql`
  mutation DeleteOffer($id: ID!) {
    deleteOffer(id: $id) {
      success
      message
    }
  }
`;

export default function OfferDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = decodeURIComponent(params.id as string);

  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await graphqlClient.request<{ offer: Offer }>(
          GET_OFFER,
          { id: offerId }
        );

        setOffer(data.offer);
      } catch (err: unknown) {
        console.error("Error loading offer:", err);
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [offerId]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      const data = await graphqlClient.request<{ deleteOffer: { success: boolean; message: string } }>(
        DELETE_OFFER,
        { id: offerId }
      );

      if (data.deleteOffer.success) {
        toast.success("Offer deleted successfully");
        router.push("/company/campaigns");
      } else {
        toast.error(data.deleteOffer.message || "Offer not found or already deleted");
      }
    } catch (err: unknown) {
      console.error("Error deleting offer:", err);
      const errorMessage = err instanceof Error ? err.message : "Error deleting offer";
      toast.error(errorMessage);
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: "Pending", className: "bg-gray-100 text-gray-600 border-gray-200" },
      APPROVED: { label: "Approved", className: "bg-slate-900 text-white border-slate-900" },
      REJECTED: { label: "Rejected", className: "bg-rose-50 text-rose-600 border-rose-100" },
      WITHDRAW: { label: "Withdrawn", className: "bg-gray-50 text-gray-400 border-gray-100" },
    };

    const config = statusConfig[status.toUpperCase() as keyof typeof statusConfig] || {
      label: status,
      className: "bg-gray-100 text-gray-500 border-gray-200",
    };

    return <Badge className={`${config.className} border font-bold uppercase text-[10px] tracking-widest px-3 py-1 rounded-lg shadow-sm`}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
        return <CheckCircle className="h-4 w-4 text-slate-900" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-rose-500" />;
      case "WITHDRAW":
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse max-w-7xl mx-auto px-4 pb-12">
        <div className="h-20 w-3/4 bg-gray-100 rounded-3xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 bg-gray-100 rounded-3xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-64 bg-gray-100 rounded-3xl" />
          <Skeleton className="h-64 bg-gray-100 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md"
        >
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto border border-rose-100">
            <AlertCircle className="w-10 h-10 text-rose-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Offer not found</h3>
            <p className="text-gray-500 font-medium">{error || "The offer you are looking for does not exist or has been removed."}</p>
          </div>
          <Button 
            onClick={() => router.push("/company/campaigns")}
            className="bg-slate-900 hover:bg-black text-white font-semibold h-12 px-8 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Back to Campaigns
          </Button>
        </motion.div>
      </div>
    );
  }

  const pendingApplications = offer.applications?.filter((app) => app.status.toUpperCase() === "PENDING").length || 0;
  const approvedApplications = offer.applications?.filter((app) => app.status.toUpperCase() === "APPROVED").length || 0;
  const totalApplications = offer.applications?.length || 0;

  return (
    <div className="space-y-10 pb-12 max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button 
            onClick={() => router.push("/company/campaigns")}
            className="group flex items-center gap-2 text-gray-500 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Campaigns
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 border border-gray-200 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4 shadow-sm">
            <Briefcase className="w-3 h-3 text-gray-500" />
            <span>Campaign Details</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-3 font-sans">
            {offer.title}
          </h1>
          <p className="text-slate-500 font-medium text-base">
            Created on {new Date(offer.createdAt).toLocaleDateString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex gap-3"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 w-12 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-slate-900 transition-colors">
                <MoreVertical className="h-5 w-5 text-slate-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-gray-200 shadow-lg">
              <DropdownMenuItem
                onClick={() => router.push(`/company/campaigns/${offerId}/edit`)}
                className="h-10 rounded-lg font-medium cursor-pointer text-slate-700"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Campaign
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteModal(true)}
                className="h-10 rounded-lg font-medium cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Offer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            onClick={() => router.push(`/company/campaigns/${offerId}/applications`)}
            className="h-12 px-6 bg-slate-900 hover:bg-black text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
          >
            Review Applications
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Proposals", value: totalApplications, icon: Users, color: "text-slate-900", bg: "bg-gray-100" },
          { label: "Pending", value: pendingApplications, icon: Clock, color: "text-gray-500", bg: "bg-gray-50" },
          { label: "Approved", value: approvedApplications, icon: CheckCircle, color: "text-slate-900", bg: "bg-gray-100" },
          { label: "Goal", value: offer.influencerNumber, icon: Target, color: "text-slate-500", bg: "bg-gray-50" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white border border-gray-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 ${stat.bg} ${stat.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
              </div>
              <div className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Objectives & Requirements */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white border border-gray-200/60 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-100 text-slate-900 rounded-xl">
                    <Target className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-900">Campaign Objectives</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <p className="text-slate-600 font-medium text-sm leading-relaxed whitespace-pre-wrap">
                  {offer.objectif}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-white border border-gray-200/60 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-100 text-slate-900 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-900">Requirements</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <p className="text-slate-600 font-medium text-sm leading-relaxed whitespace-pre-wrap">
                  {offer.requirement}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Budget & Timeline */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white border border-gray-200/60 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gray-100 text-slate-900 rounded-xl">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Budget Range</h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Financial breakdown</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Minimum</span>
                  <span className="text-xl font-bold text-slate-900">${offer.minBudget.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-5 bg-slate-900 rounded-2xl text-white shadow-md">
                  <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Maximum</span>
                  <span className="text-xl font-bold text-white">${offer.maxBudget.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-white border border-gray-200/60 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gray-100 text-slate-900 rounded-xl">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Campaign Timeline</h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Schedule details</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Starts</p>
                  <p className="text-base font-bold text-slate-900">{new Date(offer.startDate).toLocaleDateString()}</p>
                </div>
                <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Ends</p>
                  <p className="text-base font-bold text-slate-900">{new Date(offer.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <RecommendedInfluencers offerId={offerId} />

      {/* Applications List */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <Card className="bg-white border border-gray-200/60 rounded-3xl shadow-sm overflow-hidden">
          <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between gap-4 flex-wrap border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-md">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Recent Proposals</CardTitle>
                <CardDescription className="font-medium text-gray-500">Manage incoming requests</CardDescription>
              </div>
            </div>
            {totalApplications > 0 && (
              <Button
                onClick={() => router.push(`/company/campaigns/${offerId}/applications`)}
                className="bg-slate-900 hover:bg-black text-white font-semibold px-6 h-10 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 text-sm"
              >
                Manage All Proposals
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-8">
            {totalApplications === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <Users className="h-8 w-8 text-gray-300" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">No proposals yet</h4>
                <p className="text-gray-500 font-medium text-sm">Wait for influencers to pitch their ideas!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {offer.applications?.slice(0, 5).map((application, idx) => (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
                    className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white hover:bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {application.user.influencerProfile?.profilePicture ? (
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                          <img
                            src={application.user.influencerProfile.profilePicture}
                            alt={application.user.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center font-bold text-white shadow-sm">
                          {application.user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                          {application.user.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">
                            {application.user.influencerProfile?.pseudo ? `@${application.user.influencerProfile.pseudo}` : application.user.email}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                            {new Date(application.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 px-0 sm:px-6">
                      <p className="text-sm font-medium text-slate-600 line-clamp-1 italic">
                        &quot;{application.proposal}&quot;
                      </p>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(application.status)}
                        {getStatusBadge(application.status)}
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center z-100 p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg"
            >
              <Card className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="p-8 space-y-6">
                  <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto border border-rose-100">
                    <Trash2 className="h-8 w-8 text-rose-500" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Are you sure?</h3>
                    <p className="text-slate-500 font-medium text-sm">
                      You are about to delete <span className="text-slate-900 font-bold">&quot;{offer.title}&quot;</span>. This action is permanent and cannot be undone.
                    </p>
                  </div>

                  {totalApplications > 0 && (
                    <div className="bg-amber-50 border border-amber-200/50 rounded-xl p-4 flex gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                      <p className="text-sm font-semibold text-amber-900 leading-relaxed">
                        Warning: This offer has {totalApplications} active application(s). All associated data will be deleted.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteModal(false)}
                      className="flex-1 h-12 rounded-xl border border-gray-200 hover:bg-gray-50 text-slate-700 font-semibold transition-colors group/cancel"
                      disabled={deleteLoading}
                    >
                      <span className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-gray-400 group-hover/cancel:text-slate-700 transition-colors" />
                        Cancel
                      </span>
                    </Button>
                    <Button
                      onClick={handleDelete}
                      className="flex-1 h-12 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold shadow-sm transition-colors"
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? "Deleting..." : "Confirm Delete"}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

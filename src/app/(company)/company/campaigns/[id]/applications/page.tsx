"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Users,
  MessageSquare,
  Calendar,
  ChevronRight,
  Filter,
  Info
} from "lucide-react";
import { graphqlClient } from "@/lib/graphql-client";
import { gql } from "graphql-request";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { RecommendedInfluencers } from "../_components/RecommendedInfluencers";

interface Offer {
  id: string;
  title: string;
  applications?: OfferApplication[];
}

interface OfferApplication {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    influencerProfile?: {
      profilePicture?: string;
      pseudo?: string;
    };
  };
  proposal: string;
  status: "Pending" | "Approved" | "Rejected" | "Withdraw";
  submittedAt: string;
}

const GET_OFFER_APPLICATIONS = gql`
  query GetOfferApplications($id: ID!) {
    offer(id: $id) {
      id
      title
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

const UPDATE_APPLICATION_STATUS = gql`
  mutation UpdateApplicationStatus($applicationId: ID!, $status: String!) {
    updateOfferApplicationStatus(applicationId: $applicationId, status: $status) {
      ok
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
  const offerId = decodeURIComponent(params.id as string);

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

      const data: any = await graphqlClient.request(
        GET_OFFER_APPLICATIONS,
        { id: offerId }
      );

      setOffer(data.offer);
    } catch (err: any) {
      console.error("Error loading applications:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId: string) => {
    try {
      setActionLoading(applicationId);

      await graphqlClient.request(
        UPDATE_APPLICATION_STATUS,
        { applicationId, status: "Approved" }
      );

      toast.success("Application approved!");
      await fetchApplications();
    } catch (err: any) {
      console.error("Approval error:", err);
      toast.error(err.message || "Approval failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      setActionLoading(applicationId);

      await graphqlClient.request(
        UPDATE_APPLICATION_STATUS,
        { applicationId, status: "Rejected" }
      );

      toast.success("Application rejected");
      await fetchApplications();
    } catch (err: any) {
      console.error("Rejection error:", err);
      toast.error(err.message || "Rejection failed");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: "Pending", className: "bg-amber-50 text-amber-600 border-amber-100" },
      APPROVED: { label: "Approved", className: "bg-emerald-50 text-emerald-600 border-emerald-100" },
      REJECTED: { label: "Rejected", className: "bg-rose-50 text-rose-600 border-rose-100" },
      WITHDRAW: { label: "Withdrawn", className: "bg-gray-100 text-gray-500 border-gray-200" },
    };
    const config = statusConfig[status.toUpperCase() as keyof typeof statusConfig] || { label: status, className: "bg-gray-100 text-gray-500 border-gray-200" };
    return <Badge className={`${config.className} border font-black uppercase text-[8px] tracking-widest px-2 py-1 rounded-full`}>{config.label}</Badge>;
  };

  const filterApplications = (applications: OfferApplication[], status?: string) => {
    let filtered = applications;
    if (status && status !== "all") {
      filtered = filtered.filter((app) => app.status.toLowerCase() === status.toLowerCase());
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.user.influencerProfile?.pseudo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.proposal.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="h-20 w-3/4 bg-black/5 rounded-4xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 bg-black/5 rounded-3xl" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 bg-black/5 rounded-[2.5rem]" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto border-2 border-rose-100">
            <AlertCircle className="w-12 h-12 text-rose-500" />
          </div>
          <h3 className="text-2xl font-black text-black">Campaign not found</h3>
          <Button onClick={() => router.push("/company/campaigns")} className="bg-black text-white font-black h-14 px-10 rounded-2xl shadow-xl">Back to Campaigns</Button>
        </motion.div>
      </div>
    );
  }

  const applications = offer.applications || [];
  const pendingCount = applications.filter((app) => app.status.toUpperCase() === "PENDING").length;
  const approvedCount = applications.filter((app) => app.status.toUpperCase() === "APPROVED").length;
  const rejectedCount = applications.filter((app) => app.status.toUpperCase() === "REJECTED").length;

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <button 
            onClick={() => router.push(`/company/campaigns/${offerId}`)}
            className="group flex items-center gap-2 text-gray-400 hover:text-black font-black text-[10px] uppercase tracking-widest transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Details
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
            <Users className="w-3 h-3 text-emerald-400" />
            <span>Proposal Manager</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter mb-2">
            Influencer <span className="text-gray-400">Proposals</span> 📩
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-2xl line-clamp-1">
            Reviewing candidates for: <span className="text-black font-bold">{offer.title}</span>
          </p>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Total", value: applications.length, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Pending", value: pendingCount, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Approved", value: approvedCount, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Rejected", value: rejectedCount, icon: XCircle, color: "text-rose-500", bg: "bg-rose-50" }
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="bg-white border-black/5 rounded-4xl p-6 shadow-soft hover:shadow-medium transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.bg} ${stat.color} rounded-2xl`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
              </div>
              <div className="text-4xl font-black text-black tracking-tighter">{stat.value}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <RecommendedInfluencers offerId={offerId} />

      {/* Search and Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 px-2">
          <div className="flex-1 relative group max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors" />
            <Input
              placeholder="Search influencers or messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-white border-black/5 focus:border-black/10 text-black font-bold placeholder:text-gray-400 rounded-2xl shadow-soft"
            />
          </div>
          
          <TabsList className="h-14 bg-white p-1 rounded-2xl border border-black/5 shadow-soft">
            <TabsTrigger value="all" className="h-full px-6 rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-black data-[state=active]:text-white transition-all">
              All
            </TabsTrigger>
            <TabsTrigger value="pending" className="h-full px-6 rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-black data-[state=active]:text-white transition-all">
              Pending ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="approved" className="h-full px-6 rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-black data-[state=active]:text-white transition-all">
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" className="h-full px-6 rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-black data-[state=active]:text-white transition-all">
              Rejected
            </TabsTrigger>
          </TabsList>
        </div>

        <AnimatePresence mode="wait">
          <TabsContent value={activeTab} className="mt-0 space-y-6 focus-visible:outline-none">
            <ApplicationsList
              applications={filterApplications(applications, activeTab)}
              onApprove={handleApprove}
              onReject={handleReject}
              actionLoading={actionLoading}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}

function ApplicationsList({ applications, onApprove, onReject, actionLoading, getStatusBadge }: any) {
  if (applications.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="bg-white border-black/5 rounded-[3rem] border-dashed border-2 shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <div className="p-8 bg-gray-50 rounded-full mb-6">
              <Users className="w-16 h-16 text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-black mb-2">No results found</h3>
            <p className="text-gray-400 font-medium max-w-xs">We couldn't find any proposals matching your current criteria.</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6">
      {applications.map((app: any, idx: number) => (
        <motion.div
          key={app.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <Card className="bg-white border-black/5 hover:border-black/20 rounded-[2.5rem] shadow-soft hover:shadow-large transition-all duration-500 overflow-hidden group">
            <CardContent className="p-10">
              <div className="flex flex-col md:flex-row gap-10 items-start">
                {/* Profile Section */}
                <div className="flex flex-row md:flex-col items-center md:items-start gap-6 w-full md:w-64 shrink-0">
                  <div className="relative group/avatar">
                    {app.user.influencerProfile?.profilePicture ? (
                      <div className="w-20 h-20 md:w-32 md:h-32 rounded-[2.5rem] overflow-hidden shadow-large">
                        <img src={app.user.influencerProfile.profilePicture} alt={app.user.name} className="w-full h-full object-cover transition-transform group-hover/avatar:scale-110" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 md:w-32 md:h-32 rounded-[2.5rem] bg-black flex items-center justify-center font-black text-4xl text-white shadow-large">
                        {app.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div>
                      <h4 className="text-xl font-black text-black leading-tight truncate">{app.user.name}</h4>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        {app.user.influencerProfile?.pseudo ? `@${app.user.influencerProfile.pseudo}` : app.user.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 truncate">
                      <Mail className="w-3.5 h-3.5" />
                      {app.user.email}
                    </div>
                    <div className="pt-2">
                      {getStatusBadge(app.status)}
                    </div>
                  </div>
                </div>

                {/* Message Section */}
                <div className="flex-1 space-y-6 w-full">
                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-black/5 rounded-full" />
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="w-4 h-4 text-black" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Proposal Message</span>
                    </div>
                    <p className="text-lg font-medium text-gray-700 leading-relaxed italic">
                      &quot;{app.proposal}&quot;
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-black/5">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <Calendar className="w-3.5 h-3.5" />
                      Submitted on {new Date(app.submittedAt).toLocaleDateString()}
                    </div>

                    {app.status.toUpperCase() === "PENDING" && (
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          onClick={() => onReject(app.id)}
                          disabled={actionLoading === app.id}
                          className="flex-1 sm:flex-none h-12 px-8 border-2 border-rose-100 text-rose-500 hover:bg-rose-50 hover:border-rose-200 font-black rounded-xl transition-all"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button
                          onClick={() => onApprove(app.id)}
                          disabled={actionLoading === app.id}
                          className="flex-1 sm:flex-none h-12 px-8 bg-black hover:bg-gray-800 text-white font-black rounded-xl shadow-xl hover:shadow-black/10 transition-all"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

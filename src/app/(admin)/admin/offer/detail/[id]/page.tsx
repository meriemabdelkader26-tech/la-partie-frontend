"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { QUERY, QUERY_APPLICATION_FOR_OFFER, DataType, ApplicationDataType } from "./_components/query";
import { useId } from "@/app/hooks/use-id";
import Loading from "@/app/loading";
import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, Calendar, Users, Wallet, Target, Clock, ShieldCheck, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import BreadCrumbList from "@/components/shared/BreadCrumbList";
import OfferDetailOverview from "./_components/OfferDetailOverview";
import OfferDetailDataView from "./_components/OfferDetailDataView";
import OfferDetailStats from "./_components/OfferDetailStats";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UPDATE_OFFER_APPLICATION_STATUS } from "./_components/mutation";
import { toast } from "sonner";

const OfferDetailPage = () => {
  const id = useId();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: offerData, isLoading: isLoadingOffer } = useQuery<DataType>({
    queryKey: ["offerDetail", id],
    queryFn: () => graphqlClient.request(QUERY, { id }),
    enabled: !!id,
  });

  const { data: applicationsData, isLoading: isLoadingApps } = useQuery<ApplicationDataType>({
    queryKey: ["offerApplications", id],
    queryFn: () => graphqlClient.request(QUERY_APPLICATION_FOR_OFFER, { offerId: id }),
    enabled: !!id,
  });

  const approveMutation = useMutation({
    mutationFn: (applicationId: string) => graphqlClient.request(UPDATE_OFFER_APPLICATION_STATUS, { applicationId, status: "Approved" }),
    onSuccess: () => {
      toast.success("Application approved");
      queryClient.invalidateQueries({ queryKey: ["offerApplications", id] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (applicationId: string) => graphqlClient.request(UPDATE_OFFER_APPLICATION_STATUS, { applicationId, status: "Rejected" }),
    onSuccess: () => {
      toast.success("Application rejected");
      queryClient.invalidateQueries({ queryKey: ["offerApplications", id] });
    },
  });

  if (isLoadingOffer || isLoadingApps) return <Loading />;

  const offer = offerData?.offer;
  const applications = applicationsData?.applicationsForOffer.edges.map(e => e.node) || [];

  if (!offer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-8">
        <div className="bg-amber-50 border border-amber-100 p-10 rounded-[32px] flex flex-col items-center text-center max-w-md shadow-sm">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Offer Not Found</h2>
          <p className="text-gray-500 font-medium mb-8">
            The campaign you are looking for does not exist or you don't have permission to view it.
          </p>
          <Button 
            onClick={() => router.push("/admin/offer")}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold h-12 rounded-xl"
          >
            Back to Offers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-start justify-start w-full p-4 md:p-8"
    >
      <div className="flex items-center justify-between w-full mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-xl hover:bg-gray-100 h-9 w-9 mr-1"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Offer Details
            </h1>
          </div>
          <p className="text-gray-500 text-sm font-medium ml-14 mt-1">
            Managing campaign: <span className="text-emerald-600 font-bold">{offer?.title}</span>
          </p>
        </div>
      </div>

      <div className="mb-8 w-full">
        <BreadCrumbList
          breadCrumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Offers", href: "/admin/offer" },
            { label: offer?.title || "Detail", href: `/admin/offer/detail/${id}` },
          ]}
        />
      </div>

      <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <OfferDetailOverview offer={offer!} />
          
          <div className="bg-white border border-gray-100 rounded-[32px] p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-50">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Applications</h2>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-0.5">
                    {applications.length} TOTAL SUBMISSIONS
                  </p>
                </div>
              </div>
            </div>
            
            <OfferDetailDataView 
              applications={applications}
              handleApprove={(appId) => approveMutation.mutate(appId)}
              handleReject={(appId) => rejectMutation.mutate(appId)}
            />
          </div>
        </div>

        <div className="space-y-8">
          <OfferDetailStats 
            total={applicationsData?.applicationsForOffer.totalCount || 0}
            pending={applicationsData?.applicationsForOffer.pendingCount || 0}
            approved={applicationsData?.applicationsForOffer.approvedCount || 0}
            rejected={applicationsData?.applicationsForOffer.rejectedCount || 0}
          />

          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shadow-sm border border-amber-50">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Brand Info</h2>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-lg font-black text-gray-400">
                {offer?.createdBy?.name?.substring(0, 2).toUpperCase() || "??"}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">{offer?.createdBy?.name}</span>
                <span className="text-xs font-medium text-gray-500">{offer?.createdBy?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default OfferDetailPage;

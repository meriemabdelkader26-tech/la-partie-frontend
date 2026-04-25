"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Briefcase
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_MY_APPLICATIONS } from "@/lib/queries/offer-queries";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ApplicationsPage = () => {
  const router = useRouter();
  const { data: appData, isLoading } = useQuery<any>({
    queryKey: ["my-applications"],
    queryFn: () => graphqlClient.request(GET_MY_APPLICATIONS),
  });

  const applications = useMemo(() => {
    return appData?.myApplications?.edges?.map((edge: any) => edge.node) || [];
  }, [appData]);

  const renderStatusBadge = (status: string, paymentStatus?: string) => {
    if (paymentStatus === "Released") {
      return (
        <Badge className="bg-green-50 text-green-600 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    }

    const normalizedStatus = status.toUpperCase();

    switch (normalizedStatus) {
      case "APPROVED":
        return (
          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-50 text-amber-600 border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-rose-50 text-rose-600 border-rose-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case "WITHDRAW":
        return (
          <Badge className="bg-gray-100 text-gray-600 border-gray-200">
            <ArrowRight className="w-3 h-3 mr-1" />
            Withdrawn
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-50 text-gray-500 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fadeInUp">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Skeleton className="h-12 w-64 bg-gray-100" />
          <Skeleton className="h-12 w-48 bg-gray-100" />
        </div>
        <Skeleton className="h-12 w-full bg-gray-100 rounded-xl" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full bg-gray-100 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeInUp">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-black tracking-tight uppercase">My Applications</h1>
          <p className="text-gray-500 font-medium mt-1">
            Track and manage your sent proposals
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white border-black/10 hover:bg-gray-50 rounded-xl px-4 py-6 font-bold shadow-soft">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="bg-white border-black/10 hover:bg-gray-50 rounded-xl px-4 py-6 font-bold shadow-soft">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-gray-100 border border-black/5 rounded-2xl p-1.5 mb-8 h-auto flex-wrap">
          <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm rounded-xl py-3 px-8 font-bold transition-all uppercase text-xs tracking-widest">
            All ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm rounded-xl py-3 px-8 font-bold transition-all uppercase text-xs tracking-widest">
            Pending ({applications.filter((a: any) => a.status.toUpperCase() === "PENDING").length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm rounded-xl py-3 px-8 font-bold transition-all uppercase text-xs tracking-widest">
            Approved ({applications.filter((a: any) => a.status.toUpperCase() === "APPROVED").length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm rounded-xl py-3 px-8 font-bold transition-all uppercase text-xs tracking-widest">
            Rejected ({applications.filter((a: any) => a.status.toUpperCase() === "REJECTED").length})
          </TabsTrigger>
        </TabsList>

        {["all", "pending", "approved", "rejected"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-6 focus-visible:outline-none">
            {applications.filter((a: any) => tab === "all" || a.status.toLowerCase() === tab).length > 0 ? (
              applications
                .filter((a: any) => tab === "all" || a.status.toLowerCase() === tab)
                .map((app: any, idx: number) => (
                  <Card
                    key={app.id}
                    className="bg-white border-2 border-black/5 rounded-[2.5rem] shadow-soft hover:shadow-medium hover:border-black/10 transition-all duration-500 overflow-hidden group"
                  >
                    <div className="p-8">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-2xl font-black text-black tracking-tight group-hover:text-gray-700 transition-colors uppercase">
                              {app.offer.title}
                            </h3>
                            {renderStatusBadge(app.status, app.paymentStatus)}
                          </div>
                          
                          <div className="bg-gray-50/50 p-6 rounded-3xl border border-black/5">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-2">My Proposal</p>
                            <p className="text-gray-600 font-medium leading-relaxed line-clamp-3">
                              {app.proposal}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-6 pt-2">
                            <div className="flex items-center gap-2">
                              <div className="size-8 rounded-xl bg-black flex items-center justify-center shadow-soft">
                                <DollarSign className="size-4 text-white" />
                              </div>
                              <div>
                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Price</p>
                                <p className="font-bold text-black text-sm">${app.askingPrice.toLocaleString()}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="size-8 rounded-xl bg-gray-100 flex items-center justify-center">
                                <Calendar className="size-4 text-black" />
                              </div>
                              <div>
                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Submitted</p>
                                <p className="font-bold text-black text-sm">
                                  {app.submittedAt ? format(new Date(app.submittedAt), "MMM dd, yyyy") : "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="size-8 rounded-xl bg-gray-100 flex items-center justify-center">
                                <Briefcase className="size-4 text-black" />
                              </div>
                              <div>
                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Brand</p>
                                <p className="font-bold text-black text-sm">{app.offer.createdBy?.name || "Brand"}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col gap-3 shrink-0">
                          <Link href={`/influencer/offer/detail/${app.offer.id}`} className="flex-1">
                            <Button className="w-full bg-black hover:bg-gray-800 text-white rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-[1.02] transition-all">
                              View Offer
                            </Button>
                          </Link>
                          {app.status.toUpperCase() === "PENDING" && (
                            <Button variant="outline" className="flex-1 border-2 border-rose-100 text-rose-600 hover:bg-rose-50 rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] transition-all">
                              Withdraw
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            className="flex-1 border-2 border-black/5 hover:bg-gray-50 rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] transition-all"
                            onClick={() => router.push(`/influencer/messages?userId=${app.offer.createdBy.id}`)}
                          >
                            Chat
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white border-2 border-dashed border-black/5 rounded-[3rem]">
                <div className="size-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner-soft">
                  <Sparkles className="size-12 text-gray-200" />
                </div>
                <h3 className="text-2xl font-black text-black mb-3 uppercase tracking-tight">No {tab} applications</h3>
                <p className="text-gray-400 max-w-sm mx-auto mb-10 font-medium">
                  {tab === "all" 
                    ? "You haven't submitted any applications yet. Start exploring offers to collaborate with brands!"
                    : `You don't have any ${tab} applications at the moment.`}
                </p>
                <Link href="/influencer/offer">
                  <Button className="bg-black hover:bg-gray-800 text-white rounded-2xl px-10 py-7 font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all">
                    Explore Offers
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ApplicationsPage;

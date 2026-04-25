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
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_MY_APPLICATIONS } from "@/lib/queries/offer-queries";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CampaignsPage = () => {
  const router = useRouter();
  const { data: appData, isLoading } = useQuery<any>({
    queryKey: ["my-applications"],
    queryFn: () => graphqlClient.request(GET_MY_APPLICATIONS),
  });

  const applications = useMemo(() => {
    return appData?.myApplications?.edges?.map((edge: any) => edge.node) || [];
  }, [appData]);

  const campaigns = useMemo(() => {
    return {
      active: applications.filter(
        (app: any) => app.status === "Approved" && app.paymentStatus !== "Released"
      ),
      applied: applications.filter((app: any) => app.status === "Pending"),
      completed: applications.filter((app: any) => app.paymentStatus === "Released"),
      rejected: applications.filter((app: any) => app.status === "Rejected"),
    };
  }, [applications]);

  const renderStatusBadge = (status: string, paymentStatus?: string) => {
    if (paymentStatus === "Released") {
      return (
        <Badge className="bg-green-50 text-green-600 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    }

    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-blue-50 text-blue-600 border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-yellow-50 text-yellow-600 border-yellow-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-red-50 text-red-600 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
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
          <h1 className="text-3xl font-bold text-black tracking-tight">Campaigns</h1>
          <p className="text-gray-500 font-medium mt-1">
            Manage your active and completed campaigns
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

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="bg-gray-100 border border-black/5 rounded-xl p-1 mb-8 overflow-x-auto flex-nowrap w-full justify-start md:w-auto">
          <TabsTrigger value="active" className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm rounded-lg py-2 px-6 font-bold whitespace-nowrap">
            Active ({campaigns.active.length})
          </TabsTrigger>
          <TabsTrigger value="applied" className="data-[state=applied]:bg-white data-[state=applied]:text-black data-[state=applied]:shadow-sm rounded-lg py-2 px-6 font-bold whitespace-nowrap">
            Applied ({campaigns.applied.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=completed]:bg-white data-[state=completed]:text-black data-[state=completed]:shadow-sm rounded-lg py-2 px-6 font-bold whitespace-nowrap">
            Completed ({campaigns.completed.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="data-[state=rejected]:bg-white data-[state=rejected]:text-black data-[state=rejected]:shadow-sm rounded-lg py-2 px-6 font-bold whitespace-nowrap">
            Rejected ({campaigns.rejected.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6 animate-fadeInUp delay-200">
          {campaigns.active.length > 0 ? (
            campaigns.active.map((app, idx) => (
              <Card
                key={app.id}
                className="bg-white border-2 border-black/5 rounded-3xl shadow-soft hover:shadow-medium hover:border-black/20 transition-all duration-300 animate-fadeInUp"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-xl font-bold text-black group-hover:text-gray-700 transition-colors">
                          {app.offer.title}
                        </h3>
                        {renderStatusBadge(app.status, app.paymentStatus)}
                      </div>
                      <p className="text-gray-600 font-medium leading-relaxed mb-4 line-clamp-2">
                        {app.proposal}
                      </p>
                      <p className="text-gray-500 font-bold">Brand: <span className="text-black">{app.offer.createdBy?.name || "Brand"}</span></p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 rounded-2xl border border-black/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <DollarSign className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-0.5">Price</p>
                        <span className="font-bold text-black">${app.askingPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <Calendar className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-0.5">Deadline</p>
                        <span className="font-bold text-black">
                          {app.offer.endDate ? format(new Date(app.offer.endDate), "MMM dd, yyyy") : "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <Clock className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-0.5">Payment</p>
                        <span className="font-bold text-black">{app.paymentStatus}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/influencer/offer/detail/${app.offer.id}`}>
                      <Button className="bg-black hover:bg-gray-800 text-white rounded-xl px-8 py-6 font-bold shadow-soft transition-all duration-300 hover:scale-[1.02]">
                        View Details
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="bg-white border-black/10 hover:bg-gray-50 rounded-xl px-8 py-6 font-bold shadow-soft transition-all duration-300"
                      onClick={() => router.push(`/influencer/messages?userId=${app.offer.createdBy?.id}`)}
                    >
                      Message Brand
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white border-2 border-dashed border-black/5 rounded-3xl">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">No Active Campaigns</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-8">
                You don't have any approved campaigns in progress right now.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="applied" className="space-y-6 animate-fadeInUp delay-200">
          {campaigns.applied.length > 0 ? (
            campaigns.applied.map((app, idx) => (
              <Card
                key={app.id}
                className="bg-white border-2 border-black/5 rounded-3xl shadow-soft hover:shadow-medium hover:border-black/20 transition-all duration-300 animate-fadeInUp"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-xl font-bold text-black group-hover:text-gray-700 transition-colors">
                          {app.offer.title}
                        </h3>
                        {renderStatusBadge(app.status, app.paymentStatus)}
                      </div>
                      <p className="text-gray-600 font-medium leading-relaxed mb-4 line-clamp-2">
                        {app.proposal}
                      </p>
                      <p className="text-gray-500 font-bold">Brand: <span className="text-black">{app.offer.createdBy?.name || "Brand"}</span></p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 rounded-2xl border border-black/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <DollarSign className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-0.5">Asking Price</p>
                        <span className="font-bold text-black">${app.askingPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <Calendar className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-0.5">Applied On</p>
                        <span className="font-bold text-black">
                          {app.submittedAt ? format(new Date(app.submittedAt), "MMM dd, yyyy") : "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <Clock className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-0.5">Status</p>
                        <span className="font-bold text-black">{app.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/influencer/offer/detail/${app.offer.id}`}>
                      <Button variant="outline" className="bg-white border-black/10 hover:bg-gray-50 rounded-xl px-8 py-6 font-bold shadow-soft transition-all">
                        View Offer
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white border-2 border-dashed border-black/5 rounded-3xl">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">No Applications Yet</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-8">
                Go to the campaigns page and start applying to work with brands!
              </p>
              <Link href="/influencer/offer">
                <Button className="bg-black hover:bg-gray-800 text-white rounded-xl px-8 py-6 font-bold shadow-soft transition-all">
                  Browse Campaigns
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6 animate-fadeInUp delay-200">
          {campaigns.completed.length > 0 ? (
            campaigns.completed.map((app, idx) => (
              <Card
                key={app.id}
                className="bg-white border-2 border-black/5 rounded-3xl shadow-soft hover:shadow-medium hover:border-black/20 transition-all duration-300 opacity-80 hover:opacity-100 animate-fadeInUp"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-xl font-bold text-black">
                          {app.offer.title}
                        </h3>
                        {renderStatusBadge(app.status, app.paymentStatus)}
                      </div>
                      <p className="text-gray-600 font-medium leading-relaxed mb-6 line-clamp-2">
                        {app.proposal}
                      </p>
                      <div className="grid sm:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-2xl border border-black/5">
                        <div>
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-0.5">Brand</p>
                          <span className="font-bold text-black">{app.offer.createdBy?.name || "Brand"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <DollarSign className="w-5 h-5 text-black" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-0.5">Earned</p>
                            <span className="font-bold text-black">${app.askingPrice.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-0.5">Completed On</p>
                            <span className="font-bold text-black">
                              {app.releasedAt ? format(new Date(app.releasedAt), "MMM dd, yyyy") : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Link href={`/influencer/offer/detail/${app.offer.id}`}>
                      <Button variant="outline" className="bg-white border-black/10 hover:bg-gray-50 rounded-xl px-8 py-6 font-bold shadow-soft transition-all">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white border-2 border-dashed border-black/5 rounded-3xl">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">No Completed Campaigns</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-8">
                Your successfully finished campaigns will appear here.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-6 animate-fadeInUp delay-200">
          {campaigns.rejected.length > 0 ? (
            campaigns.rejected.map((app, idx) => (
              <Card
                key={app.id}
                className="bg-white border-2 border-black/5 rounded-3xl shadow-soft hover:shadow-medium hover:border-black/20 transition-all duration-300 opacity-70 animate-fadeInUp"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-xl font-bold text-black">
                          {app.offer.title}
                        </h3>
                        {renderStatusBadge(app.status, app.paymentStatus)}
                      </div>
                      <p className="text-gray-600 font-medium leading-relaxed mb-4 line-clamp-2">
                        {app.proposal}
                      </p>
                      <p className="text-gray-500 font-bold">Brand: <span className="text-black">{app.offer.createdBy?.name || "Brand"}</span></p>
                    </div>
                  </div>
                  <div className="p-6 bg-red-50 rounded-2xl border border-red-100 mb-6">
                    <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mb-1">Reason for Rejection</p>
                    <p className="text-red-700 font-medium">{app.rejectionReason || "No specific reason provided by the brand."}</p>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/influencer/offer/detail/${app.offer.id}`}>
                      <Button variant="outline" className="bg-white border-black/10 hover:bg-gray-50 rounded-xl px-8 py-6 font-bold shadow-soft transition-all">
                        View Offer
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white border-2 border-dashed border-black/5 rounded-3xl">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">No Rejected Applications</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-8">
                Applications that were not selected by brands will appear here.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignsPage;

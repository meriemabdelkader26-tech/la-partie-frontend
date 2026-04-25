"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Wallet,
  CreditCard,
  Building2,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { 
  GET_INFLUENCER_DASHBOARD_STATS, 
  GET_MY_PAYMENT_METHODS,
  GET_MY_PAYOUT_REQUESTS
} from "@/lib/queries/offer-queries";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AddPaymentMethodModal } from "./_components/AddPaymentMethodModal";

const EarningsPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ["influencerDashboardStats"],
    queryFn: async () => {
      const response = await graphqlClient.request<any>(GET_INFLUENCER_DASHBOARD_STATS);
      return response.influencerDashboardStats;
    },
  });

  const { data: paymentMethods, isLoading: isMethodsLoading } = useQuery({
    queryKey: ["myPaymentMethods"],
    queryFn: async () => {
      const response = await graphqlClient.request<any>(GET_MY_PAYMENT_METHODS);
      return response.myPaymentMethods;
    },
  });

  const stats = [
    {
      title: "Total Earnings",
      value: `$${(dashboardData?.totalEarnings || 0).toLocaleString()}`,
      change: "",
      icon: DollarSign,
      color: "emerald",
    },
    {
      title: "Campaigns",
      value: `${dashboardData?.totalCampaigns || 0}`,
      change: "",
      icon: Calendar,
      color: "blue",
    },
    {
      title: "Available Balance",
      value: `$${(dashboardData?.availableBalance || 0).toLocaleString()}`,
      change: "",
      icon: Wallet,
      color: "purple",
    },
    {
      title: "Pending",
      value: `$${(dashboardData?.pendingEarnings || 0).toLocaleString()}`,
      change: "",
      icon: CreditCard,
      color: "yellow",
    },
  ];

  const transactions = dashboardData?.recentApplications || [];
  
  // Safely parse monthly earnings if it's a string, otherwise use it directly
  const monthlyEarningsRaw = typeof dashboardData?.monthlyEarnings === 'string' 
    ? JSON.parse(dashboardData.monthlyEarnings) 
    : (dashboardData?.monthlyEarnings || []);

  const monthlyEarnings = Array.isArray(monthlyEarningsRaw) && monthlyEarningsRaw.length > 0 
    ? monthlyEarningsRaw 
    : [{ month: format(new Date(), "MMMM"), amount: 0 }];

  if (isDashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeInDown">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight">Earnings</h1>
          <p className="text-gray-500 font-medium mt-1">
            Track your income and manage payouts
          </p>
        </div>
        <Button className="bg-black hover:bg-gray-800 text-white rounded-xl px-6 py-6 font-bold shadow-soft transition-all duration-300 hover:scale-[1.02] group">
          <Download className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
          Request Payout
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card
            key={stat.title}
            className="bg-white border-2 border-black/5 rounded-3xl p-6 shadow-soft hover:shadow-medium hover:border-black/20 transition-all duration-300 group animate-fadeInUp"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <stat.icon className="w-5 h-5 text-black group-hover:text-white transition-colors duration-300" />
              </div>
              {stat.change && (
                <div className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full flex items-center gap-1 border border-green-100">
                  <TrendingUp className="w-3 h-3" />
                  <span>{stat.change}</span>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 font-semibold text-sm">{stat.title}</p>
              <p className="text-3xl font-bold text-black group-hover:tracking-tight transition-all duration-300">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Monthly Earnings Chart */}
        <Card className="lg:col-span-1 bg-white border-2 border-black/5 rounded-3xl p-8 shadow-soft animate-slideInLeft delay-300">
          <h3 className="text-xl font-bold text-black mb-6">
            Monthly Earnings
          </h3>
          <div className="space-y-6">
            {monthlyEarnings.map((data: any, idx: number) => {
              const maxAmount = Math.max(...monthlyEarnings.map((d: any) => d.amount), 1000);
              return (
                <div key={data.month} className="space-y-3 animate-fadeInUp" style={{ animationDelay: `${400 + idx * 100}ms` }}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-black uppercase tracking-widest text-[10px]">{data.month}</span>
                    <span className="text-black font-bold">
                      ${data.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className="bg-black h-3 rounded-full transition-all duration-1000 ease-out shadow-sm"
                      style={{ width: `${(data.amount / maxAmount) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Transaction History */}
        <Card className="lg:col-span-2 bg-white border-2 border-black/5 rounded-3xl p-8 shadow-soft animate-slideInRight delay-400">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-black">
              Recent Activity
            </h3>
            <Button variant="outline" className="bg-white border-black/10 hover:bg-black hover:text-white transition-all duration-300 text-black hover:text-white font-bold rounded-xl shadow-sm px-6 py-4">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {transactions.length > 0 ? (
              transactions.map((transaction: any, idx: number) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50 border border-black/5 rounded-2xl hover:border-black/10 hover:bg-white hover:shadow-soft transition-all duration-300 gap-4 group animate-fadeInUp"
                  style={{ animationDelay: `${500 + idx * 100}ms` }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-black/5 shadow-sm shrink-0 group-hover:bg-black transition-colors duration-300">
                      <DollarSign className="w-6 h-6 text-black group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-black font-bold text-base truncate">
                        {transaction.offer.title}
                      </h4>
                      <p className="text-gray-500 text-sm font-medium truncate mt-1">
                        {transaction.offer.createdBy?.name || "Company"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full">
                    <div className="text-left sm:text-right">
                      <p className="text-black font-bold text-lg">
                        ${transaction.askingPrice.toLocaleString()}
                      </p>
                      <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] mt-1">
                        {format(new Date(transaction.submittedAt), "MMM d, yyyy")}
                      </p>
                    </div>
                    {transaction.paymentStatus === "Released" ? (
                      <Badge className="bg-green-50 text-green-600 border-green-200 px-3 py-1 font-bold rounded-full">
                        Released
                      </Badge>
                    ) : transaction.status === "Approved" ? (
                      <Badge className="bg-blue-50 text-blue-600 border-blue-200 px-3 py-1 font-bold rounded-full">
                        Approved
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-50 text-yellow-600 border-yellow-200 px-3 py-1 font-bold rounded-full">
                        {transaction.status}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 font-medium">
                No recent activity found.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card className="bg-white border-2 border-black/5 rounded-3xl p-8 shadow-soft animate-fadeInUp delay-600">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-black">
            Payment Methods
          </h3>
          <Button 
            variant="outline" 
            className="bg-white border-black/10 hover:bg-black hover:text-white transition-all duration-300 text-black font-bold rounded-xl shadow-sm px-6 py-4"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add New
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {paymentMethods && paymentMethods.length > 0 ? (
            paymentMethods.map((method: any, idx: number) => (
              <div 
                key={method.id}
                className={cn(
                  "p-8 rounded-3xl relative overflow-hidden group animate-slideInLeft transition-all duration-300 cursor-pointer shadow-medium",
                  method.isPrimary ? "bg-black text-white" : "bg-gray-50 border-2 border-black/5"
                )}
                style={{ animationDelay: `${700 + idx * 100}ms` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-700"></div>
                <div className="flex items-center justify-between mb-10 relative z-10">
                  {method.methodType === "PayPal" ? (
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", method.isPrimary ? "bg-white/20" : "bg-black/5")}>
                      <Wallet className={cn("w-6 h-6", method.isPrimary ? "text-white" : "text-black")} />
                    </div>
                  ) : method.methodType === "Stripe" ? (
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", method.isPrimary ? "bg-white/20" : "bg-black/5")}>
                      <CreditCard className={cn("w-6 h-6", method.isPrimary ? "text-white" : "text-black")} />
                    </div>
                  ) : (
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", method.isPrimary ? "bg-white/20" : "bg-black/5")}>
                      <Building2 className={cn("w-6 h-6", method.isPrimary ? "text-white" : "text-black")} />
                    </div>
                  )}
                  {method.isPrimary && (
                    <Badge className="bg-white text-black border-transparent px-4 py-1.5 font-bold shadow-sm rounded-full">
                      Primary
                    </Badge>
                  )}
                </div>
                <div className="relative z-10">
                  <p className={cn("font-bold text-2xl mb-1 tracking-tight", method.isPrimary ? "text-white" : "text-black")}>
                    {method.label}
                  </p>
                  <p className={cn("font-medium text-base", method.isPrimary ? "text-white/60" : "text-gray-500")}>
                    {method.details}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-10 bg-gray-50 border-2 border-dashed border-black/5 rounded-3xl text-gray-400 font-medium">
              No payment methods added yet.
            </div>
          )}
        </div>
      </Card>

      <AddPaymentMethodModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};

export default EarningsPage;

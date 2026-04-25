"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  DollarSign,
  Eye,
  Calendar,
  MessageSquare,
  ArrowRight,
  Activity,
  BarChart3,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_INFLUENCER_DASHBOARD_STATS } from "@/lib/queries/offer-queries";
import { GET_MY_CONVERSATIONS } from "@/lib/queries/messages-queries";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const InfluencerDashboard = () => {
  const { data: statsData, isLoading: isLoadingStats } = useQuery<any>({
    queryKey: ["influencer-dashboard-stats"],
    queryFn: () => graphqlClient.request(GET_INFLUENCER_DASHBOARD_STATS),
  });

  const { data: convData, isLoading: isLoadingConvs } = useQuery<any>({
    queryKey: ["my-conversations-short"],
    queryFn: () => graphqlClient.request(GET_MY_CONVERSATIONS),
  });

  const stats = useMemo(() => {
    const d = statsData?.influencerDashboardStats;
    return [
      {
        title: "Total Campaigns",
        value: d?.totalCampaigns?.toString() || "0",
        icon: Calendar,
        change: "All time",
        changeType: "positive" as const,
        color: "from-blue-500 to-blue-600",
        lightColor: "bg-blue-50",
        textColor: "text-blue-600"
      },
      {
        title: "Total Earnings",
        value: `$${(d?.totalEarnings || 0).toLocaleString()}`,
        icon: DollarSign,
        change: "Total paid/approved",
        changeType: "positive" as const,
        color: "from-emerald-500 to-emerald-600",
        lightColor: "bg-emerald-50",
        textColor: "text-emerald-600"
      },
      {
        title: "Total Reach",
        value: (d?.totalReach || 0) > 1000 ? `${((d?.totalReach || 0) / 1000).toFixed(1)}K` : d?.totalReach?.toString() || "0",
        icon: Eye,
        change: "Followers total",
        changeType: "positive" as const,
        color: "from-purple-500 to-purple-600",
        lightColor: "bg-purple-50",
        textColor: "text-purple-600"
      },
      {
        title: "Engagement Rate",
        value: `${(d?.avgEngagement || 0).toFixed(1)}%`,
        icon: TrendingUp,
        change: "Avg across networks",
        changeType: "positive" as const,
        color: "from-rose-500 to-rose-600",
        lightColor: "bg-rose-50",
        textColor: "text-rose-600"
      },
    ];
  }, [statsData]);

  const recentConversations = useMemo(() => {
    return convData?.myConversations?.slice(0, 3) || [];
  }, [convData]);

  const activeCampaigns = useMemo(() => {
    return statsData?.influencerDashboardStats?.recentApplications || [];
  }, [statsData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2 relative">
        <div className="absolute -top-6 -left-6 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl"></div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          Welcome back! <span className="inline-block animate-wave">👋</span>
        </h1>
        <p className="text-gray-500 font-medium text-lg max-w-2xl">
          Here&apos;s what&apos;s happening with your campaigns today. You are doing great!
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={containerVariants} className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {isLoadingStats ? (
          [1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-44 rounded-3xl bg-gray-100" />
          ))
        ) : (
          stats.map((stat, idx) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card className="relative overflow-hidden bg-white border-0 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group hover:-translate-y-1">
                {/* Background Gradient Decoration */}
                <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-500 ease-out`}></div>
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl ${stat.lightColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full flex items-center gap-1">
                    {stat.changeType === "positive" ? <TrendingUp className="w-3 h-3" /> : null}
                    {stat.change.split(' ')[0]}
                  </div>
                </div>
                <div className="space-y-1 relative z-10">
                  <p className="text-gray-500 font-medium text-sm">{stat.title}</p>
                  <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{stat.value}</p>
                  <p className="text-xs text-gray-400 font-medium mt-2">{stat.change}</p>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Campaigns */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="bg-white border-0 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">Your latest campaign interests</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <Activity className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            
            <div className="space-y-4">
              {isLoadingStats ? (
                [1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 rounded-2xl bg-gray-50" />
                ))
              ) : activeCampaigns.length > 0 ? (
                activeCampaigns.map((app: any) => (
                  <motion.div
                    key={app.id}
                    whileHover={{ scale: 1.01 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50/50 border border-gray-100 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300 group cursor-pointer gap-4 sm:gap-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-900 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 text-center text-[10px] leading-tight px-1 flex-col">
                        <Sparkles className="w-5 h-5 mb-0.5" />
                        Offer
                      </div>
                      <div className="space-y-1.5 min-w-0">
                        <p className="text-gray-900 font-bold text-lg truncate max-w-[200px] md:max-w-xs">
                          {app.offer.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "relative flex h-2.5 w-2.5"
                          )}>
                            <span className={cn(
                              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                              app.status.toUpperCase() === 'APPROVED' ? "bg-emerald-400" : app.status.toUpperCase() === 'PENDING' ? "bg-amber-400" : "bg-rose-400"
                            )}></span>
                            <span className={cn(
                              "relative inline-flex rounded-full h-2.5 w-2.5",
                              app.status.toUpperCase() === 'APPROVED' ? "bg-emerald-500" : app.status.toUpperCase() === 'PENDING' ? "bg-amber-500" : "bg-rose-500"
                            )}></span>
                          </span>
                          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{app.status}</p>
                        </div>
                      </div>
                    </div>
                    <div className="sm:text-right flex items-center justify-between sm:block border-t sm:border-0 border-gray-100 pt-4 sm:pt-0">
                      <p className="text-gray-500 text-sm font-medium sm:hidden">Price</p>
                      <p className="text-gray-900 font-extrabold text-xl">
                        ${app.askingPrice.toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <Sparkles className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">No applications yet</h3>
                  <p className="text-gray-500 text-sm max-w-xs mx-auto mt-2">
                    Browse campaigns and start applying to work with brands!
                  </p>
                  <Link href="/influencer/campaigns">
                    <Button className="mt-6 rounded-xl bg-black hover:bg-gray-800 text-white font-bold px-8 py-6 h-auto">
                      Explore Campaigns
                    </Button>
                  </Link>
                </div>
              )}
            </div>
            
            <Link href="/influencer/campaigns" className="block w-full mt-8">
              <button className="w-full py-4 rounded-2xl bg-gray-50 text-gray-900 font-bold hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group">
                View All Campaigns
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </Card>
        </motion.div>

        <div className="space-y-6 lg:col-span-1">
          {/* Recent Messages */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white border-0 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Messages</h2>
                  <p className="text-sm text-gray-500 font-medium mt-1">Latest conversations</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-rose-600" />
                </div>
              </div>
              
              <div className="space-y-4">
                {isLoadingConvs ? (
                  [1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 rounded-2xl bg-gray-50" />
                  ))
                ) : recentConversations.length > 0 ? (
                  recentConversations.map((conv: any) => (
                    <Link key={conv.id} href={`/influencer/messages?conversationId=${conv.id}`}>
                      <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-300 cursor-pointer group">
                        <div className="relative">
                          <Avatar className="size-12 rounded-full border-2 border-white shadow-sm">
                            <AvatarImage src={conv.otherParticipant.influencerProfile?.profilePicture} className="object-cover" />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 font-bold">
                              {conv.otherParticipant.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {conv.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                              {conv.unreadCount}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-gray-900 font-bold truncate text-sm">
                              {conv.otherParticipant.name}
                            </p>
                            <p className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">
                              {conv.updatedAt ? formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true }) : ''}
                            </p>
                          </div>
                          <p className="text-gray-500 text-xs truncate font-medium">
                            {conv.lastMessage?.content || "No messages yet"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                    <MessageSquare className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-gray-500 text-sm font-medium">No messages yet</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={containerVariants} className="grid grid-cols-2 gap-4">
            <Link href="/influencer/analytics" className="block h-full">
              <motion.button variants={itemVariants} className="w-full h-full p-6 bg-gray-900 text-white rounded-3xl hover:bg-black transition-all duration-300 text-left shadow-lg group hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <p className="font-bold text-lg mb-1 relative z-10">Analytics</p>
                <p className="text-gray-400 text-sm font-medium relative z-10">Track stats</p>
              </motion.button>
            </Link>
            
            <Link href="/influencer/wallet" className="block h-full">
              <motion.button variants={itemVariants} className="w-full h-full p-6 bg-white border-0 rounded-3xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:-translate-y-1">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="font-bold text-gray-900 text-lg mb-1">Earnings</p>
                <p className="text-gray-500 text-sm font-medium">Review income</p>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default InfluencerDashboard;

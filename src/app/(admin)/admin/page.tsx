"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  FolderOpen, 
  Loader2, 
  Plus, 
  ArrowUpRight, 
  Activity, 
  Zap, 
  Clock 
} from "lucide-react";
import Link from "next/link";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_DASHBOARD_STATS, ADMIN_DASHBOARD_STATS } from "@/lib/queries/admin-queries";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DashboardCharts } from "./_components/DashboardCharts";

interface DashboardStats {
  totalUsers: number;
  totalInfluencers: number;
  totalCompanies: number;
  activeCategories: number;
  verifiedInfluencers: number;
}

interface ChartData {
  revenueTrend: any[];
  applicationsDist: any[];
  usersDist: any[];
  offersGrowth: any[];
  totalRevenue: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalInfluencers: 0,
    totalCompanies: 0,
    activeCategories: 0,
    verifiedInfluencers: 0,
  });
  const [chartData, setChartData] = useState<ChartData>({
    revenueTrend: [],
    applicationsDist: [],
    usersDist: [],
    offersGrowth: [],
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch both stats and chart data
        const [statsData, adminChartsData] = await Promise.all([
          graphqlClient.request(GET_DASHBOARD_STATS),
          graphqlClient.request(ADMIN_DASHBOARD_STATS),
        ]);

        // Process Stats
        const totalUsers = statsData.allUsers?.edges?.length || 0;
        const influencerEdges = statsData.allInfluencers?.edges || [];
        const influencerNodes = influencerEdges.map((edge: any) => edge.node);
        const totalInfluencers = influencerNodes.length;
        const activeCategories = statsData.allCategories?.edges?.filter(
          (edge: any) => edge.node.isActive
        ).length || 0;
        const verifiedInfluencers = influencerNodes.filter(
          (inf: any) => inf.user?.emailVerified
        ).length || 0;
        const totalCompanies = statsData.companiesCount || 0;

        setStats({
          totalUsers,
          totalInfluencers,
          totalCompanies,
          activeCategories,
          verifiedInfluencers,
        });

        // Process Chart Data
        const adminStats = adminChartsData.adminDashboardStats;
        
        setChartData({
          revenueTrend: adminStats.revenueTrend.map((d: any) => ({ name: d.label, value: d.value })),
          applicationsDist: adminStats.applicationsStatusDist.map((d: any) => ({ name: d.label, value: d.value })),
          usersDist: adminStats.usersRoleDist.map((d: any) => ({ name: d.label, value: d.value })),
          offersGrowth: adminStats.offersGrowth.map((d: any) => ({ name: d.label, value: d.value })),
          totalRevenue: adminStats.totalRevenue,
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      subLabel: "Platform reach",
      icon: Users,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
      href: "/admin/user",
      accent: "blue",
    },
    {
      title: "Influencers",
      value: stats.totalInfluencers.toString(),
      subLabel: `${stats.verifiedInfluencers} verified`,
      icon: UserCheck,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-50",
      href: "/admin/influencer",
      accent: "emerald",
    },
    {
      title: "Companies",
      value: stats.totalCompanies.toString(),
      subLabel: "Active brands",
      icon: TrendingUp,
      iconColor: "text-indigo-500",
      iconBg: "bg-indigo-50",
      href: "#",
      accent: "indigo",
    },
    {
      title: "Categories",
      value: stats.activeCategories.toString(),
      subLabel: "Content segments",
      icon: FolderOpen,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50",
      href: "/admin/category",
      accent: "amber",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
        </div>
        <p className="text-gray-400 font-bold text-sm uppercase tracking-widest animate-pulse">Loading analytics...</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen p-4 md:p-8 flex flex-col items-start justify-start w-full"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex items-center justify-between w-full mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
          </div>
          <p className="text-gray-500 text-sm font-medium ml-4 mt-1">Platform overview and management hub.</p>
        </div>
        <Link href="/admin/category/create-category">
          <button className="flex items-center gap-2 px-6 h-12 rounded-xl bg-emerald-500 text-white font-bold shadow-sm hover:shadow-md hover:bg-emerald-600 transition-all duration-300 hover:-translate-y-0.5">
            <Plus className="w-5 h-5" />
            <span>Add Category</span>
          </button>
        </Link>
      </motion.div>

      {/* Stat Cards Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-12">
        {statCards.map((card, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Link href={card.href}>
              <Card className="bg-white border border-gray-100 rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-200/50 transition-all duration-500 group relative">
                <CardContent className="p-7">
                  <div className="flex items-center justify-between mb-6">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm border border-transparent group-hover:scale-110",
                      card.iconBg,
                      card.iconColor.replace('text-', 'border-').replace('500', '100')
                    )}>
                      <card.icon className={cn("w-7 h-7", card.iconColor)} />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{card.title}</span>
                      <span className="text-3xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {card.value}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[11px] text-gray-500 font-bold uppercase tracking-tight">{card.subLabel}</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:bg-emerald-50">
                      <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Analytics Charts */}
      <motion.div variants={itemVariants} className="w-full">
        <DashboardCharts 
          revenueTrend={chartData.revenueTrend} 
          applicationsDist={chartData.applicationsDist}
          usersDist={chartData.usersDist}
          offersGrowth={chartData.offersGrowth}
        />
      </motion.div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="flex flex-col">
          <Card className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 md:p-8 border-b border-gray-50 bg-gray-50/30 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                <p className="text-gray-500 text-sm font-medium">Frequently accessed management tools.</p>
              </div>
            </div>
            <CardContent className="p-6 md:p-8 space-y-4">
              {[
                { label: "Manage Users", icon: Users, href: "/admin/user", color: "blue" },
                { label: "Manage Influencers", icon: UserCheck, href: "/admin/influencer", color: "emerald" },
                { label: "Manage Categories", icon: FolderOpen, href: "/admin/category", color: "amber" }
              ].map((action, i) => (
                <Link href={action.href} key={i}>
                  <div className="w-full flex items-center justify-between p-5 rounded-[20px] bg-white hover:bg-emerald-50/50 border border-gray-100 hover:border-emerald-100 transition-all duration-300 group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm",
                        action.color === "blue" && "bg-blue-50 text-blue-500 border border-blue-100",
                        action.color === "emerald" && "bg-emerald-50 text-emerald-500 border border-emerald-100",
                        action.color === "amber" && "bg-amber-50 text-amber-500 border border-amber-100"
                      )}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-gray-700 group-hover:text-emerald-700 transition-colors uppercase tracking-widest text-sm">{action.label}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-white flex items-center justify-center border border-transparent group-hover:border-emerald-100 transition-all">
                      <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="flex flex-col">
          <Card className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 md:p-8 border-b border-gray-50 bg-gray-50/30 flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-50">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <p className="text-gray-500 text-sm font-medium">Latest events from across the platform.</p>
              </div>
            </div>
            <CardContent className="p-6 md:p-8 space-y-4">
              {[
                { label: "New user registered", time: "3h ago", color: "bg-emerald-500" },
                { label: "Category updated", time: "5h ago", color: "bg-blue-500" },
                { label: "Influencer approved", time: "6d ago", color: "bg-purple-500" }
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-[20px] bg-gray-50/50 border border-gray-100/50 hover:bg-white hover:border-gray-200 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={cn("w-3 h-3 rounded-full shadow-sm", activity.color)}></div>
                      <div className={cn("absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-25", activity.color)}></div>
                    </div>
                    <span className="font-bold text-gray-700 text-sm group-hover:text-gray-900 transition-colors">{activity.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-black uppercase tracking-widest">{activity.time}</span>
                  </div>
                </div>
              ))}
              <div className="pt-4 text-center">
                <button className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors flex items-center gap-2 mx-auto group">
                  View Full Logs
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

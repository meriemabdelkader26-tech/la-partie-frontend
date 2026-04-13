"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, TrendingUp, FolderOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_DASHBOARD_STATS } from "@/lib/queries/admin-queries";
import { toast } from "sonner";

interface DashboardStats {
  totalUsers: number;
  totalInfluencers: number;
  activeCategories: number;
  verifiedInfluencers: number;
}

const page = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalInfluencers: 0,
    activeCategories: 0,
    verifiedInfluencers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await graphqlClient.request(GET_DASHBOARD_STATS);

        const totalUsers = data.allUsers?.edges?.length || 0;
        // Correction : allInfluencers est un objet avec edges
        const influencerEdges = data.allInfluencers?.edges || [];
        const influencerNodes = influencerEdges.map((edge: any) => edge.node);
        const totalInfluencers = influencerNodes.length;
        const activeCategories = data.allCategories?.edges?.filter(
          (edge: any) => edge.node.isActive
        ).length || 0;
        const verifiedInfluencers = influencerNodes.filter(
          (inf: any) => inf.user?.emailVerified
        ).length || 0;

        setStats({
          totalUsers,
          totalInfluencers,
          activeCategories,
          verifiedInfluencers,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      icon: Users,
      href: "/admin/user",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Total Influencers",
      value: stats.totalInfluencers.toString(),
      icon: UserCheck,
      href: "/admin/influencer",
      change: `${stats.verifiedInfluencers} verified`,
      changeType: "positive" as const,
    },
    {
      title: "Active Campaigns",
      value: "0",
      icon: TrendingUp,
      href: "/admin/campaigns",
      change: "Coming soon",
      changeType: "neutral" as const,
    },
    {
      title: "Categories",
      value: stats.activeCategories.toString(),
      icon: FolderOpen,
      href: "/admin/category",
      change: "Active",
      changeType: "neutral" as const,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen pb-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-10 bg-blue-600 rounded-full" />
        <h1 className="text-3xl font-extrabold text-blue-900 drop-shadow">Admin Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="bg-slate-800/50 border-slate-700/50 p-6 backdrop-blur-sm hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 transition-all group cursor-pointer rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-none bg-transparent">
                  <CardTitle className="text-sm font-bold text-white">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-5 w-5 text-green-400 group-hover:text-green-500 transition-colors" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-white">
                    {stat.value}
                  </div>
                  <p
                    className={`text-xs mt-1 font-semibold ${
                      stat.changeType === "positive"
                        ? "text-green-400"
                        : stat.changeType === "neutral"
                        ? "text-slate-300"
                        : "text-red-400"
                    }`}
                  >
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-slate-800/50 border-slate-700/50 p-6 backdrop-blur-sm rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#212E53]">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/admin/user"
              className="block p-3 rounded-lg bg-[#BED3C3] hover:bg-[#4A919E]/10 transition-colors text-[#212E53] font-semibold shadow"
            >
              Manage Users
            </Link>
            <Link
              href="/admin/influencer"
              className="block p-3 rounded-lg bg-[#BED3C3] hover:bg-[#4A919E]/10 transition-colors text-[#212E53] font-semibold shadow"
            >
              Manage Influencers
            </Link>
            <Link
              href="/admin/category"
              className="block p-3 rounded-lg bg-[#BED3C3] hover:bg-[#4A919E]/10 transition-colors text-[#212E53] font-semibold shadow"
            >
              Manage Categories
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 p-6 backdrop-blur-sm rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#212E53]">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[#212E53] font-semibold">
            <div className="flex items-center justify-between">
              <span>New user registered</span>
              <span className="text-xs text-blue-500">2h ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Category updated</span>
              <span className="text-xs text-green-600">5h ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Influencer approved</span>
              <span className="text-xs text-blue-700">1d ago</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 p-6 backdrop-blur-sm rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#212E53]">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#212E53] font-semibold">Database</span>
              <span className="text-green-600 text-sm font-bold">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#212E53] font-semibold">API</span>
              <span className="text-green-600 text-sm font-bold">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#212E53] font-semibold">Storage</span>
              <span className="text-[#4A919E] text-sm font-bold">72% used</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
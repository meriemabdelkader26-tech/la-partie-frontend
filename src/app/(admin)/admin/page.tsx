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

        // Correction : toujours obtenir un tableau d'influenceurs
        const influencersArray = Array.isArray(data.allInfluencers)
          ? data.allInfluencers
          : data.allInfluencers?.edges?.map((edge: any) => edge.node) || [];

        const totalInfluencers = influencersArray.length;
        const activeCategories = data.allCategories?.edges?.filter(
          (edge: any) => edge.node.isActive
        ).length || 0;
        const verifiedInfluencers = influencersArray.filter(
          (inf: any) => inf.user?.emailVerified
        ).length;

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-10 bg-linear-to-b from-emerald-400 to-emerald-600 rounded-full" />
        <h1 className="text-3xl font-semibold text-white">Admin Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="bg-slate-900 border-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-pointer group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      stat.changeType === "positive"
                        ? "text-emerald-400"
                        : "text-slate-400"
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
        <Card className="bg-slate-900 border-emerald-500/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/admin/user"
              className="block p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
            >
              Manage Users
            </Link>
            <Link
              href="/admin/influencer"
              className="block p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
            >
              Manage Influencers
            </Link>
            <Link
              href="/admin/category"
              className="block p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
            >
              Manage Categories
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-emerald-500/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-400">
            <div className="flex items-center justify-between">
              <span>New user registered</span>
              <span className="text-xs">2h ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Category updated</span>
              <span className="text-xs">5h ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Influencer approved</span>
              <span className="text-xs">1d ago</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-emerald-500/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Database</span>
              <span className="text-emerald-400 text-sm font-medium">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">API</span>
              <span className="text-emerald-400 text-sm font-medium">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Storage</span>
              <span className="text-emerald-400 text-sm font-medium">
                72% used
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
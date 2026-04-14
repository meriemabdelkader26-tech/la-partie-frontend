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

export default function AdminDashboardPage() {
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
      change: "+14%",
      changeType: "positive" as const,
      color: "",
    },
    {
      title: "Total Influencers",
      value: stats.totalInfluencers.toString(),
      icon: UserCheck,
      href: "/admin/influencer",
      change: `${stats.verifiedInfluencers} verified`,
      changeType: "positive" as const,
      color: "",
    },
    {
      title: "Active Campaigns",
      value: "0",
      icon: TrendingUp,
      href: "#",
      change: "Coming soon",
      changeType: "neutral" as const,
      color: "",
    },
    {
      title: "Categories",
      value: stats.activeCategories.toString(),
      icon: FolderOpen,
      href: "/admin/category",
      change: "Active",
      changeType: "positive" as const,
      color: "",
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
    <div className="min-h-screen p-8 bg-background">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-title">Admin Dashboard</h1>
        <Link href="/admin/category">
          <button className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white font-medium shadow-soft hover:bg-primary-light transition border border-transparent">
            <span className="text-base">+ Add Category</span>
          </button>
        </Link>
      </div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, idx) => (
          <Card
            key={idx}
            className="rounded-[16px] border border-border bg-[linear-gradient(135deg,_#F7FAF9_0%,_#EAF3EF_100%)] shadow-soft flex flex-col justify-between transition-shadow duration-200"
            style={{ minHeight: 120 }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold text-title flex items-center gap-2">
                <card.icon className="w-6 h-6" />
                {card.title}
              </CardTitle>
              <span className="text-2xl font-bold text-title">{card.value}</span>
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-0">
              <span className="text-sm font-medium text-muted">{card.change}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Activity (alignés sur une ligne) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Quick Actions */}
        <Card className="rounded-[16px] border border-border bg-[linear-gradient(135deg,_#F7FAF9_0%,_#EAF3EF_100%)] shadow-soft flex flex-col justify-between p-0">
          <CardHeader className="pb-2 px-6 pt-6">
            <CardTitle className="text-title text-base font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-0 px-6 pb-6">
            <Link href="/admin/user">
              <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-title font-medium hover:bg-primary/10 transition border border-transparent">
                <Users className="w-5 h-5" /> Manage Users
              </button>
            </Link>
            <Link href="/admin/influencer">
              <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-title font-medium hover:bg-info/10 transition border border-transparent">
                <UserCheck className="w-5 h-5" /> Manage Influencers
              </button>
            </Link>
            <Link href="/admin/category">
              <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-title font-medium hover:bg-success/10 transition border border-transparent">
                <FolderOpen className="w-5 h-5" /> Manage Categories
              </button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="rounded-[16px] border border-border bg-[linear-gradient(135deg,_#F7FAF9_0%,_#EAF3EF_100%)] shadow-soft flex flex-col justify-between p-0">
          <CardHeader className="pb-2 px-6 pt-6">
            <CardTitle className="text-title text-base font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-0 px-6 pb-6">
            <div className="flex items-center justify-between text-sm text-title">
              <span>New user registered</span>
              <span className="text-muted">3h ago</span>
            </div>
            <div className="flex items-center justify-between text-sm text-title">
              <span>Category updated</span>
              <span className="text-muted">5h ago</span>
            </div>
            <div className="flex items-center justify-between text-sm text-title">
              <span>Influencer approved</span>
              <span className="text-muted">6d ago</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
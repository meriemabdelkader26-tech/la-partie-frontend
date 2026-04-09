"use client";

import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  Calendar,
  MessageSquare,
} from "lucide-react";

const InfluencerDashboard = () => {
  // Mock data - replace with real data from your API
  const stats = [
    {
      title: "Total Campaigns",
      value: "12",
      icon: Calendar,
      change: "+3 this month",
      changeType: "positive" as const,
    },
    {
      title: "Total Earnings",
      value: "$8,450",
      icon: DollarSign,
      change: "+15% from last month",
      changeType: "positive" as const,
    },
    {
      title: "Total Reach",
      value: "284K",
      icon: Eye,
      change: "+22K this week",
      changeType: "positive" as const,
    },
    {
      title: "Engagement Rate",
      value: "4.8%",
      icon: TrendingUp,
      change: "+0.5% from last month",
      changeType: "positive" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Welcome back! 👋</h1>
        <p className="text-rose-500">
          Here's what's happening with your campaigns today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="bg-rose-100/50 border-rose-200 hover:border-pink-500/30 transition-colors"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-pink-400" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-rose-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-pink-400">{stat.change}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Active Campaigns */}
        <Card className="bg-rose-100/50 border-rose-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Active Campaigns
              </h2>
              <Calendar className="w-5 h-5 text-pink-400" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-3 bg-rose-200/50 rounded-lg hover:bg-rose-200 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-white font-medium">Campaign #{item}</p>
                    <p className="text-rose-500 text-sm">
                      {item === 1
                        ? "Fashion Brand - Summer Collection"
                        : item === 2
                        ? "Tech Product Launch"
                        : "Beauty & Wellness"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-pink-400 font-semibold">
                      ${(item * 1000).toLocaleString()}
                    </p>
                    <p className="text-rose-400 text-xs">In Progress</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent Messages */}
        <Card className="bg-rose-100/50 border-rose-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Recent Messages
              </h2>
              <MessageSquare className="w-5 h-5 text-pink-400" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 p-3 bg-rose-200/50 rounded-lg hover:bg-rose-200 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      Brand {item}
                    </p>
                    <p className="text-rose-500 text-sm truncate">
                      New campaign opportunity available...
                    </p>
                    <p className="text-rose-400 text-xs mt-1">
                      {item} hour{item > 1 ? "s" : ""} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-rose-100/50 border-rose-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <button className="p-4 bg-rose-200/50 rounded-lg hover:bg-pink-500/10 hover:border-pink-500/30 border border-transparent transition-all text-left">
              <p className="text-white font-medium">Update Profile</p>
              <p className="text-rose-500 text-sm mt-1">
                Keep your info current
              </p>
            </button>
            <button className="p-4 bg-rose-200/50 rounded-lg hover:bg-pink-500/10 hover:border-pink-500/30 border border-transparent transition-all text-left">
              <p className="text-white font-medium">Browse Campaigns</p>
              <p className="text-rose-500 text-sm mt-1">
                Find new opportunities
              </p>
            </button>
            <button className="p-4 bg-rose-200/50 rounded-lg hover:bg-pink-500/10 hover:border-pink-500/30 border border-transparent transition-all text-left">
              <p className="text-white font-medium">View Analytics</p>
              <p className="text-rose-500 text-sm mt-1">
                Track your performance
              </p>
            </button>
            <button className="p-4 bg-rose-200/50 rounded-lg hover:bg-pink-500/10 hover:border-pink-500/30 border border-transparent transition-all text-left">
              <p className="text-white font-medium">Check Earnings</p>
              <p className="text-rose-500 text-sm mt-1">Review your income</p>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InfluencerDashboard;

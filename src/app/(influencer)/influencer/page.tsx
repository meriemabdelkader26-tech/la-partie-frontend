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
        <h1 className="text-3xl font-bold text-pastel-dark-blue">Welcome back! 👋</h1>
        <p className="text-pastel-blue">
          Here's what's happening with your campaigns today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <Card
            key={stat.title}
            className="bg-white/70 border-pastel-blue hover:border-pastel-dark-blue transition-colors shadow-md"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${idx % 2 === 0 ? 'bg-pastel-red/20' : 'bg-pastel-blue/20'}`}> 
                  <stat.icon className={`w-6 h-6 ${idx % 2 === 0 ? 'text-pastel-red' : 'text-pastel-blue'}`} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-pastel-dark-blue text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-pastel-dark-blue">{stat.value}</p>
                <p className="text-xs text-pastel-blue">{stat.change}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Active Campaigns */}
        <Card className="bg-white/70 border-pastel-blue">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-pastel-dark-blue">
                Active Campaigns
              </h2>
              <Calendar className="w-5 h-5 text-pastel-blue" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-3 bg-pastel-green/10 rounded-lg hover:bg-pastel-green/20 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-pastel-dark-blue font-medium">Campaign #{item}</p>
                    <p className="text-pastel-red text-sm">
                      {item === 1
                        ? "Fashion Brand - Summer Collection"
                        : item === 2
                        ? "Tech Product Launch"
                        : "Beauty & Wellness"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-pastel-blue font-semibold">
                      ${(item * 1000).toLocaleString()}
                    </p>
                    <p className="text-pastel-dark-blue text-xs">In Progress</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent Messages */}
        <Card className="bg-white/70 border-pastel-blue">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-pastel-dark-blue">
                Recent Messages
              </h2>
              <MessageSquare className="w-5 h-5 text-pastel-blue" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 p-3 bg-pastel-red/10 rounded-lg hover:bg-pastel-red/20 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-pastel-red/20 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-pastel-red" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-pastel-dark-blue font-medium truncate">
                      Brand {item}
                    </p>
                    <p className="text-pastel-red text-sm truncate">
                      New campaign opportunity available...
                    </p>
                    <p className="text-xs text-pastel-blue mt-1">
                      {item} hour{item > 1 ? "s" : ""} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
          {/* Harmonisation pastel : boutons d'action */}
          <div className="flex flex-col gap-2 mt-4">
            <button className="p-4 bg-pastel-red/10 rounded-lg hover:bg-pastel-red/20 hover:border-pastel-red/30 border border-transparent transition-all text-left">
              <p className="text-pastel-dark-blue font-medium">View Analytics</p>
              <p className="text-pastel-red text-sm mt-1">Track your performance</p>
            </button>
            <button className="p-4 bg-pastel-red/10 rounded-lg hover:bg-pastel-red/20 hover:border-pastel-red/30 border border-transparent transition-all text-left">
              <p className="text-pastel-dark-blue font-medium">Check Earnings</p>
              <p className="text-pastel-red text-sm mt-1">Review your income</p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InfluencerDashboard;

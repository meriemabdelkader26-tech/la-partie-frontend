"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageSquare,
  Users,
} from "lucide-react";

const AnalyticsPage = () => {
  const stats = [
    {
      title: "Total Reach",
      value: "284K",
      change: "+12.5%",
      trending: "up",
      icon: Eye,
    },
    {
      title: "Engagement Rate",
      value: "4.8%",
      change: "+0.5%",
      trending: "up",
      icon: Heart,
    },
    {
      title: "Total Comments",
      value: "12.3K",
      change: "+8.2%",
      trending: "up",
      icon: MessageSquare,
    },
    {
      title: "New Followers",
      value: "+2.4K",
      change: "+15.3%",
      trending: "up",
      icon: Users,
    },
  ];

  const monthlyData = [
    { month: "Jan", reach: 180, engagement: 3.8, earnings: 4200 },
    { month: "Feb", reach: 210, engagement: 4.1, earnings: 5100 },
    { month: "Mar", reach: 245, engagement: 4.5, earnings: 6800 },
    { month: "Apr", reach: 284, engagement: 4.8, earnings: 8450 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 mt-1">
          Track your performance and growth metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="bg-slate-800/50 border-slate-700 hover:border-primary/30 transition-colors"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    stat.trending === "up" ? "text-primary-dark" : "text-red-400"
                  }`}
                >
                  {stat.trending === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="reach" className="w-full">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="reach">Reach</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        <TabsContent value="reach" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                Monthly Reach
              </h3>
              <div className="space-y-4">
                {monthlyData.map((data) => (
                  <div key={data.month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{data.month}</span>
                      <span className="text-white font-semibold">
                        {data.reach}K
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-linear-to-r from-primary-dark to-primary h-3 rounded-full transition-all"
                        style={{ width: `${(data.reach / 300) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                Engagement Rate
              </h3>
              <div className="space-y-4">
                {monthlyData.map((data) => (
                  <div key={data.month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{data.month}</span>
                      <span className="text-white font-semibold">
                        {data.engagement}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-linear-to-r from-blue-600 to-blue-400 h-3 rounded-full transition-all"
                        style={{ width: `${(data.engagement / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="earnings" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                Monthly Earnings
              </h3>
              <div className="space-y-4">
                {monthlyData.map((data) => (
                  <div key={data.month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{data.month}</span>
                      <span className="text-white font-semibold">
                        ${data.earnings.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-linear-to-r from-emerald-600 to-green-400 h-3 rounded-full transition-all"
                        style={{ width: `${(data.earnings / 10000) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Performing Content */}
      <Card className="bg-slate-800/50 border-slate-700">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-6">
            Top Performing Content
          </h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">#{item}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">
                      Post Title #{item}
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Posted {item} days ago
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-white font-semibold">
                      {(125 - item * 10).toFixed(0)}K
                    </p>
                    <p className="text-slate-400 text-xs">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold">
                      {(8.5 - item * 0.5).toFixed(1)}K
                    </p>
                    <p className="text-slate-400 text-xs">Likes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold">
                      {(4.8 - item * 0.2).toFixed(1)}%
                    </p>
                    <p className="text-slate-400 text-xs">Rate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPage;

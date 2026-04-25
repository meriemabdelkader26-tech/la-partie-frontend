"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";

const AnalyticsPage = () => {
  const stats = [
    {
      title: "Total Reach",
      value: "1.2M",
      change: "+12.5%",
      trending: "up",
      icon: Eye,
    },
    {
      title: "Engagement Rate",
      value: "4.8%",
      change: "+0.3%",
      trending: "up",
      icon: Heart,
    },
    {
      title: "Avg. Likes",
      value: "15.4K",
      change: "-2.1%",
      trending: "down",
      icon: Users,
    },
    {
      title: "Shares",
      value: "842",
      change: "+5.4%",
      trending: "up",
      icon: Share2,
    },
  ];

  const monthlyData = [
    { month: "Jan", reach: 210, engagement: 3.2, earnings: 4200 },
    { month: "Feb", reach: 245, engagement: 3.8, earnings: 5100 },
    { month: "Mar", reach: 280, engagement: 4.1, earnings: 6800 },
    { month: "Apr", reach: 295, engagement: 4.8, earnings: 8450 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="animate-fadeInDown">
        <h1 className="text-3xl font-bold text-black tracking-tight">Analytics</h1>
        <p className="text-gray-500 font-medium mt-1">
          Track your performance and growth metrics across all platforms
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card
            key={stat.title}
            className="bg-white border-2 border-black/5 rounded-3xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 group animate-fadeInUp"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <stat.icon className="w-5 h-5 text-black group-hover:text-white transition-colors duration-300" />
              </div>
              <div
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border ${
                  stat.trending === "up" 
                    ? "bg-green-50 text-green-600 border-green-100" 
                    : "bg-red-50 text-red-600 border-red-100"
                }`}
              >
                {stat.trending === "up" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 font-semibold text-sm">{stat.title}</p>
              <p className="text-3xl font-bold text-black group-hover:tracking-tight transition-all duration-300">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="reach" className="w-full">
        <TabsList className="bg-gray-100 border border-black/5 rounded-xl p-1 mb-8 animate-fadeInUp delay-500">
          <TabsTrigger value="reach" className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm rounded-lg py-3 px-10 font-bold transition-all duration-300">
            Reach
          </TabsTrigger>
          <TabsTrigger value="engagement" className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm rounded-lg py-3 px-10 font-bold transition-all duration-300">
            Engagement
          </TabsTrigger>
          <TabsTrigger value="earnings" className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm rounded-lg py-3 px-10 font-bold transition-all duration-300">
            Earnings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reach" className="mt-0 animate-fadeInUp delay-600">
          <Card className="bg-white border-2 border-black/5 rounded-3xl p-8 shadow-soft">
            <h3 className="text-xl font-bold text-black mb-8">
              Monthly Reach
            </h3>
            <div className="space-y-8">
              {monthlyData.map((data, idx) => (
                <div key={data.month} className="space-y-3 animate-fadeInUp" style={{ animationDelay: `${700 + idx * 100}ms` }}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-black uppercase tracking-widest text-[10px]">{data.month}</span>
                    <span className="text-black font-bold">
                      {data.reach}K
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-black h-4 rounded-full transition-all duration-1000 ease-out shadow-sm animate-grow"
                      style={{ width: `${(data.reach / 300) * 100}%`, animationDelay: `${800 + idx * 100}ms` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="mt-0 animate-fadeInUp delay-600">
          <Card className="bg-white border-2 border-black/5 rounded-3xl p-8 shadow-soft">
            <h3 className="text-xl font-bold text-black mb-8">
              Engagement Rate
            </h3>
            <div className="space-y-8">
              {monthlyData.map((data, idx) => (
                <div key={data.month} className="space-y-3 animate-fadeInUp" style={{ animationDelay: `${700 + idx * 100}ms` }}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-black uppercase tracking-widest text-[10px]">{data.month}</span>
                    <span className="text-black font-bold">
                      {data.engagement}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-black h-4 rounded-full transition-all duration-1000 ease-out shadow-sm animate-grow"
                      style={{ width: `${(data.engagement / 5) * 100}%`, animationDelay: `${800 + idx * 100}ms` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="earnings" className="mt-0 animate-fadeInUp delay-600">
          <Card className="bg-white border-2 border-black/5 rounded-3xl p-8 shadow-soft">
            <h3 className="text-xl font-bold text-black mb-8">
              Monthly Earnings
            </h3>
            <div className="space-y-8">
              {monthlyData.map((data, idx) => (
                <div key={data.month} className="space-y-3 animate-fadeInUp" style={{ animationDelay: `${700 + idx * 100}ms` }}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-black uppercase tracking-widest text-[10px]">{data.month}</span>
                    <span className="text-black font-bold">
                      ${data.earnings.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-black h-4 rounded-full transition-all duration-1000 ease-out shadow-sm animate-grow"
                      style={{ width: `${(data.earnings / 10000) * 100}%`, animationDelay: `${800 + idx * 100}ms` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;

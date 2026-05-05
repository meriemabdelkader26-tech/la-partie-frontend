"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Users, 
  ArrowUpRight, 
  Calendar, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Target,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_COMPANY_DASHBOARD_STATS } from "@/lib/queries/offer-queries";
import { CompanyDashboardStats } from "@/lib/types/offer-types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

const AnalyticsPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["companyDashboardStats"],
    queryFn: () => graphqlClient.request<{ companyDashboardStats: CompanyDashboardStats }>(GET_COMPANY_DASHBOARD_STATS),
  });

  const stats = data?.companyDashboardStats;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center p-4">
        <div className="space-y-4">
          <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-black text-black">Failed to load analytics</h2>
          <p className="text-gray-500">{(error as any).message || "An unexpected error occurred."}</p>
          <Button onClick={() => window.location.reload()} className="bg-black text-white rounded-xl px-8 h-12 font-black">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const applicationData = [
    { name: "Approved", value: stats?.approvedApplications || 0 },
    { name: "Pending", value: stats?.pendingApplications || 0 },
    { name: "Rejected", value: stats?.rejectedApplications || 0 },
  ];

  const successRate = stats?.totalApplications 
    ? ((stats.approvedApplications / stats.totalApplications) * 100).toFixed(1) 
    : "0.0";

  // Mock data for the trend chart (since we only have recent offers)
  const recentOffersTrend = stats?.recentOffers?.slice().reverse().map((offer: any) => ({
    name: offer.title.substring(0, 10) + "...",
    influencers: offer.influencerNumber,
    budget: offer.maxBudget
  })) || [];

  return (
    <div className="space-y-10 pb-12 px-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
            <BarChart3 className="w-3 h-3 text-blue-400" />
            <span>Performance Insights</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter mb-2 uppercase">
            Analytics <span className="text-gray-400">Overview</span> 📊
          </h1>
          <p className="text-gray-500 font-medium text-lg uppercase tracking-widest">
            Strategic campaign monitoring and ROI analysis.
          </p>
        </motion.div>

        <div className="flex gap-3">
          <Button variant="outline" className="h-12 border-2 border-black/5 rounded-xl font-black uppercase tracking-widest text-[10px]">
            <Calendar className="w-4 h-4 mr-2" />
            Real-time Data
          </Button>
          <Button className="h-12 bg-black text-white rounded-xl font-black px-6 shadow-xl shadow-black/10 uppercase tracking-widest text-[10px]">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Hero Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Campaigns", value: stats?.activeOffers || 0, trend: "Live", icon: Target, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Total Talent Pool", value: stats?.totalApplications || 0, trend: "Interest", icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
          { label: "Success Rate", value: `${successRate}%`, trend: "Growth", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Market Reach", value: stats?.totalOffers || 0, trend: "Missions", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white border-black/5 rounded-4xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.bg} ${stat.color} rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-full uppercase tracking-widest">{stat.trend}</span>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <div className="text-4xl font-black text-black tracking-tighter">{stat.value}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Application Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-5"
        >
          <Card className="bg-white border-black/5 rounded-4xl shadow-large overflow-hidden h-full">
            <CardHeader className="p-8 border-b border-black/5">
              <CardTitle className="text-xl font-black text-black uppercase tracking-tight">Application Pipeline</CardTitle>
              <CardDescription className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Status breakdown of influencer proposals</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={applicationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {applicationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Campaign Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-7"
        >
          <Card className="bg-white border-black/5 rounded-4xl shadow-large overflow-hidden h-full">
            <CardHeader className="p-8 border-b border-black/5">
              <CardTitle className="text-xl font-black text-black uppercase tracking-tight">Recent Campaign Reach</CardTitle>
              <CardDescription className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Target influencers vs Budget per campaign</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={recentOffersTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9ca3af' }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9ca3af' }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="influencers" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity Table (simplified for analytics) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-white border-black/5 rounded-4xl shadow-large overflow-hidden">
          <CardHeader className="p-8 border-b border-black/5 bg-gray-50/30">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-black text-white rounded-2xl">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-black uppercase tracking-tight">Real-time Activity</CardTitle>
                <CardDescription className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Latest interactions across your brand portfolio</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/5 bg-gray-50/50">
                    <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Talent</th>
                    <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Campaign</th>
                    <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Value</th>
                    <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentApplications?.map((app, idx) => (
                    <tr key={app.id} className="border-b border-black/5 hover:bg-gray-50/50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-black text-white flex items-center justify-center font-black text-xs">
                            {app.user.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-bold text-black text-sm">{app.user.name}</span>
                        </div>
                      </td>
                      <td className="p-6 text-sm font-medium text-gray-500">{app.offer.title}</td>
                      <td className="p-6 font-black text-black">${app.askingPrice.toLocaleString()}</td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          app.status === "Approved" ? "bg-emerald-50 text-emerald-600" :
                          app.status === "Pending" ? "bg-amber-50 text-amber-600" :
                          "bg-rose-50 text-rose-600"
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-6 text-right text-xs font-bold text-gray-400">
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {(!stats?.recentApplications || stats.recentApplications.length === 0) && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">
                        No recent activity recorded
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;

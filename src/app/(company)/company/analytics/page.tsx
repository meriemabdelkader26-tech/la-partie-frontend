"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, PieChart, Users, ArrowUpRight, Calendar, Filter, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AnalyticsPage = () => {
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
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter mb-2">
            Analytics <span className="text-gray-400">Overview</span> 📊
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Monitor your campaign reach, engagement, and ROI.
          </p>
        </motion.div>

        <div className="flex gap-3">
          <Button variant="outline" className="h-12 border-2 border-black/5 rounded-xl font-bold">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 Days
          </Button>
          <Button className="h-12 bg-black text-white rounded-xl font-bold px-6 shadow-xl shadow-black/10">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Hero Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Reach", value: "2.4M", trend: "+12.5%", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Engagement", value: "854K", trend: "+8.2%", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Conversions", value: "12.4K", trend: "+24.1%", icon: ArrowUpRight, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "ROI", value: "4.2x", trend: "+15.3%", icon: PieChart, color: "text-rose-500", bg: "bg-rose-50" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white border-black/5 rounded-[2rem] p-6 shadow-soft hover:shadow-medium transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.bg} ${stat.color} rounded-2xl`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{stat.trend}</span>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="text-4xl font-black text-black tracking-tighter">{stat.value}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Coming Soon Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-white border-black/5 rounded-[3rem] border-dashed border-2 shadow-soft overflow-hidden relative min-h-[500px] flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-50/30 -z-10" />
          <div className="text-center p-10 max-w-lg">
            <div className="w-24 h-24 bg-black text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-3">
              <BarChart3 className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-black text-black mb-4">Advanced Analytics are coming</h3>
            <p className="text-gray-500 font-medium text-lg leading-relaxed mb-10">
              We're currently building a deep-dive analytics suite that will help you track real-time conversion rates and sentiment analysis.
            </p>
            <div className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 rounded-2xl inline-flex">
              <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Beta launch next week</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;

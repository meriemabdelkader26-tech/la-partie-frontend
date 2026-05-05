"use client";

import { useEffect, useState } from "react";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_COMPANY_DASHBOARD_STATS } from "@/lib/queries/offer-queries";
import { GET_MY_COMPANY_PROFILE } from "@/lib/queries/company-queries";
import { CompanyDashboardStats } from "@/lib/types/offer-types";
import { Company } from "@/lib/types/company-types";
import { 
  Briefcase, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  Calendar,
  Plus,
  ArrowUpRight,
  LayoutDashboard,
  Zap,
  Target,
  Sparkles,
  Search,
  ChevronRight,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
  color?: "blue" | "emerald" | "amber" | "rose" | "black";
}

const StatCard = ({ title, value, icon, description, trend, delay = 0, color = "black" }: StatCardProps) => {
  const colorConfig = {
    blue: "bg-blue-50 text-blue-600 shadow-blue-100/50",
    emerald: "bg-emerald-50 text-emerald-600 shadow-emerald-100/50",
    amber: "bg-amber-50 text-amber-600 shadow-amber-100/50",
    rose: "bg-rose-50 text-rose-600 shadow-rose-100/50",
    black: "bg-gray-50 text-black shadow-gray-100/50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -5 }}
    >
      <Card className="bg-white border-black/5 rounded-[2.5rem] p-6 shadow-large overflow-hidden group hover:border-black/10 transition-all duration-500">
        <div className="flex items-start justify-between mb-8">
          <div className={`p-4 rounded-2xl shadow-xl transition-all duration-500 group-hover:scale-110 ${colorConfig[color]}`}>
            {icon}
          </div>
          {trend && (
            <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
              trend.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            }`}>
              <TrendingUp className={`w-3.5 h-3.5 ${!trend.isPositive && "rotate-180"}`} />
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest leading-none">
            {title}
          </h3>
          <div className="text-5xl font-black text-black tracking-tighter group-hover:scale-105 transition-transform duration-500 origin-left">
            {value}
          </div>
          {description && (
            <p className="text-xs font-bold text-gray-500 mt-2">{description}</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

const OfferCard = ({ offer, index }: { offer: any; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
    >
      <Link href={`/company/campaigns/${offer.id}`} className="group block">
        <Card className="bg-white border-black/5 rounded-[2.5rem] p-6 shadow-soft hover:shadow-large hover:border-black/10 transition-all duration-500 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-4 group-hover:translate-x-0">
            <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shadow-xl">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          
          <div className="flex flex-col h-full space-y-6">
            <div className="space-y-4">
              <Badge className="bg-black text-white rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest border-none">
                {offer.status || "Active"}
              </Badge>
              <h4 className="text-2xl font-black text-black leading-tight tracking-tight group-hover:text-gray-700 transition-colors line-clamp-1">
                {offer.title}
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl border border-black/5">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Budget Range</span>
                <span className="text-sm font-black text-black">${offer.minBudget} - ${offer.maxBudget}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-black/5">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Timeline</span>
                <span className="text-sm font-black text-black">{new Date(offer.endDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-black/5">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-600">{offer.influencerNumber} slots</span>
              </div>
              <span className="text-xs font-black text-black uppercase tracking-widest">Details <ChevronRight className="w-4 h-4 inline ml-1" /></span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

const ApplicationCard = ({ application, index }: { application: any; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
    >
      <Link href={`/company/campaigns/${application.offer.id}/applications`} className="group block">
        <Card className="bg-white border-black/5 rounded-[2.5rem] p-6 shadow-soft hover:shadow-large hover:border-black/10 transition-all duration-500 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-2xl text-black shadow-inner overflow-hidden group-hover:scale-105 transition-transform duration-500">
                {application.user.profilePicture ? (
                  <img src={application.user.profilePicture} alt={application.user.name} className="w-full h-full object-cover" />
                ) : (
                  application.user.name?.substring(0, 1) || "I"
                )}
              </div>
              <div>
                <h4 className="text-lg font-black text-black tracking-tight leading-none mb-1">{application.user.name}</h4>
                <p className="text-xs font-bold text-gray-400 line-clamp-1">{application.user.email}</p>
              </div>
            </div>
            <div className="px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[10px] font-black uppercase tracking-widest">
              Pending
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-2xl border border-black/5">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Applying for</span>
              <span className="text-sm font-black text-black line-clamp-1">{application.offer.title}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price Point</span>
                <span className="text-lg font-black text-black">${application.askingPrice}</span>
              </div>
              <Button variant="ghost" className="h-10 px-4 rounded-xl bg-black text-white hover:bg-gray-800 transition-all">
                Review <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

const DashboardPage = () => {
  const [stats, setStats] = useState<CompanyDashboardStats | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const companyData = await graphqlClient.request(GET_MY_COMPANY_PROFILE);
        setCompany(companyData.myCompanyProfile);
        const statsData = await graphqlClient.request(GET_COMPANY_DASHBOARD_STATS);
        setStats(statsData.companyDashboardStats);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24 bg-black/5 rounded-full" />
            <Skeleton className="h-12 w-80 bg-black/5 rounded-2xl" />
            <Skeleton className="h-5 w-64 bg-black/5 rounded-full" />
          </div>
          <Skeleton className="h-14 w-56 bg-black/5 rounded-2xl" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 bg-black/5 rounded-[2.5rem]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-6">
            <Skeleton className="h-[250px] bg-black/5 rounded-[3rem]" />
            <Skeleton className="h-[250px] bg-black/5 rounded-[3rem]" />
          </div>
          <div className="lg:col-span-8 space-y-10">
            <Skeleton className="h-[400px] bg-black/5 rounded-[3rem]" />
            <Skeleton className="h-[400px] bg-black/5 rounded-[3rem]" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 max-w-md">
          <div className="w-24 h-24 bg-rose-50 rounded-4xl flex items-center justify-center mx-auto border-2 border-rose-100 shadow-xl shadow-rose-100/50">
            <XCircle className="w-12 h-12 text-rose-500" />
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-black tracking-tight">System Interruption</h3>
            <p className="text-gray-500 font-medium leading-relaxed">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()} className="bg-black hover:bg-gray-800 text-white font-black h-14 px-10 rounded-2xl shadow-xl hover:shadow-black/20 transition-all">
            Reconnect to System
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Dynamic Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="relative"
        >
          <div className="absolute -left-4 top-0 w-1 h-full bg-black rounded-full hidden md:block" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-black text-white rounded-xl shadow-lg">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <span className="text-[10px] font-black text-black uppercase tracking-[0.3em]">Business Portal v2.0</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-black tracking-widest mb-3 leading-none uppercase">
            {company?.companyName || "Organization"}
          </h1>
          <p className="text-gray-400 font-black text-lg uppercase tracking-widest flex items-center gap-3">
            <span className="w-8 h-[2px] bg-gray-200" />
            Strategic Command Center
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/company/campaigns/new">
            <Button className="h-20 px-10 bg-black hover:bg-gray-800 text-white font-black text-xl rounded-4xl shadow-2xl hover:shadow-black/20 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-emerald-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Plus className="w-8 h-8 mr-4 group-hover:rotate-90 transition-transform duration-500" />
              Launch Campaign
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Core Intelligence Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Campaigns"
          value={stats?.totalOffers || 0}
          icon={<Briefcase className="w-6 h-6" />}
          description="Global campaign reach"
          color="black"
          delay={0.1}
        />
        <StatCard
          title="Live Now"
          value={stats?.activeOffers || 0}
          icon={<Target className="w-6 h-6" />}
          description="Active market presence"
          trend={{ value: 12, isPositive: true }}
          color="emerald"
          delay={0.2}
        />
        <StatCard
          title="Talent Pool"
          value={stats?.totalApplications || 0}
          icon={<Users className="w-6 h-6" />}
          description="Interested influencers"
          color="blue"
          delay={0.3}
        />
        <StatCard
          title="Actions Required"
          value={stats?.pendingApplications || 0}
          icon={<Clock className="w-6 h-6" />}
          description="Proposals pending review"
          color="amber"
          delay={0.4}
        />
      </div>

      {/* Performance & Activity Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Success Metrics Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-10"
          >
            <div className="px-4">
              <h2 className="text-3xl font-black text-black tracking-tight uppercase flex items-center gap-3">
                <Target className="w-8 h-8" />
                Performance
              </h2>
            </div>

            <div className="space-y-6">
              <Card className="bg-emerald-50/50 border-emerald-100 rounded-[3rem] p-10 shadow-soft hover:shadow-large transition-all duration-500 group relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                <div className="flex flex-col gap-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-xl">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-emerald-900 uppercase tracking-widest leading-none mb-1">Success Rate</h3>
                      <p className="text-xs font-bold text-emerald-600/60 uppercase">Confirmed collaborations</p>
                    </div>
                  </div>
                  <div className="text-8xl font-black text-emerald-600 tracking-tighter leading-none">
                    {stats?.approvedApplications || 0}
                  </div>
                </div>
              </Card>

              <Card className="bg-rose-50/50 border-rose-100 rounded-[3rem] p-10 shadow-soft hover:shadow-large transition-all duration-500 group relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                <div className="flex flex-col gap-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-rose-500 text-white rounded-2xl shadow-xl">
                      <XCircle className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-rose-900 uppercase tracking-widest leading-none mb-1">Filtered</h3>
                      <p className="text-xs font-bold text-rose-600/60 uppercase">Declined applications</p>
                    </div>
                  </div>
                  <div className="text-8xl font-black text-rose-600 tracking-tighter leading-none">
                    {stats?.rejectedApplications || 0}
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Activity Streams */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Recent Campaigns Section */}
          <section className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-between px-4"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 text-black rounded-2xl shadow-soft">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-black tracking-tight leading-none mb-1">Recent Missions</h2>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Ongoing marketing cycles</p>
                </div>
              </div>
              <Link href="/company/campaigns">
                <Button variant="ghost" className="h-12 px-6 font-black text-gray-400 hover:text-black hover:bg-gray-50 rounded-2xl uppercase tracking-[0.2em] transition-all group">
                  History
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
            
            <AnimatePresence mode="wait">
              {stats?.recentOffers && stats.recentOffers.length > 0 ? (
                <div className="grid gap-8 sm:grid-cols-2">
                  {stats.recentOffers.slice(0, 2).map((offer, idx) => (
                    <OfferCard key={offer.id} offer={offer} index={idx} />
                  ))}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Card className="bg-gray-50/50 border-black/5 rounded-[4rem] border-dashed border-4 p-20 text-center">
                    <div className="max-w-xs mx-auto space-y-8">
                      <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-large rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Search className="w-10 h-10 text-gray-200" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-black tracking-tight">System Idle</h3>
                        <p className="text-gray-400 font-medium leading-relaxed">Your brand presence is currently dormant. Activate a new campaign to begin.</p>
                      </div>
                      <Link href="/company/campaigns/new">
                        <Button className="h-14 px-10 bg-black text-white font-black rounded-2xl shadow-xl hover:-translate-y-1 transition-all">
                          Initiate First Campaign
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Latest Proposals Section */}
          <section className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-between px-4"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 text-black rounded-2xl shadow-soft">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-black tracking-tight leading-none mb-1">Incoming Proposals</h2>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Influencer applications queue</p>
                </div>
              </div>
              <Link href="/company/campaigns">
                <Button variant="ghost" className="h-12 px-6 font-black text-gray-400 hover:text-black hover:bg-gray-50 rounded-2xl uppercase tracking-[0.2em] transition-all group">
                  Queue
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
            
            <AnimatePresence mode="wait">
              {stats?.recentApplications && stats.recentApplications.length > 0 ? (
                <div className="grid gap-8 sm:grid-cols-2">
                  {stats.recentApplications.slice(0, 2).map((application, idx) => (
                    <ApplicationCard key={application.id} application={application} index={idx} />
                  ))}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Card className="bg-gray-50/50 border-black/5 rounded-[4rem] border-dashed border-4 p-20 text-center">
                    <div className="max-w-xs mx-auto space-y-6">
                      <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-large -rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Users className="w-10 h-10 text-gray-200" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-black tracking-tight">Queue Empty</h3>
                        <p className="text-gray-400 font-medium leading-relaxed">Awaiting talent responses. Great campaigns take time to resonate.</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Quick Actions Footer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pt-10 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Link href="/company/influencers/search" className="group">
              <div className="p-6 bg-white border border-black/5 rounded-4xl shadow-soft group-hover:bg-black transition-all duration-500 flex flex-col gap-4">
                <Search className="w-6 h-6 text-black group-hover:text-white transition-colors" />
                <span className="text-sm font-black text-black group-hover:text-white uppercase tracking-widest transition-colors">Discover Talent</span>
              </div>
            </Link>
            <Link href="/company/analytics" className="group">
              <div className="p-6 bg-white border border-black/5 rounded-4xl shadow-soft group-hover:bg-black transition-all duration-500 flex flex-col gap-4">
                <TrendingUp className="w-6 h-6 text-black group-hover:text-white transition-colors" />
                <span className="text-sm font-black text-black group-hover:text-white uppercase tracking-widest transition-colors">Market Insights</span>
              </div>
            </Link>
            <Link href="/company/profile" className="group">
              <div className="p-6 bg-white border border-black/5 rounded-4xl shadow-soft group-hover:bg-black transition-all duration-500 flex flex-col gap-4">
                <Briefcase className="w-6 h-6 text-black group-hover:text-white transition-colors" />
                <span className="text-sm font-black text-black group-hover:text-white uppercase tracking-widest transition-colors">Brand Identity</span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

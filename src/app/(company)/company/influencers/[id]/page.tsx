"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_INFLUENCER_QUERY, InfluencerDetailDataType } from "./_components/query";
import Loading from "@/app/loading";
import { useId } from "@/app/hooks/use-id";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Instagram, 
  MapPin, 
  Users, 
  TrendingUp, 
  Heart, 
  Globe, 
  Calendar,
  ShieldCheck,
  Send,
  MessageCircle,
  ChevronRight,
  Sparkles,
  Play,
  Image as ImageIcon,
  Clock
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "date-fns";
import { NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_IMAGE_PROXY } from "@/config";
import Image from "next/image";

const formatNumber = (num: number | undefined | null) => {
  if (num === undefined || num === null) return "0";
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export default function InfluencerProfilePage() {
  const id = useId();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const { isFetching, data } = useQuery<InfluencerDetailDataType>({
    queryKey: ["companyInfluencerDetail", id],
    queryFn: () => graphqlClient.request(GET_INFLUENCER_QUERY, { id }),
    enabled: !!id,
  });

  if (isFetching) return <Loading />;

  const influencer = data?.influencer;
  if (!influencer) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="p-6 bg-gray-50 rounded-full">
        <Users className="w-12 h-12 text-gray-300" />
      </div>
      <h2 className="text-2xl font-black text-black">Influencer not found</h2>
      <Button onClick={() => router.back()} variant="outline" className="rounded-xl border-2">
        Go Back
      </Button>
    </div>
  );

  const stats = influencer.statistiquesGlobales;
  const primarySocial = influencer.reseauxSociaux?.[0];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Navigation Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-2xl hover:bg-black hover:text-white transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Profile Details</span>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">{influencer.pseudo}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="h-11 rounded-xl border-2 font-bold px-6"
            onClick={() => router.push(`/company/messages?userId=${influencer.user?.id}`)}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
          <Button className="h-11 bg-black text-white hover:bg-gray-800 rounded-xl font-bold px-8 shadow-lg shadow-black/10">
            <Send className="w-4 h-4 mr-2" />
            Pitch Campaign
          </Button>
        </div>
      </div>

      {/* Hero Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Card className="overflow-hidden border-black/5 bg-white shadow-large rounded-[3rem]">
          <div className="h-48 bg-gray-50 relative overflow-hidden">
            {/* Abstract decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-black/5 rounded-full -mr-48 -mt-48 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-100 rounded-full -ml-32 -mb-32 blur-2xl" />
          </div>
          
          <CardContent className="relative px-8 md:px-12 pb-12">
            <div className="flex flex-col md:flex-row gap-8 -mt-16 items-start">
              <div className="relative">
                <Avatar className="size-40 md:size-48 border-8 border-white shadow-2xl rounded-[2.5rem] bg-white">
                  <AvatarImage src={influencer.profilePicture} className="object-cover" />
                  <AvatarFallback className="bg-gray-100 text-black text-4xl font-black rounded-[2.5rem]">
                    {influencer.pseudo?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {influencer.user?.isVerifyByAdmin && (
                  <div className="absolute -bottom-2 -right-2 bg-black text-white p-2.5 rounded-2xl shadow-xl border-4 border-white">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-6 pt-4">
                <div className="flex flex-wrap items-center gap-4 justify-between">
                  <div className="space-y-1">
                    <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter uppercase">{influencer.pseudo}</h1>
                    <div className="flex items-center gap-4 text-gray-500 font-bold">
                      <div className="flex items-center gap-1.5 hover:text-black transition-colors cursor-pointer">
                        <Instagram className="w-4 h-4" />
                        <span className="text-sm tracking-tight">@{influencer.instagramUsername}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm tracking-tight">{influencer.localisation || "Global"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-none">
                      {influencer.disponibiliteCollaboration?.replace('_', ' ') || "Available"}
                    </Badge>
                    <Badge variant="outline" className="border-2 border-black/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Top Creator
                    </Badge>
                  </div>
                </div>

                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">About Me</span>
                  </div>
                  <p className="text-gray-600 font-medium text-lg leading-relaxed italic">
                    &ldquo;{influencer.biography || "Professional content creator focusing on high-quality visual storytelling and authentic audience engagement."}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Global Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 pt-12 border-t border-black/5">
              <div className="bg-gray-50/50 p-6 rounded-4xl border border-black/5 hover:border-black/10 transition-all group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-black text-white rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Audience</span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-black tracking-tighter">{formatNumber(stats?.followersTotaux)}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Followers</p>
                </div>
              </div>

              <div className="bg-gray-50/50 p-6 rounded-4xl border border-black/5 hover:border-black/10 transition-all group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-black text-white rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Engagement</span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-black tracking-tighter">{stats?.engagementMoyenGlobal?.toFixed(1)}%</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rate</p>
                </div>
              </div>

              <div className="bg-gray-50/50 p-6 rounded-4xl border border-black/5 hover:border-black/10 transition-all group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-black text-white rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <Heart className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Impact</span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-black tracking-tighter">{formatNumber(primarySocial?.moyenneLikes)}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Avg. Likes</p>
                </div>
              </div>

              <div className="bg-gray-50/50 p-6 rounded-4xl border border-black/5 hover:border-black/10 transition-all group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-black text-white rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Identity</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {influencer.langues?.slice(0, 3).map((lang, idx) => (
                    <Badge key={`${lang}-${idx}`} variant="outline" className="rounded-lg border-2 border-black/10 bg-white font-black text-[10px] uppercase">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <Tabs defaultValue="posts" className="w-full">
            <div className="flex items-center justify-between mb-8 px-4">
              <TabsList className="bg-gray-100/50 p-1.5 rounded-2xl border border-black/5 h-14">
                <TabsTrigger value="posts" className="rounded-xl px-8 h-full font-black text-xs uppercase tracking-widest data-[state=active]:bg-black data-[state=active]:text-white transition-all">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Posts
                </TabsTrigger>
                <TabsTrigger value="reels" className="rounded-xl px-8 h-full font-black text-xs uppercase tracking-widest data-[state=active]:bg-black data-[state=active]:text-white transition-all">
                  <Play className="w-4 h-4 mr-2" />
                  Reels
                </TabsTrigger>
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              <TabsContent key="posts" value="posts">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {influencer.instagramPosts?.length ? influencer.instagramPosts.map((post, idx) => (
                    <motion.div
                      key={post.id || idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group relative aspect-square bg-gray-100 rounded-4xl overflow-hidden shadow-soft hover:shadow-large transition-all duration-500"
                    >
                      <img 
                        src={(post.imageUrl || post.thumbnailUrl) && !String(post.imageUrl || post.thumbnailUrl).includes("placehold.co") ? (post.imageUrl || post.thumbnailUrl) : "/placeholder.svg"} 
                        alt={post.postName || "Post"} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white gap-4">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 fill-white" />
                            <span className="font-black">{formatNumber(post.likes)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 fill-white" />
                            <span className="font-black">{formatNumber(post.comments)}</span>
                          </div>
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                          {post.takenAt ? formatDate(new Date(post.takenAt), "MMM d, yyyy") : "Date N/A"}
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-black/5">
                      <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-400 font-bold">No posts available</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent key="reels" value="reels">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {influencer.instagramReels?.length ? influencer.instagramReels.map((reel, idx) => (
                    <motion.div
                      key={reel.id || idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group relative aspect-9/16 bg-gray-100 rounded-4xl overflow-hidden shadow-soft hover:shadow-large transition-all duration-500"
                    >
                      <img 
                        src={reel.thumbnailUrl && !String(reel.thumbnailUrl).includes("placehold.co") ? reel.thumbnailUrl : "/placeholder.svg"} 
                        alt={reel.postName || "Reel"} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-lg flex items-center gap-1.5">
                          <Play className="w-3 h-3 fill-white" />
                          <span className="text-[10px] font-black">{reel.views ? formatNumber(reel.views) : "0"}</span>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white gap-4">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 fill-white" />
                            <span className="font-black">{formatNumber(reel.likes)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 fill-white" />
                            <span className="font-black">{formatNumber(reel.comments)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                          <Clock className="w-3 h-3" />
                          <span>{reel.duration}s</span>
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-black/5">
                      <Play className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-400 font-bold">No reels available</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>

        <div className="space-y-10">
          {/* Niche & Categories */}
          <Card className="bg-black text-white rounded-[3rem] overflow-hidden shadow-2xl border-none">
            <CardContent className="p-10 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black uppercase tracking-tighter">Content Niche</h3>
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="flex flex-wrap gap-3">
                  {influencer.selectedCategories?.map((cat, idx) => (
                    <span key={cat.id || idx} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors cursor-default">
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-white/10">
                <h3 className="text-xl font-black uppercase tracking-tighter">Engagement Pulse</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/50">
                      <span>Audience Loyalty</span>
                      <span className="text-white">High</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        className="h-full bg-white" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/50">
                      <span>Brand Consistency</span>
                      <span className="text-white">Excellent</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "92%" }}
                        className="h-full bg-white" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Stats */}
          <Card className="bg-white border-black/5 rounded-[3rem] shadow-soft p-10 space-y-8">
            <h3 className="text-xl font-black text-black uppercase tracking-tighter">Social Footprint</h3>
            <div className="space-y-6">
              {influencer.reseauxSociaux?.map((social, idx) => (
                <div key={`${social.plateforme}-${idx}`} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-black text-white rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      {social.plateforme === "Instagram" ? <Instagram className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-black text-black">{social.plateforme}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{formatNumber(social.nombreAbonnes)} Followers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-black">{social.tauxEngagement}%</p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-6 border-t border-black/5">
              <div className="flex items-center gap-3 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Profile Verified {influencer.user?.createdAt ? formatDate(new Date(influencer.user.createdAt), "MMM yyyy") : ""}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

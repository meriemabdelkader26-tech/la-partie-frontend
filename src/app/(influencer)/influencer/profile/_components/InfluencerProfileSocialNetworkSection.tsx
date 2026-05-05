"use client";

import { Influencer } from "@/app/types";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink, Plus, X, Loader2, Sparkles, Youtube, Twitter, Facebook, Linkedin, Smartphone, Video } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { UPDATE_PROFILE_PARTIAL } from "./query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import axios from "axios";
import { NEXT_PUBLIC_BASE_URL } from "@/config";
import { PlateformeEnum, FrequencePublicationEnum } from "@/app/enums";

interface Props {
  data: Influencer | null;
}

const PLATFORMS_CONFIG = [
  { id: PlateformeEnum.TIKTOK, name: "TikTok", icon: Video, color: "bg-black" },
  { id: PlateformeEnum.YOUTUBE, name: "YouTube", icon: Youtube, color: "bg-red-600" },
  { id: PlateformeEnum.TWITTER, name: "Twitter", icon: Twitter, color: "bg-blue-400" },
  { id: PlateformeEnum.FACEBOOK, name: "Facebook", icon: Facebook, color: "bg-blue-600" },
  { id: PlateformeEnum.LINKEDIN, name: "LinkedIn", icon: Linkedin, color: "bg-blue-700" },
  { id: PlateformeEnum.SNAPCHAT, name: "Snapchat", icon: Smartphone, color: "bg-yellow-400" },
];

const InfluencerProfileSocialNetworkSection = (props: Props) => {
  const { data } = props;
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [activePlatform, setActivePlatform] = useState<PlateformeEnum | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [isFetchingStats, setIsFetchingStats] = useState(false);
  
  // Local state for social networks being edited
  const [networks, setNetworks] = useState<any[]>(data?.reseauxSociaux || []);

  const updateMutation = useMutation({
    mutationFn: (newNetworks: any[]) => 
      graphqlClient.request(UPDATE_PROFILE_PARTIAL, { 
        reseauxSociaux: newNetworks.map(n => ({
          plateforme: n.plateforme,
          urlProfil: n.urlProfil,
          nombreAbonnes: String(n.nombreAbonnes),
          tauxEngagement: String(n.tauxEngagement),
          moyenneVues: String(n.moyenneVues || 0),
          moyenneLikes: String(n.moyenneLikes || 0),
          moyenneCommentaires: String(n.moyenneCommentaires || 0),
          frequencePublication: n.frequencePublication || FrequencePublicationEnum.HEBDOMADAIRE
        }))
      }),
    onSuccess: () => {
      toast.success("Social networks updated");
      queryClient.invalidateQueries({ queryKey: ["influencerProfile"] });
      setIsOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update networks");
    }
  });

  const handleFetchStats = async () => {
    if (!activePlatform || !currentUrl) return;
    setIsFetchingStats(true);
    try {
      const response = await axios.post(`${NEXT_PUBLIC_BASE_URL}api/fetch-social-stats/`, {
        platform: activePlatform.toLowerCase(),
        url: currentUrl,
      });

      if (response.data?.success) {
        const stats = response.data.stats;
        const newNetwork = {
          plateforme: activePlatform,
          urlProfil: currentUrl,
          nombreAbonnes: stats.followers || "0",
          tauxEngagement: stats.engagement_rate || "0.0",
          moyenneVues: stats.avg_views || "0",
          moyenneLikes: stats.avg_likes || "0",
          moyenneCommentaires: stats.avg_comments || "0",
          frequencePublication: FrequencePublicationEnum.HEBDOMADAIRE,
        };
        
        setNetworks(prev => {
          const filtered = prev.filter(n => n.plateforme !== activePlatform);
          return [...filtered, newNetwork];
        });
        
        setActivePlatform(null);
        setCurrentUrl("");
        toast.success(`Fetched stats for ${activePlatform}`);
      } else {
        toast.error(response.data?.message || "Failed to fetch stats");
      }
    } catch (error) {
      toast.error("Error fetching statistics");
    } finally {
      setIsFetchingStats(false);
    }
  };

  const removeNetwork = (platform: string) => {
    setNetworks(prev => prev.filter(n => n.plateforme !== platform));
  };

  const handleSave = () => {
    updateMutation.mutate(networks);
  };

  return (
    <div className="bg-white border-2 border-black/5 rounded-[40px] p-10 mb-12 shadow-soft animate-fadeInUp delay-400">
      <div className="flex items-center justify-between mb-10 animate-fadeInDown">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-black text-black tracking-tight">Social Networks</h2>
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (open) {
            setNetworks(data?.reseauxSociaux || []);
            setActivePlatform(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button variant="outline" className="rounded-xl border-2 font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-all h-10">
              <Plus className="w-4 h-4 mr-2" />
              Manage Networks
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] rounded-[32px] p-8 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-black uppercase tracking-tight">Manage Networks</DialogTitle>
              <p className="text-gray-400 font-medium text-sm">Add or remove your social media presence.</p>
            </DialogHeader>

            <div className="py-6 space-y-8">
              {/* Currently Added */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Active Connections</h3>
                <div className="grid gap-3">
                  {networks.filter(n => n.plateforme !== PlateformeEnum.INSTAGRAM).map((n) => (
                    <div key={n.plateforme} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-black/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-black text-xs">
                          {n.plateforme[0]}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-black capitalize">{n.plateforme}</p>
                          <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{n.urlProfil}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeNetwork(n.plateforme)} 
                        className="p-2 hover:bg-rose-50 text-rose-500 rounded-xl transition-colors"
                        title={`Remove ${n.plateforme}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {networks.length === 0 && <p className="text-center py-4 text-gray-400 text-xs italic">No additional networks added.</p>}
                </div>
              </div>

              {/* Add New */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Add New Network</h3>
                <div className="grid grid-cols-3 gap-3">
                  {PLATFORMS_CONFIG.map((p) => {
                    const isAdded = networks.some(n => n.plateforme === p.id);
                    return (
                      <button
                        key={p.id}
                        disabled={isAdded}
                        onClick={() => setActivePlatform(p.id)}
                        title={`Add ${p.name}`}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                          activePlatform === p.id ? "border-black bg-black/5 scale-105" : 
                          isAdded ? "opacity-30 cursor-not-allowed border-gray-100" : "border-black/5 hover:border-black/20"
                        )}
                      >
                        <p.icon className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase">{p.name}</span>
                      </button>
                    );
                  })}
                </div>

                {activePlatform && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-black text-white rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black uppercase tracking-widest">Enter {activePlatform} URL</p>
                      <button onClick={() => setActivePlatform(null)} title="Cancel"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 text-sm font-bold h-12 focus:outline-none focus:border-white/40 text-white"
                        placeholder="https://..."
                        value={currentUrl}
                        onChange={(e) => setCurrentUrl(e.target.value)}
                      />
                      <Button 
                        onClick={handleFetchStats}
                        disabled={isFetchingStats || !currentUrl}
                        className="bg-white text-black hover:bg-gray-100 rounded-xl h-12 px-6 font-black"
                      >
                        {isFetchingStats ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button 
                onClick={handleSave} 
                disabled={updateMutation.isPending}
                className="w-full bg-black text-white font-black rounded-xl h-14 shadow-xl hover:shadow-black/20 transition-all"
              >
                {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save All Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {data?.reseauxSociaux?.map((network, idx) => (
          <div 
            key={idx} 
            className="bg-gray-50 border border-black/5 rounded-[32px] p-8 hover:bg-white hover:border-black/10 hover:shadow-medium transition-all duration-500 group animate-fadeInUp"
            style={{ animationDelay: `${500 + idx * 150}ms` }}
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-black/5 flex items-center justify-center group-hover:bg-black transition-colors duration-300 shadow-sm">
                  <span className="font-black text-black group-hover:text-white transition-colors capitalize">{network.plateforme[0]}</span>
                </div>
                <h3 className="text-2xl font-black text-black capitalize tracking-tight">
                  {network.plateforme}
                </h3>
              </div>
              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 text-white font-bold rounded-2xl px-8 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.05] group/btn"
                onClick={() => window.open(network.urlProfil, "_blank")}
              >
                Visit Profile
                <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {[
                { label: "Followers", value: Number(network.nombreAbonnes).toLocaleString(), color: "text-black" },
                { label: "Engagement", value: `${network.tauxEngagement}%`, color: "text-green-600" },
                { label: "Avg. Likes", value: Number(network.moyenneLikes).toLocaleString(), color: "text-black" },
                { label: "Avg. Comments", value: Number(network.moyenneCommentaires).toLocaleString(), color: "text-black" },
                { label: "Frequency", value: network.frequencePublication?.replace(/_/g, " "), color: "text-black", capitalize: true }
              ].map((stat, sIdx) => (
                <div key={sIdx} className="animate-fadeInUp" style={{ animationDelay: `${700 + sIdx * 50}ms` }}>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">{stat.label}</p>
                  <p className={`text-xl font-black ${stat.color} ${stat.capitalize ? 'capitalize' : ''}`}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
        {(!data?.reseauxSociaux || data.reseauxSociaux.length === 0) && (
          <div className="text-center py-20 bg-gray-50 rounded-[32px] border-2 border-dashed border-black/5">
            <Globe className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold italic">No social networks connected yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default InfluencerProfileSocialNetworkSection;

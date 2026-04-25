"use client";
import { useState } from "react";
import { ProfileFormData } from "../types";
import SubmitButton from "@/components/shared/SubmitButton";
import { PlateformeEnum, FrequencePublicationEnum } from "@/app/enums";
import { 
  Youtube, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Smartphone, 
  Video, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  ChevronRight,
  Users,
  Activity,
  Eye,
  Heart,
  MessageCircle,
  X
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { NEXT_PUBLIC_BASE_URL } from "@/config";
import { cn } from "@/lib/utils";

interface Props {
  formData: ProfileFormData;
  onUpdate: (updates: Partial<ProfileFormData>) => void;
  onNext: () => void;
}

interface PlatformData {
  plateforme: PlateformeEnum;
  urlProfil: string;
  nombreAbonnes: string;
  tauxEngagement: string;
  moyenneVues: string;
  moyenneLikes: string;
  moyenneCommentaires: string;
  frequencePublication: string;
  isFetched: boolean;
  profile_pic?: string;
  name?: string;
  biography?: string;
}

const PLATFORMS_CONFIG = [
  { id: PlateformeEnum.TIKTOK, name: "TikTok", icon: Video, color: "bg-black" },
  { id: PlateformeEnum.YOUTUBE, name: "YouTube", icon: Youtube, color: "bg-red-600" },
  { id: PlateformeEnum.TWITTER, name: "Twitter", icon: Twitter, color: "bg-blue-400" },
  { id: PlateformeEnum.FACEBOOK, name: "Facebook", icon: Facebook, color: "bg-blue-600" },
  { id: PlateformeEnum.LINKEDIN, name: "LinkedIn", icon: Linkedin, color: "bg-blue-700" },
  { id: PlateformeEnum.SNAPCHAT, name: "Snapchat", icon: Smartphone, color: "bg-yellow-400" },
];

export default function StepSocialNetworks({
  formData,
  onUpdate,
  onNext,
}: Props) {
  // Initialize state from formData
  const initialData: Record<string, PlatformData> = {};
  if (formData.reseauxSociaux && formData.reseauxSociaux.length > 0) {
    formData.reseauxSociaux.forEach((rs) => {
      if (rs.plateforme !== PlateformeEnum.INSTAGRAM) {
        initialData[rs.plateforme] = {
          plateforme: rs.plateforme as PlateformeEnum,
          urlProfil: rs.urlProfil || "",
          nombreAbonnes: rs.nombreAbonnes || "0",
          tauxEngagement: rs.tauxEngagement || "0",
          moyenneVues: rs.moyenneVues || "0",
          moyenneLikes: rs.moyenneLikes || "0",
          moyenneCommentaires: rs.moyenneCommentaires || "0",
          frequencePublication: rs.frequencePublication as string || FrequencePublicationEnum.QUOTIDIENNE,
          isFetched: true,
        };
      }
    });
  }

  const [platformsData, setPlatformsData] = useState<Record<string, PlatformData>>(initialData);
  const [activePlatform, setActivePlatform] = useState<PlateformeEnum | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const handlePlatformClick = (platformId: PlateformeEnum) => {
    if (activePlatform === platformId) {
      setActivePlatform(null);
    } else {
      setActivePlatform(platformId);
      setCurrentUrl(platformsData[platformId]?.urlProfil || "");
    }
  };

  const handleFetchStats = async () => {
    if (!activePlatform || !currentUrl) {
      toast.error("Please enter the profile URL first.");
      return;
    }

    setIsFetching(true);
    try {
      const response = await axios.post(
        `${NEXT_PUBLIC_BASE_URL}api/fetch-social-stats/`,
        {
          platform: activePlatform.toLowerCase(),
          url: currentUrl,
        }
      );

      if (response.data && response.data.success) {
        const stats = response.data.stats;
        setPlatformsData(prev => ({
          ...prev,
          [activePlatform]: {
            plateforme: activePlatform,
            urlProfil: currentUrl,
            nombreAbonnes: stats.followers || "0",
            tauxEngagement: stats.engagement_rate || "0",
            moyenneVues: stats.avg_views || "0",
            moyenneLikes: stats.avg_likes || "0",
            moyenneCommentaires: stats.avg_comments || "0",
            frequencePublication: FrequencePublicationEnum.QUOTIDIENNE,
            isFetched: true,
            profile_pic: stats.profile_pic,
            name: stats.name,
            biography: stats.biography,
          }
        }));
        toast.success(`Successfully fetched statistics for ${activePlatform}!`);
      } else {
        toast.error(response.data?.message || "Failed to fetch statistics.");
      }
    } catch (error: any) {
      console.error("Error fetching social stats:", error);
      toast.error(error.response?.data?.message || "An error occurred while fetching statistics.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleRemovePlatform = (platformId: PlateformeEnum) => {
    setPlatformsData(prev => {
      const newData = { ...prev };
      delete newData[platformId];
      return newData;
    });
    if (activePlatform === platformId) {
      setActivePlatform(null);
      setCurrentUrl("");
    }
  };

  const formatNumber = (numStr: string) => {
    const num = parseInt(numStr, 10);
    if (isNaN(num)) return "0";
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Keep Instagram if it was there
    const instagramData = formData.reseauxSociaux?.find(rs => rs.plateforme === PlateformeEnum.INSTAGRAM);
    
    const updatedReseaux = Object.values(platformsData).map(data => ({
      plateforme: data.plateforme,
      urlProfil: data.urlProfil,
      nombreAbonnes: data.nombreAbonnes,
      tauxEngagement: data.tauxEngagement,
      moyenneVues: data.moyenneVues,
      moyenneLikes: data.moyenneLikes,
      moyenneCommentaires: data.moyenneCommentaires,
      frequencePublication: data.frequencePublication,
    }));

    if (instagramData) {
      updatedReseaux.unshift(instagramData as any);
    }

    onUpdate({
      reseauxSociaux: updatedReseaux as any,
    });
    onNext();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Header */}
      <div className="animate-fadeInUp">
        <h2 className="text-2xl font-bold text-black mb-2">
          Other Social Networks
        </h2>
        <p className="text-gray-600">
          Connect your other platforms to complete your profile
        </p>
      </div>

      {/* Platform Buttons Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fadeInUp" style={{ animationDelay: "100ms" }}>
        {PLATFORMS_CONFIG.map((platform) => {
          const isDone = platformsData[platform.id]?.isFetched;
          const isActive = activePlatform === platform.id;
          const Icon = platform.icon;

          return (
            <button
              key={platform.id}
              type="button"
              onClick={() => handlePlatformClick(platform.id)}
              className={cn(
                "relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 overflow-hidden group",
                isActive 
                  ? "border-black bg-black/5 shadow-md scale-105" 
                  : isDone 
                    ? "border-green-500 bg-green-50 hover:bg-green-100" 
                    : "border-black/10 bg-white hover:border-black/30 hover:bg-gray-50"
              )}
            >
              {isDone && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
              )}
              
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110",
                isActive || isDone ? platform.color : "bg-gray-200"
              )}>
                <Icon className={cn("w-6 h-6", isActive || isDone ? "text-white" : "text-gray-500")} />
              </div>
              
              <span className={cn(
                "font-semibold text-sm",
                isActive || isDone ? "text-black" : "text-gray-500"
              )}>
                {platform.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Platform Section */}
      {activePlatform && (
        <div className="animate-fadeInUp bg-white border-2 border-black/10 rounded-3xl p-6 md:p-8 shadow-large relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-black flex items-center gap-2">
              {PLATFORMS_CONFIG.find(p => p.id === activePlatform)?.name} Configuration
            </h3>
            <button
              type="button"
              onClick={() => setActivePlatform(null)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!platformsData[activePlatform]?.isFetched ? (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-black">
                Profile URL *
              </label>
              <div className="relative group/fetch">
                <input
                  type="url"
                  value={currentUrl}
                  onChange={(e) => setCurrentUrl(e.target.value)}
                  placeholder={`https://www.${activePlatform.toLowerCase()}.com/...`}
                  className="w-full h-14 bg-white border-2 border-black/10 rounded-xl px-4 text-black focus:border-black focus:ring-0 transition-colors"
                />
                
                <button
                  type="button"
                  onClick={handleFetchStats}
                  disabled={isFetching || !currentUrl}
                  className="absolute right-2 top-2 group inline-flex items-center justify-center gap-2 px-4 h-10 text-sm font-semibold text-white transition-all duration-300 bg-black rounded-lg overflow-hidden shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  
                  {isFetching ? (
                    <Loader2 className="w-4 h-4 animate-spin relative z-10" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-yellow-400 relative z-10 group-hover:scale-110 transition-transform" />
                  )}
                  <span className="relative z-10">{isFetching ? "Fetching..." : "Fetch Stats"}</span>
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Enter your profile URL and we'll automatically fetch your statistics.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              {/* Profile Card Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6 relative z-10">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl bg-black/5">
                    {platformsData[activePlatform].profile_pic ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={platformsData[activePlatform].profile_pic} 
                        alt={platformsData[activePlatform].name || "Profile"} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full bg-black flex items-center justify-center text-white text-3xl font-black" style={{ display: platformsData[activePlatform].profile_pic ? 'none' : 'flex' }}>
                      {PLATFORMS_CONFIG.find(p => p.id === activePlatform)?.name.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div className={cn(
                    "absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-scaleIn delay-300",
                    PLATFORMS_CONFIG.find(p => p.id === activePlatform)?.color
                  )}>
                    {(() => {
                      const Icon = PLATFORMS_CONFIG.find(p => p.id === activePlatform)?.icon || Users;
                      return <Icon className="w-4 h-4 text-white" />;
                    })()}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-3xl font-black text-black tracking-tight">
                      {platformsData[activePlatform].name || "Connected Account"}
                    </h3>
                  </div>
                  <p className="text-gray-500 font-medium text-lg mb-4 truncate max-w-md">
                    {platformsData[activePlatform].urlProfil.replace(/^https?:\/\/(www\.)?/, '')}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentUrl(platformsData[activePlatform].urlProfil);
                      setPlatformsData(prev => {
                        const newData = { ...prev };
                        newData[activePlatform].isFetched = false;
                        return newData;
                      });
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 hover:bg-black/10 text-black text-sm font-semibold rounded-full transition-colors"
                  >
                    Change Account URL
                  </button>
                </div>
              </div>

              {/* Biography if available */}
              {platformsData[activePlatform].biography && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-2">Biography / About</h4>
                  <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap line-clamp-3">
                    {platformsData[activePlatform].biography}
                  </p>
                </div>
              )}

              {/* Dynamic Stats Grid based on Platform */}
              {(() => {
                const data = platformsData[activePlatform];
                
                const StatCard = ({ icon: Icon, colorClass, bgClass, value, label }: { icon: any, colorClass: string, bgClass: string, value: string, label: string }) => (
                  <div className="bg-white p-4 rounded-2xl border border-black/10 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-2", bgClass)}>
                      <Icon className={cn("w-5 h-5", colorClass)} />
                    </div>
                    <p className="text-2xl font-black text-black">{value}</p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">{label}</p>
                  </div>
                );

                switch (activePlatform) {
                  case PlateformeEnum.YOUTUBE:
                    return (
                      <div className="grid grid-cols-2 gap-4">
                        <StatCard icon={Users} colorClass="text-red-600" bgClass="bg-red-50" value={formatNumber(data.nombreAbonnes)} label="Subscribers" />
                        <StatCard icon={Eye} colorClass="text-blue-500" bgClass="bg-blue-50" value={formatNumber(data.moyenneVues)} label="Total Views" />
                      </div>
                    );
                  case PlateformeEnum.TIKTOK:
                    return (
                      <div className="grid grid-cols-2 gap-4">
                        <StatCard icon={Users} colorClass="text-black" bgClass="bg-gray-100" value={formatNumber(data.nombreAbonnes)} label="Followers" />
                        <StatCard icon={Heart} colorClass="text-pink-500" bgClass="bg-pink-50" value={formatNumber(data.moyenneLikes)} label="Total Likes" />
                      </div>
                    );
                  case PlateformeEnum.FACEBOOK:
                    return (
                      <div className="grid grid-cols-2 gap-4">
                        <StatCard icon={Users} colorClass="text-blue-600" bgClass="bg-blue-50" value={formatNumber(data.nombreAbonnes)} label="Followers" />
                        <StatCard icon={Heart} colorClass="text-blue-500" bgClass="bg-blue-50" value={formatNumber(data.moyenneLikes)} label="Page Likes" />
                      </div>
                    );
                  case PlateformeEnum.TWITTER:
                    return (
                      <div className="grid grid-cols-3 gap-4">
                        <StatCard icon={Users} colorClass="text-blue-400" bgClass="bg-blue-50" value={formatNumber(data.nombreAbonnes)} label="Followers" />
                        <StatCard icon={Users} colorClass="text-gray-500" bgClass="bg-gray-100" value={formatNumber(data.moyenneLikes)} label="Following" />
                        <StatCard icon={MessageCircle} colorClass="text-blue-400" bgClass="bg-blue-50" value={formatNumber(data.moyenneVues)} label="Tweets" />
                      </div>
                    );
                  case PlateformeEnum.LINKEDIN:
                    return (
                      <div className="grid grid-cols-2 gap-4">
                        <StatCard icon={Users} colorClass="text-blue-700" bgClass="bg-blue-50" value={formatNumber(data.nombreAbonnes)} label="Followers" />
                        <StatCard icon={Users} colorClass="text-blue-500" bgClass="bg-blue-50" value={data.moyenneLikes.includes('+') ? data.moyenneLikes : formatNumber(data.moyenneLikes)} label="Connections" />
                      </div>
                    );
                  default:
                    // Fallback for any other platform
                    return (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard icon={Users} colorClass="text-blue-500" bgClass="bg-blue-50" value={formatNumber(data.nombreAbonnes)} label="Followers" />
                        <StatCard icon={Activity} colorClass="text-purple-500" bgClass="bg-purple-50" value={`${data.tauxEngagement}%`} label="Engagement" />
                        <StatCard icon={Heart} colorClass="text-pink-500" bgClass="bg-pink-50" value={formatNumber(data.moyenneLikes)} label="Avg Likes" />
                        <StatCard icon={Eye} colorClass="text-orange-500" bgClass="bg-orange-50" value={formatNumber(data.moyenneVues)} label="Avg Views" />
                      </div>
                    );
                }
              })()}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleRemovePlatform(activePlatform)}
                  className="text-sm text-red-500 hover:text-red-600 font-semibold transition-colors"
                >
                  Remove Platform
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="animate-fadeInUp" style={{ animationDelay: "200ms" }}>
        <SubmitButton isLoading={false}>Continue to Next Step</SubmitButton>
      </div>
    </form>
  );
}

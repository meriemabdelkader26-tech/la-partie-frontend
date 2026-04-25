import { TInfluencer } from "@/app/_components/types";
import { Card } from "@/components/ui/card";
import { Award, MapPin, TrendingUp, Users, ExternalLink, Instagram, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_IMAGE_PROXY } from "@/config";

interface Props {
  recommendation: TInfluencer;
}

const formatNumber = (num?: number) => {
  if (num === undefined) return "0";
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

const InfluencerCard = (props: Props) => {
  const { recommendation: rec } = props;
  
  const handleViewProfile = () => {
    if (rec.profile_url) {
      window.open(rec.profile_url, '_blank', 'noopener,noreferrer');
    }
  };

  const proxyUrl = rec.profile_pic ? `${NEXT_PUBLIC_BASE_URL}${NEXT_PUBLIC_IMAGE_PROXY}${encodeURIComponent(rec.profile_pic)}` : "";

  return (
    <Card 
      className="p-0 gap-0 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all duration-500 overflow-hidden group cursor-pointer hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] h-full flex flex-col relative"
      onClick={handleViewProfile}
    >
      {/* Real-time Status Badge */}
      {rec.is_realtime && (
        <div className="absolute top-6 left-6 z-20 px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl flex items-center justify-center border border-white/20">
          <div className="relative flex items-center justify-center mr-2 w-2 h-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </div>
          Live
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-64 bg-zinc-900 overflow-hidden">
        {rec.profile_pic ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={proxyUrl}
            alt={rec.name}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale hover:grayscale-0"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              if (target.nextElementSibling) {
                (target.nextElementSibling as HTMLElement).style.display = 'flex';
              }
            }}
          />
        ) : null}
        
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center" style={{ display: rec.profile_pic ? 'none' : 'flex' }}>
          <span className="text-6xl font-black text-white/10 uppercase tracking-tighter">
            {rec.name.charAt(0)}
          </span>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Rank Display (if any) */}
        {rec.rank && (
          <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-2xl font-black border border-white/20 transition-all duration-300">
            #{rec.rank}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-8 lg:p-10 flex-1 flex flex-col bg-zinc-950 relative z-10">
        <div className="mb-8 bg-zinc-950 rounded-t-xl">
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-col">
              <h3 className="text-2xl font-black text-white leading-tight group-hover:text-slate-300 transition-colors truncate pr-2">
                {rec.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-slate-400 font-bold tracking-tight text-sm">@{rec.username || "creator"}</span>
                {rec.is_verified && (
                  <ShieldCheck size={14} className="text-blue-500" fill="currentColor" />
                )}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors flex-shrink-0">
              <Instagram size={18} />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-zinc-900 text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-wider truncate max-w-full">
              {rec.category}
            </span>
            <span className="px-3 py-1 bg-white/10 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/20 flex-shrink-0">
              Trending
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 transition-colors">
            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
              <Users size={14} />
              Audience
            </div>
            <div className="text-xl lg:text-2xl font-black text-white font-mono truncate">
              {rec.followers ? formatNumber(rec.followers) : (rec.followers_formatted || "0")}
            </div>
          </div>
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 transition-colors">
            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
              <TrendingUp size={14} />
              Impact
            </div>
            <div className="text-xl lg:text-2xl font-black text-white font-mono truncate">
              {rec.engagement_rate?.toFixed(1) || "0.0"}%
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          <Button 
            className="w-full h-16 bg-white hover:bg-slate-200 text-slate-950 font-black rounded-full shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group/btn overflow-hidden"
            onClick={(e) => {
              e.stopPropagation();
              handleViewProfile();
            }}
          >
            <span className="tracking-tight truncate">View Full Profile</span>
            <ExternalLink className="w-5 h-5 flex-shrink-0 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default InfluencerCard;

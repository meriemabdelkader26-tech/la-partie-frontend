import { CarouselItem } from "@/components/ui/carousel";
import { TInfluencer } from "./types";
import { TrendingUp, Users, ExternalLink, Instagram } from "lucide-react";
import Image from "next/image";
import { NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_IMAGE_PROXY } from "@/config";

interface Props {
  influencer: TInfluencer;
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

const HomeTrendingInfluencerCard = (props: Props) => {
  const { influencer } = props;
  
  const handleViewProfile = () => {
    if (influencer.profile_url) {
      window.open(influencer.profile_url, '_blank', 'noopener,noreferrer');
    }
  };

  const proxyUrl = influencer.profile_pic ? `${NEXT_PUBLIC_BASE_URL}${NEXT_PUBLIC_IMAGE_PROXY}${encodeURIComponent(influencer.profile_pic)}` : "";

  return (
    <CarouselItem
      className="pl-4 md:basis-1/2 lg:basis-1/3"
    >
      <div 
        className="group h-full bg-zinc-950 rounded-[2.5rem] overflow-hidden border border-zinc-900 hover:border-zinc-800 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer flex flex-col"
        onClick={handleViewProfile}
      >
        {/* Profile Image Section */}
        <div className="relative h-64 w-full overflow-hidden bg-zinc-900">
          {influencer.profile_pic ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={proxyUrl}
              alt={influencer.name}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale hover:grayscale-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.nextElementSibling) {
                  (target.nextElementSibling as HTMLElement).style.display = 'flex';
                }
              }}
            />
          ) : null}
          
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center" style={{ display: influencer.profile_pic ? 'none' : 'flex' }}>
            <span className="text-4xl font-bold text-white/20">
              {influencer.name.charAt(0)}
            </span>
          </div>
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
          
          {/* Real-time Badge */}
          {influencer.is_realtime && (
            <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg flex items-center justify-center border border-white/20 z-20">
              <div className="relative flex items-center justify-center mr-2 w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </div>
              Live
            </div>
          )}

          {/* Rank or Icon */}
          <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-xl border border-white/20 transition-colors duration-300">
            {influencer.rank ? (
              <span className="font-bold text-sm">#{influencer.rank}</span>
            ) : (
              <TrendingUp size={18} />
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 flex-1 flex flex-col bg-zinc-950 relative z-10">
          <div className="mb-8 bg-zinc-950 rounded-t-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-white truncate pr-2 group-hover:text-slate-300 transition-colors">
                  {influencer.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-slate-400 font-bold tracking-tight text-sm">@{influencer.username || "creator"}</span>
                  {influencer.is_verified && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4" stroke="white"/></svg>
                  )}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors flex-shrink-0">
                <Instagram size={18} />
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 transition-colors">
              <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Users size={12} />
                Followers
              </div>
              <div className="text-xl lg:text-2xl font-black text-white font-mono truncate">
                {influencer.followers ? formatNumber(influencer.followers) : (influencer.followers_formatted || "0")}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 transition-colors">
              <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                <TrendingUp size={12} />
                Posts
              </div>
              <div className="text-xl lg:text-2xl font-black text-white font-mono truncate">
                {influencer.posts_count ? formatNumber(influencer.posts_count) : "N/A"}
              </div>
            </div>
          </div>

          {/* Category Tag */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-800">
            <span className="text-slate-400 text-xs font-semibold truncate pr-2">
              {influencer.external_url ? (
                <a href={influencer.external_url} target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1 truncate" onClick={(e) => e.stopPropagation()}>
                  <ExternalLink size={12} className="flex-shrink-0" /> <span className="truncate">Link in Bio</span>
                </a>
              ) : "Instagram Creator"}
            </span>
            <div className="flex items-center gap-1 text-white font-bold text-sm bg-zinc-800 px-4 py-2 rounded-full hover:bg-zinc-700 transition-colors flex-shrink-0">
              <span>View Profile</span>
            </div>
          </div>
        </div>
      </div>
    </CarouselItem>
  );
};

export default HomeTrendingInfluencerCard;

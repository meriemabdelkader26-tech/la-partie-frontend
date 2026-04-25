import { Influencer } from "@/app/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Instagram, 
  MapPin, 
  Users, 
  TrendingUp, 
  Heart, 
  Calendar,
  ShieldCheck,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";

interface Props {
  data: Influencer | null;
}

const InfluencerProfileHeaderSection = (props: Props) => {
  const { data } = props;
  
  const stats = data?.statistiquesGlobales;
  const primarySocial = data?.reseauxSociaux?.[0];

  return (
    <div className="bg-white border border-gray-100 rounded-[32px] p-6 md:p-10 shadow-sm relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl" />
      
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 relative z-10">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="relative">
            <Avatar className="size-40 md:size-48 border-4 border-white shadow-xl rounded-3xl">
              <AvatarImage
                src={data?.profilePicture}
                alt="influencer-profile"
                className="object-cover"
              />
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-3xl font-bold rounded-3xl">
                {data?.pseudo?.substring(0, 2).toUpperCase() || "IF"}
              </AvatarFallback>
            </Avatar>
            {data?.user?.isVerifyByAdmin && (
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl shadow-lg border-2 border-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-3">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{data?.pseudo}</h1>
            <span className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border",
              data?.disponibiliteCollaboration === "DISPONIBLE" 
                ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                : "bg-amber-50 text-amber-700 border-amber-100"
            )}>
              {data?.disponibiliteCollaboration?.replace('_', ' ') || "Status Unknown"}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-6 mb-6 text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-1 rounded-lg">
                <Instagram className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-700">@{data?.instagramUsername}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{data?.localisation || "Global"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Joined {data?.user?.createdAt ? formatDate(new Date(data.user.createdAt), "MMM yyyy") : "N/A"}</span>
            </div>
          </div>

          <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Biography</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base italic">
              &ldquo;{data?.biography || "No biography provided."}&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col items-center md:items-start transition-all hover:border-emerald-100 hover:shadow-md">
              <Users className="w-5 h-5 text-indigo-500 mb-2" />
              <span className="text-xl font-black text-gray-900">{stats?.followersTotaux?.toLocaleString() || "0"}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Followers</span>
            </div>
            <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col items-center md:items-start transition-all hover:border-emerald-100 hover:shadow-md">
              <TrendingUp className="w-5 h-5 text-emerald-500 mb-2" />
              <span className="text-xl font-black text-gray-900">{stats?.engagementMoyenGlobal?.toFixed(2)}%</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg. Engagement</span>
            </div>
            <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col items-center md:items-start transition-all hover:border-emerald-100 hover:shadow-md">
              <Heart className="w-5 h-5 text-rose-500 mb-2" />
              <span className="text-xl font-black text-gray-900">{primarySocial?.moyenneLikes?.toLocaleString() || "0"}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg. Likes</span>
            </div>
            <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col items-center md:items-start transition-all hover:border-emerald-100 hover:shadow-md">
              <Globe className="w-5 h-5 text-blue-500 mb-2" />
              <div className="flex flex-wrap gap-1 mt-1">
                {data?.langues.slice(0, 2).map((lang) => (
                  <span key={lang} className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                    {lang}
                  </span>
                ))}
                {(data?.langues?.length || 0) > 2 && (
                  <span className="text-[10px] font-bold text-gray-400">+{data!.langues.length - 2}</span>
                )}
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Languages</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfileHeaderSection;
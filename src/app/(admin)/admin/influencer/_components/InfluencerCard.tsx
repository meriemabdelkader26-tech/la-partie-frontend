import { Influencer } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  MessageCircle, 
  MapPin, 
  TrendingUp, 
  Eye, 
  CheckCircle2
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  influencer: Influencer;
}

const InfluencerCard = (props: Props) => {
  const { influencer } = props;
  const router = useRouter();

  const engagement = influencer.statistiquesGlobales?.engagementMoyenGlobal || 0;
  const followers = influencer.statistiquesGlobales?.followersTotaux || 0;
  const growth = influencer.statistiquesGlobales?.croissanceMensuelle || 0;
  const reach = (followers * engagement) / 100;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <Card
      key={influencer.id}
      className="group bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-500 flex flex-col h-full"
    >
      {/* Cover/Avatar Section */}
      <div className="relative h-48 w-[calc(100%+2px)] -mt-[1px] -ml-[1px] overflow-hidden">
        <Image
          src={influencer.profilePicture || "/avatar.jpg"}
          alt={influencer?.user?.name || "Influencer Image"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Engagement Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-lg flex items-center gap-1.5 transform transition-transform duration-500 group-hover:translate-y-[-2px]">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[11px] font-bold text-gray-900">
            {engagement.toFixed(1)}% Eng.
          </span>
        </div>

        {/* Status Badge */}
        {influencer.user?.isVerifyByAdmin && (
          <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-emerald-400/50">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
              {influencer.user?.name}
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
              {influencer.disponibiliteCollaboration || "Available"}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 mt-1.5 text-gray-500">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{influencer.localisation || "Global"}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-6 p-3 bg-gray-50 rounded-2xl border border-gray-100/50">
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Followers</span>
            <span className="text-sm font-extrabold text-gray-900">{formatNumber(followers)}</span>
          </div>
          <div className="flex flex-col items-center text-center border-x border-gray-200">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Growth</span>
            <span className={cn(
              "text-sm font-extrabold",
              growth >= 0 ? "text-emerald-600" : "text-rose-600"
            )}>
              {growth >= 0 ? "+" : ""}{growth}%
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Reach</span>
            <span className="text-sm font-extrabold text-indigo-600">{formatNumber(reach)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <Button 
            className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 h-10 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
            onClick={() =>
              router.push(`/admin/chat?userId=${influencer.user?.id}`)
            }
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Chat
          </Button>
          <Button
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white h-10 text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-2"
            onClick={() =>
              router.push(`/admin/influencer/detail/${influencer.user?.id}`)
            }
          >
            <Eye className="w-3.5 h-3.5" />
            Profile
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default InfluencerCard;
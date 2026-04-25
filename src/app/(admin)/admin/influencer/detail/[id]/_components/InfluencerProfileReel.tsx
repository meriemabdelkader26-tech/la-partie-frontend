import { InstagramReel } from "@/app/types";
import { Card } from "@/components/ui/card";
import { Heart, Play } from "lucide-react";
import Image from "next/image";

interface Props {
  reel: InstagramReel;
}

const InfluencerProfileReel = (props: Props) => {
  const { reel } = props;

  return (
    <Card className="group bg-white border border-gray-100 rounded-[20px] overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex flex-col h-full cursor-pointer">
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <Image
          src={reel.thumbnailUrl || "/placeholder.svg"}
          alt="Reel"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          unoptimized
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 transform transition-transform group-hover:scale-110">
            <Play size={24} className="text-white fill-white ml-1" />
          </div>
        </div>
        
        <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1">
          <Play size={10} className="text-white" />
          <span className="text-[10px] font-bold text-white">{reel.views?.toLocaleString()}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-gray-600 text-[13px] font-medium line-clamp-1 mb-3 leading-relaxed">
          {reel.postName || "Instagram Reel"}
        </p>
        <div className="mt-auto flex items-center gap-4 text-gray-400">
          <div className="flex items-center gap-1.5 group/stat">
            <Heart size={14} className="group-hover/stat:text-rose-500 transition-colors" />
            <span className="text-[11px] font-black">{reel.likes?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InfluencerProfileReel;

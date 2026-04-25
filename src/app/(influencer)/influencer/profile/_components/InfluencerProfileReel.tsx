import { InstagramReel } from "@/app/types";
import { Card } from "@/components/ui/card";
import { Heart, Play, BarChart3 } from "lucide-react";
import Image from "next/image";

interface Props {
  reel: InstagramReel;
  className?: string;
  style?: React.CSSProperties;
}

const InfluencerProfileReel = (props: Props) => {
  const { reel, className, style } = props;

  return (
    <Card 
      className={`bg-white border-2 border-black/5 rounded-[32px] overflow-hidden hover:border-black/20 hover:shadow-medium transition-all duration-500 group cursor-pointer ${className || ""}`}
      style={style}
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-gray-50">
        <Image
          src={reel.thumbnailUrl || "/placeholder.svg"}
          alt="Reel"
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          unoptimized
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-all duration-500 backdrop-blur-[1px] group-hover:backdrop-blur-[2px]">
          <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-medium transform scale-90 group-hover:scale-100 transition-all duration-500">
            <Play size={24} className="text-black fill-black ml-1" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/90 via-black/40 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center gap-6 text-white font-black text-xs uppercase tracking-widest">
            <div className="flex items-center gap-2 group/stat">
              <Heart size={16} className="fill-white group-hover/stat:scale-125 transition-transform" />
              <span>{reel.likes.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 group/stat">
              <BarChart3 size={16} className="text-white group-hover/stat:scale-125 transition-transform" />
              <span>{reel.views.toLocaleString()}</span>
            </div>
          </div>
          {reel.duration && (
            <div className="mt-3 inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-md text-[9px] font-black text-white uppercase tracking-tighter">
              {Math.floor(reel.duration / 60)}:{(reel.duration % 60).toString().padStart(2, '0')} min
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default InfluencerProfileReel;

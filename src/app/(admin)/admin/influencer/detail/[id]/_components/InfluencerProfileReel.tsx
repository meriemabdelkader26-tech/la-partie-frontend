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
    <Card className="bg-slate-800 border-slate-700 overflow-hidden hover:border-green-400 transition-colors group cursor-pointer">
      <div className="relative h-48 w-full overflow-hidden bg-slate-700">
        <Image
          src={reel.thumbnailUrl || "/placeholder.svg"}
          alt="Reel"
          fill
          className="object-cover group-hover:scale-105 transition-transform"
          unoptimized
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors">
          <Play size={48} className="text-green-400 fill-green-400" />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-4 text-slate-400 text-sm">
          <div className="flex items-center gap-1">
            <Heart size={16} />
            <span>{reel.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Play size={16} />
            <span>{reel.views}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InfluencerProfileReel;
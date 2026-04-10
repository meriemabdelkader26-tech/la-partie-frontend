import { Influencer } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  influencer: Influencer;
}

const InfluencerCard = (props: Props) => {
  const { influencer } = props;
  const router = useRouter();

  return (
    <Card
      key={influencer.id}
      className="bg-slate-800/50 border-slate-700/50 overflow-hidden backdrop-blur-sm hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 transition-all group cursor-pointer"
    >
      <div className="relative h-60 bg-slate-700 overflow-hidden group-hover:scale-105 transition-transform duration-300">
        <Image
          src={influencer.images[0]?.url || "/avatar.jpg"}
          alt={influencer?.user?.name || "Influencer Image"}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3 bg-green-500/90 px-3 py-1 rounded-full backdrop-blur-sm">
          <span className="text-xs font-bold text-white">
            {influencer.statistiquesGlobales!.engagementMoyenGlobal.toFixed(0)}%
            Eng
          </span>
        </div>
      </div>
      <div className="px-6 pb-6">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-green-400 transition-colors">
          {influencer!.user!.name}
        </h3>
        <p className="text-xs text-slate-400 mb-4">{influencer.localisation}</p>
        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-slate-700/50">
          <div>
            <p className="text-xs text-slate-500 mb-1">Followers</p>
            <p className="text-sm font-bold text-blue-400">
              {(
                influencer!.statistiquesGlobales!.followersTotaux / 1000
              ).toFixed(0)}
              K
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Growth</p>
            <p className="text-sm font-bold text-green-400">
              +{influencer!.statistiquesGlobales!.croissanceMensuelle}%
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Reach</p>
            <p className="text-sm font-bold text-purple-400">
              {(
                (influencer!.statistiquesGlobales!.followersTotaux *
                  influencer.statistiquesGlobales!.engagementMoyenGlobal) /
                100 /
                1000
              ).toFixed(0)}
              K
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg py-2">
            <MessageCircle className="size-4 mr-2" />
            Message
          </Button>
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg py-2"
            onClick={() =>
              router.push(`/admin/influencer/detail/${influencer.user!.id}`)
            }
          >
            View Profile
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default InfluencerCard;
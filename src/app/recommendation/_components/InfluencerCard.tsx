import { TInfluencer } from "@/app/_components/types";
import { Card } from "@/components/ui/card";
import { Award, MapPin, TrendingUp, Users } from "lucide-react";

interface Props {
  recommendation: TInfluencer;
}

const InfluencerCard = (props: Props) => {
  const { recommendation: rec } = props;
  return (
    <Card className="bg-slate-800 border-slate-700 hover:border-primary transition-all duration-300 overflow-hidden group cursor-pointer">
      <div className="bg-linear-to-r from-primary to-primary-dark px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="size-7 text-white" />
          <span className="text-lg font-bold text-white">#{rec.rank}</span>
        </div>
        <div className="text-right">
          <div className="text-xs text-primary-light">Match Score</div>
          <div className="text-sm font-bold text-white">
            {(rec.similarity_score * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition line-clamp-2">
          {rec.name}
        </h3>

        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-slate-700 text-primary text-xs font-semibold rounded-full">
            {rec.category}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-slate-400 text-sm">Followers</span>
            </div>
            <span className="font-bold text-white">
              {rec.followers_formatted}
            </span>
          </div>

          {/* Engagement Rate */}
          <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-slate-400 text-sm">Engagement</span>
            </div>
            <span className="font-bold text-white">
              {rec.engagement_rate.toFixed(2)}%
            </span>
          </div>

          {rec.country !== "Unknown" && (
            <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-slate-400 text-sm">Location</span>
              </div>
              <span className="font-bold text-white text-sm">
                {rec.country}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {/* <Button className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold">
          View Profile
        </Button> */}
      </div>
    </Card>
  );
};

export default InfluencerCard;

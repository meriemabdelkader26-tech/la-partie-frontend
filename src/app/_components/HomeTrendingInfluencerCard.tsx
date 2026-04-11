import { CarouselItem } from "@/components/ui/carousel";
import { TInfluencer } from "./types";

interface Props {
  influencer: TInfluencer;
}

const HomeTrendingInfluencerCard = (props: Props) => {
  const { influencer } = props;
  return (
    <CarouselItem
      key={influencer.rank}
      className="pl-4 md:basis-1/2 lg:basis-1/3"
    >
      <div className="bg-linear-to-br from-pastel-blue to-pastel-dark-blue rounded-lg overflow-hidden border border-pastel-blue hover:border-pastel-green/50 transition-all duration-300 hover:shadow-lg hover:shadow-pastel-green/10">
        {/* Rank Badge */}
        <div className="relative h-40 bg-linear-to-r from-pastel-green to-pastel-red flex items-center justify-center">
          <div className="text-pastel-dark-blue text-center">
            <div className="text-6xl font-bold">{influencer.rank}</div>
            <p className="text-sm mt-2 opacity-90">RANK</p>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-pastel-dark-blue mb-1">
              {influencer.name}
            </h3>

            <p className="text-pastel-blue text-sm">{influencer.country}</p>
          </div>

          <div className="space-y-3 bg-pastel-blue/30 rounded-lg p-4">
            <div>
              <p className="text-pastel-blue text-xs uppercase tracking-wider mb-1">
                Followers
              </p>
              <p className="text-2xl font-bold text-pastel-green">
                {influencer.followers_formatted}
              </p>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-pastel-blue text-xs uppercase tracking-wider mb-1">
                  Engagement
                </p>
                <p className="text-lg font-bold text-pastel-dark-blue">
                  {influencer.engagement_rate.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                  Match Score
                </p>
                <p className="text-lg font-bold text-white">
                  {(influencer.similarity_score * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CarouselItem>
  );
};

export default HomeTrendingInfluencerCard;
import { Influencer } from "@/app/types";
import InfluencerProfileSwitcher from "./InfluencerProfileSwitcher";
import InfluencerProfilePost from "./InfluencerProfilePost";
import InfluencerProfileReel from "./InfluencerProfileReel";

interface Props {
  active: string;
  setActiveTab: (tab: string) => void;
  data: Influencer | null;
}

const InfluencerProfileContentTabSection = (props: Props) => {
  const { active, setActiveTab, data } = props;

  return (
    <div className="mb-8">
      <div className="flex gap-4 border-b border-slate-700 mb-6">
        <InfluencerProfileSwitcher
          label={`Posts (${data?.instagramPosts?.length || 0})`}
          active={active === "posts"}
          onClick={() => setActiveTab("posts")}
        />
        <InfluencerProfileSwitcher
          label={`Reels (${data?.instagramReels?.length || 0})`}
          active={active === "reels"}
          onClick={() => setActiveTab("reels")}
        />
      </div>

      {active === "posts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.instagramPosts?.map((post) => (
            <InfluencerProfilePost key={post.id} post={post} />
          ))}
        </div>
      )}

      {active === "reels" && (
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data?.instagramReels?.map((reel) => (
              <InfluencerProfileReel key={reel.id} reel={reel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfluencerProfileContentTabSection;

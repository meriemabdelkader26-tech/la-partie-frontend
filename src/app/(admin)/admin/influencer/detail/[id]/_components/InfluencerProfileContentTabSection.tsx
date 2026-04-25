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
    <div className="bg-white border border-gray-100 rounded-[32px] p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-8 border-b border-gray-100">
        <InfluencerProfileSwitcher
          label="Posts"
          count={data?.instagramPosts?.length || 0}
          active={active === "posts"}
          onClick={() => setActiveTab("posts")}
        />
        <InfluencerProfileSwitcher
          label="Reels"
          count={data?.instagramReels?.length || 0}
          active={active === "reels"}
          onClick={() => setActiveTab("reels")}
        />
      </div>

      <div className="min-h-[400px]">
        {active === "posts" && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {data?.instagramPosts?.map((post) => (
              <InfluencerProfilePost key={post.id} post={post} />
            ))}
            {(!data?.instagramPosts || data.instagramPosts.length === 0) && (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 font-medium">No posts available.</p>
              </div>
            )}
          </div>
        )}

        {active === "reels" && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {data?.instagramReels?.map((reel) => (
              <InfluencerProfileReel key={reel.id} reel={reel} />
            ))}
            {(!data?.instagramReels || data.instagramReels.length === 0) && (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 font-medium">No reels available.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfluencerProfileContentTabSection;
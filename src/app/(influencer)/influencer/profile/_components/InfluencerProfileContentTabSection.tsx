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
    <div className="mb-16 animate-fadeIn">
      <div className="flex gap-8 border-b-2 border-black/5 mb-10 overflow-x-auto pb-1 animate-fadeInDown">
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

      <div className="relative min-h-[400px]">
        {active === "posts" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
            {data?.instagramPosts?.map((post, idx) => (
              <InfluencerProfilePost 
                key={post.id} 
                post={post} 
                className="animate-fadeInUp"
                style={{ animationDelay: `${idx * 50}ms` }}
              />
            ))}
          </div>
        )}

        {active === "reels" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
            {data?.instagramReels?.map((reel, idx) => (
              <InfluencerProfileReel 
                key={reel.id} 
                reel={reel} 
                className="animate-fadeInUp"
                style={{ animationDelay: `${idx * 50}ms` }}
              />
            ))}
          </div>
        )}
        
        {((active === "posts" && (!data?.instagramPosts || data.instagramPosts.length === 0)) || 
          (active === "reels" && (!data?.instagramReels || data.instagramReels.length === 0))) && (
          <div className="flex flex-col items-center justify-center py-20 animate-fadeInUp">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-black/5 shadow-inner-soft">
              <span className="text-4xl text-gray-200 font-bold">!</span>
            </div>
            <p className="text-gray-400 font-bold text-lg">No content found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfluencerProfileContentTabSection;

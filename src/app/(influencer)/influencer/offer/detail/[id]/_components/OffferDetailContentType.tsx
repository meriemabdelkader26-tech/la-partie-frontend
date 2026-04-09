import { Card } from "@/components/ui/card";

const contentTypes = ["Reels", "Posts", "Stories"];
const platforms = ["Instagram", " TikTok", "YouTube"];

const OffferDetailContentType = () => {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50 p-6 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-white mb-4">
        Content Types & Platforms
      </h2>
      <div className="space-y-4">
        <div>
          <p className="text-xs text-slate-400 mb-3 uppercase font-semibold">
            Platforms
          </p>
          <div className="flex gap-2 flex-wrap">
            {platforms.map((platform) => (
              <span
                key={platform}
                className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-3 uppercase font-semibold">
            Content Types
          </p>
          <div className="flex gap-2 flex-wrap">
            {contentTypes.map((type) => (
              <span
                key={type}
                className="inline-block bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OffferDetailContentType;

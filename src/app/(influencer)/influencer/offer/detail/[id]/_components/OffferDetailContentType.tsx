import { Card } from "@/components/ui/card";

const contentTypes = ["Reels", "Posts", "Stories"];
const platforms = ["Instagram", " TikTok", "YouTube"];

const OffferDetailContentType = () => {
  return (
    <Card className="bg-white border-2 border-black/5 p-8 rounded-3xl shadow-soft">
      <h2 className="text-xl font-bold text-black mb-6">
        Content Types & Platforms
      </h2>
      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <p className="text-xs text-gray-500 mb-4 uppercase font-bold tracking-wider">
            Platforms
          </p>
          <div className="flex gap-2 flex-wrap">
            {platforms.map((platform) => (
              <span
                key={platform}
                className="inline-block bg-black text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-4 uppercase font-bold tracking-wider">
            Content Types
          </p>
          <div className="flex gap-2 flex-wrap">
            {contentTypes.map((type) => (
              <span
                key={type}
                className="inline-block bg-gray-100 text-black border border-black/5 px-4 py-1.5 rounded-full text-sm font-bold"
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

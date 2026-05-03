import { InstagramPost } from "@/app/types";
import { Card } from "@/components/ui/card";
import { Heart, MessageCircle, ExternalLink } from "lucide-react";
import { NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_IMAGE_PROXY } from "@/config";

interface Props {
  post: InstagramPost;
  className?: string;
  style?: React.CSSProperties;
}

const InfluencerProfilePost = (props: Props) => {
  const { post, className, style } = props;
  const imageUrl = post.imageUrl || post.thumbnailUrl;
  const isPlaceholder = !imageUrl || String(imageUrl).includes("placehold.co") || imageUrl === "/placeholder.svg";

  return (
    <Card
      key={post.id}
      className={`bg-white border-2 border-black/5 rounded-[32px] overflow-hidden hover:border-black/20 hover:shadow-medium transition-all duration-500 group cursor-pointer ${className || ""}`}
      style={style}
    >
      <div className="relative h-64 w-full overflow-hidden bg-gray-50 flex items-center justify-center">
        <img
          src={!isPlaceholder ? imageUrl : "/placeholder.svg"}
          alt={post.postName || "Instagram Post"}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100 shadow-medium">
            <ExternalLink className="w-5 h-5 text-black" />
          </div>
        </div>
      </div>
      <div className="p-6">
        <p className="text-black font-bold text-sm line-clamp-2 mb-6 group-hover:text-gray-700 transition-colors leading-relaxed">
          {post.postName || "No caption"}
        </p>
        <div className="flex items-center gap-6 pt-4 border-t border-black/5">
          <div className="flex items-center gap-2 group/stat">
            <Heart size={16} className="text-black group-hover/stat:scale-125 transition-transform duration-300" />
            <span className="text-xs font-black text-black">{(post.likes || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 group/stat">
            <MessageCircle size={16} className="text-black group-hover/stat:scale-125 transition-transform duration-300" />
            <span className="text-xs font-black text-black">{(post.comments || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InfluencerProfilePost;

import { InstagramPost } from "@/app/types";
import { Card } from "@/components/ui/card";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";

interface Props {
  post: InstagramPost;
}

const InfluencerProfilePost = (props: Props) => {
  const { post } = props;
  return (
    <Card
      key={post.id}
      className="group bg-white border border-gray-100 rounded-[20px] overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <Image
          src={post.imageUrl || "/placeholder.svg"}
          alt={post.postName || "Post"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-gray-600 text-[13px] font-medium line-clamp-2 mb-4 leading-relaxed">
          {post.postName || "No caption available."}
        </p>
        <div className="mt-auto flex items-center gap-4 text-gray-400">
          <div className="flex items-center gap-1.5 group/stat">
            <Heart size={14} className="group-hover/stat:text-rose-500 transition-colors" />
            <span className="text-[11px] font-black">{post.likes?.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 group/stat">
            <MessageCircle size={14} className="group-hover/stat:text-blue-500 transition-colors" />
            <span className="text-[11px] font-black">{post.comments?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InfluencerProfilePost;

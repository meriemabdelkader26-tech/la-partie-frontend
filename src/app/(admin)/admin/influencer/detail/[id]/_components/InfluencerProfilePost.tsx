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
      className="bg-slate-800 border-slate-700 overflow-hidden hover:border-green-400 transition-colors group cursor-pointer"
    >
      <div className="relative h-48 w-full overflow-hidden bg-slate-700">
        <Image
          src={post.imageUrl || "/placeholder.svg"}
          alt={post.postName}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
          unoptimized
        />
      </div>
      <div className="p-4">
        <p className="text-slate-300 text-sm line-clamp-2 mb-3">
          {post.postName}
        </p>
        <div className="flex items-center gap-4 text-slate-400 text-sm">
          <div className="flex items-center gap-1">
            <Heart size={16} />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={16} />
            <span>{post.comments}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InfluencerProfilePost;
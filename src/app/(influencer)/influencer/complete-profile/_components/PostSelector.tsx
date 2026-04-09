"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Heart,
  MessageCircle,
  Image as ImageIcon,
  Grid3x3,
} from "lucide-react";
import { InstagramPost } from "@/app/types";
import {
  fetchInstagramPosts,
  simplifyPostsData,
  SimplifiedPost,
} from "@/lib/instagram-api";

interface PostSelectorProps {
  username: string;
  selectedPosts: InstagramPost[];
  onPostsChange: (posts: InstagramPost[]) => void;
  maxSelection?: number;
}

export default function PostSelector({
  username,
  selectedPosts,
  onPostsChange,
  maxSelection = 6,
}: PostSelectorProps) {
  const [posts, setPosts] = useState<SimplifiedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchInstagramPosts(username);
        const simplifiedPosts = simplifyPostsData(response);
        setPosts(simplifiedPosts);
      } catch (err) {
        setError("Failed to load Instagram posts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      loadPosts();
    }
  }, [username]);

  const togglePostSelection = (post: SimplifiedPost) => {
    const isSelected = selectedPosts.some((p) => p.id === post.id);

    if (isSelected) {
      // Remove from selection
      onPostsChange(selectedPosts.filter((p) => p.id !== post.id));
    } else {
      // Add to selection (check max limit)
      if (selectedPosts.length >= maxSelection) {
        alert(`You can only select up to ${maxSelection} posts`);
        return;
      }

      // Convert SimplifiedPost to InstagramPost type
      const instagramPost: InstagramPost = {
        id: post.id,
        code: post.code,
        mediaType: post.mediaType,
        imageUrl: post.imageUrl,
        thumbnailUrl: post.thumbnailUrl,
        postName: post.postName,
        takenAt: post.takenAt,
        likes: post.likes ?? 0,
        comments: post.comments ?? 0,
        username: post.username,
        carouselMedia: post.carouselMedia,
        hashtags: post.hashtags,
      };

      onPostsChange([...selectedPosts, instagramPost]);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card
              key={i}
              className="overflow-hidden bg-slate-700 border-slate-600"
            >
              <CardContent className="p-0">
                <Skeleton className="aspect-square w-full" />
                <div className="p-2">
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-slate-700 rounded-lg p-8 text-center">
        <p className="text-slate-400">No posts found for this account</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-slate-300 text-sm">
          Select up to {maxSelection} posts to showcase in your portfolio
        </p>
        <span className="bg-emerald-600/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium">
          {selectedPosts.length} / {maxSelection} selected
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post) => {
          const isSelected = selectedPosts.some((p) => p.id === post.id);

          return (
            <Card
              key={post.id}
              className={`relative overflow-hidden cursor-pointer transition-all ${
                isSelected
                  ? "ring-2 ring-emerald-500 bg-emerald-500/10"
                  : "hover:ring-2 hover:ring-slate-500 bg-slate-700"
              }`}
              onClick={() => togglePostSelection(post)}
            >
              <CardContent className="p-0">
                {/* Post Image */}
                <div className="relative aspect-square">
                  <img
                    src={post.imageUrl}
                    alt={post.postName}
                    className="w-full h-full object-cover"
                  />

                  {/* Media Type Badge */}
                  <div className="absolute top-2 right-2">
                    {post.mediaType === "carousel" && (
                      <span className="bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        <Grid3x3 className="w-3 h-3" />
                        {post.carouselMedia?.length || 0}
                      </span>
                    )}
                    {post.mediaType === "image" && (
                      <span className="bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                        <ImageIcon className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {/* Selection Checkbox */}
                  <div
                    className="absolute top-2 left-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => togglePostSelection(post)}
                      className="bg-white border-2 border-white data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                  </div>

                  {/* Overlay with stats */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1 text-white">
                      <Heart className="w-5 h-5 fill-white" />
                      <span className="font-semibold">
                        {post.likes >= 1000
                          ? `${(post.likes / 1000).toFixed(1)}K`
                          : post.likes}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white">
                      <MessageCircle className="w-5 h-5 fill-white" />
                      <span className="font-semibold">
                        {post.comments >= 1000
                          ? `${(post.comments / 1000).toFixed(1)}K`
                          : post.comments}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Post Caption (truncated) */}
                <div className="p-2">
                  <p className="text-slate-300 text-xs line-clamp-2">
                    {post.postName}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

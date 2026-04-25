"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import {
  Heart,
  MessageCircle,
  Image as ImageIcon,
  Grid3x3,
  Maximize2,
} from "lucide-react";
import { InstagramPost } from "@/app/types";
import {
  fetchInstagramPosts,
  simplifyPostsData,
  SimplifiedPost,
} from "@/lib/instagram-api";

import { NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_IMAGE_PROXY } from "@/config";

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
      } catch (err: any) {
        // Affiche le message d'erreur explicite si fourni
        setError(err?.message || "Erreur inconnue lors du chargement des posts Instagram");
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

  const formatNumber = (num: number | null | undefined): string => {
    if (num == null) {
      return "0";
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
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
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-black rounded-xl">
        <p className="text-white text-sm font-semibold">
          Select up to {maxSelection} posts to showcase in your portfolio
        </p>
        <span className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold">
          {selectedPosts.length} / {maxSelection}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post, index) => {
          const isSelected = selectedPosts.some((p) => p.id === post.id);

          return (
            <Card
              key={post.id}
              className={`p-0 gap-0 relative overflow-hidden cursor-pointer transition-all duration-300 rounded-2xl animate-fadeInUp ${
                isSelected
                  ? "ring-4 ring-black shadow-2xl scale-105"
                  : "hover:ring-2 hover:ring-black/20 hover:scale-105 shadow-medium hover:shadow-large"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => togglePostSelection(post)}
            >
              <CardContent className="p-0">
                {/* Post Image */}
                <div className="relative aspect-square bg-gray-200 animate-pulse overflow-hidden">
                  {post.imageUrl ? (
                    <img
                      src={`${NEXT_PUBLIC_BASE_URL}${NEXT_PUBLIC_IMAGE_PROXY}${encodeURIComponent(post.imageUrl)}`}
                      alt={post.postName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-0 transition-opacity duration-500"
                      onLoad={(e) => {
                        e.currentTarget.classList.remove('opacity-0');
                        e.currentTarget.parentElement?.classList.remove('animate-pulse');
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.nextElementSibling) {
                          (target.nextElementSibling as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs" style={{ display: post.imageUrl ? 'none' : 'flex' }}>
                    <ImageIcon className="w-8 h-8" />
                  </div>

                  {/* Media Type Badge */}
                  <div className="absolute top-3 right-3 z-20">
                    {post.mediaType === "carousel" && post.carouselMedia && post.carouselMedia.length > 0 && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="bg-black/90 hover:bg-black backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg transition-colors"
                          >
                            <Grid3x3 className="w-3.5 h-3.5" />
                            {post.carouselMedia.length}
                          </button>
                        </DialogTrigger>
                        <DialogContent 
                          className="max-w-2xl p-0 bg-black border-none overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DialogTitle className="sr-only">Carousel Images</DialogTitle>
                          <Carousel className="w-full">
                            <CarouselContent>
                              {post.carouselMedia.map((media, idx) => (
                                <CarouselItem key={idx} className="flex items-center justify-center">
                                  <div className="relative aspect-square w-full bg-gray-900 animate-pulse">
                                    <img
                                      src={`${NEXT_PUBLIC_BASE_URL}${NEXT_PUBLIC_IMAGE_PROXY}${encodeURIComponent(media.imageUrl)}`}
                                      alt={`Carousel image ${idx + 1}`}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-contain opacity-0 transition-opacity duration-500"
                                      onLoad={(e) => {
                                        e.currentTarget.classList.remove('opacity-0');
                                        e.currentTarget.parentElement?.classList.remove('animate-pulse');
                                      }}
                                    />
                                  </div>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-4 bg-white hover:bg-gray-200 text-black border-none w-10 h-10 shadow-xl opacity-90 hover:opacity-100 transition-all" />
                            <CarouselNext className="right-4 bg-white hover:bg-gray-200 text-black border-none w-10 h-10 shadow-xl opacity-90 hover:opacity-100 transition-all" />
                          </Carousel>
                        </DialogContent>
                      </Dialog>
                    )}
                    {post.mediaType === "image" && (
                      <span className="bg-black/90 backdrop-blur-sm text-white p-1.5 rounded-lg shadow-lg flex items-center justify-center">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {/* Selection Checkbox */}
                  <div
                    className="absolute top-3 left-3 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={`w-7 h-7 rounded-lg border-3 flex items-center justify-center transition-all ${
                      isSelected 
                        ? "bg-black border-black" 
                        : "bg-white/90 border-white backdrop-blur-sm"
                    }`}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => togglePostSelection(post)}
                        className="border-0 bg-transparent data-[state=checked]:bg-transparent data-[state=checked]:text-white"
                      />
                    </div>
                  </div>

                  {/* Overlay with stats */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-all duration-300 flex items-end justify-center p-4 gap-6">
                    <div className="flex items-center gap-2 text-white">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 fill-white" />
                      </div>
                      <span className="font-bold text-lg">
                        {formatNumber(post.likes)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 fill-white" />
                      </div>
                      <span className="font-bold text-lg">
                        {formatNumber(post.comments)}
                      </span>
                    </div>
                  </div>

                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-white text-black px-3 py-1.5 rounded-lg text-xs font-bold text-center shadow-lg">
                        ✓ Selected
                      </div>
                    </div>
                  )}
                </div>

                {/* Post Caption (truncated) */}
                <div className="p-3 bg-white">
                  <p className="text-gray-700 text-sm line-clamp-2 font-medium">
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

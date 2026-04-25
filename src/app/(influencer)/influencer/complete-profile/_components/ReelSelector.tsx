"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchInstagramReels,
  simplifyReelsData,
  SimplifiedReel,
  extractHashtags,
} from "@/lib/instagram-api";
import { PlayCircle, Heart, MessageCircle, Eye } from "lucide-react";
import { InstagramReel } from "@/app/types";

import { NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_IMAGE_PROXY } from "@/config";

interface ReelSelectorProps {
  username: string;
  selectedReels: InstagramReel[];
  onReelsSelected: (reels: InstagramReel[]) => void;
  maxSelection?: number;
}

export default function ReelSelector({
  username,
  selectedReels,
  onReelsSelected,
  maxSelection = 5,
}: ReelSelectorProps) {
  const [reels, setReels] = useState<SimplifiedReel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (username) {
      loadReels();
    }
  }, [username]);

  const loadReels = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchInstagramReels(username);
      const simplifiedReels = simplifyReelsData(response);
      setReels(simplifiedReels);
    } catch (err) {
      setError("Failed to load reels. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isReelSelected = (reelId: string) => {
    return selectedReels.some((r) => r.id === reelId);
  };

  const toggleReelSelection = (reel: SimplifiedReel) => {
    const isSelected = isReelSelected(reel.id);

    if (isSelected) {
      // Remove from selection
      onReelsSelected(selectedReels.filter((r) => r.id !== reel.id));
    } else {
      // Check max limit
      if (selectedReels.length >= maxSelection) {
        alert(`You can only select up to ${maxSelection} reels`);
        return;
      }

      // Add to selection
      const reelWithHashtags: InstagramReel = {
        ...reel,
        likes: reel.likes ?? 0,
        comments: reel.comments ?? 0,
        hashtags: extractHashtags(reel.postName),
      };
      onReelsSelected([...selectedReels, reelWithHashtags]);
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

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-48 bg-gray-200" />
          <Skeleton className="h-5 w-24 bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-white border-2 border-black/5 rounded-2xl">
              <CardContent className="p-4">
                <Skeleton className="aspect-9/16 w-full mb-3 bg-gray-200 rounded-xl" />
                <Skeleton className="h-4 w-3/4 mb-2 bg-gray-200" />
                <Skeleton className="h-4 w-1/2 bg-gray-200" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-400/30 rounded-2xl p-6">
        <p className="text-red-800 font-medium">{error}</p>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="bg-gray-50 border-2 border-black/5 rounded-2xl p-8 text-center">
        <p className="text-gray-600 font-medium">No reels found for this account</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-gray-600 text-sm font-medium">
          Select up to {maxSelection} reels to showcase in your portfolio
        </p>
        <span className="bg-black text-white px-4 py-2 rounded-xl text-sm font-bold shadow-medium">
          {selectedReels.length} / {maxSelection} selected
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reels.map((reel, index) => {
          const isSelected = isReelSelected(reel.id);

          return (
            <Card
              key={reel.id}
              className={`p-0 gap-0 relative overflow-hidden cursor-pointer transition-all duration-300 rounded-2xl animate-fadeInUp ${
                isSelected
                  ? "ring-4 ring-black bg-white border-2 border-black shadow-large scale-105"
                  : "hover:ring-4 hover:ring-black/20 bg-white border-2 border-black/10 hover:border-black/30 hover:shadow-large hover:scale-105"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => toggleReelSelection(reel)}
            >
              <CardContent className="p-0">
                {/* Reel Thumbnail */}
                <div className="relative aspect-9/16 bg-gray-200 animate-pulse overflow-hidden">
                  <img
                    src={`${NEXT_PUBLIC_BASE_URL}${NEXT_PUBLIC_IMAGE_PROXY}${encodeURIComponent(reel.thumbnailUrl)}`}
                    alt={reel.postName}
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
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs" style={{ display: reel.thumbnailUrl ? 'none' : 'flex' }}>
                    <PlayCircle className="w-8 h-8" />
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-black/90 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-large">
                      <PlayCircle className="w-3.5 h-3.5" />
                      {formatDuration(reel.duration)}
                    </span>
                  </div>

                  {/* Selection Checkbox */}
                  <div
                    className="absolute top-3 left-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleReelSelection(reel)}
                      className="bg-white border-2 border-white data-[state=checked]:bg-black data-[state=checked]:border-black w-6 h-6 shadow-large"
                    />
                  </div>

                  {/* Overlay with stats */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-6">
                    <div className="flex flex-col items-center gap-1 text-white">
                      <Heart className="w-6 h-6 fill-white" />
                      <span className="font-bold text-sm">
                        {formatNumber(reel.likes)}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-white">
                      <MessageCircle className="w-6 h-6 fill-white" />
                      <span className="font-bold text-sm">
                        {formatNumber(reel.comments)}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-white">
                      <Eye className="w-6 h-6 fill-white" />
                      <span className="font-bold text-sm">
                        {formatNumber(reel.views)}
                      </span>
                    </div>
                  </div>

                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-xl text-xs font-bold shadow-large">
                      ✓ Selected
                    </div>
                  )}
                </div>

                {/* Reel Caption */}
                <div className="p-3 bg-gradient-to-br from-white to-gray-50">
                  <p className="text-black text-xs font-medium line-clamp-2">
                    {reel.postName}
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

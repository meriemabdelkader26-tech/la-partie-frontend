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
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <Skeleton className="aspect-9/16 w-full mb-3" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
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

  if (reels.length === 0) {
    return (
      <div className="bg-slate-700 rounded-lg p-8 text-center">
        <p className="text-slate-400">No reels found for this account</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-slate-300 text-sm">
          Select up to {maxSelection} reels to showcase in your portfolio
        </p>
        <span className="bg-emerald-600/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium">
          {selectedReels.length} / {maxSelection} selected
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reels.map((reel) => {
          const isSelected = isReelSelected(reel.id);

          return (
            <Card
              key={reel.id}
              className={`relative overflow-hidden cursor-pointer transition-all ${
                isSelected
                  ? "ring-2 ring-emerald-500 bg-emerald-500/10"
                  : "hover:ring-2 hover:ring-slate-500 bg-slate-700"
              }`}
              onClick={() => toggleReelSelection(reel)}
            >
              <CardContent className="p-0">
                {/* Reel Thumbnail */}
                <div className="relative aspect-9/16">
                  <img
                    src={reel.thumbnailUrl}
                    alt={reel.postName}
                    className="w-full h-full object-cover"
                  />

                  {/* Duration Badge */}
                  <div className="absolute top-2 right-2">
                    <span className="bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <PlayCircle className="w-3 h-3" />
                      {formatDuration(reel.duration)}
                    </span>
                  </div>

                  {/* Selection Checkbox */}
                  <div
                    className="absolute top-2 left-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleReelSelection(reel)}
                      className="bg-white border-2 border-white data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                  </div>

                  {/* Overlay with stats */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1 text-white">
                      <Heart className="w-5 h-5 fill-white" />
                      <span className="font-semibold">
                        {formatNumber(reel.likes)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white">
                      <MessageCircle className="w-5 h-5 fill-white" />
                      <span className="font-semibold">
                        {formatNumber(reel.comments)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white">
                      <Eye className="w-5 h-5 fill-white" />
                      <span className="font-semibold">
                        {formatNumber(reel.views)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reel Caption */}
                <div className="p-2">
                  <p className="text-slate-300 text-xs line-clamp-2">
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

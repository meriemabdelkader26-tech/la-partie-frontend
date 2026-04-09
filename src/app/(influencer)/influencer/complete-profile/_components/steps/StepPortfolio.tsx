"use client";

import { ProfileFormData } from "../types";
import SubmitButton from "@/components/shared/SubmitButton";
import { useState } from "react";
import ReelSelector from "../ReelSelector";
import { InstagramReel } from "@/app/types";
import { Film } from "lucide-react";

interface Props {
  formData: ProfileFormData;
  onUpdate: (updates: Partial<ProfileFormData>) => void;
  onNext: () => void;
}

export default function StepPortfolio({ formData, onUpdate, onNext }: Props) {
  const [selectedReels, setSelectedReels] = useState<InstagramReel[]>(
    formData.selectedReels || []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ selectedReels });
    onNext();
  };

  const handleReelsSelected = (reels: InstagramReel[]) => {
    setSelectedReels(reels);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Portfolio & Top Reels
        </h3>
        <p className="text-slate-400 text-sm mb-6">
          Select up to 5 of your best performing reels to showcase in your
          profile.
        </p>
      </div>

      {/* Reels Section */}
      <div className="bg-slate-700 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Film className="text-emerald-400" size={24} />
          <h4 className="text-lg font-semibold text-white">
            Select Your Best Reels
          </h4>
        </div>

        {formData.instagramUsername ? (
          <ReelSelector
            username={formData.instagramUsername}
            selectedReels={selectedReels}
            onReelsSelected={handleReelsSelected}
            maxSelection={5}
          />
        ) : (
          <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 text-center">
            <p className="text-yellow-400">
              Instagram username not found. Please complete Step 1 first.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-start gap-4 justify-between">
        <p className="text-sm text-slate-400">
          {selectedReels.length > 0
            ? `${selectedReels.length} reel${
                selectedReels.length > 1 ? "s" : ""
              } selected`
            : "No reels selected (optional)"}
        </p>
        <SubmitButton isLoading={false}>Continue</SubmitButton>
      </div>
    </form>
  );
}

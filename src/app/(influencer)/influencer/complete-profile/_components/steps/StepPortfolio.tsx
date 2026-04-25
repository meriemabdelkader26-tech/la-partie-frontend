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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="animate-fadeInUp">
        <h2 className="text-2xl font-bold text-black mb-2">
          Portfolio & Top Reels
        </h2>
        <p className="text-gray-600">
          Select up to 5 of your best performing reels to showcase in your
          profile.
        </p>
      </div>

      {/* Reels Section */}
      <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-black/5 rounded-3xl p-8 space-y-6 shadow-soft animate-fadeInUp delay-100">
        <div className="flex items-center gap-3 pb-4 border-b-2 border-black/5">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-medium">
            <Film className="text-white" size={24} />
          </div>
          <h3 className="text-xl font-bold text-black">
            Select Your Best Reels
          </h3>
        </div>

        {formData.instagramUsername ? (
          <ReelSelector
            username={formData.instagramUsername}
            selectedReels={selectedReels}
            onReelsSelected={handleReelsSelected}
            maxSelection={5}
          />
        ) : (
          <div className="bg-yellow-50 border-2 border-yellow-400/30 rounded-2xl p-6 text-center">
            <p className="text-yellow-800 font-medium">
              Instagram username not found. Please complete Step 1 first.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col items-start gap-6 animate-fadeInUp delay-200">
        <div className="w-full bg-gray-50 border-2 border-black/5 rounded-2xl p-4">
          <p className="text-sm text-gray-600 font-medium">
            {selectedReels.length > 0
              ? `✓ ${selectedReels.length} reel${
                  selectedReels.length > 1 ? "s" : ""
                } selected`
              : "No reels selected (optional)"}
          </p>
        </div>
        <SubmitButton isLoading={false}>Continue</SubmitButton>
      </div>
    </form>
  );
}

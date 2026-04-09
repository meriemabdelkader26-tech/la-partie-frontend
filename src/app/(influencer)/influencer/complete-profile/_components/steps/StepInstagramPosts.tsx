"use client";
import { useState } from "react";
import { ProfileFormData } from "../types";
import SubmitButton from "@/components/shared/SubmitButton";
import PostSelector from "../PostSelector";
import { InstagramPost } from "@/app/types";
import { AlertCircle } from "lucide-react";

interface Props {
  formData: ProfileFormData;
  onUpdate: (updates: Partial<ProfileFormData>) => void;
  onNext: () => void;
}

export default function StepInstagramPosts({
  formData,
  onUpdate,
  onNext,
}: Props) {
  const [error, setError] = useState("");

  const handlePostsChange = (posts: InstagramPost[]) => {
    onUpdate({ selectedPosts: posts });
    setError("");
  };

  const handleSubmit = () => {
    // Validation: At least 1 post recommended but not required
    const selectedPosts = formData.selectedPosts || [];
    if (selectedPosts.length === 0) {
      setError("We recommend selecting at least 1 post to showcase your work");
      // Still allow to continue
    }

    onNext();
  };

  if (!formData.instagramUsername) {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-500/10 border border-yellow-600 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-500 font-medium">
              Instagram Account Required
            </p>
            <p className="text-yellow-400 text-sm mt-1">
              Please connect your Instagram account in Step 1 to select posts.
            </p>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onNext();
          }}
        >
          <SubmitButton isLoading={false}>Skip this step</SubmitButton>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Select Your Best Instagram Posts
        </h2>
        <p className="text-slate-400">
          Choose up to 6 posts that best represent your content and style. These
          will be featured in your portfolio.
        </p>
      </div>

      {error && (
        <div className="bg-yellow-500/10 border border-yellow-600 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-yellow-400 text-sm">{error}</p>
        </div>
      )}

      <PostSelector
        username={formData.instagramUsername}
        selectedPosts={formData.selectedPosts || []}
        onPostsChange={handlePostsChange}
        maxSelection={6}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="flex flex-col items-start gap-4 justify-between">
          <p className="text-slate-400 text-sm">
            {(formData.selectedPosts || []).length === 0
              ? "You can skip this step if you prefer"
              : `${(formData.selectedPosts || []).length} post${
                  (formData.selectedPosts || []).length > 1 ? "s" : ""
                } selected`}
          </p>
          <SubmitButton isLoading={false}>Continue</SubmitButton>
        </div>
      </form>
    </div>
  );
}

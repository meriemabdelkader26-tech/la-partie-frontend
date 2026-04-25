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
    <div className="space-y-8">
      <div className="animate-fadeInUp">
        <h2 className="text-3xl font-bold text-black mb-3">
          Select Your Best Instagram Posts
        </h2>
        <p className="text-gray-600 text-lg">
          Choose up to 6 posts that best represent your content and style. These
          will be featured in your portfolio.
        </p>
      </div>

      {error && (
        <div className="bg-yellow-50 border-2 border-yellow-400/30 rounded-xl p-4 flex items-start gap-3 animate-fadeInUp">
          <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <p className="text-yellow-800 text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="animate-fadeInUp delay-200">
        <PostSelector
          username={formData.instagramUsername}
          selectedPosts={formData.selectedPosts || []}
          onPostsChange={handlePostsChange}
          maxSelection={6}
        />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="animate-fadeInUp delay-300"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between p-6 bg-white rounded-2xl border border-black/10 shadow-sm">
          <div className="flex items-center gap-3">
            {(formData.selectedPosts || []).length === 0 ? (
              <p className="text-gray-500 font-medium">
                You can skip this step if you prefer
              </p>
            ) : (
              <div className="flex items-center gap-2 bg-black/5 px-4 py-2 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <p className="text-black font-bold">
                  {(formData.selectedPosts || []).length} post{
                    (formData.selectedPosts || []).length > 1 ? "s" : ""
                  } selected
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {(formData.selectedPosts || []).length === 0 && (
              <button
                type="button"
                onClick={onNext}
                className="text-gray-500 hover:text-black font-semibold transition-colors px-4 py-2"
              >
                Skip for now
              </button>
            )}
            <SubmitButton 
              isLoading={false} 
              className="w-full sm:w-auto px-8 h-12 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold shadow-medium hover:shadow-large transition-all duration-300 hover:scale-[1.02]"
            >
              Continue
            </SubmitButton>
          </div>
        </div>
      </form>
    </div>
  );
}

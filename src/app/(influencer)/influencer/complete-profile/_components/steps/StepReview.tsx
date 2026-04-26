"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ProfileFormData } from "../types";
import SubmitButton from "@/components/shared/SubmitButton";
import ErrorTriangle from "@/components/shared/ErrorTriangle";
import { Category } from "@/app/types";
import { useProfileFormStore } from "@/stores/use-profile-form-store";
import { useSessionStore } from "@/stores/use-session-store";
import { PlayCircle, Heart, MessageCircle, Eye, ImageIcon } from "lucide-react";
import { graphqlClient } from "@/lib/graphql-client";
import { COMPLETE_INFLUENCER_PROFILE_MUTATION } from "../mutations/completeProfile";

const FALLBACK_CATEGORIES: Category[] = [
  { id: "1", name: "Fashion & Style" },
  { id: "2", name: "Beauty & Makeup" },
  { id: "3", name: "Fitness & Health" },
  { id: "4", name: "Travel & Lifestyle" },
  { id: "5", name: "Food & Cooking" },
  { id: "6", name: "Technology & Gadgets" },
  { id: "7", name: "Gaming & Esports" },
  { id: "8", name: "Parenting & Family" },
];

interface Props {
  categories?: Category[];
  formData: ProfileFormData;
  onComplete: () => void;
}

export default function StepReview({
  categories,
  formData,
  onComplete,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { clearFormData } = useProfileFormStore();
  const { currentUser, setCurrentUser } = useSessionStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Prepare the variables for GraphQL mutation
      const variables = {
        instagramUsername: formData.instagramUsername,
        pseudo: formData.pseudo || null,
        biography: formData.biography,
        localisation: formData.localisation,
        siteWeb: formData.siteWeb || null,
        disponibiliteCollaboration: formData.disponibiliteCollaboration || null,
        langues: formData.langues,
        typeContenu: formData.typeContenu,
        selectedCategories: formData.selectedCategories,
        centresInteret: formData.centresInteret || [],
        reseauxSociaux: formData.reseauxSociaux.map((rs) => ({
          plateforme: rs.plateforme,
          urlProfil: rs.urlProfil,
          nombreAbonnes: rs.nombreAbonnes,
          tauxEngagement: rs.tauxEngagement,
          moyenneVues: rs.moyenneVues || null,
          moyenneLikes: rs.moyenneLikes || null,
          moyenneCommentaires: rs.moyenneCommentaires || null,
          frequencePublication: rs.frequencePublication,
        })),
        offresCollaboration: formData.offresCollaboration.map((oc) => ({
          typeCollaboration: oc.typeCollaboration,
          tarifMinimum: oc.tarifMinimum,
          tarifMaximum: oc.tarifMaximum,
          conditions: oc.conditions || null,
        })),
        portfolioMedia: formData.portfolioMedia.map((pm) => ({
          imageUrl: pm.imageUrl,
          title: pm.title,
          description: pm.description || null,
          dateCreation: pm.dateCreation || null,
        })),
        selectedReels: (formData.selectedReels || []).map((reel) => ({
          id: reel.id,
          code: reel.code,
          videoUrl: reel.videoUrl,
          thumbnailUrl: reel.thumbnailUrl,
          postName: reel.postName,
          duration: Math.round(reel.duration), // Convert to integer
          takenAt: String(reel.takenAt || ""), // Ensure string
          likes: reel.likes ?? 0,
          comments: reel.comments ?? 0,
          views: reel.views ?? 0,
          username: reel.username,
          hashtags: reel.hashtags || [],
        })),
        selectedPosts: (formData.selectedPosts || []).map((post) => ({
          id: post.id,
          code: post.code,
          mediaType: post.mediaType,
          imageUrl: post.imageUrl,
          thumbnailUrl: post.thumbnailUrl,
          postName: post.postName,
          takenAt: String(post.takenAt || ""), // Ensure string
          likes: post.likes ?? 0,
          comments: post.comments ?? 0,
          username: post.username,
          hashtags: post.hashtags || [],
        })),
        images: (formData.images || []).map((img) => ({
          url: img.url,
          isDefault: img.isDefault,
          isPublic: img.isPublic,
        })),
      };

      const result: any = await graphqlClient.request(
        COMPLETE_INFLUENCER_PROFILE_MUTATION,
        variables
      );

      if (result.completeInfluencerProfile?.success) {
        setSuccess(true);
        // Clear the form data from Zustand store after successful submission
        clearFormData();

        // Refresh token to get updated isCompletedProfile and isVerifyByAdmin status in JWT
        try {
          const refreshToken = localStorage.getItem("refreshToken") || "";
          if (refreshToken) {
            console.log("[DEBUG] Triggering token refresh after profile completion...");
            const refreshRes = await fetch("/api/refresh-token", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            });
            if (refreshRes.ok) {
              const refreshData = await refreshRes.json();
              if (refreshData.refreshToken) {
                localStorage.setItem("refreshToken", refreshData.refreshToken);
              }
              console.log("[DEBUG] Token refreshed successfully.");
            } else {
              console.error("[DEBUG] Token refresh failed:", refreshRes.status);
            }
          }
        } catch (e) {
          console.error("Failed to refresh token after profile completion", e);
        }

        // Update session store to reflect profile completion
        if (currentUser) {
          setCurrentUser({
            ...currentUser,
            isCompletedProfile: true,
          });
        }
        
        setTimeout(onComplete, 2000);
      } else {
        setError(
          result.completeInfluencerProfile?.message || "Failed to save profile"
        );
      }
    } catch (err: any) {
      console.error("Error submitting profile:", err);
      setError(
        err?.response?.errors?.[0]?.message ||
          "Failed to save profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6 py-12 animate-fadeInUp">
        <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto shadow-large animate-scaleIn">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-3xl font-bold text-black">Profile Completed!</h3>
        <p className="text-gray-600 text-lg">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="animate-fadeInUp">
        <h2 className="text-2xl font-bold text-black mb-2">
          Review Your Profile
        </h2>
        <p className="text-gray-600">
          Please review your information before submitting
        </p>
      </div>

      {error && <ErrorTriangle message={error} />}

      <div className="space-y-6">
        {/* Instagram Info */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-black/5 rounded-3xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 animate-fadeInUp delay-100">
          <h3 className="font-bold text-black text-xl mb-6">Instagram Account</h3>
          <div className="space-y-6">
            {/* Username and Display Name */}
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-3 text-sm">
                <p className="text-gray-700">
                  <span className="text-gray-500 font-semibold">Username:</span>{" "}
                  <span className="text-black font-bold">
                    @{formData.instagramUsername}
                  </span>
                </p>
                {formData.pseudo && (
                  <p className="text-gray-700">
                    <span className="text-gray-500 font-semibold">
                      Display Name:
                    </span>{" "}
                    <span className="text-black font-bold">{formData.pseudo}</span>
                  </p>
                )}
                {formData.instagramData?.full_name && (
                  <p className="text-gray-700">
                    <span className="text-gray-500 font-semibold">
                      Full Name:
                    </span>{" "}
                    <span className="text-black font-bold">
                      {formData.instagramData.full_name}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Statistics */}
            {formData.instagramData && (
              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="bg-black rounded-2xl p-4 text-center shadow-medium hover:scale-105 transition-transform duration-300">
                  <p className="text-3xl font-bold text-white">
                    {formData.instagramData.follower_count >= 1000000
                      ? `${(
                          formData.instagramData.follower_count / 1000000
                        ).toFixed(1)}M`
                      : formData.instagramData.follower_count >= 1000
                      ? `${(
                          formData.instagramData.follower_count / 1000
                        ).toFixed(1)}K`
                      : formData.instagramData.follower_count}
                  </p>
                  <p className="text-xs text-gray-300 mt-2 font-semibold">Followers</p>
                </div>
                <div className="bg-black rounded-2xl p-4 text-center shadow-medium hover:scale-105 transition-transform duration-300">
                  <p className="text-3xl font-bold text-white">
                    {formData.instagramData.following_count >= 1000000
                      ? `${(
                          formData.instagramData.following_count / 1000000
                        ).toFixed(1)}M`
                      : formData.instagramData.following_count >= 1000
                      ? `${(
                          formData.instagramData.following_count / 1000
                        ).toFixed(1)}K`
                      : formData.instagramData.following_count}
                  </p>
                  <p className="text-xs text-gray-300 mt-2 font-semibold">Following</p>
                </div>
                <div className="bg-black rounded-2xl p-4 text-center shadow-medium hover:scale-105 transition-transform duration-300">
                  <p className="text-3xl font-bold text-white">
                    {formData.instagramData.media_count >= 1000
                      ? `${(formData.instagramData.media_count / 1000).toFixed(
                          1
                        )}K`
                      : formData.instagramData.media_count}
                  </p>
                  <p className="text-xs text-gray-300 mt-2 font-semibold">Posts</p>
                </div>
              </div>
            )}

            {/* Contact Information */}
            {(formData.instagramData?.public_email ||
              formData.instagramData?.biography_email ||
              formData.instagramData?.contact_phone_number) && (
              <div className="border-t-2 border-black/5 pt-6 space-y-3 text-sm">
                <p className="text-gray-600 font-bold mb-3">
                  Contact Information:
                </p>
                {formData.instagramData.public_email && (
                  <p className="text-gray-700">
                    <span className="text-gray-500 font-semibold">Public Email:</span>{" "}
                    <span className="text-black font-bold">
                      {formData.instagramData.public_email}
                    </span>
                  </p>
                )}
                {formData.instagramData.biography_email && (
                  <p className="text-gray-700">
                    <span className="text-gray-500 font-semibold">Biography Email:</span>{" "}
                    <span className="text-black font-bold">
                      {formData.instagramData.biography_email}
                    </span>
                  </p>
                )}
                {formData.instagramData.contact_phone_number && (
                  <p className="text-gray-700">
                    <span className="text-gray-500 font-semibold">Phone:</span>{" "}
                    <span className="text-black font-bold">
                      {formData.instagramData.contact_phone_number}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Biography */}
            {formData.instagramData?.biography && (
              <div className="border-t-2 border-black/5 pt-6">
                <p className="text-gray-600 font-bold text-sm mb-3">
                  Biography:
                </p>
                <p className="text-black text-sm whitespace-pre-line leading-relaxed">
                  {formData.instagramData.biography}
                </p>
              </div>
            )}

            {/* Website */}
            {formData.instagramData?.external_url && (
              <div className="border-t-2 border-black/5 pt-6">
                <p className="text-gray-700 text-sm">
                  <span className="text-gray-500 font-semibold">Website:</span>{" "}
                  <a
                    href={formData.instagramData.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:text-gray-700 underline font-bold"
                  >
                    {formData.instagramData.external_url}
                  </a>
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Instagram Posts */}
        {formData.selectedPosts && formData.selectedPosts.length > 0 && (
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-black/5 rounded-3xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 animate-fadeInUp delay-200">
            <h3 className="font-bold text-black text-xl mb-6">
              Selected Posts ({formData.selectedPosts.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {formData.selectedPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative bg-white border-2 border-black/10 rounded-2xl overflow-hidden aspect-square group hover:border-black/30 hover:shadow-large transition-all duration-300"
                >
                  <img
                    src={post.thumbnailUrl}
                    alt={post.postName}
                    className="w-full h-full object-cover"
                  />
                  {post.mediaType === "carousel" && (
                    <div className="absolute top-2 right-2">
                      <ImageIcon className="w-4 h-4 text-white drop-shadow-lg" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <div className="flex items-center gap-1 text-white text-sm">
                      <Heart className="w-4 h-4 fill-white" />
                      <span>
                        {post.likes >= 1000
                          ? `${(post.likes / 1000).toFixed(1)}K`
                          : post.likes}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white text-sm">
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>
                        {post.comments >= 1000
                          ? `${(post.comments / 1000).toFixed(1)}K`
                          : post.comments}
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs line-clamp-2">
                      {post.postName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Instagram Reels */}
        {formData.selectedReels && formData.selectedReels.length > 0 && (
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-black/5 rounded-3xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 animate-fadeInUp delay-300">
            <h3 className="font-bold text-black text-xl mb-6">
              Selected Reels ({formData.selectedReels.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {formData.selectedReels.map((reel) => (
                <div
                  key={reel.id}
                  className="relative bg-white border-2 border-black/10 rounded-2xl overflow-hidden aspect-9/16 group hover:border-black/30 hover:shadow-large transition-all duration-300"
                >
                  <img
                    src={reel.thumbnailUrl}
                    alt={reel.postName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <PlayCircle className="w-3 h-3" />
                      {Math.floor(reel.duration / 60)}:
                      {String(Math.floor(reel.duration % 60)).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <div className="flex items-center gap-1 text-white text-xs">
                      <Heart className="w-3 h-3 fill-white" />
                      <span>
                        {reel.likes >= 1000000
                          ? `${(reel.likes / 1000000).toFixed(1)}M`
                          : reel.likes >= 1000
                          ? `${(reel.likes / 1000).toFixed(1)}K`
                          : reel.likes}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white text-xs">
                      <MessageCircle className="w-3 h-3 fill-white" />
                      <span>
                        {reel.comments >= 1000000
                          ? `${(reel.comments / 1000000).toFixed(1)}M`
                          : reel.comments >= 1000
                          ? `${(reel.comments / 1000).toFixed(1)}K`
                          : reel.comments}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white text-xs">
                      <Eye className="w-3 h-3 fill-white" />
                      <span>
                        {reel.views >= 1000000
                          ? `${(reel.views / 1000000).toFixed(1)}M`
                          : reel.views >= 1000
                          ? `${(reel.views / 1000).toFixed(1)}K`
                          : reel.views}
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs line-clamp-2">
                      {reel.postName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Profile Images */}
        {formData.images && formData.images.length > 0 && (
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-black/5 rounded-3xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 animate-fadeInUp delay-400">
            <h3 className="font-bold text-black text-xl mb-6">
              Profile Images ({formData.images.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative bg-white border-2 rounded-2xl overflow-hidden aspect-square hover:shadow-large transition-all duration-300 ${
                    image.isDefault ? "ring-4 ring-black/20 border-black" : "border-black/10 hover:border-black/30"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`Profile image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {image.isDefault && (
                    <div className="absolute top-3 left-3 bg-black text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-large">
                      <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      Avatar
                    </div>
                  )}
                  <div
                    className={`absolute top-3 right-3 px-3 py-1.5 rounded-xl text-xs font-bold shadow-large ${
                      image.isPublic
                        ? "bg-blue-600 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {image.isPublic ? "Public" : "Private"}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Profile Info */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-black/5 rounded-3xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 animate-fadeInUp delay-500">
          <h3 className="font-bold text-black text-xl mb-6">Profile Information</h3>
          <div className="space-y-4 text-sm">
            <p className="text-gray-700">
              <span className="text-gray-500 font-semibold">Biography:</span>{" "}
              <span className="text-black font-medium">{formData.biography}</span>
            </p>
            <p className="text-gray-700">
              <span className="text-gray-500 font-semibold">Location:</span>{" "}
              <span className="text-black font-medium">{formData.localisation}</span>
            </p>
            {formData.siteWeb && (
              <p className="text-gray-700">
                <span className="text-gray-500 font-semibold">Website:</span>{" "}
                <a
                  href={formData.siteWeb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:text-gray-700 underline font-bold"
                >
                  {formData.siteWeb}
                </a>
              </p>
            )}
            {formData.disponibiliteCollaboration && (
              <p className="text-gray-700">
                <span className="text-gray-500 font-semibold">Availability:</span>{" "}
                <span className="text-black font-medium">{formData.disponibiliteCollaboration.replace(/_/g, " ")}</span>
              </p>
            )}
          </div>
        </Card>

        {/* Languages & Content */}
        {formData.langues.length > 0 && (
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-black/5 rounded-3xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 animate-fadeInUp delay-600">
            <h3 className="font-bold text-black text-xl mb-6">
              Languages & Content Types
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-gray-600 text-sm font-bold mb-3">Languages:</p>
                <div className="flex flex-wrap gap-3">
                  {formData.langues.map((lang) => (
                    <span
                      key={lang}
                      className="bg-black text-white text-sm px-4 py-2 rounded-xl font-semibold shadow-soft"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              {formData.typeContenu.length > 0 && (
                <div>
                  <p className="text-gray-600 text-sm font-bold mb-3">Content Types:</p>
                  <div className="flex flex-wrap gap-3">
                    {formData.typeContenu.map((type) => (
                      <span
                        key={type}
                        className="bg-gray-800 text-white text-sm px-4 py-2 rounded-xl font-semibold shadow-soft"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Social Networks */}
        {formData.reseauxSociaux.length > 0 && (
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-black/5 rounded-3xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 animate-fadeInUp delay-700">
            <h3 className="font-bold text-black text-xl mb-6">Social Networks</h3>
            <div className="space-y-4">
              {formData.reseauxSociaux.map((network, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-black/10 rounded-2xl p-6 space-y-3 text-sm hover:border-black/30 hover:shadow-medium transition-all duration-300"
                >
                  <p className="text-black font-bold text-lg">
                    {network.plateforme.charAt(0).toUpperCase() +
                      network.plateforme.slice(1).toLowerCase()}
                  </p>
                  <p className="text-gray-700">
                    <span className="text-gray-500 font-semibold">Followers:</span>{" "}
                    <span className="text-black font-bold">{Number(network.nombreAbonnes).toLocaleString()}</span>
                  </p>
                  <p className="text-gray-700">
                    <span className="text-gray-500 font-semibold">Engagement Rate:</span>{" "}
                    <span className="text-black font-bold">{network.tauxEngagement}%</span>
                  </p>
                  {network.moyenneVues && (
                    <p className="text-gray-700">
                      <span className="text-gray-500 font-semibold">Avg Views:</span>{" "}
                      <span className="text-black font-bold">{Number(network.moyenneVues).toLocaleString()}</span>
                    </p>
                  )}
                  <p className="text-gray-700">
                    <span className="text-gray-500 font-semibold">Frequency:</span>{" "}
                    <span className="text-black font-bold">{network.frequencePublication.replace(/_/g, " ")}</span>
                  </p>
                  <a
                    href={network.urlProfil}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:text-gray-700 text-xs block truncate underline font-bold"
                  >
                    {network.urlProfil}
                  </a>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Categories */}
        {formData.selectedCategories.length > 0 && (
          <Card className="bg-linear-to-br from-white to-gray-50 border-2 border-black/5 rounded-3xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 animate-fadeInUp delay-800">
            <h3 className="font-bold text-black text-xl mb-6">Categories</h3>
            <div className="flex flex-wrap gap-3">
              {formData.selectedCategories.map((categoryId) => {
                const displayCategories = (!categories || categories.length === 0) ? FALLBACK_CATEGORIES : categories;
                const category = displayCategories?.find(
                  (cat) => String(cat.id) === String(categoryId)
                );
                return (
                  <span
                    key={categoryId}
                    className="bg-black text-white text-sm px-4 py-2 rounded-xl font-semibold shadow-soft"
                  >
                    {category ? category.name : categoryId}
                  </span>
                );
              })}
            </div>
          </Card>
        )}

        {/* Centers of Interest */}
        {formData.centresInteret && formData.centresInteret.length > 0 && (
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-black/5 rounded-3xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 animate-fadeInUp delay-900">
            <h3 className="font-bold text-black text-xl mb-6">
              Centers of Interest
            </h3>
            <div className="flex flex-wrap gap-3">
              {formData.centresInteret.map((interest, idx) => (
                <span
                  key={idx}
                  className="bg-gray-800 text-white border-2 border-gray-800 text-sm px-4 py-2 rounded-xl font-semibold shadow-soft"
                >
                  {interest}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Collaboration Offers */}
        {formData.offresCollaboration.length > 0 && (
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-black/5 rounded-3xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 animate-fadeInUp delay-1000">
            <h3 className="font-bold text-black text-xl mb-6">
              Collaboration Offers
            </h3>
            <div className="space-y-4">
              {formData.offresCollaboration.map((offer, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-black/10 rounded-2xl p-6 space-y-3 text-sm hover:border-black/30 hover:shadow-medium transition-all duration-300"
                >
                  <p className="text-black font-bold text-lg">
                    {offer.typeCollaboration.replace(/_/g, " ")}
                  </p>
                  <p className="text-gray-700">
                    <span className="text-gray-500 font-semibold">Rate:</span>{" "}
                    <span className="text-black font-bold">${offer.tarifMinimum} - ${offer.tarifMaximum}</span>
                  </p>
                  {offer.conditions && (
                    <p className="text-gray-600 text-xs leading-relaxed">{offer.conditions}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <div className="animate-fadeInUp delay-1100">
        <SubmitButton isLoading={loading} loadingText="Saving Profile...">
          Complete Profile
        </SubmitButton>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ProfileFormData } from "../types";
import SubmitButton from "@/components/shared/SubmitButton";
import ErrorTriangle from "@/components/shared/ErrorTriangle";
import { Category } from "@/app/types";
import { useProfileFormStore } from "@/stores/use-profile-form-store";
import { PlayCircle, Heart, MessageCircle, Eye, ImageIcon } from "lucide-react";
import { graphqlClient } from "@/lib/graphql-client";
import { COMPLETE_INFLUENCER_PROFILE_MUTATION } from "../mutations/completeProfile";

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
          takenAt: reel.takenAt,
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
          takenAt: post.takenAt,
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
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white">Profile Completed!</h3>
        <p className="text-slate-400">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Review Your Profile
        </h3>
        <p className="text-slate-400 text-sm">
          Please review your information before submitting
        </p>
      </div>

      {error && <ErrorTriangle message={error} />}

      <div className="space-y-4">
        {/* Instagram Info */}
        <Card className="bg-slate-700 border-slate-600 p-4">
          <h3 className="font-semibold text-white mb-4">Instagram Account</h3>
          <div className="space-y-3">
            {/* Username and Display Name */}
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-2 text-sm">
                <p className="text-slate-300">
                  <span className="text-slate-400 font-medium">Username:</span>{" "}
                  <span className="text-white">
                    @{formData.instagramUsername}
                  </span>
                </p>
                {formData.pseudo && (
                  <p className="text-slate-300">
                    <span className="text-slate-400 font-medium">
                      Display Name:
                    </span>{" "}
                    <span className="text-white">{formData.pseudo}</span>
                  </p>
                )}
                {formData.instagramData?.full_name && (
                  <p className="text-slate-300">
                    <span className="text-slate-400 font-medium">
                      Full Name:
                    </span>{" "}
                    <span className="text-white">
                      {formData.instagramData.full_name}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Statistics */}
            {formData.instagramData && (
              <div className="grid grid-cols-3 gap-3 py-3">
                <div className="bg-slate-600 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-400">
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
                  <p className="text-xs text-slate-400 mt-1">Followers</p>
                </div>
                <div className="bg-slate-600 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-400">
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
                  <p className="text-xs text-slate-400 mt-1">Following</p>
                </div>
                <div className="bg-slate-600 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-400">
                    {formData.instagramData.media_count >= 1000
                      ? `${(formData.instagramData.media_count / 1000).toFixed(
                          1
                        )}K`
                      : formData.instagramData.media_count}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Posts</p>
                </div>
              </div>
            )}

            {/* Contact Information */}
            {(formData.instagramData?.public_email ||
              formData.instagramData?.biography_email ||
              formData.instagramData?.contact_phone_number) && (
              <div className="border-t border-slate-600 pt-3 space-y-2 text-sm">
                <p className="text-slate-400 font-medium mb-2">
                  Contact Information:
                </p>
                {formData.instagramData.public_email && (
                  <p className="text-slate-300">
                    <span className="text-slate-400">Public Email:</span>{" "}
                    <span className="text-white">
                      {formData.instagramData.public_email}
                    </span>
                  </p>
                )}
                {formData.instagramData.biography_email && (
                  <p className="text-slate-300">
                    <span className="text-slate-400">Biography Email:</span>{" "}
                    <span className="text-white">
                      {formData.instagramData.biography_email}
                    </span>
                  </p>
                )}
                {formData.instagramData.contact_phone_number && (
                  <p className="text-slate-300">
                    <span className="text-slate-400">Phone:</span>{" "}
                    <span className="text-white">
                      {formData.instagramData.contact_phone_number}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Biography */}
            {formData.instagramData?.biography && (
              <div className="border-t border-slate-600 pt-3">
                <p className="text-slate-400 font-medium text-sm mb-2">
                  Biography:
                </p>
                <p className="text-slate-300 text-sm whitespace-pre-line">
                  {formData.instagramData.biography}
                </p>
              </div>
            )}

            {/* Website */}
            {formData.instagramData?.external_url && (
              <div className="border-t border-slate-600 pt-3">
                <p className="text-slate-300 text-sm">
                  <span className="text-slate-400 font-medium">Website:</span>{" "}
                  <a
                    href={formData.instagramData.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 underline"
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
          <Card className="bg-slate-700 border-slate-600 p-4">
            <h3 className="font-semibold text-white mb-3">
              Selected Posts ({formData.selectedPosts.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {formData.selectedPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative bg-slate-600 rounded-lg overflow-hidden aspect-square group"
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
          <Card className="bg-slate-700 border-slate-600 p-4">
            <h3 className="font-semibold text-white mb-3">
              Selected Reels ({formData.selectedReels.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {formData.selectedReels.map((reel) => (
                <div
                  key={reel.id}
                  className="relative bg-slate-600 rounded-lg overflow-hidden aspect-9/16 group"
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
          <Card className="bg-slate-700 border-slate-600 p-4">
            <h3 className="font-semibold text-white mb-3">
              Profile Images ({formData.images.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative bg-slate-600 rounded-lg overflow-hidden aspect-square ${
                    image.isDefault ? "ring-2 ring-emerald-500" : ""
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`Profile image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {image.isDefault && (
                    <div className="absolute top-2 left-2 bg-emerald-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                      <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      Avatar
                    </div>
                  )}
                  <div
                    className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                      image.isPublic
                        ? "bg-blue-600 text-white"
                        : "bg-slate-600 text-slate-300"
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
        <Card className="bg-slate-700 border-slate-600 p-4">
          <h3 className="font-semibold text-white mb-3">Profile Information</h3>
          <div className="space-y-2 text-sm">
            <p className="text-slate-300">
              <span className="text-slate-400">Biography:</span>{" "}
              {formData.biography}
            </p>
            <p className="text-slate-300">
              <span className="text-slate-400">Location:</span>{" "}
              {formData.localisation}
            </p>
            {formData.siteWeb && (
              <p className="text-slate-300">
                <span className="text-slate-400">Website:</span>{" "}
                <a
                  href={formData.siteWeb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300"
                >
                  {formData.siteWeb}
                </a>
              </p>
            )}
            {formData.disponibiliteCollaboration && (
              <p className="text-slate-300">
                <span className="text-slate-400">Availability:</span>{" "}
                {formData.disponibiliteCollaboration.replace(/_/g, " ")}
              </p>
            )}
          </div>
        </Card>

        {/* Languages & Content */}
        {formData.langues.length > 0 && (
          <Card className="bg-slate-700 border-slate-600 p-4">
            <h3 className="font-semibold text-white mb-3">
              Languages & Content Types
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-slate-400 text-xs mb-2">Languages:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.langues.map((lang) => (
                    <span
                      key={lang}
                      className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              {formData.typeContenu.length > 0 && (
                <div>
                  <p className="text-slate-400 text-xs mb-2">Content Types:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.typeContenu.map((type) => (
                      <span
                        key={type}
                        className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded"
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
          <Card className="bg-slate-700 border-slate-600 p-4">
            <h3 className="font-semibold text-white mb-3">Social Networks</h3>
            <div className="space-y-3">
              {formData.reseauxSociaux.map((network, idx) => (
                <div
                  key={idx}
                  className="bg-slate-600 rounded p-3 space-y-2 text-sm"
                >
                  <p className="text-white font-medium">
                    {network.plateforme.charAt(0).toUpperCase() +
                      network.plateforme.slice(1).toLowerCase()}
                  </p>
                  <p className="text-slate-300">
                    <span className="text-slate-400">Followers:</span>{" "}
                    {Number(network.nombreAbonnes).toLocaleString()}
                  </p>
                  <p className="text-slate-300">
                    <span className="text-slate-400">Engagement Rate:</span>{" "}
                    {network.tauxEngagement}%
                  </p>
                  {network.moyenneVues && (
                    <p className="text-slate-300">
                      <span className="text-slate-400">Avg Views:</span>{" "}
                      {Number(network.moyenneVues).toLocaleString()}
                    </p>
                  )}
                  <p className="text-slate-300">
                    <span className="text-slate-400">Frequency:</span>{" "}
                    {network.frequencePublication.replace(/_/g, " ")}
                  </p>
                  <a
                    href={network.urlProfil}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 text-xs block truncate"
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
          <Card className="bg-slate-700 border-slate-600 p-4">
            <h3 className="font-semibold text-white mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {formData.selectedCategories.map((categoryId) => {
                const category = categories?.find(
                  (cat) => cat.id === categoryId
                );
                return (
                  <span
                    key={categoryId}
                    className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded"
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
          <Card className="bg-slate-700 border-slate-600 p-4">
            <h3 className="font-semibold text-white mb-3">
              Centers of Interest
            </h3>
            <div className="flex flex-wrap gap-2">
              {formData.centresInteret.map((interest, idx) => (
                <span
                  key={idx}
                  className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs px-3 py-1.5 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Collaboration Offers */}
        {formData.offresCollaboration.length > 0 && (
          <Card className="bg-slate-700 border-slate-600 p-4">
            <h3 className="font-semibold text-white mb-3">
              Collaboration Offers
            </h3>
            <div className="space-y-3">
              {formData.offresCollaboration.map((offer, idx) => (
                <div
                  key={idx}
                  className="bg-slate-600 rounded p-3 space-y-1 text-sm"
                >
                  <p className="text-white font-medium">
                    {offer.typeCollaboration.replace(/_/g, " ")}
                  </p>
                  <p className="text-slate-300">
                    ${offer.tarifMinimum} - ${offer.tarifMaximum}
                  </p>
                  {offer.conditions && (
                    <p className="text-slate-400 text-xs">{offer.conditions}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <SubmitButton isLoading={loading} loadingText="Saving Profile...">
        Complete Profile
      </SubmitButton>
    </form>
  );
}

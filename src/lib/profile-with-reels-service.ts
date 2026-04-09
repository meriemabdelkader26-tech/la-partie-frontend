/**
 * Example GraphQL mutations and queries for saving Instagram Reels to database
 * This file demonstrates how to integrate the selected reels with your backend
 */

import { graphqlClient } from "@/lib/graphql-client";
import { InstagramReel } from "@/app/types";
import { ProfileFormData } from "@/app/(influencer)/influencer/complete-profile/_components/types";

// ============================================
// GraphQL MUTATIONS
// ============================================

/**
 * Save complete influencer profile including selected reels
 */
export const SAVE_INFLUENCER_PROFILE_WITH_REELS = `
  mutation SaveInfluencerProfile($input: InfluencerProfileInput!) {
    createInfluencerProfile(input: $input) {
      id
      instagramUsername
      biography
      localisation
      selectedReels {
        id
        code
        videoUrl
        thumbnailUrl
        postName
        duration
        takenAt
        likes
        comments
        views
        username
        hashtags
      }
      createdAt
      updatedAt
    }
  }
`;

/**
 * Add reels to existing profile
 */
export const ADD_REELS_TO_PROFILE = `
  mutation AddReelsToProfile($profileId: ID!, $reels: [InstagramReelInput!]!) {
    addReelsToProfile(profileId: $profileId, reels: $reels) {
      id
      selectedReels {
        id
        videoUrl
        postName
      }
    }
  }
`;

/**
 * Update selected reels (replace existing)
 */
export const UPDATE_SELECTED_REELS = `
  mutation UpdateSelectedReels($profileId: ID!, $reels: [InstagramReelInput!]!) {
    updateSelectedReels(profileId: $profileId, reels: $reels) {
      id
      selectedReels {
        id
        code
        videoUrl
        thumbnailUrl
        postName
        likes
        comments
        views
      }
    }
  }
`;

/**
 * Remove a specific reel from profile
 */
export const REMOVE_REEL_FROM_PROFILE = `
  mutation RemoveReelFromProfile($profileId: ID!, $reelId: ID!) {
    removeReelFromProfile(profileId: $profileId, reelId: $reelId) {
      id
      selectedReels {
        id
      }
    }
  }
`;

// ============================================
// GraphQL QUERIES
// ============================================

/**
 * Get influencer profile with reels
 */
export const GET_PROFILE_WITH_REELS = `
  query GetProfileWithReels($profileId: ID!) {
    influencerProfile(id: $profileId) {
      id
      instagramUsername
      biography
      selectedReels {
        id
        code
        videoUrl
        thumbnailUrl
        postName
        duration
        takenAt
        likes
        comments
        views
        username
        hashtags
      }
    }
  }
`;

/**
 * Get top reels across all influencers
 */
export const GET_TOP_REELS = `
  query GetTopReels($limit: Int = 10) {
    topReels(limit: $limit) {
      id
      videoUrl
      postName
      likes
      views
      influencerProfile {
        id
        instagramUsername
      }
    }
  }
`;

// ============================================
// SERVICE FUNCTIONS
// ============================================

/**
 * Save complete influencer profile with selected reels
 */
export async function saveInfluencerProfileWithReels(
  formData: ProfileFormData
) {
  try {
    const result = await graphqlClient.request(
      SAVE_INFLUENCER_PROFILE_WITH_REELS,
      {
        input: {
          instagramUsername: formData.instagramUsername,
          pseudo: formData.pseudo,
          biography: formData.biography,
          localisation: formData.localisation,
          siteWeb: formData.siteWeb,
          disponibiliteCollaboration: formData.disponibiliteCollaboration,
          langues: formData.langues,
          typeContenu: formData.typeContenu,
          selectedCategories: formData.selectedCategories,
          centresInteret: formData.centresInteret,
          reseauxSociaux: formData.reseauxSociaux,
          offresCollaboration: formData.offresCollaboration,
          portfolioMedia: formData.portfolioMedia,
          selectedReels: formData.selectedReels?.map((reel) => ({
            id: reel.id,
            code: reel.code,
            videoUrl: reel.videoUrl,
            thumbnailUrl: reel.thumbnailUrl,
            postName: reel.postName,
            duration: reel.duration,
            takenAt: reel.takenAt,
            likes: reel.likes,
            comments: reel.comments,
            views: reel.views,
            username: reel.username,
            hashtags: reel.hashtags || [],
          })),
          collaborations: formData.collaborations,
        },
      }
    );

    return {
      success: true,
      data: result.createInfluencerProfile,
    };
  } catch (error) {
    console.error("Error saving influencer profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Add new reels to existing profile
 */
export async function addReelsToProfile(
  profileId: string,
  reels: InstagramReel[]
) {
  try {
    const result = await graphqlClient.request(ADD_REELS_TO_PROFILE, {
      profileId,
      reels: reels.map((reel) => ({
        id: reel.id,
        code: reel.code,
        videoUrl: reel.videoUrl,
        thumbnailUrl: reel.thumbnailUrl,
        postName: reel.postName,
        duration: reel.duration,
        takenAt: reel.takenAt,
        likes: reel.likes,
        comments: reel.comments,
        views: reel.views,
        username: reel.username,
        hashtags: reel.hashtags || [],
      })),
    });

    return {
      success: true,
      data: result.addReelsToProfile,
    };
  } catch (error) {
    console.error("Error adding reels:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Update selected reels for a profile
 */
export async function updateSelectedReels(
  profileId: string,
  reels: InstagramReel[]
) {
  try {
    const result = await graphqlClient.request(UPDATE_SELECTED_REELS, {
      profileId,
      reels: reels.map((reel) => ({
        id: reel.id,
        code: reel.code,
        videoUrl: reel.videoUrl,
        thumbnailUrl: reel.thumbnailUrl,
        postName: reel.postName,
        duration: reel.duration,
        takenAt: reel.takenAt,
        likes: reel.likes,
        comments: reel.comments,
        views: reel.views,
        username: reel.username,
        hashtags: reel.hashtags || [],
      })),
    });

    return {
      success: true,
      data: result.updateSelectedReels,
    };
  } catch (error) {
    console.error("Error updating reels:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Remove a reel from profile
 */
export async function removeReelFromProfile(profileId: string, reelId: string) {
  try {
    const result = await graphqlClient.request(REMOVE_REEL_FROM_PROFILE, {
      profileId,
      reelId,
    });

    return {
      success: true,
      data: result.removeReelFromProfile,
    };
  } catch (error) {
    console.error("Error removing reel:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Get profile with reels
 */
export async function getProfileWithReels(profileId: string) {
  try {
    const result = await graphqlClient.request(GET_PROFILE_WITH_REELS, {
      profileId,
    });

    return {
      success: true,
      data: result.influencerProfile,
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// ============================================
// USAGE EXAMPLE IN COMPONENT
// ============================================

/**
 * Example: How to use in StepReview component
 *
 * import { saveInfluencerProfileWithReels } from '@/lib/profile-with-reels-service';
 *
 * const handleFinalSubmit = async () => {
 *   setIsSubmitting(true);
 *
 *   const result = await saveInfluencerProfileWithReels(formData);
 *
 *   if (result.success) {
 *     toast.success('Profile created successfully!');
 *     router.push(`/influencer/profile/${result.data.id}`);
 *   } else {
 *     toast.error(result.error);
 *   }
 *
 *   setIsSubmitting(false);
 * };
 */

import apiClient from "./api_client";
import axios from "axios";

// ============================================
// INSTAGRAM REELS API
// ============================================

// Types for Instagram Reels API Response
export interface InstagramReelItem {
  id: string;
  code: string;
  caption: {
    text: string;
    created_at: number;
  } | null;
  video_url: string;
  thumbnail_url: string;
  video_duration: number;
  taken_at: number;
  taken_at_date: string;
  like_count: number;
  comment_count: number;
  play_count: number;
  user: {
    id: string;
    username: string;
    full_name: string;
    profile_pic_url: string;
  };
  clips_metadata?: {
    audio_type?: string;
    original_sound_info?: any;
    music_info?: any;
  };
}

export interface InstagramReelsResponse {
  data: {
    count: number;
    items: InstagramReelItem[];
  };
}

export interface SimplifiedReel {
  id: string;
  code: string;
  videoUrl: string;
  thumbnailUrl: string;
  postName: string; // Caption text
  duration: number;
  takenAt: string;
  likes: number;
  comments: number;
  views: number;
  username: string;
}

interface RawInstagramPayload {
  data?: {
    count?: number;
    items?: any[];
    edges?: Array<{ node?: any }>;
  };
  items?: any[];
  edges?: Array<{ node?: any }>;
  result?: any;
}

function toRawItems(payload: RawInstagramPayload): any[] {
  const directItems = payload?.data?.items || payload?.items;
  if (Array.isArray(directItems) && directItems.length > 0) {
    return directItems.map((item: any) => item?.node?.media || item?.node || item);
  }

  const edgeItems =
    payload?.data?.edges?.map((edge) => edge?.node).filter(Boolean) ||
    payload?.edges?.map((edge) => edge?.node).filter(Boolean) ||
    [];
  if (edgeItems.length > 0) {
    return edgeItems.map((item: any) => item?.media || item);
  }

  const nestedCandidates = [
    payload?.result?.edges,
    payload?.result?.data?.items,
    payload?.result?.data?.edges,
    payload?.result?.items,
    payload?.result?.posts,
    payload?.result,
  ];

  for (const candidate of nestedCandidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      return candidate.map((item: any) => item?.node?.media || item?.node || item);
    }
  }

  return [];
}

function pickBestImageUrl(item: any): string {
  return (
    item?.image_versions?.items?.[0]?.url ||
    item?.image_versions2?.candidates?.[0]?.url ||
    item?.thumbnail_url ||
    item?.display_uri ||
    "https://placehold.co/600x800?text=Instagram"
  );
}

function pickBestVideoUrl(item: any): string {
  return (
    item?.video_url ||
    item?.video_versions?.[0]?.url ||
    item?.clips_metadata?.video_url ||
    pickBestImageUrl(item)
  );
}

function normalizeDate(item: any): string {
  if (item?.taken_at_date) {
    return item.taken_at_date;
  }
  if (item?.taken_at) {
    return new Date(item.taken_at * 1000).toISOString();
  }
  return new Date().toISOString();
}

async function callInstagramWithFallback(
  usernameOrIdOrUrl: string,
  type: "posts" | "reels"
): Promise<any[]> {
  const encoded = encodeURIComponent(usernameOrIdOrUrl);
  const candidates: Array<() => Promise<any>> = [
    () => apiClient.get(`/${type}?username_or_id_or_url=${encoded}`),
    () => apiClient.get(`/${type}?username=${encoded}`),
    () => apiClient.post(`/${type}`, { username_or_id_or_url: usernameOrIdOrUrl }),
    () => apiClient.post(`/${type}`, { username: usernameOrIdOrUrl }),
  ];

  // Cross-fallback because some providers return reels in posts and vice versa.
  if (type === "posts") {
    candidates.push(
      () => apiClient.get(`/reels?username_or_id_or_url=${encoded}`),
      () => apiClient.get(`/reels?username=${encoded}`),
      () => apiClient.post(`/reels`, { username_or_id_or_url: usernameOrIdOrUrl }),
      () => apiClient.post(`/reels`, { username: usernameOrIdOrUrl })
    );
  } else {
    candidates.push(
      () => apiClient.get(`/posts?username_or_id_or_url=${encoded}`),
      () => apiClient.get(`/posts?username=${encoded}`),
      () => apiClient.post(`/posts`, { username_or_id_or_url: usernameOrIdOrUrl }),
      () => apiClient.post(`/posts`, { username: usernameOrIdOrUrl })
    );
  }

  let lastError: unknown = null;

  for (const call of candidates) {
    try {
      const response = await call();
      const items = toRawItems(response.data);
      if (items.length > 0) {
        return items;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 0;
        if ([400, 404, 405, 422].includes(status)) {
          // This candidate shape is not supported by the provider; try the next one.
          lastError = null;
          continue;
        }
      }
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  return [];
}

/**
 * Fetch Instagram reels for a given username, user ID, or profile URL
 * @param usernameOrIdOrUrl - Instagram username, user ID, or profile URL
 * @returns Promise<InstagramReelsResponse>
 */
export async function fetchInstagramReels(
  usernameOrIdOrUrl: string
): Promise<InstagramReelsResponse> {
  try {
    const items = await callInstagramWithFallback(usernameOrIdOrUrl, "reels");
    return {
      data: {
        count: items.length,
        items: items as InstagramReelItem[],
      },
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 429) {
        return { data: { count: 0, items: [] } };
      }
      if (status === 503) {
        return { data: { count: 0, items: [] } };
      }
      if ([400, 404, 405, 422].includes(status || 0)) {
        return { data: { count: 0, items: [] } };
      }
    }
    console.error("Error fetching Instagram reels:", error);
    return { data: { count: 0, items: [] } };
  }
}

/**
 * Simplify reels data for easier consumption
 * @param reelsResponse - Raw Instagram reels response
 * @returns Array of simplified reel objects
 */
export function simplifyReelsData(
  reelsResponse: InstagramReelsResponse
): SimplifiedReel[] {
  return reelsResponse.data.items.map((reel: any) => {
    const captionText =
      (reel?.caption && typeof reel.caption === "object" ? reel.caption.text : "") ||
      "No caption";
    return {
      id: reel.id || String(reel.pk || reel.code || Math.random()),
      code: reel.code || String(reel.pk || reel.id || ""),
      videoUrl: pickBestVideoUrl(reel),
      thumbnailUrl: pickBestImageUrl(reel),
      postName: captionText,
      duration: reel.video_duration || 0,
      takenAt: normalizeDate(reel),
      likes: reel.like_count ?? 0,
      comments: reel.comment_count ?? 0,
      views: reel.play_count ?? reel.view_count ?? 0,
      username: reel.user?.username || reel.owner?.username || "",
    };
  });
}

/**
 * Get the top N reels by engagement (likes + comments)
 * @param reels - Array of simplified reels
 * @param topN - Number of top reels to return
 * @returns Array of top performing reels
 */
export function getTopReelsByEngagement(
  reels: SimplifiedReel[],
  topN: number = 3
): SimplifiedReel[] {
  return reels
    .sort((a, b) => b.likes + b.comments - (a.likes + a.comments))
    .slice(0, topN);
}

/**
 * Extract hashtags from reel caption
 * @param caption - Reel caption text
 * @returns Array of hashtags
 */
export function extractHashtags(caption: string): string[] {
  const hashtagRegex = /#[\w\u00C0-\u017F]+/g;
  const matches = caption.match(hashtagRegex);
  return matches ? matches.map((tag) => tag.substring(1)) : [];
}

// ============================================
// INSTAGRAM POSTS API
// ============================================

// Types for Instagram Posts API Response
export interface InstagramCarouselMedia {
  id: string;
  image_versions: {
    items: Array<{
      url: string;
      width: number;
      height: number;
    }>;
  };
  is_video: boolean;
  thumbnail_url: string;
}

export interface InstagramPostItem {
  id: string;
  code: string;
  caption: {
    text: string;
    created_at: number;
    hashtags: string[];
  } | null;
  image_versions: {
    items: Array<{
      url: string;
      width: number;
      height: number;
    }>;
  };
  thumbnail_url: string;
  media_type: number; // 1 = image, 2 = video, 8 = carousel
  media_format: string;
  carousel_media?: InstagramCarouselMedia[];
  carousel_media_count?: number;
  taken_at: number;
  taken_at_date: string;
  like_count: number;
  comment_count: number;
  user: {
    id: string;
    username: string;
    full_name: string;
    profile_pic_url: string;
  };
}

export interface InstagramPostsResponse {
  data: {
    count: number;
    items: InstagramPostItem[];
  };
}

export interface SimplifiedPost {
  id: string;
  code: string;
  mediaType: "image" | "carousel" | "video";
  imageUrl: string;
  thumbnailUrl: string;
  postName: string;
  takenAt: string;
  likes: number;
  comments: number;
  username: string;
  carouselMedia?: {
    id: string;
    imageUrl: string;
    thumbnailUrl: string;
    isVideo: boolean;
  }[];
  hashtags?: string[];
}

/**
 * Fetch Instagram posts for a given username, user ID, or profile URL
 * @param usernameOrIdOrUrl - Instagram username, user ID, or profile URL
 * @returns Promise<InstagramPostsResponse>
 */
export async function fetchInstagramPosts(
  usernameOrIdOrUrl: string
): Promise<InstagramPostsResponse> {
  try {
    const items = await callInstagramWithFallback(usernameOrIdOrUrl, "posts");
    return {
      data: {
        count: items.length,
        items: items as InstagramPostItem[],
      },
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 429) {
        return { data: { count: 0, items: [] } };
      }
      if (status === 503) {
        return { data: { count: 0, items: [] } };
      }
      if ([400, 404, 405, 422].includes(status || 0)) {
        return { data: { count: 0, items: [] } };
      }
    }
    console.error("Error fetching Instagram posts:", error);
    return { data: { count: 0, items: [] } };
  }
}

/**
 * Simplify posts data for easier consumption
 * @param postsResponse - Raw Instagram posts response
 * @returns Array of simplified post objects
 */
export function simplifyPostsData(
  postsResponse: InstagramPostsResponse
): SimplifiedPost[] {
  return postsResponse.data.items.map((post: any) => {
    // Determine media type
    let mediaType: "image" | "carousel" | "video" = "image";
    if (post.media_type === 8 || post.media_format === "album") {
      mediaType = "carousel";
    } else if (post.media_type === 2 || post.product_type === "clips") {
      mediaType = "video";
    }

    // Get best quality image URL
    const imageUrl = pickBestImageUrl(post);

    // Process carousel media if exists
    const carouselMedia = post.carousel_media?.map((item: any) => ({
      id: item.id,
      imageUrl: pickBestImageUrl(item),
      thumbnailUrl: item.thumbnail_url || pickBestImageUrl(item),
      isVideo: item.is_video,
    }));

    const captionText =
      (post?.caption && typeof post.caption === "object" ? post.caption.text : "") ||
      "No caption";

    return {
      id: post.id || String(post.pk || post.code || Math.random()),
      code: post.code || String(post.pk || post.id || ""),
      mediaType,
      imageUrl,
      thumbnailUrl: post.thumbnail_url || imageUrl,
      postName: captionText,
      takenAt: normalizeDate(post),
      likes: post.like_count ?? 0,
      comments: post.comment_count ?? 0,
      username: post.user?.username || post.owner?.username || "",
      carouselMedia,
      hashtags: post.caption?.hashtags || extractHashtags(captionText),
    };
  });
}

/**
 * Get the top N posts by engagement (likes + comments)
 * @param posts - Array of simplified posts
 * @param topN - Number of top posts to return
 * @returns Array of top performing posts
 */
export function getTopPostsByEngagement(
  posts: SimplifiedPost[],
  topN: number = 6
): SimplifiedPost[] {
  return posts
    .sort((a, b) => b.likes + b.comments - (a.likes + a.comments))
    .slice(0, topN);
}

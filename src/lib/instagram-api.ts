// Appel API avec gestion robuste des erreurs (404, 400, 405, 422)
async function callInstagramWithFallback(usernameOrIdOrUrl: string, type: "posts" | "reels"): Promise<any[]> {
  try {
    // RapidAPI attend un POST avec { username }
    const response = await apiClient.post(`/${type}`, { username: usernameOrIdOrUrl, maxId: "" });
    const items = toRawItems(response.data);
    return items;
  } catch (error: any) {
    // Si erreur 404, 400, 405, 422 : retourne tableau vide (pas d'exception bloquante)
    const status = error?.response?.status;
    if ([400, 404, 405, 422].includes(status)) {
      return [];
    }
    // Pour les autres erreurs, log et retourne vide
    console.error("Instagram fetch error:", error);
    return [];
  }
}
// Normaliseur universel pour tous les formats de réponse RapidAPI
function toRawItems(payload: any): any[] {
  // 1. Format direct (data.items ou items)
  const directItems = payload?.data?.items || payload?.items;
  if (Array.isArray(directItems) && directItems.length > 0) {
    return directItems.map((item: any) => item?.node?.media || item?.node || item);
  }

  // 2. Format edges (data.edges ou edges)
  const edgeItems =
    (payload?.data?.edges || payload?.edges || [])
      .map((edge: any) => edge?.node)
      .filter(Boolean);
  if (edgeItems.length > 0) {
    return edgeItems.map((item: any) => item?.media || item);
  }

  // 3. Format result.edges[].node ou result.edges[].node.media
  if (Array.isArray(payload?.result?.edges) && payload.result.edges.length > 0) {
    return payload.result.edges
      .map((edge: any) => edge?.node?.media || edge?.node)
      .filter(Boolean);
  }

  // 4. Format result.data.items, result.items, result.posts
  const nestedCandidates = [
    payload?.result?.data?.items,
    payload?.result?.items,
    payload?.result?.posts,
    payload?.result,
  ];
  for (const candidate of nestedCandidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      return candidate.map((item: any) => item?.node?.media || item?.node || item);
    }
  }

  // 5. Fallback vide
  return [];
}
import apiClient from "./api_client";

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

/**
 * Fetch Instagram reels for a given username, user ID, or profile URL
 * @param usernameOrIdOrUrl - Instagram username, user ID, or profile URL
 * @returns Promise<InstagramReelsResponse>
 */
export async function fetchInstagramReels(
  usernameOrIdOrUrl: string
): Promise<InstagramReelsResponse> {
  const items = await callInstagramWithFallback(usernameOrIdOrUrl, "reels");
  if (items.length === 0) {
    const posts = await callInstagramWithFallback(usernameOrIdOrUrl, "posts");
    return { data: { count: posts.length, items: posts } };
  }
  return { data: { count: items.length, items } };
}

/**
 * Simplify reels data for easier consumption
 * @param reelsResponse - Raw Instagram reels response
 * @returns Array of simplified reel objects
 */
export function simplifyReelsData(
  reelsResponse: InstagramReelsResponse
): SimplifiedReel[] {
  return reelsResponse.data.items.map((reel) => {
    // 1. Image: prioriser image_versions2.candidates
    let thumbnailUrl = '';
    if (reel.image_versions2 && Array.isArray(reel.image_versions2.candidates) && reel.image_versions2.candidates.length > 0) {
      thumbnailUrl = reel.image_versions2.candidates[0].url;
    }

    // 2. Caption: jamais le code, vide si absent, sinon texte ou 'No caption'
    let postName = "";
    if (reel.caption && typeof reel.caption === "object" && typeof reel.caption.text === "string") {
      postName = reel.caption.text.trim();
    } else if (typeof reel.caption === "string") {
      postName = reel.caption.trim();
    } else if (reel.title) {
      postName = reel.title;
    } else if (reel.name) {
      postName = reel.name;
    }
    // Si le caption est égal au code, ou vide, on affiche vide
    if (postName === reel.code) postName = "";
    if (!postName) postName = "No caption";

    // 3. Video URL
    let videoUrl = reel.video_url || reel.video || reel.media_url || (reel.video_versions?.[0]?.url) || "";

    // 4. Durée en secondes -> mm:ss
    let durationSec = reel.video_duration || reel.duration || 0;
    let duration = "";
    if (durationSec > 0) {
      const min = Math.floor(durationSec / 60);
      const sec = Math.floor(durationSec % 60);
      duration = `${min}:${sec.toString().padStart(2, "0")}`;
    } else {
      duration = "";
    }

    if (!thumbnailUrl || thumbnailUrl === "") {
      // Log si aucune image trouvée
      // eslint-disable-next-line no-console
      console.warn('Reel sans image, structure complète:', JSON.stringify(reel, null, 2));
    }
    if (!postName || postName === "No caption") {
      // Log si aucune caption trouvée
      // eslint-disable-next-line no-console
      console.warn('Reel sans caption, structure complète:', JSON.stringify(reel, null, 2));
    }
    if (!videoUrl && reel.media_type === 2) {
      // Log si aucune vidéo trouvée
      // eslint-disable-next-line no-console
      console.warn('Reel sans videoUrl, structure complète:', JSON.stringify(reel, null, 2));
    }
    return {
      id: reel.id,
      code: reel.code,
      videoUrl,
      thumbnailUrl,
      postName,
      duration,
      takenAt: reel.taken_at_date || reel.taken_at || "",
      likes: reel.like_count ?? reel.likes ?? 0,
      comments: reel.comment_count ?? reel.comments ?? 0,
      views: reel.play_count ?? reel.views ?? 0,
      username: reel.user?.username || reel.username || "",
    };
  });
}

    // 2. Caption: jamais le code, vide si absent, sinon texte ou 'No caption'
    let postName = "";
    if (reel.caption && typeof reel.caption === "object" && typeof reel.caption.text === "string") {
      postName = reel.caption.text.trim();
    } else if (typeof reel.caption === "string") {
      postName = reel.caption.trim();
    } else if (reel.title) {
      postName = reel.title;
    } else if (reel.name) {
      postName = reel.name;
    }
    // Si le caption est égal au code, ou vide, on affiche vide
    if (postName === reel.code) postName = "";
    if (!postName) postName = "No caption";

    // 3. Video URL
    let videoUrl = reel.video_url || reel.video || reel.media_url || (reel.video_versions?.[0]?.url) || "";

    // 4. Durée en secondes -> mm:ss
    let durationSec = reel.video_duration || reel.duration || 0;
    let duration = "";
    if (durationSec > 0) {
      const min = Math.floor(durationSec / 60);
      const sec = Math.floor(durationSec % 60);
      duration = `${min}:${sec.toString().padStart(2, "0")}`;
    } else {
      duration = "";
    }

    if (!thumbnailUrl || thumbnailUrl === "") {
      // Log si aucune image trouvée
      // eslint-disable-next-line no-console
      console.warn('Reel sans image, structure complète:', JSON.stringify(reel, null, 2));
    }
    if (!postName || postName === "No caption") {
      // Log si aucune caption trouvée
      // eslint-disable-next-line no-console
      console.warn('Reel sans caption, structure complète:', JSON.stringify(reel, null, 2));
    }
    if (!videoUrl && reel.media_type === 2) {
      // Log si aucune vidéo trouvée
      // eslint-disable-next-line no-console
      console.warn('Reel sans videoUrl, structure complète:', JSON.stringify(reel, null, 2));
    }
    return {
      id: reel.id,
      code: reel.code,
      videoUrl,
      thumbnailUrl,
      postName,
      duration,
      takenAt: reel.taken_at_date || reel.taken_at || "",
      likes: reel.like_count ?? reel.likes ?? 0,
      comments: reel.comment_count ?? reel.comments ?? 0,
      views: reel.play_count ?? reel.views ?? 0,
      username: reel.user?.username || reel.username || "",
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
  const items = await callInstagramWithFallback(usernameOrIdOrUrl, "posts");
  if (items.length === 0) {
    const reels = await callInstagramWithFallback(usernameOrIdOrUrl, "reels");
    return { data: { count: reels.length, items: reels } };
  }
  return { data: { count: items.length, items } };
}

/**
 * Simplify posts data for easier consumption
 * @param postsResponse - Raw Instagram posts response
 * @returns Array of simplified post objects
 */
export function simplifyPostsData(
  postsResponse: InstagramPostsResponse
): SimplifiedPost[] {
  return postsResponse.data.items.map((post) => {
    // Determine media type
    let mediaType: "image" | "carousel" | "video" = "image";
    if (post.media_type === 8 || post.media_format === "album") {
      mediaType = "carousel";
    } else if (post.media_type === 2) {
      mediaType = "video";
    }

    // Get best quality image URL (tous les fallback connus)
    let imageUrl =
      post.display_url ||
      post.image ||
      post.media_url ||
      post.thumbnail_url ||
      (post.image_versions?.items?.[0]?.url) ||
      (post.images?.standard_resolution?.url) ||
      (post.carousel_media?.[0]?.image_versions?.items?.[0]?.url) ||
      // Fallback pour image_versions2.candidates
      (post.image_versions2?.candidates?.[0]?.url) ||
      "";

    // Fallback pour vidéo : si media_type=2 et video_versions existe, prendre la première url vidéo
    if (!imageUrl && post.media_type === 2 && Array.isArray(post.video_versions) && post.video_versions.length > 0) {
      imageUrl = post.video_versions[0].url;
    }

    // Si toujours pas d'image, logguer tout le post pour analyse
    if (!imageUrl) {
      // eslint-disable-next-line no-console
      console.warn('Post sans image, structure complète:', JSON.stringify(post, null, 2));
      // Essayer de trouver une image dans tous les champs
      for (const key in post) {
        if (typeof post[key] === 'string' && post[key].includes('http')) {
          imageUrl = post[key];
          break;
        }
      }
      // Si toujours rien, image de secours
      if (!imageUrl) {
        imageUrl = "https://placehold.co/400x400?text=No+Image";
      }
    }

    // Caption ultra-robuste
    const postName = post.caption?.text || post.caption || post.title || post.name || "No caption";
    if (!postName || postName === "No caption") {
      // eslint-disable-next-line no-console
      console.warn('Post sans caption, structure complète:', JSON.stringify(post, null, 2));
    }

    // Process carousel media if exists
    const carouselMedia = post.carousel_media?.map((item) => ({
      id: item.id,
      imageUrl: item.image_versions?.items[0]?.url || item.thumbnail_url || "https://placehold.co/400x400?text=No+Image",
      thumbnailUrl: item.thumbnail_url || "https://placehold.co/400x400?text=No+Image",
      isVideo: item.is_video,
    }));

    return {
      id: post.id,
      code: post.code,
      mediaType,
      imageUrl,
      thumbnailUrl: post.thumbnail_url || "https://placehold.co/400x400?text=No+Image",
      postName,
      takenAt: post.taken_at_date || post.taken_at || "",
      likes: post.like_count ?? post.likes ?? 0,
      comments: post.comment_count ?? post.comments ?? 0,
      username: post.user?.username || post.username || "",
      carouselMedia,
      hashtags: post.caption?.hashtags || [],
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
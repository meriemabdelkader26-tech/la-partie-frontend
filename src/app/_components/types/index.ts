export type TInfluencer = {
  id: number;
  rank?: number;
  name: string;
  username?: string;
  category?: string;
  country?: string;
  followers?: number;
  followers_formatted?: string;
  engagement_rate?: number;
  similarity_score?: number;
  profile_pic?: string;
  profile_url?: string;
  is_realtime?: boolean;
  posts_count?: number;
  external_url?: string;
  biography?: string;
  is_verified?: boolean;
};

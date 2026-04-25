export type Category = {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  created?: string;
  modified?: string;
};

export type InstagramReel = {
  id: string;
  code: string;
  videoUrl: string;
  thumbnailUrl: string;
  postName: string;
  duration: number;
  takenAt: string;
  likes: number;
  comments: number;
  views: number;
  username: string;
  hashtags?: string[];
};

export type InstagramPost = {
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
};

export type Influencer = {
  id: string;
  user?: User;
  pseudo: string;
  instagramUsername: string;
  biography: string;
  localisation?: string;
  profileImage?: string;
  profilePicture?: string;
  images: ImageType[];
  disponibiliteCollaboration?: string;
  langues: string[];
  typeContenu: string[];
  reseauxSociaux: InfluencerReseauxSociaux[];
  selectedCategories: Category[];
  instagramPosts: InstagramPost[];
  instagramReels: InstagramReel[];
  statistiquesGlobales?: StatistiquesGlobalesInfluencer;
};

export type ImageType = {
  id: string;
  url: string;
  isDefault: boolean;
  isPublic: boolean;
};

export type StatistiquesGlobalesInfluencer = {
  croissanceMensuelle: number;
  engagementMoyenGlobal: number;
  followersTotaux: number;
};

export type InfluencerReseauxSociaux = {
  plateforme: string;
  nombreAbonnes: number;
  tauxEngagement: number;
  moyenneLikes: number;
  moyenneCommentaires?: number;
  frequencePublication?: string;
  urlProfil?: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  phoneNumber: string | null;
  phoneNumberVerified: boolean;
  emailVerified: boolean;
  verifiedAt: string | null;
  role: string;
  isVerifyByAdmin: boolean;
  isCompletedProfile: boolean;
  createdAt: string;
  updatedAt: string;
  influencerProfile?: {
    profilePicture?: string;
  };
};

export type Offer = {
  id: string;
  title: string;
  objectif: string;
  influencerNumber: number;
  minBudget: string;
  maxBudget: string;
  startDate: string;
  endDate: string;
  requirement: string;
  createdAt: string;
  isApplied?: boolean;
  isSaved?: boolean;
  applicationStatus?: string;
  applicationsCount?: number;
  approvedApplicationsCount?: number;
  createdBy: User;
  applications?: OfferApplication[];
};

export type OfferApplication = {
  id: string;
  user: User;
};

export interface RecommendedOffer {
  offer_id: number;
  title: string;
  score: number;
  semantic_score: number;
  category_match: number;
  budget_alignment: number;
  min_budget: number;
  max_budget: number;
  explanation: string;
}

export interface RecommendedInfluencer {
  influencer_id: number;
  name: string;
  pseudo: string;
  score: number;
  semantic_score: number;
  engagement_score: number;
  category_match: number;
  budget_alignment: number;
  followers: number;
  explanation: string;
}

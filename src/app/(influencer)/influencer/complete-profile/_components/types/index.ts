import { InstagramDataType } from "../schema";

export type ProfileFormData = {
  // Step 1
  instagramUsername: string;
  pseudo: string;
  instagramData: InstagramDataType | null;

  // Step 2
  biography: string;
  localisation: string;
  siteWeb: string;
  disponibiliteCollaboration: string;

  // Step 3
  langues: string[];
  typeContenu: string[];

  // Step 4
  reseauxSociaux: Array<{
    plateforme: string;
    urlProfil: string;
    nombreAbonnes: string;
    tauxEngagement: string;
    moyenneVues: string;
    moyenneLikes: string;
    moyenneCommentaires: string;
    frequencePublication: string;
  }>;

  // Step 5
  selectedCategories: string[];
  centresInteret: string[];

  // Step 6
  offresCollaboration: Array<{
    typeCollaboration: string;
    tarifMinimum: string;
    tarifMaximum: string;
    conditions: string;
  }>;

  // Step 7
  portfolioMedia: Array<{
    imageUrl: string;
    title: string;
    description: string;
    dateCreation: string;
  }>;
  selectedReels: Array<{
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
  }>;
  selectedPosts: Array<{
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
    carouselMedia?: Array<{
      id: string;
      imageUrl: string;
      thumbnailUrl: string;
      isVideo: boolean;
    }>;
    hashtags?: string[];
  }>;
  collaborations: Array<{
    nomMarque: string;
    campagne: string;
    periode: string;
    resultats: string;
    lienPublication: string;
  }>;

  // Step 8
  images: Array<{
    url: string;
    isDefault: boolean;
    isPublic: boolean;
  }>;
};

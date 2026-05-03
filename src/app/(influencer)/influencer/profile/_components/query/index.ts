import { Influencer } from "@/app/types";

export const QUERY = `
query MyInfluencerProfile {
  myInfluencerProfile {
    id
    disponibiliteCollaboration
    createdAt
    centresInteret
    biography
    profilePicture
    user {
      id
      name
      email
    }
    images {
      createdAt
      id
      isDefault
      isPublic
      url
    }
    instagramPosts {
      carouselMedia
      code
      createdAt
      comments
      hashtags
      id
      imageUrl
      instagramId
      likes
      mediaType
      postName
      takenAt
      thumbnailUrl
      updatedAt
      username
    }
    instagramReels {
      code
      comments
      createdAt
      duration
      hashtags
      videoUrl
      username
      updatedAt
      thumbnailUrl
      takenAt
      postName
      likes
      instagramId
      id
      views
    }
    instagramUsername
    langues
    localisation
    portfolioMedia {
      createdAt
      dateCreation
      description
      id
      imageUrl
      titre
      updatedAt
    }
    pseudo
    reseauxSociaux {
      createdAt
      id
      frequencePublication
      moyenneCommentaires
      moyenneLikes
      nombreAbonnes
      moyenneVues
      plateforme
      tauxEngagement
      updatedAt
      urlProfil
    }
    selectedCategories {
      created
      description
      id
      isActive
      modified
      name
    }
    siteWeb
    typeContenu
    statistiquesGlobales {
      followersTotaux
      engagementMoyenGlobal
      croissanceMensuelle
    }
    statistiquesHistorique {
      id
      followersTotaux
      engagementMoyenGlobal
      croissanceMensuelle
      mois
    }
  }
}
`;

export type DataType = {
  myInfluencerProfile: Influencer;
};

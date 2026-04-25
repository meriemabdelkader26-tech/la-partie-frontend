import { Influencer } from "@/app/types";

export const GET_INFLUENCER_BY_USER_QUERY = `
  query GetInfluencerByUser($userId: ID!) {
    influencerByUser(userId: $userId) {
      id
      pseudo
      instagramUsername
      biography
      localisation
      langues
      typeContenu
      disponibiliteCollaboration
      profilePicture
      images {
        id
        url
        isDefault
        isPublic
      }
      reseauxSociaux {
        plateforme
        nombreAbonnes
        tauxEngagement
        moyenneLikes
        moyenneCommentaires
        frequencePublication
        urlProfil
      }
      statistiquesGlobales {
        followersTotaux
        engagementMoyenGlobal
        croissanceMensuelle
      }
      selectedCategories {
        id
        name
      }
      instagramPosts {
        id
        code
        mediaType
        imageUrl
        thumbnailUrl
        postName
        takenAt
        likes
        comments
      }
      instagramReels {
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
      }
      user {
        id
        name
        email
        phoneNumber
        phoneNumberVerified
        emailVerified
        isVerifyByAdmin
        createdAt
      }
    }
  }
`;

export type InfluencerDetailDataType = {
  influencerByUser: Influencer;
};

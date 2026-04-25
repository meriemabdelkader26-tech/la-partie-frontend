import { Influencer } from "@/app/types";
import { gql } from "graphql-request";

export const GET_INFLUENCER_QUERY = gql`
  query GetInfluencer($id: ID!) {
    influencer(id: $id) {
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
  influencer: Influencer;
};

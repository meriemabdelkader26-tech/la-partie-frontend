import { gql } from "graphql-request";

export const GET_INFLUENCER_SETTINGS = gql`
  query GetInfluencerSettings {
    myInfluencerProfile {
      id
      user {
        id
        email
        name
        phoneNumber
      }
      biography
      siteWeb
      instagramUsername
      profilePicture
      images {
        id
        url
        isDefault
      }
      reseauxSociaux {
        id
        plateforme
        urlProfil
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($userId: ID!, $name: String, $phoneNumber: String) {
    updateUser(userId: $userId, name: $name, phoneNumber: $phoneNumber) {
      success
      message
      user {
        id
        name
        phoneNumber
      }
    }
  }
`;

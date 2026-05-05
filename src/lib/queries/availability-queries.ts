import { gql } from "graphql-request";

export const UPDATE_INFLUENCER_AVAILABILITY = gql`
  mutation UpdateInfluencerAvailability($disponibiliteCollaboration: DisponibiliteEnum!) {
    updateInfluencerAvailability(disponibiliteCollaboration: $disponibiliteCollaboration) {
      success
      message
      influencer {
        id
        disponibiliteCollaboration
      }
    }
  }
`;

export const UPDATE_COMPANY_AVAILABILITY = gql`
  mutation UpdateCompanyAvailability($disponibiliteCollaboration: String!) {
    updateCompanyAvailability(disponibiliteCollaboration: $disponibiliteCollaboration) {
      success
      message
      company {
        id
        disponibiliteCollaboration
      }
    }
  }
`;

export const GET_MY_AVAILABILITY = gql`
  query GetMyAvailability {
    myInfluencerProfile {
      disponibiliteCollaboration
    }
    myCompanyProfile {
      disponibiliteCollaboration
    }
  }
`;

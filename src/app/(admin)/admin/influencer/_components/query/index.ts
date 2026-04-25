import { Influencer } from "@/app/types";

export const QUERY = `
query allInfluencers($offset: Int, $first: Int, $ordering: String, $userName: String, $disponibiliteCollaboration: String, $maxEngagement: Decimal, $maxFollowers: Decimal) {
  allInfluencers(
    offset: $offset
    first: $first
    ordering: $ordering
    maxEngagement: $maxEngagement
    maxFollowers: $maxFollowers
    userName: $userName
    disponibiliteCollaboration: $disponibiliteCollaboration
  ) {
    edges {
      node {
        id
        user {
          id
          name
        }
        profilePicture
        images {
          id
          isDefault
          isPublic
          url
        }
        localisation
        statistiquesGlobales {
          croissanceMensuelle
          engagementMoyenGlobal
          followersTotaux
        }
      }
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
`;

export type DataType = {
  allInfluencers: {
    edges: {
      node: Influencer;
    }[];
    totalCount: number;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
};
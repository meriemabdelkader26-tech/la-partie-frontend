import { Offer } from "@/app/types";
import { OfferApplication } from "../types";

export const QUERY = `
query offer($id: ID!) {
  offer(id: $id) {
    id
    createdAt
    createdBy {
      name
      id
      email
    }
    influencerNumber
    maxBudget
    minBudget
    requirement
    startDate
    title
    objectif
    endDate
    applications {
      id
      user {
        id
        name
      }
    }
  }
}
`;
export const QUERY_APPLICATION_FOR_OFFER = `
query applicationsForOffer($offerId: ID!, $first: Int, $offset: Int, $ordering: String) {
  applicationsForOffer(
    offerIdCustom: $offerId
    first: $first
    offset: $offset
    ordering: $ordering
  ) {
    edges {
      node {
        id
        status
        reviewedBy {
          name
          role
        }
        isApproved
        isPending
        isRejected
        proposal
        id
        adminNotes
        user {
          name
          email
        }
        deliveryDays
        submittedAt
        canEdit
        askingPrice
        estimatedReach
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    totalCount
    pendingCount
    approvedCount
    rejectedCount
  }
}
`;

export type DataType = {
  offer: Offer;
};

export type ApplicationDataType = {
  applicationsForOffer: {
    edges: {
      node: OfferApplication;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    totalCount: number;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
  };
};
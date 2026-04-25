import { Offer } from "@/app/types";

export const QUERY = `
query allOffers($first: Int, $offset: Int, $maxBudget: Decimal, $minBudget: Decimal, $ordering: String, $startDate: Date, $title: String, $endDate: Date) {
  allOffers(
    maxBudget: $maxBudget
    minBudget: $minBudget
    offset: $offset
    first: $first
    ordering: $ordering
    startDate: $startDate
    title: $title
    endDate: $endDate
  ) {
    edges {
      node {
        id
        influencerNumber
        maxBudget
        minBudget
        objectif
        startDate
        requirement
        title
        endDate
        createdAt
        isApplied
        isSaved
        applicationStatus
        createdBy {
          email
          id
          name
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

export const GET_SAVED_OFFERS = `
query savedOffers($first: Int, $offset: Int) {
  savedOffers(first: $first, offset: $offset) {
    edges {
      node {
        id
        influencerNumber
        maxBudget
        minBudget
        objectif
        startDate
        requirement
        title
        endDate
        createdAt
        isApplied
        isSaved
        applicationStatus
        createdBy {
          email
          id
          name
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
  allOffers: {
    edges: {
      node: Offer;
    }[];
    totalCount: number;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  savedOffers?: {
    edges: {
      node: Offer;
    }[];
    totalCount: number;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
};

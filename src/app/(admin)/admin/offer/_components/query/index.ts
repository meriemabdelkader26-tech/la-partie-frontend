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
};
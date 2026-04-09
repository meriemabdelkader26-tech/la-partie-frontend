import { Offer } from "@/app/types";

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
export type DataType = {
  offer: Offer;
};

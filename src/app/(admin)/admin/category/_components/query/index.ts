import { Category } from "@/app/types";

export const QUERY = `
query allCategories($isActive: Boolean, $offset: Int, $first: Int, $orderBy: String, $nameIstartswith: String) {
  allCategories(
    isActive: $isActive
    offset: $offset
    first: $first
    name_Icontains: $nameIstartswith
    ordering: $orderBy
  ) {
    edges {
      node {
        id
        name
        description
        isActive
        created
        modified
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    totalCount
  }
}
`;

export type DataType = {
  allCategories: {
    edges: Array<{
      node: Category;
    }>;
    pageInfo: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
    totalCount: number;
  };
};
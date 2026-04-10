import { User } from "@/app/types";

export const QUERY = `
query AllUsers($first: Int, $offset: Int, $role: UserRoleEnum, $nameIcontains: String, $emailIcontains: String, $isActive: Boolean, $isBanned: Boolean, $orderBy: String, $isVerifyByAdmin: Boolean) {
  allUsers(
    role: $role
    ordering: $orderBy
    offset: $offset
    name_Icontains: $nameIcontains
    isBanned: $isBanned
    isActive: $isActive
    first: $first
    email_Icontains: $emailIcontains
    isVerifyByAdmin: $isVerifyByAdmin
  ) {
    edges {
      node {
        id
        email
        name
        phoneNumber
        phoneNumberVerified
        emailVerified
        verifiedAt
        role
        isVerifyByAdmin
        isCompletedProfile
        createdAt
        updatedAt
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
  allUsers: {
    edges: Array<{
      node: User;
    }>;
    pageInfo: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
    totalCount: number;
  };
};
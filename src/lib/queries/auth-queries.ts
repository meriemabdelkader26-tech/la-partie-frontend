import { gql } from "graphql-request";

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
      success
      message
    }
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId) {
      success
      message
    }
  }
`;

export const UPDATE_EMAIL = gql`
  mutation UpdateUserEmail($userId: ID!, $email: String!) {
    updateUser(userId: $userId, email: $email) {
      success
      message
      user {
        id
        email
      }
    }
  }
`;

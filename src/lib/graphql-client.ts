import { NEXT_PUBLIC_API_URL } from "@/config";
import { GraphQLClient } from "graphql-request";
import Cookies from "js-cookie";

// Function to get headers dynamically
const getHeaders = () => {
  const token = Cookies.get("access_token") || Cookies.get("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers.Authorization = `JWT ${token}`;
  }

  return headers;
};

// Create client without initial headers
export const graphqlClient = new GraphQLClient(NEXT_PUBLIC_API_URL, {
  credentials: "include",
});

// Override the request method to include dynamic headers on each request
const originalRequest = graphqlClient.request.bind(graphqlClient);
graphqlClient.request = <T = any>(
  document: any,
  variables?: any,
  requestHeaders?: any
): Promise<T> => {
  // Get fresh headers on each request
  const headers = {
    ...getHeaders(),
    ...requestHeaders,
  };
  return originalRequest(document, variables, headers);
};

// Helper function to handle common GraphQL errors
export function handleGraphQLError(error: any): Error {
  if (error.response && error.response.errors) {
    const firstError = error.response.errors[0];
    return new Error(
      firstError.message || "Error occurred during GraphQL request"
    );
  }
  return error;
}

// Type for common response patterns
export interface GraphQLErrorResponse {
  errors?: Array<{ message: string }>;
}

// Wrapper function for GraphQL requests with error handling
export const graphql = {
  request: async <T = any>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> => {
    try {
      return await graphqlClient.request<T>(query, variables);
    } catch (error) {
      throw handleGraphQLError(error);
    }
  },
};

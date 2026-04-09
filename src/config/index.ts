export const NODE_ENV: string = process.env.NODE_ENV || "development";
export const NEXT_PUBLIC_API_URL: string =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/graphql";

export const NEXT_PUBLIC_BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000/";

export const NEXT_PUBLIC_API_INSTAGRAM: string =
  process.env.NEXT_PUBLIC_API_INSTAGRAM || "";

export const NEXT_PUBLIC_API_HEADER_X_RAPIDAPI_KEY: string =
  process.env.NEXT_PUBLIC_API_HEADER_X_RAPIDAPI_KEY || "";

export const NEXT_PUBLIC_API_HEADER_X_RAPIDAPI_HOST: string =
  process.env.NEXT_PUBLIC_API_HEADER_X_RAPIDAPI_HOST || "";

export const NEXT_PUBLIC_RECOMMENDATION =
  "api/recommend/?category=Unknown&country=USA&n=15";

export const COOKIE_TOKEN_KEY = "token";
export const COOKIE_REFRESH_TOKEN_KEY = "refreshToken";
export const COOKIE_USER_ROLE_KEY = "userRole";
export const COOKIE_IS_STAFF_KEY = "isStaff";

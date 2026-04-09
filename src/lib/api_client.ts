import {
  NEXT_PUBLIC_API_HEADER_X_RAPIDAPI_HOST,
  NEXT_PUBLIC_API_HEADER_X_RAPIDAPI_KEY,
  NEXT_PUBLIC_API_INSTAGRAM,
} from "@/config";
import axios from "axios";

const normalizedInstagramBaseURL = NEXT_PUBLIC_API_INSTAGRAM
  ? NEXT_PUBLIC_API_INSTAGRAM.replace(/\/+$/, "").replace(/\/userInfo$/, "")
  : "";

// Create a custom Axios instance with the base URL
const apiClient = axios.create({
  baseURL: normalizedInstagramBaseURL,
  headers: {
    "Content-Type": "application/json",
    "x-rapidapi-key": NEXT_PUBLIC_API_HEADER_X_RAPIDAPI_KEY,
    "x-rapidapi-host": NEXT_PUBLIC_API_HEADER_X_RAPIDAPI_HOST,
  },
  withCredentials: true,
});

export default apiClient;

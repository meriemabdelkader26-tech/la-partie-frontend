import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { NEXT_PUBLIC_BASE_URL } from "@/config";
import Cookies from "js-cookie";
import { COOKIE_TOKEN_KEY } from "@/config";

export interface RecommendedOffer {
  offer_id: number;
  title: string;
  objectif: string;
  requirement: string;
  score: number;
  semantic_score: number;
  category_match: number;
  budget_alignment: number;
  min_budget: number;
  max_budget: number;
  end_date: string;
  influencer_number: number;
  created_by_name: string;
  explanation: string;
}

export interface RecommendedInfluencer {
  influencer_id: number;
  name: string;
  pseudo: string;
  score: number;
  semantic_score: number;
  engagement_score: number;
  category_match: number;
  budget_alignment: number;
  followers: number;
  explanation: string;
}

export function usePersonalizedOffers(influencerId?: number) {
  const token = Cookies.get(COOKIE_TOKEN_KEY);

  return useQuery({
    queryKey: ["personalized-offers", influencerId],
    queryFn: async () => {
      const url = influencerId 
        ? `${NEXT_PUBLIC_BASE_URL}api/recommend/offers/${influencerId}/`
        : `${NEXT_PUBLIC_BASE_URL}api/recommend/offers/`;
      
      const response = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return response.data.recommendations as RecommendedOffer[];
    },
    enabled: true, // Fetch even without ID, backend will try to get from token
  });
}

export function useOfferRecommendations(offerId: number) {
  const token = Cookies.get(COOKIE_TOKEN_KEY);

  return useQuery({
    queryKey: ["offer-recommendations", offerId],
    queryFn: async () => {
      const response = await axios.get(
        `${NEXT_PUBLIC_BASE_URL}api/recommend/influencers/${offerId}/`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      return response.data.recommendations as RecommendedInfluencer[];
    },
    enabled: !!offerId,
  });
}

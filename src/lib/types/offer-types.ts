/**
 * Types TypeScript pour les Offers (Campagnes)
 * Ces types correspondent au schema GraphQL du backend
 */

import { User } from "./admin-types";

// ============================================
// ENUMS
// ============================================

export enum ApplicationStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  WITHDRAW = "Withdraw",
}

export enum PaymentStatus {
  UNPAID = "Unpaid",
  IN_ESCROW = "InEscrow",
  RELEASED = "Released",
  REFUNDED = "Refunded",
}

// ============================================
// OFFER TYPE
// ============================================

export interface Offer {
  id: string;
  title: string;
  minBudget: number;
  maxBudget: number;
  startDate: string;
  endDate: string;
  influencerNumber: number;
  requirement: string;
  objectif: string;
  createdAt: string;
  createdBy: User;
  applications?: OfferApplication[];
  applicationsCount?: number;
}

// ============================================
// OFFER APPLICATION TYPE
// ============================================

export interface OfferApplication {
  id: string;
  offer: Offer;
  user: User;
  proposal: string;
  askingPrice: number;
  status: ApplicationStatus;
  paymentStatus?: PaymentStatus | string;
  submittedAt: string;
}

// ============================================
// RELAY CONNECTION TYPES
// ============================================

export interface OfferEdge {
  node: Offer;
  cursor: string;
}

export interface OfferConnection {
  edges: OfferEdge[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  totalCount?: number;
}

// ============================================
// QUERY RESPONSE TYPES
// ============================================

export interface GetOfferResponse {
  offer: Offer;
}

export interface GetAllOffersResponse {
  allOffers: OfferConnection;
}

export interface GetMyOffersResponse {
  myOffers: OfferConnection;
}

export interface GetOfferApplicationsResponse {
  offerApplications: OfferApplication[];
}

export interface GetMyApplicationsResponse {
  myApplications: OfferApplication[];
}

// ============================================
// QUERY VARIABLES TYPES
// ============================================

export interface GetOfferVariables {
  id: string;
}

export interface GetAllOffersVariables {
  first?: number;
  after?: string;
  before?: string;
  minBudget?: number;
  maxBudget?: number;
  startDateAfter?: string;
  endDateBefore?: string;
  createdBy?: string;
}

export interface GetOfferApplicationsVariables {
  offerId: string;
  status?: ApplicationStatus;
}

export interface GetMyApplicationsVariables {
  status?: ApplicationStatus;
}

// ============================================
// MUTATION INPUT TYPES
// ============================================

export interface CreateOfferInput {
  title: string;
  minBudget: number;
  maxBudget: number;
  startDate: string;
  endDate: string;
  influencerNumber: number;
  requirement: string;
  objectif: string;
}

export interface UpdateOfferInput {
  id: string;
  title?: string;
  minBudget?: number;
  maxBudget?: number;
  startDate?: string;
  endDate?: string;
  influencerNumber?: number;
  requirement?: string;
  objectif?: string;
}

export interface CreateOfferApplicationInput {
  offerId: string;
  proposal: string;
  askingPrice: number;
}

export interface UpdateApplicationStatusInput {
  applicationId: string;
  status: ApplicationStatus;
}

// ============================================
// MUTATION RESPONSE TYPES
// ============================================

export interface CreateOfferResponse {
  createOffer: {
    success: boolean;
    message: string;
    offer?: Offer;
    errors?: string[];
  };
}

export interface UpdateOfferResponse {
  updateOffer: {
    success: boolean;
    message: string;
    offer?: Offer;
    errors?: string[];
  };
}

export interface DeleteOfferResponse {
  deleteOffer: {
    success: boolean;
    message: string;
    errors?: string[];
  };
}

export interface CreateOfferApplicationResponse {
  createOfferApplication: {
    success: boolean;
    message: string;
    application?: OfferApplication;
    errors?: string[];
  };
}

export interface UpdateApplicationStatusResponse {
  updateApplicationStatus: {
    success: boolean;
    message: string;
    application?: OfferApplication;
    errors?: string[];
  };
}

export interface MarkApplicationPaymentEscrowResponse {
  markApplicationPaymentEscrow: {
    ok: boolean;
    application?: OfferApplication;
  };
}

export interface CreateApplicationCheckoutSessionResponse {
  createApplicationCheckoutSession: {
    ok: boolean;
    checkout?: {
      sessionId: string;
      checkoutUrl: string;
    };
  };
}

export interface ReleaseApplicationPaymentResponse {
  releaseApplicationPayment: {
    ok: boolean;
    application?: OfferApplication;
  };
}

export interface RefundApplicationPaymentResponse {
  refundApplicationPayment: {
    ok: boolean;
    application?: OfferApplication;
  };
}

export interface WithdrawApplicationResponse {
  withdrawApplication: {
    success: boolean;
    message: string;
    errors?: string[];
  };
}

// ============================================
// DASHBOARD STATS TYPES
// ============================================

export interface CompanyDashboardStats {
  totalOffers: number;
  activeOffers: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  recentOffers: Offer[];
  recentApplications: OfferApplication[];
}

export interface GetCompanyDashboardStatsResponse {
  companyDashboardStats: CompanyDashboardStats;
}

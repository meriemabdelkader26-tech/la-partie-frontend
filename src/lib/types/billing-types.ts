export interface BillingStatus {
  id: string;
  role: string;
  billingPlan: "FREE" | "PLUS" | "PRO" | string;
  billingSubscriptionStatus: string;
  billingPeriodStart?: string | null;
  billingPeriodEnd?: string | null;
  campaignsUsed?: number | null;
  campaignsLimit?: number | null;
  campaignsRemaining?: number | null;
  applicationsUsed?: number | null;
  applicationsLimit?: number | null;
  applicationsRemaining?: number | null;
  canCreateCampaign: boolean;
  canApplyToCampaign: boolean;
  hasActivePaidPlan: boolean;
}

export interface GetMyBillingStatusResponse {
  me: BillingStatus | null;
}

export interface CreatePlatformSubscriptionCheckoutSessionResponse {
  createPlatformSubscriptionCheckoutSession: {
    ok: boolean;
    message: string;
    checkout?: {
      sessionId: string;
      checkoutUrl: string;
    } | null;
  };
}

export interface CreateBillingPortalSessionResponse {
  createBillingPortalSession: {
    ok: boolean;
    message: string;
    portal?: {
      portalUrl: string;
    } | null;
  };
}

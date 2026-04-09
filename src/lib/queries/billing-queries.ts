import { gql } from "graphql-request";

export const GET_MY_BILLING_STATUS = gql`
  query GetMyBillingStatus {
    me {
      id
      role
      billingPlan
      billingSubscriptionStatus
      billingPeriodStart
      billingPeriodEnd
      campaignsUsed
      campaignsLimit
      campaignsRemaining
      applicationsUsed
      applicationsLimit
      applicationsRemaining
      canCreateCampaign
      canApplyToCampaign
      hasActivePaidPlan
    }
  }
`;

export const CREATE_PLATFORM_SUBSCRIPTION_CHECKOUT_SESSION = gql`
  mutation CreatePlatformSubscriptionCheckoutSession($plan: String!) {
    createPlatformSubscriptionCheckoutSession(plan: $plan) {
      ok
      message
      checkout {
        sessionId
        checkoutUrl
      }
    }
  }
`;

export const CREATE_BILLING_PORTAL_SESSION = gql`
  mutation CreateBillingPortalSession {
    createBillingPortalSession {
      ok
      message
      portal {
        portalUrl
      }
    }
  }
`;

import { gql } from "graphql-request";

// ============================================
// OFFER QUERIES
// ============================================

// Query pour récupérer une offre spécifique
export const GET_OFFER = gql`
  query GetOffer($id: ID!) {
    offer(id: $id) {
      id
      title
      minBudget
      maxBudget
      startDate
      endDate
      influencerNumber
      requirement
      objectif
      createdAt
      createdBy {
        id
        email
        name
        role
      }
      applications {
        id
        user {
          id
          name
          email
        }
        proposal
        askingPrice
        status
        submittedAt
      }
    }
  }
`;

// Query pour récupérer toutes les offres avec pagination
export const GET_ALL_OFFERS = gql`
  query GetAllOffers(
    $first: Int
    $after: String
    $before: String
    $minBudget: Decimal
    $maxBudget: Decimal
    $startDate: Date
    $endDate: Date
    $createdBy: ID
  ) {
    allOffers(
      first: $first
      after: $after
      before: $before
      minBudget: $minBudget
      maxBudget: $maxBudget
      startDate: $startDate
      endDate: $endDate
      createdBy: $createdBy
    ) {
      edges {
        node {
          id
          title
          minBudget
          maxBudget
          startDate
          endDate
          influencerNumber
          requirement
          objectif
          createdAt
          createdBy {
            id
            name
            email
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

// Query pour récupérer les offres créées par l'utilisateur connecté
export const GET_MY_OFFERS = gql`
  query GetMyOffers {
    myOffers {
      edges {
        node {
          id
          title
          minBudget
          maxBudget
          startDate
          endDate
          influencerNumber
          requirement
          objectif
          createdAt
          applications {
            id
            status
            submittedAt
            user {
              id
              name
              email
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

// Query pour récupérer les applications d'une offre spécifique
export const GET_OFFER_APPLICATIONS = gql`
  query GetOfferApplications($offerId: ID!, $status: String) {
    offerApplications(offerId: $offerId, status: $status) {
      id
      offer {
        id
        title
      }
      user {
        id
        name
        email
        phoneNumber
      }
      proposal
      askingPrice
      status
      submittedAt
    }
  }
`;

// Query pour récupérer les applications de l'utilisateur connecté
export const GET_MY_APPLICATIONS = gql`
  query GetMyApplications($status: String) {
    myApplications(status: $status) {
      edges {
        node {
          id
          offer {
            id
            title
            minBudget
            maxBudget
            startDate
            endDate
            createdBy {
              id
              name
            }
          }
          proposal
          askingPrice
          status
          paymentStatus
          rejectionReason
          submittedAt
          releasedAt
        }
      }
    }
  }
`;

// Query pour récupérer les statistiques du dashboard company
export const GET_COMPANY_DASHBOARD_STATS = gql`
  query GetCompanyDashboardStats {
    companyDashboardStats {
      totalOffers
      activeOffers
      totalApplications
      pendingApplications
      approvedApplications
      rejectedApplications
      recentOffers {
        id
        title
        minBudget
        maxBudget
        startDate
        endDate
        influencerNumber
        createdAt
      }
      recentApplications {
        id
        offer {
          id
          title
        }
        user {
          id
          name
          email
        }
        status
        paymentStatus
        askingPrice
        submittedAt
      }
    }
  }
`;

// Query pour récupérer les statistiques du dashboard influencer
export const GET_INFLUENCER_DASHBOARD_STATS = gql`
  query GetInfluencerDashboardStats {
    influencerDashboardStats {
      totalCampaigns
      activeCampaigns
      totalEarnings
      pendingEarnings
      availableBalance
      totalReach
      avgEngagement
      monthlyEarnings
      recentApplications {
        id
        offer {
          id
          title
          createdBy {
            name
          }
        }
        status
        paymentStatus
        askingPrice
        submittedAt
      }
    }
  }
`;

export const CREATE_APPLICATION_CHECKOUT_SESSION = gql`
  mutation CreateApplicationCheckoutSession($applicationId: ID!) {
    createApplicationCheckoutSession(applicationId: $applicationId) {
      ok
      checkout {
        sessionId
        checkoutUrl
      }
    }
  }
`;

export const MARK_APPLICATION_PAYMENT_ESCROW = gql`
  mutation MarkApplicationPaymentEscrow($applicationId: ID!, $paymentReference: String) {
    markApplicationPaymentEscrow(applicationId: $applicationId, paymentReference: $paymentReference) {
      ok
      application {
        id
        status
        paymentStatus
      }
    }
  }
`;

export const RELEASE_APPLICATION_PAYMENT = gql`
  mutation ReleaseApplicationPayment($applicationId: ID!) {
    releaseApplicationPayment(applicationId: $applicationId) {
      ok
      application {
        id
        status
        paymentStatus
      }
    }
  }
`;

export const REFUND_APPLICATION_PAYMENT = gql`
  mutation RefundApplicationPayment($applicationId: ID!) {
    refundApplicationPayment(applicationId: $applicationId) {
      ok
      application {
        id
        status
        paymentStatus
      }
    }
  }
`;

// ============================================
// OFFER MUTATIONS
// ============================================

// Mutation pour créer une offre
export const CREATE_OFFER = gql`
  mutation CreateOffer(
    $title: String!
    $minBudget: Float!
    $maxBudget: Float!
    $startDate: Date!
    $endDate: Date!
    $influencerNumber: Int!
    $requirement: String!
    $objectif: String!
  ) {
    createOffer(
      title: $title
      minBudget: $minBudget
      maxBudget: $maxBudget
      startDate: $startDate
      endDate: $endDate
      influencerNumber: $influencerNumber
      requirement: $requirement
      objectif: $objectif
    ) {
      success
      message
      errors
      offer {
        id
        title
        minBudget
        maxBudget
        startDate
        endDate
        influencerNumber
        requirement
        objectif
        createdAt
        createdBy {
          id
          name
          email
        }
      }
    }
  }
`;

// Mutation pour mettre à jour une offre
export const UPDATE_OFFER = gql`
  mutation UpdateOffer(
    $id: ID!
    $title: String
    $minBudget: Float
    $maxBudget: Float
    $startDate: Date
    $endDate: Date
    $influencerNumber: Int
    $requirement: String
    $objectif: String
  ) {
    updateOffer(
      id: $id
      title: $title
      minBudget: $minBudget
      maxBudget: $maxBudget
      startDate: $startDate
      endDate: $endDate
      influencerNumber: $influencerNumber
      requirement: $requirement
      objectif: $objectif
    ) {
      success
      message
      offer {
        id
        title
        minBudget
        maxBudget
        startDate
        endDate
        influencerNumber
        requirement
        objectif
        createdAt
      }
    }
  }
`;

// Mutation pour supprimer une offre
export const DELETE_OFFER = gql`
  mutation DeleteOffer($id: ID!) {
    deleteOffer(id: $id) {
      success
      message
    }
  }
`;

// Mutation pour créer une application à une offre
export const CREATE_OFFER_APPLICATION = gql`
  mutation CreateOfferApplication(
    $offerId: ID!
    $proposal: String!
    $askingPrice: Float!
  ) {
    createOfferApplication(
      offerId: $offerId
      proposal: $proposal
      askingPrice: $askingPrice
    ) {
      success
      message
      errors
      application {
        id
        offer {
          id
          title
        }
        user {
          id
          name
          email
        }
        proposal
        askingPrice
        status
        submittedAt
      }
    }
  }
`;

// Mutation pour mettre à jour le statut d'une application
export const UPDATE_APPLICATION_STATUS = gql`
  mutation UpdateApplicationStatus($applicationId: ID!, $status: String!) {
    updateOfferApplicationStatus(applicationId: $applicationId, status: $status) {
      ok
      application {
        id
        status
      }
    }
  }
`;

// Mutation pour approuver une application
export const APPROVE_APPLICATION = gql`
  mutation ApproveApplication($applicationId: ID!) {
    updateOfferApplicationStatus(applicationId: $applicationId, status: "Approved") {
      ok
      application {
        id
        status
      }
    }
  }
`;

// Mutation pour rejeter une application
export const REJECT_APPLICATION = gql`
  mutation RejectApplication($applicationId: ID!) {
    updateOfferApplicationStatus(applicationId: $applicationId, status: "Rejected") {
      ok
      application {
        id
        status
      }
    }
  }
`;

// Mutation pour retirer une application
export const WITHDRAW_APPLICATION = gql`
  mutation WithdrawApplication($applicationId: ID!) {
    withdrawApplication(applicationId: $applicationId) {
      success
      message
      errors
    }
  }
`;

export const DECLINE_OFFER_OPPORTUNITY = gql`
  mutation DeclineOfferOpportunity($offerId: ID!, $reason: String) {
    declineOfferOpportunity(offerId: $offerId, reason: $reason) {
      success
      message
      errors
      application {
        id
        status
      }
    }
  }
`;

export const GET_MY_PAYMENT_METHODS = gql`
  query GetMyPaymentMethods {
    myPaymentMethods {
      id
      methodType
      label
      details
      isPrimary
      isActive
      createdAt
    }
  }
`;

export const GET_MY_PAYOUT_REQUESTS = gql`
  query GetMyPayoutRequests {
    myPayoutRequests {
      id
      amount
      status
      requestedAt
      processedAt
      notes
      paymentMethod {
        id
        methodType
        label
        details
        isPrimary
      }
    }
  }
`;

export const ADD_PAYMENT_METHOD = gql`
  mutation AddPaymentMethod(
    $methodType: String!
    $label: String!
    $details: String!
    $isPrimary: Boolean
  ) {
    addPaymentMethod(
      methodType: $methodType
      label: $label
      details: $details
      isPrimary: $isPrimary
    ) {
      success
      message
      errors
      paymentMethod {
        id
        methodType
        label
        details
        isPrimary
      }
    }
  }
`;

export const CREATE_PAYOUT_REQUEST = gql`
  mutation CreatePayoutRequest(
    $amount: Float!
    $paymentMethodId: ID
    $notes: String
  ) {
    createPayoutRequest(
      amount: $amount
      paymentMethodId: $paymentMethodId
      notes: $notes
    ) {
      success
      message
      errors
      availableBalance
      payoutRequest {
        id
        amount
        status
        requestedAt
      }
    }
  }
`;

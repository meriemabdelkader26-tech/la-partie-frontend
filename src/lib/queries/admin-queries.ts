import { gql } from "graphql-request";

// Query pour récupérer tous les utilisateurs
export const GET_ALL_USERS = gql`
  query GetAllUsers(
    $emailIcontains: String
    $nameIcontains: String
    $role: String
    $emailVerified: Boolean
    $isActive: Boolean
    $isStaff: Boolean
    $isBanned: Boolean
    $orderBy: String
    $first: Int
    $after: String
  ) {
    allUsers(
      emailIcontains: $emailIcontains
      nameIcontains: $nameIcontains
      role: $role
      emailVerified: $emailVerified
      isActive: $isActive
      isStaff: $isStaff
      isBanned: $isBanned
      orderBy: $orderBy
      first: $first
      after: $after
    ) {
      edges {
        node {
          id
          email
          name
          phoneNumber
          role
          emailVerified
          phoneNumberVerified
          isActive
          isBanned
          isStaff
          createdAt
          updatedAt
          isCompletedProfile
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

// Query pour récupérer tous les influenceurs
export const GET_ALL_INFLUENCERS = gql`
  query GetAllInfluencers(
    $localisation: String
    $disponibiliteCollaboration: String
    $minFollowers: Decimal
    $first: Int
    $after: String
  ) {
    allInfluencers(
      localisation: $localisation
      disponibiliteCollaboration: $disponibiliteCollaboration
      minFollowers: $minFollowers
      first: $first
      after: $after
    ) {
      edges {
        node {
          id
          pseudo
          instagramUsername
          biography
          localisation
          disponibiliteCollaboration
          createdAt
          updatedAt
          user {
            id
            email
            name
            isActive
            emailVerified
          }
          selectedCategories {
            id
            name
          }
          images {
            id
            url
            isDefault
          }
          instagramData
          statistiquesGlobales {
            followersTotaux
            engagementMoyenGlobal
            croissanceMensuelle
          }
        }
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

// Query pour récupérer les statistiques du dashboard
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    allUsers {
      totalCount
      edges {
        node {
          id
          role
          isActive
          emailVerified
          isCompletedProfile
          createdAt
        }
      }
    }
    allInfluencers {
      totalCount
      edges {
        node {
          id
          createdAt
          user {
            emailVerified
          }
        }
      }
    }
    allCategories {
      totalCount
      edges {
        node {
          id
          isActive
        }
      }
    }
    allOffers {
      totalCount
      edges {
        node {
          id
          startDate
          endDate
          createdAt
        }
      }
    }
    allOfferApplications {
      totalCount
      pendingCount
      approvedCount
      rejectedCount
      edges {
        node {
          id
          submittedAt
          status
        }
      }
    }
    companiesCount
  }
`;

// Query pour récupérer un utilisateur spécifique
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email
      name
      phoneNumber
      role
      emailVerified
      phoneNumberVerified
      isActive
      isBanned
      isStaff
      isSuperuser
      createdAt
      updatedAt
      isCompletedProfile
      influencerProfile {
        id
        pseudo
        instagramUsername
      }
    }
  }
`;

// Query pour récupérer un influenceur spécifique
export const GET_INFLUENCER = gql`
  query GetInfluencer($id: ID!) {
    influencer(id: $id) {
      id
      pseudo
      instagramUsername
      biography
      siteWeb
      localisation
      disponibiliteCollaboration
      langues
      centresInteret
      typeContenu
      createdAt
      updatedAt
      user {
        id
        email
        name
        phoneNumber
        isActive
        emailVerified
      }
      selectedCategories {
        id
        name
      }
      images {
        id
        url
        isDefault
      }
      reseauxSociaux {
        id
        plateforme
        urlProfil
      }
      instagramPosts {
        id
        code
        imageUrl
        thumbnailUrl
        postName
        likes
        comments
        takenAt
      }
      instagramReels {
        id
        code
        videoUrl
        thumbnailUrl
        postName
        likes
        comments
        views
        takenAt
      }
      instagramData
      statistiquesGlobales {
        followersTotaux
        engagementMoyenGlobal
        croissanceMensuelle
      }
    }
  }
`;

// Query pour les stats du dashboard admin
export const ADMIN_DASHBOARD_STATS = gql`
  query AdminDashboardStats {
    adminDashboardStats {
      totalSessions
      sessionsTrendByMedium {
        label
        data
      }
      pagesPerVisit
      uniqueVisitors
      newVsReturning {
        new
        returning
      }
      genderBreakdown
    }
  }
`;

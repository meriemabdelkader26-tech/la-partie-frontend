import { gql } from "graphql-request";

// ============================================
// COMPANY QUERIES
// ============================================

// Query pour récupérer le profil company de l'utilisateur connecté
export const GET_MY_COMPANY_PROFILE = gql`
  query GetMyCompanyProfile {
    myCompanyProfile {
      id
      user {
        id
        email
        name
        phoneNumber
        role
        isActive
        emailVerified
      }
      companyName
      matricule
      website
      size
      description
      domainActivity
      contactEmail
      entrepriseType
      langues
      disponibiliteCollaboration
      createdAt
      updatedAt
      address {
        id
        address
        city
        state
        postalCode
        country
        createdAt
        updatedAt
      }
      images {
        id
        url
        isDefault
        isPublic
        createdAt
      }
    }
  }
`;

// Query pour récupérer un company spécifique par ID
export const GET_COMPANY = gql`
  query GetCompany($id: ID!) {
    company(id: $id) {
      id
      user {
        id
        email
        name
        phoneNumber
        role
        isActive
      }
      companyName
      matricule
      website
      size
      description
      domainActivity
      contactEmail
      entrepriseType
      langues
      disponibiliteCollaboration
      createdAt
      updatedAt
      address {
        id
        address
        city
        state
        postalCode
        country
      }
      images {
        id
        url
        isDefault
        isPublic
        createdAt
      }
    }
  }
`;

// Query pour récupérer un company par user ID
export const GET_COMPANY_BY_USER = gql`
  query GetCompanyByUser($userId: ID!) {
    companyByUser(userId: $userId) {
      id
      user {
        id
        email
        name
      }
      companyName
      website
      size
      description
      domainActivity
      contactEmail
      entrepriseType
      langues
      disponibiliteCollaboration
      createdAt
      updatedAt
      address {
        id
        address
        city
        country
      }
      images {
        id
        url
        isDefault
      }
    }
  }
`;

// Query pour lister toutes les companies avec filtres
export const GET_ALL_COMPANIES = gql`
  query GetAllCompanies(
    $first: Int
    $skip: Int
    $domainActivity: String
    $size: String
    $country: String
    $disponibiliteCollaboration: String
  ) {
    companies(
      first: $first
      skip: $skip
      domainActivity: $domainActivity
      size: $size
      country: $country
      disponibiliteCollaboration: $disponibiliteCollaboration
    ) {
      id
      companyName
      website
      size
      description
      domainActivity
      entrepriseType
      langues
      disponibiliteCollaboration
      createdAt
      address {
        city
        country
      }
      images {
        id
        url
        isDefault
      }
    }
  }
`;

// Query pour compter les companies
export const GET_COMPANIES_COUNT = gql`
  query GetCompaniesCount(
    $domainActivity: String
    $size: String
    $country: String
    $disponibiliteCollaboration: String
  ) {
    companiesCount(
      domainActivity: $domainActivity
      size: $size
      country: $country
      disponibiliteCollaboration: $disponibiliteCollaboration
    )
  }
`;

// ============================================
// COMPANY MUTATIONS
// ============================================

// Mutation pour créer un profil company
export const CREATE_COMPANY_PROFILE = gql`
  mutation CreateCompanyProfile(
    $companyName: String!
    $matricule: String
    $website: String
    $size: String
    $description: String
    $domainActivity: String
    $contactEmail: String
    $entrepriseType: String
    $langues: [String]
    $disponibiliteCollaboration: String
    $address: AddressInput
    $images: [CompanyImageInput]
  ) {
    createCompanyProfile(
      companyName: $companyName
      matricule: $matricule
      website: $website
      size: $size
      description: $description
      domainActivity: $domainActivity
      contactEmail: $contactEmail
      entrepriseType: $entrepriseType
      langues: $langues
      disponibiliteCollaboration: $disponibiliteCollaboration
      address: $address
      images: $images
    ) {
      success
      message
      errors
      company {
        id
        companyName
        website
        size
        description
        domainActivity
        contactEmail
        entrepriseType
        langues
        disponibiliteCollaboration
        createdAt
        updatedAt
        address {
          id
          address
          city
          state
          postalCode
          country
        }
        images {
          id
          url
          isDefault
          isPublic
        }
      }
    }
  }
`;

// Mutation pour mettre à jour un profil company
export const UPDATE_COMPANY_PROFILE = gql`
  mutation UpdateCompanyProfile(
    $companyName: String
    $matricule: String
    $website: String
    $size: String
    $description: String
    $domainActivity: String
    $contactEmail: String
    $entrepriseType: String
    $langues: [String]
    $disponibiliteCollaboration: String
    $address: AddressInput
  ) {
    updateCompanyProfile(
      companyName: $companyName
      matricule: $matricule
      website: $website
      size: $size
      description: $description
      domainActivity: $domainActivity
      contactEmail: $contactEmail
      entrepriseType: $entrepriseType
      langues: $langues
      disponibiliteCollaboration: $disponibiliteCollaboration
      address: $address
    ) {
      success
      message
      errors
      company {
        id
        companyName
        website
        size
        description
        domainActivity
        contactEmail
        entrepriseType
        langues
        disponibiliteCollaboration
        updatedAt
        address {
          id
          address
          city
          state
          postalCode
          country
        }
      }
    }
  }
`;

// Mutation pour ajouter une image
export const ADD_COMPANY_IMAGE = gql`
  mutation AddCompanyImage($url: String!, $isDefault: Boolean, $isPublic: Boolean) {
    addCompanyImage(url: $url, isDefault: $isDefault, isPublic: $isPublic) {
      success
      message
      errors
      image {
        id
        url
        isDefault
        isPublic
        createdAt
      }
    }
  }
`;

// Mutation pour supprimer une image
export const REMOVE_COMPANY_IMAGE = gql`
  mutation RemoveCompanyImage($imageId: ID!) {
    removeCompanyImage(imageId: $imageId) {
      success
      message
      errors
    }
  }
`;

// Mutation pour compléter le profil company
export const COMPLETE_COMPANY_PROFILE = gql`
  mutation CompleteCompanyProfile {
    completeCompanyProfile {
      success
      message
      errors
      company {
        id
        companyName
        user {
          id
          isCompletedProfile
        }
      }
    }
  }
`;

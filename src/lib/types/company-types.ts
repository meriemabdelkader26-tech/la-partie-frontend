/**
 * Types TypeScript pour les données Company
 * Ces types correspondent au schema GraphQL du backend
 */

import { User } from "./admin-types";

// ============================================
// ENUMS
// ============================================

export enum CompanySize {
  S = "S", // Small (1-50 employees)
  M = "M", // Medium (51-200 employees)
  L = "L", // Large (201-1000 employees)
  XL = "XL", // Extra Large (1001+ employees)
}

export enum DomainActivity {
  TECH = "TECH", // Technology
  FIN = "FIN", // Finance
  HLTH = "HLTH", // Healthcare
  EDU = "EDU", // Education
  ENT = "ENT", // Entertainment
  MFG = "MFG", // Manufacturing
  RET = "RET", // Retail
  OTH = "OTH", // Other
}

export enum EntrepriseType {
  PRIV = "PRIV", // Private
  PUB = "PUB", // Public
  NGO = "NGO", // Non-Governmental Organization
  GOV = "GOV", // Government Agency
}

export enum DisponibiliteCollaboration {
  DISPONIBLE = "disponible",
  OCCUPE = "occupe",
  PARTIELLEMENT_DISPONIBLE = "partiellement_disponible",
}

// ============================================
// ADDRESS TYPE
// ============================================

export interface Address {
  id: string;
  address: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// COMPANY IMAGE TYPE
// ============================================

export interface CompanyImage {
  id: string;
  url: string;
  isDefault: boolean;
  isPublic: boolean;
  createdAt: string;
}

// ============================================
// COMPANY TYPE
// ============================================

export interface Company {
  id: string;
  user: User;
  companyName: string;
  matricule?: string;
  website?: string;
  size?: CompanySize;
  description?: string;
  domainActivity?: DomainActivity;
  contactEmail?: string;
  entrepriseType?: EntrepriseType;
  address?: Address;
  langues: string[];
  disponibiliteCollaboration: DisponibiliteCollaboration;
  images: CompanyImage[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// QUERY RESPONSE TYPES
// ============================================

export interface MyCompanyProfileResponse {
  myCompanyProfile: Company | null;
}

export interface CompanyResponse {
  company: Company;
}

export interface CompanyByUserResponse {
  companyByUser: Company;
}

export interface CompaniesResponse {
  companies: Company[];
}

export interface CompaniesCountResponse {
  companiesCount: number;
}

// ============================================
// QUERY VARIABLES TYPES
// ============================================

export interface GetCompanyVariables {
  id: string;
}

export interface GetCompanyByUserVariables {
  userId: string;
}

export interface GetCompaniesVariables {
  first?: number;
  skip?: number;
  domainActivity?: DomainActivity;
  size?: CompanySize;
  country?: string;
  disponibiliteCollaboration?: DisponibiliteCollaboration;
}

export interface GetCompaniesCountVariables {
  domainActivity?: DomainActivity;
  size?: CompanySize;
  country?: string;
  disponibiliteCollaboration?: DisponibiliteCollaboration;
}

// ============================================
// MUTATION INPUT TYPES
// ============================================

export interface CompanyImageInput {
  url: string;
  isDefault?: boolean;
  isPublic?: boolean;
}

export interface AddressInput {
  address: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface CreateCompanyProfileInput {
  companyName: string;
  matricule?: string;
  website?: string;
  size?: CompanySize;
  description?: string;
  domainActivity?: DomainActivity;
  contactEmail?: string;
  entrepriseType?: EntrepriseType;
  langues?: string[];
  disponibiliteCollaboration?: DisponibiliteCollaboration;
  address?: AddressInput;
  images?: CompanyImageInput[];
}

export interface UpdateCompanyProfileInput {
  companyName?: string;
  matricule?: string;
  website?: string;
  size?: CompanySize;
  description?: string;
  domainActivity?: DomainActivity;
  contactEmail?: string;
  entrepriseType?: EntrepriseType;
  langues?: string[];
  disponibiliteCollaboration?: DisponibiliteCollaboration;
  address?: AddressInput;
}

// ============================================
// MUTATION RESPONSE TYPES
// ============================================

export interface CreateCompanyProfileResponse {
  createCompanyProfile: {
    success: boolean;
    message: string;
    company?: Company;
    errors?: string[];
  };
}

export interface UpdateCompanyProfileResponse {
  updateCompanyProfile: {
    success: boolean;
    message: string;
    company?: Company;
    errors?: string[];
  };
}

export interface AddCompanyImageResponse {
  addCompanyImage: {
    success: boolean;
    message: string;
    image?: CompanyImage;
    errors?: string[];
  };
}

export interface RemoveCompanyImageResponse {
  removeCompanyImage: {
    success: boolean;
    message: string;
    errors?: string[];
  };
}

export interface CompleteCompanyProfileResponse {
  completeCompanyProfile: {
    success: boolean;
    message: string;
    company?: Company;
    errors?: string[];
  };
}

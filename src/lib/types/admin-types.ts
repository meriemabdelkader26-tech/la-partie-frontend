/**
 * Types TypeScript pour les données Admin
 * Ces types correspondent au schema GraphQL du backend
 */

// ============================================
// USER TYPES
// ============================================

export enum UserRole {
  ADMIN = "ADMIN",
  COMPANY = "COMPANY",
  INFLUENCER = "INFLUENCER",
}

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  phoneNumberVerified: boolean;
  emailVerified: boolean;
  verifiedAt?: string;
  isVerifyByAdmin: boolean;
  role: UserRole;
  isBanned: boolean;
  isActive: boolean;
  isStaff: boolean;
  isSuperuser: boolean;
  isCompletedProfile: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface UserEdge {
  node: User;
  cursor: string;
}

export interface UserConnection {
  edges: UserEdge[];
  pageInfo: PageInfo;
}

// ============================================
// INFLUENCER TYPES
// ============================================

export enum DisponibiliteEnum {
  DISPONIBLE = "DISPONIBLE",
  OCCUPE = "OCCUPE",
  PARTIELLEMENT_DISPONIBLE = "PARTIELLEMENT_DISPONIBLE",
}

export interface StatistiquesGlobales {
  followersTotaux: number;
  engagementMoyenGlobal: number;
  croissanceMensuelle: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface InfluencerImage {
  id: string;
  url: string;
  isDefault?: boolean;
}

export interface InfluencerPost {
  id: string;
  code?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  postName?: string;
  likes?: number;
  comments?: number;
  takenAt?: string;
}

export interface InfluencerReel {
  id: string;
  code?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  postName?: string;
  likes?: number;
  comments?: number;
  views?: number;
  takenAt?: string;
}

export interface Influencer {
  id: string;
  user: User;
  instagramUsername?: string;
  pseudo?: string;
  biography?: string;
  siteWeb?: string;
  localisation?: string;
  instagramData?: any; // JSONString
  images?: InfluencerImage[];
  instagramPosts?: InfluencerPost[];
  instagramReels?: InfluencerReel[];
  selectedCategories: Category[];
  langues: string[];
  centresInteret: string[];
  typeContenu: string[];
  disponibiliteCollaboration: DisponibiliteEnum;
  createdAt: string;
  updatedAt: string;
  profilePicture?: string;
  statistiquesGlobales?: StatistiquesGlobales;
}

export interface InfluencerEdge {
  node: Influencer;
  cursor: string;
}

export interface InfluencerConnection {
  edges: InfluencerEdge[];
  pageInfo: PageInfo;
  totalCount?: number;
}

// ============================================
// CATEGORY TYPES
// ============================================

export interface CategoryEdge {
  node: Category;
  cursor: string;
}

export interface CategoryConnection {
  edges: CategoryEdge[];
  pageInfo: PageInfo;
  totalCount?: number;
}

// ============================================
// PAGINATION TYPES (Relay)
// ============================================

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

// ============================================
// QUERY RESPONSE TYPES
// ============================================

export interface GetAllUsersResponse {
  allUsers: UserConnection;
}

export interface GetAllInfluencersResponse {
  allInfluencers: InfluencerConnection;
}

export interface GetDashboardStatsResponse {
  allUsers: UserConnection;
  allInfluencers: InfluencerConnection;
  allCategories: CategoryConnection;
}

export interface GetUserResponse {
  user: User;
}

export interface GetInfluencerResponse {
  influencer: Influencer;
}

// ============================================
// QUERY VARIABLES TYPES
// ============================================

export interface GetAllUsersVariables {
  emailIcontains?: string;
  nameIcontains?: string;
  role?: UserRole;
  emailVerified?: boolean;
  isActive?: boolean;
  isStaff?: boolean;
  isBanned?: boolean;
  orderBy?: string;
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}

export interface GetAllInfluencersVariables {
  localisation?: string;
  disponibiliteCollaboration?: DisponibiliteEnum | string;
  minFollowers?: number;
  first?: number;
  after?: string;
}

export interface GetUserVariables {
  id: string;
}

export interface GetInfluencerVariables {
  id: string;
}

// ============================================
// DASHBOARD STATS TYPES
// ============================================

export interface DashboardStats {
  totalUsers: number;
  totalInfluencers: number;
  verifiedInfluencers: number;
  pendingInfluencers: number;
  activeCategories: number;
  totalCategories: number;
}

// ============================================
// TABLE DATA TYPES (pour l'affichage)
// ============================================

export interface UserTableRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  emailVerified: boolean;
  createdAt: string;
}

export interface InfluencerTableRow {
  id: string;
  name: string;
  pseudo: string;
  email: string;
  instagramUsername: string;
  followers: string; // formaté (ex: "125K")
  category: string;
  status: "Verified" | "Pending";
  avatar?: string;
}

// ============================================
// FILTER TYPES
// ============================================

export interface UserFilters {
  search: string;
  role?: UserRole;
  isActive?: boolean;
  emailVerified?: boolean;
}

export interface InfluencerFilters {
  search: string;
  localisation?: string;
  minFollowers?: number;
  categoryId?: string;
  status?: "Verified" | "Pending";
}

// ============================================
// UTILITY TYPES
// ============================================

export type SortOrder = "asc" | "desc";

export interface SortConfig {
  field: string;
  order: SortOrder;
}

// ============================================
// API ERROR TYPES
// ============================================

export interface GraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: string[];
  extensions?: Record<string, any>;
}

export interface GraphQLErrorResponse {
  errors?: GraphQLError[];
}

// ============================================
// EXPORT ALL (removed duplicate export type statement)
// ============================================

// All types are already exported with the export keyword above


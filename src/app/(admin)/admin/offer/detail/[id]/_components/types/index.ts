import { User } from "@/app/types";

export type OfferApplication = {
  id: string;
  status: string;
  reviewedBy: User;
  isApproved: boolean;
  isPending: boolean;
  isRejected: boolean;
  proposal: string;
  adminNotes?: string;
  user: User;
  deliveryDays?: number;
  submittedAt?: string;
  canEdit: boolean;
  askingPrice: number;
  estimatedReach?: string;
};
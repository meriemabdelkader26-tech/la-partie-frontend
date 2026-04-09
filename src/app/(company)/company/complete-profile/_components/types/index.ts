import { DisponibiliteEnum } from "@/app/enums";
import { CompanySize, DomainActivity, EnterpriseType } from "../enums";

export type ProfileCompanyFormData = {
  // Basic Information
  companyName: string;
  matricule: string;
  website?: string;
  contactEmail: string;

  // Company Details
  size: CompanySize;
  entrepriseType: EnterpriseType;
  domainActivity: DomainActivity;
  description: string;

  // Company Address
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;

  // Languages & Collaboration
  disponibiliteCollaboration: DisponibiliteEnum;
  langues: string[];

  // Images & Logos
  imagesLogos: {
    url: string;
    isDefault: boolean;
    isPublic: boolean;
  }[];
};

import { DisponibiliteEnum } from "@/app/enums";
import { z } from "zod";
import { CompanySize, DomainActivity, EnterpriseType } from "../enums";

export const BasicInfoSchema = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters long"),
  matricule: z.string().min(8, "Matricule must be at least 8 characters long"),
  website: z.url("Invalid URL").optional(),
  contactEmail: z
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters long"),
});

export const CompanyDetailsSchema = z.object({
  size: z.enum(CompanySize),
  entrepriseType: z.enum(EnterpriseType),
  domainActivity: z.enum(DomainActivity),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters long"),
});

export const CompanyAddressSchema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters long"),
  city: z.string().min(2, "City must be at least 2 characters long"),
  state: z.string().min(2, "State must be at least 2 characters long"),
  postalCode: z
    .string()
    .min(4, "Postal Code must be at least 4 characters long"),
  country: z.string().min(2, "Country must be at least 2 characters long"),
});

export const LanguagesCollaborationSchema = z.object({
  disponibiliteCollaboration: z.enum(DisponibiliteEnum),
  langues: z.array(z.string()).min(1, "Select at least one language"),
});

export const ImagesLogosSchema = z.object({
  images: z.array(
    z.object({
      url: z.url("Invalid image URL"),
      isDefault: z.boolean(),
      isPublic: z.boolean(),
    })
  ),
});

export type BasicInfoType = z.infer<typeof BasicInfoSchema>;
export type CompanyDetailsType = z.infer<typeof CompanyDetailsSchema>;
export type CompanyAddressType = z.infer<typeof CompanyAddressSchema>;
export type LanguagesCollaborationType = z.infer<
  typeof LanguagesCollaborationSchema
>;
export type ImagesLogosType = z.infer<typeof ImagesLogosSchema>;

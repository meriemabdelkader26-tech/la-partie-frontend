import { CompanySize } from "../enums";

export const STEPS = [
  {
    number: 1,
    slug: "basic-info",
    title: "Basic Info",
    description: "Enter your company basic information",
  },
  {
    number: 2,
    slug: "company-details",
    title: "Company Details",
    description: "Provide detailed information about your company",
  },
  {
    number: 3,
    slug: "company-address",
    title: "Company Address",
    description: "Add your company address information ",
  },
  {
    number: 4,
    slug: "languages-collaboration",
    title: "Languages & Collaboration",
    description: "Add languages and collaboration preferences",
  },
  {
    number: 5,
    slug: "images-logos",
    title: "Images & Logos",
    description: "Upload your company images and logos",
  },
  {
    number: 6,
    slug: "review-submit",
    title: "Review & Submit",
    description: "Review your information and submit",
  },
];

export const getStepBySlug = (slug: string) => {
  return STEPS.find((step) => step.slug === slug);
};

export const getStepByNumber = (number: number) => {
  return STEPS.find((step) => step.number === number);
};

export const companySizes = [
  {
    label: "Small (1-50 employees)",
    value: CompanySize.S,
  },
  {
    label: "Medium (51-200 employees)",
    value: CompanySize.M,
  },
  {
    label: "Large (201-1000 employees)",
    value: CompanySize.L,
  },
  {
    label: "Extra Large (1001+ employees)",
    value: CompanySize.XL,
  },
];

export const enterpriseTypes = [
  { label: "Private", value: "PRIV" },
  { label: "Public", value: "PUB" },
  { label: "Non-Governmental Organization", value: "NGO" },
  { label: "Government Agency", value: "GOV" },
];

export const domainActivities = [
  { label: "Technology", value: "TECH" },
  { label: "Finance", value: "FIN" },
  { label: "Healthcare", value: "HLTH" },
  { label: "Education", value: "EDU" },
  { label: "Entertainment", value: "ENT" },
  { label: "Manufacturing", value: "MFG" },
  { label: "Retail", value: "RET" },
  { label: "Other", value: "OTH" },
];

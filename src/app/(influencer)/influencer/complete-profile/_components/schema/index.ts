import {
  DisponibiliteEnum,
  FrequencePublicationEnum,
  PlateformeEnum,
  TypeCollaborationEnum,
} from "@/app/enums";
import { z } from "zod";

// Instagram Data Schema (from API)
export const InstagramDataSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  full_name: z.string().optional(),
  biography: z.string().optional(),
  follower_count: z
    .number()
    .min(0, { message: "Follower count must be positive" }),
  following_count: z
    .number()
    .min(0, { message: "Following count must be positive" }),
  media_count: z.number().min(0, { message: "Media count must be positive" }),
  public_email: z
    .string()
    .email({ message: "Must be a valid email" })
    .optional()
    .or(z.literal("")),
  biography_email: z
    .string()
    .email({ message: "Must be a valid email" })
    .optional()
    .or(z.literal("")),
  contact_phone_number: z.string().optional().or(z.literal("")),
  external_url: z
    .string()
    .url({ message: "Must be a valid URL" })
    .optional()
    .or(z.literal("")),
  profile_pic_url: z
    .string()
    .url({ message: "Must be a valid URL" })
    .optional()
    .or(z.literal("")),
  is_verified: z.boolean().optional(),
  is_private: z.boolean().optional(),
});

// Step 1: Instagram Schema
export const Step1InstagramSchema = z.object({
  instagramUsername: z
    .string()
    .min(1, { message: "Instagram username is required" })
    .regex(/^[a-zA-Z0-9._]+$/, {
      message: "Invalid Instagram username format",
    }),
  pseudo: z.string().optional(),
  instagramData: InstagramDataSchema.nullable().optional(),
});

// Step 2: Personal Info & Bio Schema (biography + localisation + siteWeb)
export const Step2PersonalInfoSchema = z.object({
  biography: z
    .string()
    .min(10, { message: "Biography must be at least 10 characters" })
    .max(500, { message: "Biography must not exceed 500 characters" }),
  country: z.string().min(2, { message: "Country is required" }),
  city: z.string().min(2, { message: "City is required" }),
  siteWeb: z
    .string()
    .url({ message: "Must be a valid URL" })
    .optional()
    .or(z.literal("")),
  disponibiliteCollaboration: z.nativeEnum(DisponibiliteEnum).optional(),
});

// Step 3: Languages & Content Types Schema (langues + typeContenu)
export const Step3LanguagesSchema = z.object({
  langues: z
    .array(z.string())
    .min(1, { message: "Select at least one language" }),
  typeContenu: z
    .array(z.string())
    .min(1, { message: "Select at least one content type" }),
});

// Step 4: Social Networks Schema (reseauxSociaux)
export const Step4SocialNetworksSchema = z.object({
  reseauxSociaux: z
    .array(
      z.object({
        plateforme: z.nativeEnum(PlateformeEnum),
        urlProfil: z
          .string()
          .url({ message: "Must be a valid URL" })
          .min(1, { message: "Profile URL is required" }),
        nombreAbonnes: z
          .string()
          .min(1, { message: "Number of followers is required" })
          .refine((val) => !isNaN(Number(val)), {
            message: "Must be a valid number",
          }),
        tauxEngagement: z
          .string()
          .min(1, { message: "Engagement rate is required" })
          .refine((val) => !isNaN(Number(val)), {
            message: "Must be a valid number",
          }),
        moyenneVues: z
          .string()
          .refine((val) => val === "" || !isNaN(Number(val)), {
            message: "Must be a valid number",
          })
          .optional()
          .or(z.literal("")),
        moyenneLikes: z
          .string()
          .refine((val) => val === "" || !isNaN(Number(val)), {
            message: "Must be a valid number",
          })
          .optional()
          .or(z.literal("")),
        moyenneCommentaires: z
          .string()
          .refine((val) => val === "" || !isNaN(Number(val)), {
            message: "Must be a valid number",
          })
          .optional()
          .or(z.literal("")),
        frequencePublication: z.nativeEnum(FrequencePublicationEnum),
      })
    )
    .min(1, { message: "Add at least one social network" }),
});

// Step 5: Niches/Categories Schema (selectedCategories + centresInteret)
export const Step5NichesSchema = z.object({
  selectedCategories: z
    .array(z.string())
    .min(1, { message: "Select at least one category" })
    .max(5, { message: "You can select up to 5 categories" }),
  centresInteret: z.array(z.string()).optional(),
});

// Step 6: Collaboration Offers Schema (offresCollaboration)
export const Step6CollaborationSchema = z.object({
  offresCollaboration: z
    .array(
      z.object({
        typeCollaboration: z.nativeEnum(TypeCollaborationEnum),
        tarifMinimum: z
          .string()
          .min(1, { message: "Minimum rate is required" })
          .refine((val) => !isNaN(Number(val)), {
            message: "Must be a valid number",
          }),
        tarifMaximum: z
          .string()
          .min(1, { message: "Maximum rate is required" })
          .refine((val) => !isNaN(Number(val)), {
            message: "Must be a valid number",
          }),
        conditions: z.string().optional(),
      })
    )
    .min(1, { message: "Add at least one collaboration offer" }),
});

// Instagram Reel Schema
export const InstagramReelSchema = z.object({
  id: z.string(),
  code: z.string(),
  videoUrl: z.string().url({ message: "Must be a valid video URL" }),
  thumbnailUrl: z.string().url({ message: "Must be a valid thumbnail URL" }),
  postName: z.string().min(1, { message: "Post name is required" }),
  duration: z.number().positive(),
  takenAt: z.string(),
  likes: z.number().min(0),
  comments: z.number().min(0),
  views: z.number().min(0),
  username: z.string(),
  hashtags: z.array(z.string()).optional(),
});

// Instagram Post Schema
export const InstagramPostSchema = z.object({
  id: z.string(),
  code: z.string(),
  mediaType: z.enum(["image", "carousel", "video"]),
  imageUrl: z.string().url({ message: "Must be a valid image URL" }),
  thumbnailUrl: z.string().url({ message: "Must be a valid thumbnail URL" }),
  postName: z.string().min(1, { message: "Post name is required" }),
  takenAt: z.string(),
  likes: z.number().min(0),
  comments: z.number().min(0),
  username: z.string(),
  carouselMedia: z
    .array(
      z.object({
        id: z.string(),
        imageUrl: z.string(),
        thumbnailUrl: z.string(),
        isVideo: z.boolean(),
      })
    )
    .optional(),
  hashtags: z.array(z.string()).optional(),
});

// Step 7: Portfolio & Past Collaborations (portfolioMedia + collaborations + reels + posts)
export const Step7PortfolioSchema = z.object({
  portfolioMedia: z
    .array(
      z.object({
        imageUrl: z
          .string()
          .url({ message: "Must be a valid URL" })
          .min(1, { message: "Image URL is required" }),
        title: z.string().min(1, { message: "Title is required" }),
        description: z.string().optional(),
        dateCreation: z.string().optional(),
      })
    )
    .optional(),
  selectedReels: z
    .array(InstagramReelSchema)
    .max(5, { message: "You can select up to 5 reels" })
    .optional(),
  selectedPosts: z
    .array(InstagramPostSchema)
    .max(6, { message: "You can select up to 6 posts" })
    .optional(),
  collaborations: z
    .array(
      z.object({
        nomMarque: z.string().min(1, { message: "Brand name is required" }),
        campagne: z.string().min(1, { message: "Campaign is required" }),
        periode: z.string().min(1, { message: "Period is required" }),
        resultats: z.string().optional(),
        lienPublication: z
          .string()
          .url({ message: "Must be a valid URL" })
          .optional()
          .or(z.literal("")),
      })
    )
    .optional(),
});

// Image Schema
export const ImageSchema = z.object({
  url: z.string().url({ message: "Must be a valid URL" }),
  isDefault: z.boolean(),
  isPublic: z.boolean(),
});

// Step 8: Images Upload Schema
export const Step8ImagesSchema = z.object({
  images: z
    .array(ImageSchema)
    .min(1, { message: "Upload at least one image" })
    .max(10, { message: "You can upload up to 10 images" })
    .refine((images) => images.filter((img) => img.isDefault).length <= 1, {
      message: "Only one image can be set as default",
    }),
});

// Complete Form Schema (for final submission)
export const CompleteInfluencerFormSchema = z.object({
  instagramUsername: z
    .string()
    .min(1, { message: "Instagram username is required" }),
  pseudo: z.string().optional(),
  instagramData: InstagramDataSchema.nullable().optional(),
  biography: z
    .string()
    .min(3, { message: "Biography must be at least 3 characters" }),
  centresInteret: z.array(z.string()).optional(),
  collaborations: z
    .array(
      z.object({
        nomMarque: z.string().min(1, { message: "Brand name is required" }),
        campagne: z.string().min(1, { message: "Campaign is required" }),
        periode: z.string().min(1, { message: "Period is required" }),
        resultats: z.string().optional(),
        lienPublication: z.url({ message: "Must be a valid URL" }).optional(),
      })
    )
    .optional(),
  disponibiliteCollaboration: z.enum(DisponibiliteEnum).optional(),
  langues: z.array(z.string()),
  localisation: z.string().min(1, { message: "Location is required" }),
  offresCollaboration: z
    .array(
      z.object({
        typeCollaboration: z.enum(TypeCollaborationEnum),
        tarifMinimum: z
          .string()
          .min(1, { message: "Minimum rate is required" })
          .refine((val) => !isNaN(Number(val)), {
            message: "Must be a valid number",
          }),
        tarifMaximum: z
          .string()
          .min(1, { message: "Maximum rate is required" })
          .refine((val) => !isNaN(Number(val)), {
            message: "Must be a valid number",
          }),
        conditions: z.string().optional(),
      })
    )
    .optional(),
  portfolioMedia: z
    .array(
      z.object({
        imageUrl: z
          .url({ message: "Must be a valid URL" })
          .min(1, { message: "Image URL is required" }),
        title: z.string().min(1, { message: "Title is required" }),
        description: z.string().optional(),
        dateCreation: z.string().optional(),
      })
    )
    .optional(),
  selectedReels: z.array(InstagramReelSchema).optional(),
  selectedPosts: z.array(InstagramPostSchema).optional(),
  images: z.array(ImageSchema).optional(),
  reseauxSociaux: z
    .array(
      z.object({
        plateforme: z.nativeEnum(PlateformeEnum),
        urlProfil: z
          .url({ message: "Must be a valid URL" })
          .min(1, { message: "Profile URL is required" }),
        nombreAbonnes: z
          .string()
          .min(1, { message: "Number of followers is required" })
          .refine((val) => !isNaN(Number(val)), {
            message: "Must be a valid number",
          }),
        tauxEngagement: z
          .string()
          .min(1, { message: "Engagement rate is required" })
          .refine((val) => !isNaN(Number(val)), {
            message: "Must be a valid number",
          }),
        moyenneVues: z.string().optional(),
        moyenneLikes: z.string().optional(),
        moyenneCommentaires: z.string().optional(),
        frequencePublication: z.nativeEnum(FrequencePublicationEnum),
      })
    )
    .min(1, { message: "Add at least one social network" }),
  selectedCategories: z
    .array(z.string())
    .min(1, { message: "Select at least one category" }),
  siteWeb: z.url({ message: "Must be a valid URL" }).optional(),
  typeContenu: z.array(z.string()).optional(),
});

// Type exports for TypeScript
export type InstagramDataType = z.infer<typeof InstagramDataSchema>;
export type ImageType = z.infer<typeof ImageSchema>;
export type Step1InstagramType = z.infer<typeof Step1InstagramSchema>;
export type Step2PersonalInfoType = z.infer<typeof Step2PersonalInfoSchema>;
export type Step3LanguagesType = z.infer<typeof Step3LanguagesSchema>;
export type Step4SocialNetworksType = z.infer<typeof Step4SocialNetworksSchema>;
export type Step5NichesType = z.infer<typeof Step5NichesSchema>;
export type Step6CollaborationType = z.infer<typeof Step6CollaborationSchema>;
export type Step7PortfolioType = z.infer<typeof Step7PortfolioSchema>;
export type Step8ImagesType = z.infer<typeof Step8ImagesSchema>;

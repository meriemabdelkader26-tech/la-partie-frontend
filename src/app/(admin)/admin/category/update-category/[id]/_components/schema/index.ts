import { z } from "zod";

export const MutationCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long"),
  description: z
    .string()
    .max(200, "Description must be at most 200 characters long")
    .optional(),
  isActive: z.boolean().optional(),
});
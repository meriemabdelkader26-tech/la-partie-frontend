import { z } from "zod";

export const MutationOfferSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title must be at most 100 characters long"),
  minBudget: z
    .string()
    .min(1, "Minimum budget is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Minimum budget must be a valid number",
    }),
  maxBudget: z
    .string()
    .min(1, "Maximum budget is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Maximum budget must be a valid number",
    }),
  startDate: z.date({
    message: "Start date must be a valid date",
  }),
  endDate: z.date({
    message: "End date must be a valid date",
  }),
  influencerNumber: z
    .string()
    .min(1, "Number of influencers is required")
    .min(1, "Must be at least 1")
    .refine((val) => !isNaN(Number(val)), {
      message: "Number of influencers must be a valid number",
    }),
  requirement: z
    .string()
    .min(10, "Requirements must be at least 10 characters long"),
  objectif: z.string().min(10, "Objective must be at least 10 characters long"),
});
import { z } from "zod";

export const ApplyOfferSchema = z.object({
  askingPrice: z
    .string()
    .min(1, "Asking price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Please enter a valid price",
    }),
  proposal: z
    .string()
    .min(10, "Proposal must be at least 10 characters")
    .max(500, "Proposal must not exceed 500 characters"),
});

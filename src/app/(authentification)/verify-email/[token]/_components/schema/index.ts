import { z } from "zod";

export const VerifyEmailSchema = z.object({
  code: z
    .string()
    .length(6, {
      message: "Your one-time password must be exactly 6 characters.",
    })
    .regex(/^\d+$/, {
      message: "Your one-time password must contain only digits.",
    }),
  email: z
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
});

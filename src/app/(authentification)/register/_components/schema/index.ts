import { RoleEnum } from "@/app/enums";
import { z } from "zod";

export const RegisterFormSchema = z
  .object({
    email: z
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    phoneNumber: z.string().min(8, { message: "Phone number is required" }),
    name: z.string().min(1, { message: "Name is required" }),
    role: z.enum(RoleEnum),
    confirmPassword: z.string().min(6, { message: "Confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z.string().min(3, "First name must be at least 3 characters"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupRequestDTO = z.infer<typeof signupSchema>;
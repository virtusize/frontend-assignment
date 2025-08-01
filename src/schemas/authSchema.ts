import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(4, "Password must be at least 4 characters"),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(4, "Password must be at least 4 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  username: z.string().min(1, "Username is required"),
});
export const newPasswordSchema = z.object({
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(50, "Password too long"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type NewPasswordSchema = z.infer<typeof newPasswordSchema>;

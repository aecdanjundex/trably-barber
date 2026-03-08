import { z } from "zod";

export const requestOtpSchema = z.object({
  /** The organization's slug — matches the subdomain */
  slug: z.string().min(1),
  phone: z.string().min(8).max(20),
});

export const verifyOtpSchema = z.object({
  slug: z.string().min(1),
  phone: z.string().min(8).max(20),
  code: z.string().length(6),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().email("E-mail inválido").max(200),
});

export type RequestOtpInput = z.infer<typeof requestOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

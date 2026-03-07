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

export type RequestOtpInput = z.infer<typeof requestOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

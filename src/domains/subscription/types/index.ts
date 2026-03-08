import type { organization, subscriptionInvoice } from "@/db/schema";

export type Organization = typeof organization.$inferSelect;

export type Plan = "free" | "trial" | "basic" | "premium";
export type PlanInterval = "monthly" | "annual";
export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid";

export interface PlanInfo {
  plan: Plan;
  interval: PlanInterval | null;
  status: SubscriptionStatus | null;
  trialEndsAt: Date | null;
  currentPeriodEndsAt: Date | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

/** Prices in cents (BRL) */
export const PLAN_PRICES = {
  basic: {
    monthly: 6900,  // R$ 69,00
    annual: 59900,  // R$ 599,00/year
  },
  premium: {
    monthly: 14900,  // R$ 149,00
    annual: 119900,  // R$ 1.199,00/year
  },
} as const;

export const TRIAL_DAYS = 15;

export type SubscriptionInvoice = typeof subscriptionInvoice.$inferSelect;

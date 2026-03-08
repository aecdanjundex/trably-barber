import type { Organization, PlanInfo, SubscriptionInvoice } from "../types";

interface ISubscriptionRepository {
  getOrgById(orgId: string): Promise<Organization | null>;

  updateSubscription(
    orgId: string,
    data: Partial<{
      plan: string;
      planInterval: string | null;
      stripeCustomerId: string | null;
      stripeSubscriptionId: string | null;
      subscriptionStatus: string | null;
      trialEndsAt: Date | null;
      currentPeriodStartsAt: Date | null;
      currentPeriodEndsAt: Date | null;
    }>,
  ): Promise<void>;

  getOrgByStripeCustomerId(
    stripeCustomerId: string,
  ): Promise<Organization | null>;

  getPlanInfo(orgId: string): Promise<PlanInfo | null>;

  upsertInvoice(invoice: SubscriptionInvoice): Promise<void>;

  getInvoices(orgId: string): Promise<SubscriptionInvoice[]>;
}

export type { ISubscriptionRepository };

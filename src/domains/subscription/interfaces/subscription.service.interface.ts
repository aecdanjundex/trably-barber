import type { PlanInfo, SubscriptionInvoice } from "../types";

interface ISubscriptionService {
  getPlanInfo(orgId: string): Promise<PlanInfo | null>;

  startTrial(orgId: string): Promise<void>;

  createPortalSession(
    orgId: string,
    returnUrl: string,
  ): Promise<string>;

  handleWebhookEvent(rawBody: string, signature: string): Promise<void>;

  getInvoices(orgId: string): Promise<SubscriptionInvoice[]>;
}

export type { ISubscriptionService };

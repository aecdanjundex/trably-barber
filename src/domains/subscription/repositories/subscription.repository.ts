import "reflect-metadata";
import { injectable, inject } from "inversify";
import { desc, eq } from "drizzle-orm";
import { TYPES } from "@/lib/di/types";
import type { Database } from "@/lib/db";
import { organization as organizationTable, subscriptionInvoice as invoiceTable } from "@/db/schema";
import type { ISubscriptionRepository } from "../interfaces/subscription.repository.interface";
import type { Organization, PlanInfo, Plan, PlanInterval, SubscriptionStatus, SubscriptionInvoice } from "../types";

@injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(@inject(TYPES.Database) private db: Database) {}

  async getOrgById(orgId: string): Promise<Organization | null> {
    const [row] = await this.db
      .select()
      .from(organizationTable)
      .where(eq(organizationTable.id, orgId))
      .limit(1);
    return row ?? null;
  }

  async updateSubscription(
    orgId: string,
    data: Partial<{
      plan: string;
      planInterval: string | null;
      stripeCustomerId: string | null;
      stripeSubscriptionId: string | null;
      subscriptionStatus: string | null;
      trialEndsAt: Date | null;
      currentPeriodEndsAt: Date | null;
    }>,
  ): Promise<void> {
    await this.db
      .update(organizationTable)
      .set(data)
      .where(eq(organizationTable.id, orgId));
  }

  async getOrgByStripeCustomerId(
    stripeCustomerId: string,
  ): Promise<Organization | null> {
    const [row] = await this.db
      .select()
      .from(organizationTable)
      .where(eq(organizationTable.stripeCustomerId, stripeCustomerId))
      .limit(1);
    return row ?? null;
  }

  async getPlanInfo(orgId: string): Promise<PlanInfo | null> {
    const org = await this.getOrgById(orgId);
    if (!org) return null;
    return {
      plan: org.plan as Plan,
      interval: org.planInterval as PlanInterval | null,
      status: org.subscriptionStatus as SubscriptionStatus | null,
      trialEndsAt: org.trialEndsAt,
      currentPeriodEndsAt: org.currentPeriodEndsAt,
      stripeCustomerId: org.stripeCustomerId,
      stripeSubscriptionId: org.stripeSubscriptionId,
    };
  }

  async upsertInvoice(invoice: SubscriptionInvoice): Promise<void> {
    await this.db
      .insert(invoiceTable)
      .values(invoice)
      .onConflictDoUpdate({
        target: invoiceTable.stripeInvoiceId,
        set: {
          status: invoice.status,
          amountInCents: invoice.amountInCents,
          paidAt: invoice.paidAt,
          plan: invoice.plan,
          planInterval: invoice.planInterval,
          periodFrom: invoice.periodFrom,
          periodTo: invoice.periodTo,
        },
      });
  }

  async getInvoices(orgId: string): Promise<SubscriptionInvoice[]> {
    return this.db
      .select()
      .from(invoiceTable)
      .where(eq(invoiceTable.organizationId, orgId))
      .orderBy(desc(invoiceTable.periodFrom));
  }
}

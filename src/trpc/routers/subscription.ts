import { TRPCError } from "@trpc/server";
import { createTRPCRouter, orgAdminProcedure } from "@/trpc/init";
import { container } from "@/lib/di/container";
import { TYPES } from "@/lib/di/types";
import type { ISubscriptionService } from "@/domains/subscription/interfaces/subscription.service.interface";
import { env } from "@/lib/env/server";

function getService() {
  return container.get<ISubscriptionService>(TYPES.SubscriptionService);
}

export const subscriptionRouter = createTRPCRouter({
  /** Get the current plan/subscription info for the active org */
  getPlanInfo: orgAdminProcedure.query(async ({ ctx }) => {
    const svc = getService();
    const info = await svc.getPlanInfo(ctx.orgId);
    if (!info) throw new TRPCError({ code: "NOT_FOUND" });
    return { ...info, orgId: ctx.orgId };
  }),

  /** Activate the 15-day trial for the active org */
  startTrial: orgAdminProcedure.mutation(async ({ ctx }) => {
    const svc = getService();
    const info = await svc.getPlanInfo(ctx.orgId);
    if (!info) throw new TRPCError({ code: "NOT_FOUND" });
    if (info.plan !== "free") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Trial só disponível para organizações no plano gratuito",
      });
    }
    await svc.startTrial(ctx.orgId);
  }),

  /** Create a Stripe Customer Portal session URL */
  createPortalSession: orgAdminProcedure.mutation(async ({ ctx }) => {
    const svc = getService();
    const returnUrl = `${env.NEXT_PUBLIC_APP_URL}/admin/assinatura`;
    const url = await svc.createPortalSession(ctx.orgId, returnUrl);
    return { url };
  }),

  /** List billing invoices for the active org */
  getInvoices: orgAdminProcedure.query(async ({ ctx }) => {
    const svc = getService();
    return svc.getInvoices(ctx.orgId);
  }),
});

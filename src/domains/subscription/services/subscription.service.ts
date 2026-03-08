import "reflect-metadata";
import { injectable, inject } from "inversify";
import Stripe from "stripe";
import { TYPES } from "@/lib/di/types";
import { env } from "@/lib/env/server";
import type { ISubscriptionRepository } from "../interfaces/subscription.repository.interface";
import type { ISubscriptionService } from "../interfaces/subscription.service.interface";
import type { Plan, PlanInterval } from "../types";
import { PLAN_PRICES, TRIAL_DAYS } from "../types";

function requireStripeEnv() {
  const key = env.STRIPE_SECRET_KEY;
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  if (!key || !webhookSecret) {
    throw new Error(
      "Stripe não configurado. Adicione STRIPE_SECRET_KEY e STRIPE_WEBHOOK_SECRET ao .env",
    );
  }
  return { key, webhookSecret };
}

function getStripe(): Stripe {
  const { key } = requireStripeEnv();
  return new Stripe(key, { apiVersion: "2026-02-25.clover" });
}

function unixToDate(value: unknown): Date | null {
  const n = typeof value === "number" ? value : Number(value);
  if (!isFinite(n) || n <= 0) return null;
  return new Date(n * 1000);
}

/**
 * Reads plan/interval from the subscription's price.
 * Priority: price metadata → price nickname → price amount (mapped via PLAN_PRICES).
 */
async function getPlanFromSubscription(
  stripe: Stripe,
  sub: Stripe.Subscription,
): Promise<{ plan: Plan; interval: PlanInterval } | null> {
  const priceId = sub.items.data[0]?.price.id;
  if (!priceId) return null;

  const price = await stripe.prices.retrieve(priceId);

  // 1. Explicit metadata
  const metaPlan = price.metadata.plan as Plan | undefined;
  const metaInterval = price.metadata.interval as PlanInterval | undefined;
  if (metaPlan && metaInterval)
    return { plan: metaPlan, interval: metaInterval };

  // 2. Interval from Stripe recurring
  const stripeInterval = price.recurring?.interval;
  const interval: PlanInterval | null =
    stripeInterval === "month"
      ? "monthly"
      : stripeInterval === "year"
        ? "annual"
        : null;

  // 3. Plan from nickname
  const nickname = (price.nickname ?? "").toLowerCase();
  let plan: Plan | null = null;
  if (
    nickname.includes("basic") ||
    nickname.includes("básico") ||
    nickname.includes("basico")
  ) {
    plan = "basic";
  } else if (nickname.includes("premium")) {
    plan = "premium";
  }

  // 4. Plan from unit_amount mapped to PLAN_PRICES
  if (!plan && price.unit_amount !== null) {
    const amount = price.unit_amount;
    if (
      amount === PLAN_PRICES.basic.monthly ||
      amount === PLAN_PRICES.basic.annual
    ) {
      plan = "basic";
    } else if (
      amount === PLAN_PRICES.premium.monthly ||
      amount === PLAN_PRICES.premium.annual
    ) {
      plan = "premium";
    }
  }

  if (plan && interval) return { plan, interval };
  return null;
}

@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(TYPES.SubscriptionRepository)
    private repo: ISubscriptionRepository,
  ) {}

  async getPlanInfo(orgId: string) {
    return this.repo.getPlanInfo(orgId);
  }

  async startTrial(orgId: string): Promise<void> {
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DAYS);
    await this.repo.updateSubscription(orgId, {
      plan: "trial",
      subscriptionStatus: "trialing",
      trialEndsAt,
    });
  }

  async createCheckoutSession(
    orgId: string,
    plan: Plan,
    interval: PlanInterval,
    successUrl: string,
    cancelUrl: string,
  ): Promise<string> {
    const stripe = getStripe();

    const priceIdMap: Record<Plan, Record<PlanInterval, string | undefined>> = {
      free: { monthly: undefined, annual: undefined },
      trial: { monthly: undefined, annual: undefined },
      basic: {
        monthly: env.STRIPE_PRICE_BASIC_MONTHLY,
        annual: env.STRIPE_PRICE_BASIC_ANNUAL,
      },
      premium: {
        monthly: env.STRIPE_PRICE_PREMIUM_MONTHLY,
        annual: env.STRIPE_PRICE_PREMIUM_ANNUAL,
      },
    };

    const priceId = priceIdMap[plan]?.[interval];
    if (!priceId) {
      throw new Error(
        `Price ID não configurado para ${plan}/${interval}. Configure STRIPE_PRICE_${plan.toUpperCase()}_${interval.toUpperCase()} no .env`,
      );
    }

    const org = await this.repo.getOrgById(orgId);

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: orgId,
      metadata: { orgId },
      subscription_data: { metadata: { orgId } },
    };

    if (org?.stripeCustomerId) {
      sessionParams.customer = org.stripeCustomerId;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return session.url!;
  }

  async createPortalSession(orgId: string, returnUrl: string): Promise<string> {
    const stripe = getStripe();
    const org = await this.repo.getOrgById(orgId);
    if (!org?.stripeCustomerId) {
      throw new Error("No Stripe customer associated with this organization");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: org.stripeCustomerId,
      return_url: returnUrl,
    });

    return session.url;
  }

  async handleWebhookEvent(rawBody: string, signature: string): Promise<void> {
    const { webhookSecret } = requireStripeEnv();
    const stripe = getStripe();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch {
      throw new Error("Invalid webhook signature");
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Pricing Table sets client_reference_id; manual checkout uses metadata.orgId
        const orgId = session.client_reference_id ?? session.metadata?.orgId;
        if (!orgId || !session.subscription) break;

        const sub = await stripe.subscriptions.retrieve(
          session.subscription as string,
        );
        const planData = await getPlanFromSubscription(stripe, sub);
        const subRaw = sub as unknown as Record<string, unknown>;

        await this.repo.updateSubscription(orgId, {
          ...(planData ?? {}),
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          subscriptionStatus: "active",
          trialEndsAt: null,
          currentPeriodStartsAt: unixToDate(subRaw.current_period_start),
          currentPeriodEndsAt: unixToDate(subRaw.current_period_end),
        });

        // invoice.created fires before this event (customer ID not yet saved),
        // so we register the session's invoice here using the orgId we have.
        const sessionRaw = session as unknown as Record<string, unknown>;
        const invoiceId = sessionRaw.invoice as string | null;
        if (invoiceId) {
          const inv = await stripe.invoices.retrieve(invoiceId);
          const invRaw = inv as unknown as Record<string, unknown>;
          const invStatus = invRaw.status as string;
          const mapped =
            invStatus === "paid"
              ? "paid"
              : invStatus === "open"
                ? "open"
                : "failed";
          await this.recordInvoice(stripe, inv, orgId, mapped);
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;

        // Try metadata first (manual checkout), then look up by customer ID
        let orgId: string | undefined = sub.metadata?.orgId;
        if (!orgId) {
          const org = await this.repo.getOrgByStripeCustomerId(
            sub.customer as string,
          );
          orgId = org?.id;
        }
        if (!orgId) break;

        const planData = sub.metadata?.plan
          ? {
              plan: sub.metadata.plan as Plan,
              interval: sub.metadata.interval as PlanInterval,
            }
          : await getPlanFromSubscription(stripe, sub);

        const subRaw = sub as unknown as Record<string, unknown>;
        await this.repo.updateSubscription(orgId, {
          ...(planData ?? {}),
          stripeSubscriptionId: sub.id,
          subscriptionStatus: sub.status as string,
          // current_period_start/end were removed from the Subscription type in newer Stripe API
          // versions but are still returned at runtime
          currentPeriodStartsAt: unixToDate(subRaw.current_period_start),
          currentPeriodEndsAt: unixToDate(subRaw.current_period_end),
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        let orgId: string | undefined = sub.metadata?.orgId;
        if (!orgId) {
          const org = await this.repo.getOrgByStripeCustomerId(
            sub.customer as string,
          );
          orgId = org?.id;
        }
        if (!orgId) break;

        await this.repo.updateSubscription(orgId, {
          plan: "free",
          planInterval: null,
          stripeSubscriptionId: null,
          subscriptionStatus: "canceled",
          currentPeriodStartsAt: null,
          currentPeriodEndsAt: null,
        });
        break;
      }

      case "invoice.created": {
        // Records the invoice as soon as it is created (status: "open").
        // For the first subscription invoice, the customer ID may not be
        // linked yet — that case is handled in checkout.session.completed.
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const org = await this.repo.getOrgByStripeCustomerId(customerId);
        if (!org) break;
        await this.recordInvoice(stripe, invoice, org.id, "open");
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const org = await this.repo.getOrgByStripeCustomerId(customerId);
        if (!org) break;

        await this.repo.updateSubscription(org.id, {
          subscriptionStatus: "past_due",
        });

        await this.recordInvoice(stripe, invoice, org.id, "failed");
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const org = await this.repo.getOrgByStripeCustomerId(customerId);
        if (!org) break;

        await this.repo.updateSubscription(org.id, {
          subscriptionStatus: "active",
        });

        await this.recordInvoice(stripe, invoice, org.id, "paid");
        break;
      }
    }
  }

  async getInvoices(orgId: string) {
    return this.repo.getInvoices(orgId);
  }

  private async recordInvoice(
    stripe: Stripe,
    invoice: Stripe.Invoice,
    orgId: string,
    status: "open" | "paid" | "failed",
  ): Promise<void> {
    if (!invoice.id) return;

    const raw = invoice as unknown as Record<string, unknown>;
    const periodFrom = new Date((raw.period_start as number) * 1000);
    const periodTo = new Date((raw.period_end as number) * 1000);
    const subscriptionId = (raw.subscription as string) ?? null;

    let plan: string | null = null;
    let planInterval: string | null = null;
    if (subscriptionId) {
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      const planData = await getPlanFromSubscription(stripe, sub);
      plan = planData?.plan ?? null;
      planInterval = planData?.interval ?? null;
    }

    const amountInCents =
      status === "paid"
        ? ((raw.amount_paid as number) ?? 0)
        : ((raw.amount_due as number) ?? 0);

    await this.repo.upsertInvoice({
      id: crypto.randomUUID(),
      organizationId: orgId,
      stripeInvoiceId: invoice.id,
      stripeSubscriptionId: subscriptionId,
      plan,
      planInterval,
      amountInCents,
      status,
      periodFrom,
      periodTo,
      paidAt: status === "paid" ? new Date() : null,
      createdAt: new Date(),
    });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { container } from "@/lib/di/container";
import { TYPES } from "@/lib/di/types";
import type { ISubscriptionService } from "@/domains/subscription/interfaces/subscription.service.interface";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  try {
    const subscriptionService = container.get<ISubscriptionService>(
      TYPES.SubscriptionService,
    );
    await subscriptionService.handleWebhookEvent(rawBody, signature);
    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    console.error("[stripe/webhook]", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

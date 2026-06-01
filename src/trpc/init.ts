import { cache } from "react";
import { headers } from "next/headers";
import superjson from "superjson";
import { TRPCError, initTRPC } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { member, organization } from "@/db/schema";
import { ORG_ADMIN_ROLES, type OrgRole } from "@/lib/permissions";

export const createTRPCContext = cache(async () => {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  return {
    user: session?.user ?? null,
    session: session?.session ?? null,
  };
});

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      user: ctx.user,
      session: ctx.session,
    },
  });
});

/**
 * Protected procedure — requires an authenticated session.
 */
export const protectedProcedure = t.procedure.use(isAuthed);

/**
 * Admin procedure — requires an authenticated session with role "admin".
 */
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next({ ctx });
});

/**
 * Org procedure — requires an active organization and valid membership.
 * Adds `orgId` and `memberRole` to the context.
 * Use this for all tenant-scoped operations.
 */
export const orgProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const orgId = ctx.session.activeOrganizationId;
  if (!orgId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "No active organization selected",
    });
  }

  const [orgMember] = await db
    .select()
    .from(member)
    .where(
      and(eq(member.organizationId, orgId), eq(member.userId, ctx.user.id)),
    )
    .limit(1);

  if (!orgMember) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Not a member of this organization",
    });
  }

  return next({
    ctx: {
      ...ctx,
      orgId,
      memberRole: orgMember.role as OrgRole,
    },
  });
});

/**
 * Org admin procedure — requires owner or admin role in the active organization.
 */
export const orgAdminProcedure = orgProcedure.use(({ ctx, next }) => {
  if (!ORG_ADMIN_ROLES.includes(ctx.memberRole)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Organization admin access required",
    });
  }
  return next({ ctx });
});

async function checkPremiumPlan(orgId: string): Promise<void> {
  const [org] = await db
    .select({ plan: organization.plan })
    .from(organization)
    .where(eq(organization.id, orgId))
    .limit(1);
  if (org?.plan !== "premium") {
    throw new TRPCError({ code: "FORBIDDEN", message: "PREMIUM_REQUIRED" });
  }
}

/**
 * Premium org procedure — requires active org membership AND premium plan.
 */
export const premiumOrgProcedure = orgProcedure.use(async ({ ctx, next }) => {
  await checkPremiumPlan(ctx.orgId);
  return next({ ctx });
});

/**
 * Premium org admin procedure — requires org admin role AND premium plan.
 */
export const premiumOrgAdminProcedure = orgAdminProcedure.use(
  async ({ ctx, next }) => {
    await checkPremiumPlan(ctx.orgId);
    return next({ ctx });
  },
);

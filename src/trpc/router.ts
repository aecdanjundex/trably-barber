import { z } from "zod";
import { and, eq, gt } from "drizzle-orm";
import {
  publicProcedure,
  protectedProcedure,
  adminProcedure,
  createTRPCRouter,
} from "./init";
import { clientRouter } from "./routers/client";
import { serviceOrderRouter } from "./routers/service-order";
import { financialRouter } from "./routers/financial";
import { db } from "@/lib/db";
import { invitation, organization } from "@/db/schema";

export const appRouter = createTRPCRouter({
  getInvitationInfo: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [row] = await db
        .select({
          email: invitation.email,
          status: invitation.status,
          expiresAt: invitation.expiresAt,
          organizationName: organization.name,
        })
        .from(invitation)
        .innerJoin(organization, eq(invitation.organizationId, organization.id))
        .where(
          and(
            eq(invitation.id, input.id),
            eq(invitation.status, "pending"),
            gt(invitation.expiresAt, new Date()),
          ),
        )
        .limit(1);

      if (!row) return null;
      return row;
    }),

  me: protectedProcedure.query(({ ctx }) => ({ user: ctx.user })),

  adminOnly: adminProcedure.query(({ ctx }) => ({
    message: `Admin access granted for ${ctx.user.name}`,
  })),

  client: clientRouter,
  serviceOrder: serviceOrderRouter,
  financial: financialRouter,
});

export type AppRouter = typeof appRouter;

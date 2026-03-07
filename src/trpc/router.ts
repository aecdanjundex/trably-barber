import { z } from "zod";
import { and, eq, gt } from "drizzle-orm";
import {
  publicProcedure,
  protectedProcedure,
  adminProcedure,
  orgProcedure,
  orgAdminProcedure,
  createTRPCRouter,
} from "./init";
import { customerAuthRouter } from "./routers/customer-auth";
import { customerBookingRouter } from "./routers/customer-booking";
import { adminRouter } from "./routers/admin";
import { db } from "@/lib/db";
import { invitation, organization } from "@/db/schema";

export const appRouter = createTRPCRouter({
  hello: publicProcedure.query(async () => {
    return "Hello from tRPC!";
  }),

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
  me: protectedProcedure.query(({ ctx }) => {
    return { user: ctx.user };
  }),
  adminOnly: adminProcedure.query(({ ctx }) => {
    return { message: `Admin access granted for ${ctx.user.name}` };
  }),
  customerAuth: customerAuthRouter,
  customerBooking: customerBookingRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;

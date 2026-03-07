import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/trpc/init";
import { db } from "@/lib/db";
import { organization, member, user } from "@/db/schema";
import { ORG_ROLES } from "@/lib/permissions";

export const customerBookingRouter = createTRPCRouter({
  /**
   * Returns basic organization info by slug.
   * Used to render the org branding on the booking page.
   */
  getOrganization: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const rows = await db
        .select({
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          logo: organization.logo,
        })
        .from(organization)
        .where(eq(organization.slug, input.slug))
        .limit(1);

      return rows[0] ?? null;
    }),

  /**
   * Returns the barbers (members with role "barber" or "owner") for an org.
   * Used to display the professional selection on the booking screen.
   */
  getBarbers: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const orgRows = await db
        .select({ id: organization.id })
        .from(organization)
        .where(eq(organization.slug, input.slug))
        .limit(1);

      if (!orgRows[0]) return [];

      return db
        .select({
          id: user.id,
          name: user.name,
          image: user.image,
        })
        .from(member)
        .innerJoin(user, eq(member.userId, user.id))
        .where(
          and(
            eq(member.organizationId, orgRows[0].id),
            inArray(member.role, [ORG_ROLES.BARBER, ORG_ROLES.OWNER]),
          ),
        );
    }),
});

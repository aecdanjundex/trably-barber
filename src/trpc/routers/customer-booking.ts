import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  customerProcedure,
} from "@/trpc/init";
import { db } from "@/lib/db";
import { organization, member, user, service } from "@/db/schema";
import { ORG_ROLES } from "@/lib/permissions";
import { container } from "@/lib/di/container";
import { TYPES } from "@/lib/di/types";
import type { ISchedulingService } from "@/domains/scheduling/interfaces/scheduling.service.interface";
import {
  getAvailableSlotsSchema,
  createAppointmentSchema,
  requestSqueezeInSchema,
} from "@/domains/scheduling/schemas/scheduling.schema";

const getSchedulingService = () =>
  container.get<ISchedulingService>(TYPES.SchedulingService);

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

  /**
   * Returns active services for an organization.
   */
  getServices: publicProcedure
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
          id: service.id,
          name: service.name,
          description: service.description,
          durationMinutes: service.durationMinutes,
          priceInCents: service.priceInCents,
        })
        .from(service)
        .where(
          and(
            eq(service.organizationId, orgRows[0].id),
            eq(service.active, true),
          ),
        )
        .orderBy(service.name);
    }),

  /**
   * Returns available time slots for a barber on a given date.
   */
  getAvailableSlots: publicProcedure
    .input(getAvailableSlotsSchema)
    .query(async ({ input, ctx }) => {
      const svc = getSchedulingService();

      // Resolve org ID from slug
      const orgRows = await db
        .select({ id: organization.id })
        .from(organization)
        .where(eq(organization.slug, input.slug))
        .limit(1);

      if (!orgRows[0]) return [];

      // If customer is authenticated, pass customerId for block checking
      let customerId: string | undefined;
      if (ctx.customerToken) {
        const { customerSession } = await import("@/db/schema");
        const session = await db
          .select({ customerId: customerSession.customerId })
          .from(customerSession)
          .where(eq(customerSession.token, ctx.customerToken))
          .limit(1);
        if (session[0]) customerId = session[0].customerId;
      }

      return svc.getAvailableSlots(
        orgRows[0].id,
        input.barberId,
        input.date,
        input.serviceId,
        customerId,
      );
    }),

  /**
   * Create a regular booking.
   */
  createAppointment: customerProcedure
    .input(createAppointmentSchema)
    .mutation(({ ctx, input }) =>
      getSchedulingService().createAppointment(
        ctx.customerOrgId,
        ctx.customer.id,
        input,
      ),
    ),

  /**
   * Request a squeeze-in (encaixe). Requires barber confirmation.
   */
  requestSqueezeIn: customerProcedure
    .input(requestSqueezeInSchema)
    .mutation(({ ctx, input }) =>
      getSchedulingService().requestSqueezeIn(
        ctx.customerOrgId,
        ctx.customer.id,
        input,
      ),
    ),

  /**
   * List customer's own appointments.
   */
  myAppointments: customerProcedure.query(({ ctx }) =>
    getSchedulingService().listCustomerAppointments(
      ctx.customerOrgId,
      ctx.customer.id,
    ),
  ),

  /**
   * Cancel customer's own appointment.
   */
  cancelAppointment: customerProcedure
    .input(z.object({ appointmentId: z.string() }))
    .mutation(({ ctx, input }) =>
      getSchedulingService().updateAppointmentStatus(
        ctx.customerOrgId,
        input.appointmentId,
        "cancelled",
      ),
    ),
});

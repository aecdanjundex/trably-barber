import { z } from "zod";
import { createTRPCRouter, orgAdminProcedure, orgProcedure } from "@/trpc/init";
import { container } from "@/lib/di/container";
import { TYPES } from "@/lib/di/types";
import type { IAdminService } from "@/domains/admin/interfaces/admin.service.interface";
import {
  createServiceSchema,
  updateServiceSchema,
} from "@/domains/admin/schemas/service.schema";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "@/domains/admin/schemas/customer.schema";
import { ORG_ROLES } from "@/lib/permissions";

const getService = () => container.get<IAdminService>(TYPES.AdminService);

export const adminRouter = createTRPCRouter({
  // ─── Dashboard ─────────────────────────────────────────────────────────────
  getDashboardStats: orgAdminProcedure.query(({ ctx }) =>
    getService().getDashboardStats(ctx.orgId),
  ),

  // ─── Services ──────────────────────────────────────────────────────────────
  listServices: orgAdminProcedure.query(({ ctx }) =>
    getService().listServices(ctx.orgId),
  ),

  createService: orgAdminProcedure
    .input(createServiceSchema)
    .mutation(({ ctx, input }) => getService().createService(ctx.orgId, input)),

  updateService: orgAdminProcedure
    .input(updateServiceSchema)
    .mutation(({ ctx, input }) => getService().updateService(ctx.orgId, input)),

  deleteService: orgAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      getService().deleteService(ctx.orgId, input.id),
    ),

  // ─── Customers ─────────────────────────────────────────────────────────────
  listCustomers: orgAdminProcedure.query(({ ctx }) =>
    getService().listCustomers(ctx.orgId),
  ),

  createCustomer: orgAdminProcedure
    .input(createCustomerSchema)
    .mutation(({ ctx, input }) =>
      getService().createCustomer(ctx.orgId, input),
    ),

  updateCustomer: orgAdminProcedure
    .input(updateCustomerSchema)
    .mutation(({ ctx, input }) =>
      getService().updateCustomer(ctx.orgId, input),
    ),

  // ─── Users ─────────────────────────────────────────────────────────────────
  listOrgMembers: orgProcedure.query(({ ctx }) =>
    getService().listOrgMembers(ctx.orgId),
  ),

  toggleUserBan: orgAdminProcedure
    .input(z.object({ userId: z.string(), banned: z.boolean() }))
    .mutation(({ input }) =>
      getService().toggleUserBan(input.userId, input.banned),
    ),

  // ─── Appointments ──────────────────────────────────────────────────────────
  listAppointments: orgProcedure
    .input(
      z
        .object({
          from: z.date().optional(),
          to: z.date().optional(),
          barberId: z.string().optional(),
        })
        .optional(),
    )
    .query(({ ctx, input }) => {
      const barberId =
        ctx.memberRole === ORG_ROLES.BARBER ? ctx.user.id : input?.barberId;
      return getService().listAppointments(
        ctx.orgId,
        barberId,
        input?.from,
        input?.to,
      );
    }),
});

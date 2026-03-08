import { z } from "zod";
import { createTRPCRouter, orgAdminProcedure, orgProcedure } from "@/trpc/init";
import { container } from "@/lib/di/container";
import { TYPES } from "@/lib/di/types";
import type { IAdminService } from "@/domains/admin/interfaces/admin.service.interface";
import {
  createServiceSchema,
  updateServiceSchema,
} from "@/domains/admin/schemas/service.schema";
import { ORG_ROLES } from "@/lib/permissions";

const getService = () => container.get<IAdminService>(TYPES.AdminService);

export const adminRouter = createTRPCRouter({
  // ─── Dashboard ─────────────────────────────────────────────────────────────
  getDashboardStats: orgProcedure.query(({ ctx }) =>
    getService().getDashboardStats(ctx.orgId),
  ),

  // ─── Services ──────────────────────────────────────────────────────────────
  listServices: orgProcedure.query(({ ctx }) =>
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
  listCustomers: orgProcedure.query(({ ctx }) =>
    getService().listCustomers(ctx.orgId),
  ),

  // ─── Appointments ──────────────────────────────────────────────────────────
  listAppointments: orgProcedure.query(({ ctx }) => {
    const barberId =
      ctx.memberRole === ORG_ROLES.BARBER ? ctx.user.id : undefined;
    return getService().listAppointments(ctx.orgId, barberId);
  }),
});

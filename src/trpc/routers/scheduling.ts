import { z } from "zod";
import { createTRPCRouter, orgProcedure, orgAdminProcedure } from "@/trpc/init";
import { container } from "@/lib/di/container";
import { TYPES } from "@/lib/di/types";
import type { ISchedulingService } from "@/domains/scheduling/interfaces/scheduling.service.interface";
import {
  upsertScheduleConfigSchema,
  deleteScheduleConfigSchema,
  createBarberTimeBlockSchema,
  createCustomerBlockSchema,
  appointmentIdSchema,
  updateAppointmentStatusSchema,
} from "@/domains/scheduling/schemas/scheduling.schema";
import { ORG_ROLES } from "@/lib/permissions";

const getService = () =>
  container.get<ISchedulingService>(TYPES.SchedulingService);

export const schedulingRouter = createTRPCRouter({
  // ─── Schedule Config ─────────────────────────────────────────────────────

  listScheduleConfigs: orgProcedure
    .input(z.object({ barberId: z.string().optional() }).optional())
    .query(({ ctx, input }) => {
      const barberId =
        ctx.memberRole === ORG_ROLES.BARBER ? ctx.user.id : input?.barberId;
      return getService().listScheduleConfigs(ctx.orgId, barberId);
    }),

  upsertScheduleConfig: orgAdminProcedure
    .input(upsertScheduleConfigSchema)
    .mutation(({ ctx, input }) =>
      getService().upsertScheduleConfig(ctx.orgId, input),
    ),

  deleteScheduleConfig: orgAdminProcedure
    .input(deleteScheduleConfigSchema)
    .mutation(({ ctx, input }) =>
      getService().deleteScheduleConfig(
        ctx.orgId,
        input.barberId,
        input.dayOfWeek,
      ),
    ),

  // ─── Barber Time Blocks ──────────────────────────────────────────────────

  listBarberTimeBlocks: orgProcedure
    .input(z.object({ barberId: z.string().optional() }).optional())
    .query(({ ctx, input }) => {
      const barberId =
        ctx.memberRole === ORG_ROLES.BARBER ? ctx.user.id : input?.barberId;
      return getService().listBarberTimeBlocks(ctx.orgId, barberId);
    }),

  createBarberTimeBlock: orgProcedure
    .input(createBarberTimeBlockSchema)
    .mutation(({ ctx, input }) => {
      // Barbers can only create blocks for themselves
      const barberId =
        ctx.memberRole === ORG_ROLES.BARBER ? ctx.user.id : input.barberId;
      return getService().createBarberTimeBlock(ctx.orgId, {
        ...input,
        barberId,
      });
    }),

  deleteBarberTimeBlock: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      getService().deleteBarberTimeBlock(ctx.orgId, input.id),
    ),

  // ─── Customer Blocks ─────────────────────────────────────────────────────

  listCustomerBlocks: orgProcedure
    .input(z.object({ barberId: z.string().optional() }).optional())
    .query(({ ctx, input }) => {
      const barberId =
        ctx.memberRole === ORG_ROLES.BARBER ? ctx.user.id : input?.barberId;
      return getService().listCustomerBlocks(ctx.orgId, barberId);
    }),

  createCustomerBlock: orgProcedure
    .input(createCustomerBlockSchema)
    .mutation(({ ctx, input }) => {
      const barberId =
        ctx.memberRole === ORG_ROLES.BARBER ? ctx.user.id : input.barberId;
      return getService().createCustomerBlock(ctx.orgId, {
        ...input,
        barberId,
      });
    }),

  deleteCustomerBlock: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      getService().deleteCustomerBlock(ctx.orgId, input.id),
    ),

  // ─── Squeeze-in Management ───────────────────────────────────────────────

  confirmSqueezeIn: orgProcedure
    .input(appointmentIdSchema)
    .mutation(({ ctx, input }) =>
      getService().confirmSqueezeIn(ctx.orgId, input.appointmentId),
    ),

  rejectSqueezeIn: orgProcedure
    .input(appointmentIdSchema)
    .mutation(({ ctx, input }) =>
      getService().rejectSqueezeIn(ctx.orgId, input.appointmentId),
    ),

  // ─── Appointment Status ──────────────────────────────────────────────────

  updateAppointmentStatus: orgProcedure
    .input(updateAppointmentStatusSchema)
    .mutation(({ ctx, input }) =>
      getService().updateAppointmentStatus(
        ctx.orgId,
        input.appointmentId,
        input.status,
      ),
    ),
});

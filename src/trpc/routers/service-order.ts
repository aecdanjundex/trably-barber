import { z } from "zod";
import { createTRPCRouter, orgAdminProcedure, orgProcedure } from "@/trpc/init";
import { container } from "@/lib/di/container";
import { TYPES } from "@/lib/di/types";
import type { IServiceOrderService } from "@/domains/service-order/interfaces/service-order.service.interface";
import {
  createProductSchema,
  updateProductSchema,
  createPaymentMethodSchema,
  updatePaymentMethodSchema,
  upsertCommissionConfigSchema,
  createServiceOrderSchema,
  updateServiceOrderSchema,
  addServiceOrderItemSchema,
  updateServiceOrderItemSchema,
  addPaymentSchema,
  createQuickItemSchema,
  updateQuickItemSchema,
  reportDateRangeSchema,
  generateCommissionPaymentSchema,
  updateCommissionPaymentStatusSchema,
} from "@/domains/service-order/schemas/service-order.schema";
import { ORG_ROLES } from "@/lib/permissions";
import { TRPCError } from "@trpc/server";

const getService = () =>
  container.get<IServiceOrderService>(TYPES.ServiceOrderService);

export const serviceOrderRouter = createTRPCRouter({
  // ─── Products ──────────────────────────────────────────────────────────────
  listProducts: orgAdminProcedure.query(({ ctx }) =>
    getService().listProducts(ctx.orgId),
  ),

  createProduct: orgAdminProcedure
    .input(createProductSchema)
    .mutation(({ ctx, input }) => getService().createProduct(ctx.orgId, input)),

  updateProduct: orgAdminProcedure
    .input(updateProductSchema)
    .mutation(({ ctx, input }) => getService().updateProduct(ctx.orgId, input)),

  deleteProduct: orgAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      getService().deleteProduct(ctx.orgId, input.id),
    ),

  // ─── Payment Methods ───────────────────────────────────────────────────────
  listPaymentMethods: orgAdminProcedure.query(({ ctx }) =>
    getService().listPaymentMethods(ctx.orgId),
  ),

  createPaymentMethod: orgAdminProcedure
    .input(createPaymentMethodSchema)
    .mutation(({ ctx, input }) =>
      getService().createPaymentMethod(ctx.orgId, input),
    ),

  updatePaymentMethod: orgAdminProcedure
    .input(updatePaymentMethodSchema)
    .mutation(({ ctx, input }) =>
      getService().updatePaymentMethod(ctx.orgId, input),
    ),

  deletePaymentMethod: orgAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      getService().deletePaymentMethod(ctx.orgId, input.id),
    ),

  // ─── Commission Config ─────────────────────────────────────────────────────
  listCommissionConfigs: orgAdminProcedure.query(({ ctx }) =>
    getService().listCommissionConfigs(ctx.orgId),
  ),

  upsertCommissionConfig: orgAdminProcedure
    .input(upsertCommissionConfigSchema)
    .mutation(({ ctx, input }) =>
      getService().upsertCommissionConfig(ctx.orgId, input),
    ),

  deleteCommissionConfig: orgAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      getService().deleteCommissionConfig(ctx.orgId, input.id),
    ),

  // ─── Service Orders ────────────────────────────────────────────────────────
  listServiceOrders: orgAdminProcedure
    .input(
      z
        .object({
          status: z.string().optional(),
          customerId: z.string().optional(),
          from: z.date().optional(),
          to: z.date().optional(),
        })
        .optional(),
    )
    .query(({ ctx, input }) =>
      getService().listServiceOrders(ctx.orgId, input ?? undefined),
    ),

  getServiceOrder: orgAdminProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      getService().getServiceOrder(ctx.orgId, input.id),
    ),

  createServiceOrder: orgAdminProcedure
    .input(createServiceOrderSchema)
    .mutation(({ ctx, input }) =>
      getService().createServiceOrder(ctx.orgId, input),
    ),

  updateServiceOrder: orgAdminProcedure
    .input(updateServiceOrderSchema)
    .mutation(({ ctx, input }) =>
      getService().updateServiceOrder(ctx.orgId, input),
    ),

  // ─── Service Order Items ───────────────────────────────────────────────────
  addServiceOrderItem: orgAdminProcedure
    .input(addServiceOrderItemSchema)
    .mutation(({ ctx, input }) =>
      getService().addServiceOrderItem(ctx.orgId, input),
    ),

  updateServiceOrderItem: orgAdminProcedure
    .input(updateServiceOrderItemSchema)
    .mutation(({ input }) => getService().updateServiceOrderItem(input)),

  removeServiceOrderItem: orgAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => getService().removeServiceOrderItem(input.id)),

  // ─── Payments ──────────────────────────────────────────────────────────────
  addPayment: orgAdminProcedure
    .input(addPaymentSchema)
    .mutation(({ input }) => getService().addPayment(input)),

  removePayment: orgAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => getService().removePayment(input.id)),

  listPaymentsByDateRange: orgAdminProcedure
    .input(z.object({ from: z.date(), to: z.date() }))
    .query(({ ctx, input }) =>
      getService().listPaymentsByDateRange(ctx.orgId, input.from, input.to),
    ),

  // ─── Quick Items ───────────────────────────────────────────────────────────
  listQuickItems: orgAdminProcedure.query(({ ctx }) =>
    getService().listQuickItems(ctx.orgId),
  ),

  createQuickItem: orgAdminProcedure
    .input(createQuickItemSchema)
    .mutation(({ ctx, input }) =>
      getService().createQuickItem(ctx.orgId, input),
    ),

  updateQuickItem: orgAdminProcedure
    .input(updateQuickItemSchema)
    .mutation(({ ctx, input }) =>
      getService().updateQuickItem(ctx.orgId, input),
    ),

  deleteQuickItem: orgAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      getService().deleteQuickItem(ctx.orgId, input.id),
    ),

  // ─── Reports ───────────────────────────────────────────────────────────────
  reportTotalInvoiced: orgAdminProcedure
    .input(reportDateRangeSchema)
    .query(({ ctx, input }) =>
      getService().getReportTotalInvoiced(ctx.orgId, input.from, input.to),
    ),

  reportAverageTicket: orgAdminProcedure
    .input(reportDateRangeSchema)
    .query(({ ctx, input }) =>
      getService().getReportAverageTicket(ctx.orgId, input.from, input.to),
    ),

  reportByPaymentMethod: orgAdminProcedure
    .input(reportDateRangeSchema)
    .query(({ ctx, input }) =>
      getService().getReportByPaymentMethod(ctx.orgId, input.from, input.to),
    ),

  reportByProfessional: orgAdminProcedure
    .input(reportDateRangeSchema)
    .query(({ ctx, input }) =>
      getService().getReportByProfessional(ctx.orgId, input.from, input.to),
    ),

  reportByProduct: orgAdminProcedure
    .input(reportDateRangeSchema)
    .query(({ ctx, input }) =>
      getService().getReportByProduct(ctx.orgId, input.from, input.to),
    ),

  reportByService: orgAdminProcedure
    .input(reportDateRangeSchema)
    .query(({ ctx, input }) =>
      getService().getReportByService(ctx.orgId, input.from, input.to),
    ),

  // ─── Commission Payments ───────────────────────────────────────────────────
  listCommissionPayments: orgProcedure
    .input(
      z
        .object({
          professionalId: z.string().optional(),
          status: z.string().optional(),
        })
        .optional(),
    )
    .query(({ ctx, input }) => {
      const professionalId =
        ctx.memberRole === ORG_ROLES.BARBER
          ? ctx.user.id
          : input?.professionalId;
      return getService().listCommissionPayments(ctx.orgId, {
        ...input,
        professionalId,
      });
    }),

  getCommissionPayment: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const payment = await getService().getCommissionPayment(
        ctx.orgId,
        input.id,
      );
      if (
        ctx.memberRole === ORG_ROLES.BARBER &&
        payment?.professionalId !== ctx.user.id
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Acesso negado",
        });
      }
      return payment;
    }),

  generateCommissionPayment: orgAdminProcedure
    .input(generateCommissionPaymentSchema)
    .mutation(({ ctx, input }) =>
      getService().generateCommissionPayment(ctx.orgId, input),
    ),

  updateCommissionPaymentStatus: orgAdminProcedure
    .input(updateCommissionPaymentStatusSchema)
    .mutation(({ ctx, input }) =>
      getService().updateCommissionPaymentStatus(
        ctx.orgId,
        input.id,
        input.status,
      ),
    ),
});

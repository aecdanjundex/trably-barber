import { z } from "zod";
import {
  createTRPCRouter,
  orgAdminProcedure,
  orgProcedure,
} from "@/trpc/init";
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
} from "@/domains/service-order/schemas/service-order.schema";

const getService = () =>
  container.get<IServiceOrderService>(TYPES.ServiceOrderService);

export const serviceOrderRouter = createTRPCRouter({
  // ─── Products ──────────────────────────────────────────────────────────────
  listProducts: orgProcedure.query(({ ctx }) =>
    getService().listProducts(ctx.orgId),
  ),

  createProduct: orgAdminProcedure
    .input(createProductSchema)
    .mutation(({ ctx, input }) =>
      getService().createProduct(ctx.orgId, input),
    ),

  updateProduct: orgAdminProcedure
    .input(updateProductSchema)
    .mutation(({ ctx, input }) =>
      getService().updateProduct(ctx.orgId, input),
    ),

  deleteProduct: orgAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      getService().deleteProduct(ctx.orgId, input.id),
    ),

  // ─── Payment Methods ───────────────────────────────────────────────────────
  listPaymentMethods: orgProcedure.query(({ ctx }) =>
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
  listCommissionConfigs: orgProcedure.query(({ ctx }) =>
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
  listServiceOrders: orgProcedure
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

  getServiceOrder: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      getService().getServiceOrder(ctx.orgId, input.id),
    ),

  createServiceOrder: orgProcedure
    .input(createServiceOrderSchema)
    .mutation(({ ctx, input }) =>
      getService().createServiceOrder(ctx.orgId, input),
    ),

  updateServiceOrder: orgProcedure
    .input(updateServiceOrderSchema)
    .mutation(({ ctx, input }) =>
      getService().updateServiceOrder(ctx.orgId, input),
    ),

  // ─── Service Order Items ───────────────────────────────────────────────────
  addServiceOrderItem: orgProcedure
    .input(addServiceOrderItemSchema)
    .mutation(({ ctx, input }) =>
      getService().addServiceOrderItem(ctx.orgId, input),
    ),

  updateServiceOrderItem: orgProcedure
    .input(updateServiceOrderItemSchema)
    .mutation(({ input }) => getService().updateServiceOrderItem(input)),

  removeServiceOrderItem: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => getService().removeServiceOrderItem(input.id)),

  // ─── Payments ──────────────────────────────────────────────────────────────
  addPayment: orgProcedure
    .input(addPaymentSchema)
    .mutation(({ input }) => getService().addPayment(input)),

  removePayment: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => getService().removePayment(input.id)),

  listPaymentsByDateRange: orgProcedure
    .input(z.object({ from: z.date(), to: z.date() }))
    .query(({ ctx, input }) =>
      getService().listPaymentsByDateRange(ctx.orgId, input.from, input.to),
    ),

  // ─── Quick Items ───────────────────────────────────────────────────────────
  listQuickItems: orgProcedure.query(({ ctx }) =>
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
});

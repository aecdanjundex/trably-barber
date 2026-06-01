import { z } from "zod";
import { createTRPCRouter, orgProcedure, orgAdminProcedure } from "../init";
import { container } from "@/lib/di/container";
import { TYPES } from "@/lib/di/types";
import type { IServiceOrderService } from "@/domains/service-order/interfaces/service-order.service.interface";
import { db } from "@/lib/db";
import { service, product, paymentMethod } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const orderService = () =>
  container.get<IServiceOrderService>(TYPES.ServiceOrderService);

export const serviceOrderRouter = createTRPCRouter({
  list: orgProcedure
    .input(
      z.object({
        status: z
          .enum(["open", "in_progress", "completed", "cancelled"])
          .optional(),
        clientId: z.string().optional(),
        search: z.string().optional(),
        page: z.number().int().positive().default(1),
        pageSize: z.number().int().positive().max(100).default(20),
      }),
    )
    .query(({ ctx, input }) =>
      orderService().list({ organizationId: ctx.orgId, ...input }),
    ),

  getById: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => orderService().getById(input.id, ctx.orgId)),

  create: orgProcedure
    .input(
      z.object({
        clientId: z.string().optional().nullable(),
        assignedToId: z.string().optional().nullable(),
        dueDate: z.date().optional().nullable(),
        notes: z.string().optional().nullable(),
        discountInCents: z.number().int().min(0).default(0),
        items: z
          .array(
            z.object({
              itemType: z.enum(["service", "product"]),
              referenceId: z.string().optional().nullable(),
              name: z.string().min(1),
              quantity: z.number().int().positive(),
              unitPriceInCents: z.number().int().min(0),
              notes: z.string().optional().nullable(),
            }),
          )
          .default([]),
      }),
    )
    .mutation(({ ctx, input }) =>
      orderService().create({ organizationId: ctx.orgId, ...input }),
    ),

  update: orgProcedure
    .input(
      z.object({
        id: z.string(),
        clientId: z.string().optional().nullable(),
        assignedToId: z.string().optional().nullable(),
        status: z
          .enum(["open", "in_progress", "completed", "cancelled"])
          .optional(),
        discountInCents: z.number().int().min(0).optional(),
        dueDate: z.date().optional().nullable(),
        notes: z.string().optional().nullable(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return orderService().update(id, ctx.orgId, data);
    }),

  delete: orgAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => orderService().delete(input.id, ctx.orgId)),

  addItem: orgProcedure
    .input(
      z.object({
        serviceOrderId: z.string(),
        itemType: z.enum(["service", "product"]),
        referenceId: z.string().optional().nullable(),
        name: z.string().min(1),
        quantity: z.number().int().positive(),
        unitPriceInCents: z.number().int().min(0),
        notes: z.string().optional().nullable(),
      }),
    )
    .mutation(({ input }) => orderService().addItem(input)),

  removeItem: orgProcedure
    .input(z.object({ itemId: z.string(), serviceOrderId: z.string() }))
    .mutation(({ ctx, input }) =>
      orderService().removeItem(input.itemId, input.serviceOrderId, ctx.orgId),
    ),

  addPayment: orgProcedure
    .input(
      z.object({
        serviceOrderId: z.string(),
        paymentMethodId: z.string(),
        amountInCents: z.number().int().positive(),
        paidAt: z.date().optional(),
        notes: z.string().optional().nullable(),
      }),
    )
    .mutation(({ input }) => orderService().addPayment(input)),

  removePayment: orgProcedure
    .input(z.object({ paymentId: z.string(), serviceOrderId: z.string() }))
    .mutation(({ ctx, input }) =>
      orderService().removePayment(
        input.paymentId,
        input.serviceOrderId,
        ctx.orgId,
      ),
    ),

  listServices: orgProcedure.query(({ ctx }) =>
    db
      .select()
      .from(service)
      .where(and(eq(service.organizationId, ctx.orgId), eq(service.active, true))),
  ),

  listProducts: orgProcedure.query(({ ctx }) =>
    db
      .select()
      .from(product)
      .where(and(eq(product.organizationId, ctx.orgId), eq(product.active, true))),
  ),

  listPaymentMethods: orgProcedure.query(({ ctx }) =>
    db
      .select()
      .from(paymentMethod)
      .where(
        and(
          eq(paymentMethod.organizationId, ctx.orgId),
          eq(paymentMethod.active, true),
        ),
      ),
  ),
});

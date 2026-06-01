import { z } from "zod";
import { createTRPCRouter, orgProcedure, orgAdminProcedure } from "../init";
import { container } from "@/lib/di/container";
import { TYPES } from "@/lib/di/types";
import type { IFinancialService } from "@/domains/financial/interfaces/financial.service.interface";

const financialService = () =>
  container.get<IFinancialService>(TYPES.FinancialService);

export const financialRouter = createTRPCRouter({
  summary: orgProcedure
    .input(z.object({ from: z.date(), to: z.date() }))
    .query(({ ctx, input }) =>
      financialService().getSummary({
        organizationId: ctx.orgId,
        from: input.from,
        to: input.to,
      }),
    ),

  revenueByDay: orgProcedure
    .input(z.object({ from: z.date(), to: z.date() }))
    .query(({ ctx, input }) =>
      financialService().getRevenueByDay({
        organizationId: ctx.orgId,
        from: input.from,
        to: input.to,
      }),
    ),

  topServices: orgProcedure
    .input(
      z.object({
        from: z.date(),
        to: z.date(),
        limit: z.number().int().positive().max(20).default(5),
      }),
    )
    .query(({ ctx, input }) =>
      financialService().getTopServices(
        { organizationId: ctx.orgId, from: input.from, to: input.to },
        input.limit,
      ),
    ),

  revenueByPaymentMethod: orgProcedure
    .input(z.object({ from: z.date(), to: z.date() }))
    .query(({ ctx, input }) =>
      financialService().getRevenueByPaymentMethod({
        organizationId: ctx.orgId,
        from: input.from,
        to: input.to,
      }),
    ),

  listExpenses: orgProcedure
    .input(z.object({ from: z.date(), to: z.date() }))
    .query(({ ctx, input }) =>
      financialService().listExpenses(ctx.orgId, input.from, input.to),
    ),

  createExpense: orgAdminProcedure
    .input(
      z.object({
        category: z
          .enum(["rent", "supplies", "payroll", "marketing", "utilities", "other"])
          .default("other"),
        description: z.string().min(1),
        amountInCents: z.number().int().positive(),
        date: z.date(),
      }),
    )
    .mutation(({ ctx, input }) =>
      financialService().createExpense({
        ...input,
        organizationId: ctx.orgId,
        createdById: ctx.user.id,
      }),
    ),

  updateExpense: orgAdminProcedure
    .input(
      z.object({
        id: z.string(),
        category: z
          .enum(["rent", "supplies", "payroll", "marketing", "utilities", "other"])
          .optional(),
        description: z.string().min(1).optional(),
        amountInCents: z.number().int().positive().optional(),
        date: z.date().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return financialService().updateExpense(id, ctx.orgId, data);
    }),

  deleteExpense: orgAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      financialService().deleteExpense(input.id, ctx.orgId),
    ),
});

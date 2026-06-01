import "reflect-metadata";
import { injectable, inject } from "inversify";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { TYPES } from "@/lib/di/types";
import type { Database } from "@/lib/db";
import {
  expense,
  serviceOrder,
  serviceOrderItem,
  serviceOrderPayment,
  paymentMethod,
} from "@/db/schema";
import type { IFinancialRepository } from "../interfaces/financial.repository.interface";
import type {
  Expense,
  FinancialSummary,
  RevenueByPeriod,
  TopService,
  RevenueByPaymentMethod,
  CreateExpenseInput,
  UpdateExpenseInput,
  FinancialReportInput,
} from "../types";

@injectable()
export class FinancialRepository implements IFinancialRepository {
  constructor(@inject(TYPES.Database) private db: Database) {}

  async listExpenses(
    organizationId: string,
    from: Date,
    to: Date,
  ): Promise<Expense[]> {
    return this.db
      .select()
      .from(expense)
      .where(
        and(
          eq(expense.organizationId, organizationId),
          gte(expense.date, from),
          lte(expense.date, to),
        ),
      )
      .orderBy(sql`${expense.date} DESC`);
  }

  async createExpense(input: CreateExpenseInput): Promise<Expense> {
    const [created] = await this.db
      .insert(expense)
      .values({
        id: crypto.randomUUID(),
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return created;
  }

  async updateExpense(
    id: string,
    organizationId: string,
    input: UpdateExpenseInput,
  ): Promise<Expense> {
    const [updated] = await this.db
      .update(expense)
      .set({ ...input, updatedAt: new Date() })
      .where(
        and(eq(expense.id, id), eq(expense.organizationId, organizationId)),
      )
      .returning();
    return updated;
  }

  async deleteExpense(id: string, organizationId: string): Promise<void> {
    await this.db
      .delete(expense)
      .where(
        and(eq(expense.id, id), eq(expense.organizationId, organizationId)),
      );
  }

  async getSummary(input: FinancialReportInput): Promise<FinancialSummary> {
    const { organizationId, from, to } = input;

    const [revenueResult, expenseResult, ordersResult] = await Promise.all([
      this.db
        .select({
          total: sql<number>`coalesce(sum(${serviceOrderPayment.amountInCents}), 0)`,
        })
        .from(serviceOrderPayment)
        .innerJoin(
          serviceOrder,
          eq(serviceOrderPayment.serviceOrderId, serviceOrder.id),
        )
        .where(
          and(
            eq(serviceOrder.organizationId, organizationId),
            eq(serviceOrder.status, "completed"),
            gte(serviceOrderPayment.paidAt, from),
            lte(serviceOrderPayment.paidAt, to),
          ),
        ),

      this.db
        .select({
          total: sql<number>`coalesce(sum(${expense.amountInCents}), 0)`,
        })
        .from(expense)
        .where(
          and(
            eq(expense.organizationId, organizationId),
            gte(expense.date, from),
            lte(expense.date, to),
          ),
        ),

      this.db
        .select({ count: sql<number>`count(*)` })
        .from(serviceOrder)
        .where(
          and(
            eq(serviceOrder.organizationId, organizationId),
            eq(serviceOrder.status, "completed"),
            gte(serviceOrder.updatedAt, from),
            lte(serviceOrder.updatedAt, to),
          ),
        ),
    ]);

    const revenueInCents = Number(revenueResult[0]?.total ?? 0);
    const expensesInCents = Number(expenseResult[0]?.total ?? 0);
    const ordersCompleted = Number(ordersResult[0]?.count ?? 0);

    return {
      revenueInCents,
      expensesInCents,
      profitInCents: revenueInCents - expensesInCents,
      ordersCompleted,
      averageOrderValueInCents:
        ordersCompleted > 0
          ? Math.round(revenueInCents / ordersCompleted)
          : 0,
    };
  }

  async getRevenueByDay(
    input: FinancialReportInput,
  ): Promise<RevenueByPeriod[]> {
    const { organizationId, from, to } = input;

    const rows = await this.db
      .select({
        date: sql<string>`date_trunc('day', ${serviceOrderPayment.paidAt})::date::text`,
        revenueInCents: sql<number>`coalesce(sum(${serviceOrderPayment.amountInCents}), 0)`,
        ordersCount: sql<number>`count(distinct ${serviceOrderPayment.serviceOrderId})`,
      })
      .from(serviceOrderPayment)
      .innerJoin(
        serviceOrder,
        eq(serviceOrderPayment.serviceOrderId, serviceOrder.id),
      )
      .where(
        and(
          eq(serviceOrder.organizationId, organizationId),
          eq(serviceOrder.status, "completed"),
          gte(serviceOrderPayment.paidAt, from),
          lte(serviceOrderPayment.paidAt, to),
        ),
      )
      .groupBy(sql`date_trunc('day', ${serviceOrderPayment.paidAt})::date`)
      .orderBy(sql`date_trunc('day', ${serviceOrderPayment.paidAt})::date`);

    return rows.map((r) => ({
      date: r.date,
      revenueInCents: Number(r.revenueInCents),
      ordersCount: Number(r.ordersCount),
    }));
  }

  async getTopServices(
    input: FinancialReportInput,
    limit = 5,
  ): Promise<TopService[]> {
    const { organizationId, from, to } = input;

    const rows = await this.db
      .select({
        name: serviceOrderItem.name,
        count: sql<number>`sum(${serviceOrderItem.quantity})`,
        revenueInCents: sql<number>`sum(${serviceOrderItem.unitPriceInCents} * ${serviceOrderItem.quantity})`,
      })
      .from(serviceOrderItem)
      .innerJoin(
        serviceOrder,
        eq(serviceOrderItem.serviceOrderId, serviceOrder.id),
      )
      .where(
        and(
          eq(serviceOrder.organizationId, organizationId),
          eq(serviceOrder.status, "completed"),
          eq(serviceOrderItem.itemType, "service"),
          gte(serviceOrder.updatedAt, from),
          lte(serviceOrder.updatedAt, to),
        ),
      )
      .groupBy(serviceOrderItem.name)
      .orderBy(sql`sum(${serviceOrderItem.unitPriceInCents} * ${serviceOrderItem.quantity}) DESC`)
      .limit(limit);

    return rows.map((r) => ({
      name: r.name,
      count: Number(r.count),
      revenueInCents: Number(r.revenueInCents),
    }));
  }

  async getRevenueByPaymentMethod(
    input: FinancialReportInput,
  ): Promise<RevenueByPaymentMethod[]> {
    const { organizationId, from, to } = input;

    const [rows, totalResult] = await Promise.all([
      this.db
        .select({
          paymentMethodName: paymentMethod.name,
          amountInCents: sql<number>`sum(${serviceOrderPayment.amountInCents})`,
        })
        .from(serviceOrderPayment)
        .innerJoin(
          serviceOrder,
          eq(serviceOrderPayment.serviceOrderId, serviceOrder.id),
        )
        .innerJoin(
          paymentMethod,
          eq(serviceOrderPayment.paymentMethodId, paymentMethod.id),
        )
        .where(
          and(
            eq(serviceOrder.organizationId, organizationId),
            eq(serviceOrder.status, "completed"),
            gte(serviceOrderPayment.paidAt, from),
            lte(serviceOrderPayment.paidAt, to),
          ),
        )
        .groupBy(paymentMethod.name)
        .orderBy(sql`sum(${serviceOrderPayment.amountInCents}) DESC`),

      this.db
        .select({
          total: sql<number>`coalesce(sum(${serviceOrderPayment.amountInCents}), 0)`,
        })
        .from(serviceOrderPayment)
        .innerJoin(
          serviceOrder,
          eq(serviceOrderPayment.serviceOrderId, serviceOrder.id),
        )
        .where(
          and(
            eq(serviceOrder.organizationId, organizationId),
            eq(serviceOrder.status, "completed"),
            gte(serviceOrderPayment.paidAt, from),
            lte(serviceOrderPayment.paidAt, to),
          ),
        ),
    ]);

    const total = Number(totalResult[0]?.total ?? 0);
    return rows.map((r) => ({
      paymentMethodName: r.paymentMethodName,
      amountInCents: Number(r.amountInCents),
      percentage: total > 0 ? Math.round((Number(r.amountInCents) / total) * 100) : 0,
    }));
  }
}

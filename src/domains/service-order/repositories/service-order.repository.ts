import "reflect-metadata";
import { injectable, inject } from "inversify";
import { eq, and, ilike, or, sql, desc } from "drizzle-orm";
import { TYPES } from "@/lib/di/types";
import type { Database } from "@/lib/db";
import {
  serviceOrder,
  serviceOrderItem,
  serviceOrderPayment,
  paymentMethod,
  client,
  user,
} from "@/db/schema";
import type { IServiceOrderRepository } from "../interfaces/service-order.repository.interface";
import type {
  ServiceOrder,
  ServiceOrderItem,
  ServiceOrderPayment,
  ServiceOrderDetail,
  CreateOrderInput,
  UpdateOrderInput,
  AddOrderItemInput,
  AddOrderPaymentInput,
  ListOrdersInput,
} from "../types";

@injectable()
export class ServiceOrderRepository implements IServiceOrderRepository {
  constructor(@inject(TYPES.Database) private db: Database) {}

  async list(
    input: ListOrdersInput,
  ): Promise<{ data: ServiceOrder[]; total: number }> {
    const {
      organizationId,
      status,
      clientId,
      search,
      page = 1,
      pageSize = 20,
    } = input;

    const conditions = [eq(serviceOrder.organizationId, organizationId)];
    if (status) conditions.push(eq(serviceOrder.status, status));
    if (clientId) conditions.push(eq(serviceOrder.clientId, clientId));

    if (search) {
      // Search by order number (if the term is numeric) OR by client name.
      // We intentionally do NOT bail early when no clients match the term —
      // orders without a client, or orders matched by number, must still show.
      const clientMatch = await this.db
        .select({ id: client.id })
        .from(client)
        .where(
          and(
            eq(client.organizationId, organizationId),
            ilike(client.name, `%${search}%`),
          ),
        );
      const matchingClientIds = clientMatch.map((c) => c.id);

      const searchConditions = [];

      // Match by order number when the search term is a plain integer
      const numericTerm = parseInt(search, 10);
      if (!isNaN(numericTerm) && String(numericTerm) === search.trim()) {
        searchConditions.push(eq(serviceOrder.number, numericTerm));
      }

      // Match by client name
      if (matchingClientIds.length > 0) {
        searchConditions.push(
          or(...matchingClientIds.map((id) => eq(serviceOrder.clientId, id)))!,
        );
      }

      if (searchConditions.length === 0) {
        // No criteria matched at all — return empty result
        return { data: [], total: 0 };
      }

      conditions.push(or(...searchConditions)!);
    }

    const whereClause = and(...conditions);

    const [rows, countResult] = await Promise.all([
      this.db
        .select({
          id: serviceOrder.id,
          organizationId: serviceOrder.organizationId,
          number: serviceOrder.number,
          clientId: serviceOrder.clientId,
          clientName: client.name,
          assignedToId: serviceOrder.assignedToId,
          status: serviceOrder.status,
          discountInCents: serviceOrder.discountInCents,
          dueDate: serviceOrder.dueDate,
          notes: serviceOrder.notes,
          createdAt: serviceOrder.createdAt,
          updatedAt: serviceOrder.updatedAt,
        })
        .from(serviceOrder)
        .leftJoin(client, eq(serviceOrder.clientId, client.id))
        .where(whereClause)
        .orderBy(desc(serviceOrder.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.db
        .select({ count: sql<number>`count(*)` })
        .from(serviceOrder)
        .where(whereClause),
    ]);

    return {
      data: rows.map((r) => ({ ...r, clientName: r.clientName ?? null })),
      total: Number(countResult[0]?.count ?? 0),
    };
  }

  async findById(
    id: string,
    organizationId: string,
  ): Promise<ServiceOrderDetail | null> {
    const rows = await this.db
      .select()
      .from(serviceOrder)
      .where(
        and(
          eq(serviceOrder.id, id),
          eq(serviceOrder.organizationId, organizationId),
        ),
      )
      .limit(1);

    if (!rows[0]) return null;
    const order = rows[0];

    const [clientRow, assignedRow, items, payments] = await Promise.all([
      order.clientId
        ? this.db
            .select({ name: client.name })
            .from(client)
            .where(eq(client.id, order.clientId))
            .limit(1)
        : Promise.resolve([]),

      order.assignedToId
        ? this.db
            .select({ name: user.name })
            .from(user)
            .where(eq(user.id, order.assignedToId))
            .limit(1)
        : Promise.resolve([]),

      this.db
        .select()
        .from(serviceOrderItem)
        .where(eq(serviceOrderItem.serviceOrderId, id)),

      this.db
        .select({
          payment: serviceOrderPayment,
          paymentMethodName: paymentMethod.name,
        })
        .from(serviceOrderPayment)
        .innerJoin(
          paymentMethod,
          eq(serviceOrderPayment.paymentMethodId, paymentMethod.id),
        )
        .where(eq(serviceOrderPayment.serviceOrderId, id)),
    ]);

    const totalInCents = items.reduce(
      (sum, i) => sum + i.unitPriceInCents * i.quantity,
      0,
    );
    const paidInCents = payments.reduce(
      (sum, p) => sum + p.payment.amountInCents,
      0,
    );

    return {
      ...order,
      clientName: (clientRow as { name: string }[])[0]?.name ?? null,
      assignedToName: (assignedRow as { name: string }[])[0]?.name ?? null,
      items,
      payments: payments.map((p) => ({
        ...p.payment,
        paymentMethodName: p.paymentMethodName,
      })),
      totalInCents: totalInCents - order.discountInCents,
      paidInCents,
      balanceInCents: totalInCents - order.discountInCents - paidInCents,
    };
  }

  async create(input: CreateOrderInput): Promise<ServiceOrder> {
    const { items, ...orderData } = input;
    const id = crypto.randomUUID();
    const now = new Date();
    const number = await this.nextNumber(input.organizationId);

    const [created] = await this.db
      .insert(serviceOrder)
      .values({
        id,
        number,
        status: "open",
        discountInCents: orderData.discountInCents ?? 0,
        ...orderData,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    if (items.length > 0) {
      await this.db.insert(serviceOrderItem).values(
        items.map((item) => ({
          id: crypto.randomUUID(),
          serviceOrderId: id,
          ...item,
          createdAt: now,
        })),
      );
    }

    return { ...created, clientName: null };
  }

  async update(
    id: string,
    organizationId: string,
    input: UpdateOrderInput,
  ): Promise<ServiceOrder> {
    const [updated] = await this.db
      .update(serviceOrder)
      .set({ ...input, updatedAt: new Date() })
      .where(
        and(
          eq(serviceOrder.id, id),
          eq(serviceOrder.organizationId, organizationId),
        ),
      )
      .returning();
    return { ...updated, clientName: null };
  }

  async delete(id: string, organizationId: string): Promise<void> {
    await this.db
      .delete(serviceOrder)
      .where(
        and(
          eq(serviceOrder.id, id),
          eq(serviceOrder.organizationId, organizationId),
        ),
      );
  }

  async addItem(input: AddOrderItemInput): Promise<ServiceOrderItem> {
    const [created] = await this.db
      .insert(serviceOrderItem)
      .values({
        id: crypto.randomUUID(),
        ...input,
        createdAt: new Date(),
      })
      .returning();
    return created;
  }

  async removeItem(
    itemId: string,
    serviceOrderId: string,
    _organizationId: string,
  ): Promise<void> {
    await this.db
      .delete(serviceOrderItem)
      .where(
        and(
          eq(serviceOrderItem.id, itemId),
          eq(serviceOrderItem.serviceOrderId, serviceOrderId),
        ),
      );
  }

  async addPayment(input: AddOrderPaymentInput): Promise<ServiceOrderPayment> {
    const [created] = await this.db
      .insert(serviceOrderPayment)
      .values({
        id: crypto.randomUUID(),
        paidAt: input.paidAt ?? new Date(),
        ...input,
        createdAt: new Date(),
      })
      .returning();
    return created;
  }

  async removePayment(
    paymentId: string,
    serviceOrderId: string,
    _organizationId: string,
  ): Promise<void> {
    await this.db
      .delete(serviceOrderPayment)
      .where(
        and(
          eq(serviceOrderPayment.id, paymentId),
          eq(serviceOrderPayment.serviceOrderId, serviceOrderId),
        ),
      );
  }

  async nextNumber(organizationId: string): Promise<number> {
    // Use FOR UPDATE to lock the scanned rows so that two concurrent requests
    // cannot both read the same max and generate duplicate order numbers,
    // which would violate the UNIQUE constraint and cause a 500 error.
    const rows = await this.db.execute<{ next_number: string }>(
      sql`
        WITH locked AS (
          SELECT COALESCE(MAX(number), 0) AS current_max
          FROM service_order
          WHERE organization_id = ${organizationId}
          FOR UPDATE
        )
        SELECT current_max + 1 AS next_number FROM locked
      `,
    );
    return Number(rows[0]?.next_number ?? 1);
  }
}

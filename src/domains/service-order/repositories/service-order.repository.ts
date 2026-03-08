import "server-only";
import { inject, injectable } from "inversify";
import { eq, and, desc, gte, lte, inArray } from "drizzle-orm";
import type { Database } from "@/lib/db";
import { TYPES } from "@/lib/di/types";
import {
  product,
  paymentMethod,
  commissionConfig,
  serviceOrder,
  serviceOrderItem,
  serviceOrderItemProfessional,
  serviceOrderPayment,
  quickItem,
  customer,
  user,
  service,
} from "@/db/schema";
import type { IServiceOrderRepository } from "../interfaces/service-order.repository.interface";
import type {
  CreateProductInput,
  UpdateProductInput,
  CreatePaymentMethodInput,
  UpdatePaymentMethodInput,
  UpsertCommissionConfigInput,
  CreateServiceOrderInput,
  UpdateServiceOrderInput,
  UpdateServiceOrderItemInput,
  AddPaymentInput,
  CreateQuickItemInput,
  UpdateQuickItemInput,
} from "../schemas/service-order.schema";
import type { EnrichedServiceOrder, EnrichedQuickItem } from "../types";

@injectable()
class ServiceOrderRepository implements IServiceOrderRepository {
  constructor(@inject(TYPES.Database) private readonly db: Database) {}

  // ─── Products ──────────────────────────────────────────────────────────────

  async listProducts(orgId: string) {
    return this.db
      .select()
      .from(product)
      .where(eq(product.organizationId, orgId))
      .orderBy(product.name);
  }

  async getProduct(orgId: string, id: string) {
    const rows = await this.db
      .select()
      .from(product)
      .where(and(eq(product.id, id), eq(product.organizationId, orgId)))
      .limit(1);
    return rows[0] ?? null;
  }

  async createProduct(orgId: string, input: CreateProductInput) {
    const now = new Date();
    const rows = await this.db
      .insert(product)
      .values({
        id: crypto.randomUUID(),
        organizationId: orgId,
        name: input.name,
        priceInCents: input.priceInCents,
        active: input.active,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return rows[0];
  }

  async updateProduct(orgId: string, input: UpdateProductInput) {
    const { id, ...data } = input;
    const rows = await this.db
      .update(product)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(product.id, id), eq(product.organizationId, orgId)))
      .returning();
    return rows[0] ?? null;
  }

  async deleteProduct(orgId: string, id: string) {
    await this.db
      .delete(product)
      .where(and(eq(product.id, id), eq(product.organizationId, orgId)));
  }

  // ─── Services (read-only) ──────────────────────────────────────────────────

  async getServiceReference(orgId: string, id: string) {
    const rows = await this.db
      .select({ name: service.name, priceInCents: service.priceInCents })
      .from(service)
      .where(and(eq(service.id, id), eq(service.organizationId, orgId)))
      .limit(1);
    return rows[0] ?? null;
  }

  // ─── Payment Methods ───────────────────────────────────────────────────────

  async listPaymentMethods(orgId: string) {
    return this.db
      .select()
      .from(paymentMethod)
      .where(eq(paymentMethod.organizationId, orgId))
      .orderBy(paymentMethod.name);
  }

  async getPaymentMethod(orgId: string, id: string) {
    const rows = await this.db
      .select()
      .from(paymentMethod)
      .where(
        and(eq(paymentMethod.id, id), eq(paymentMethod.organizationId, orgId)),
      )
      .limit(1);
    return rows[0] ?? null;
  }

  async createPaymentMethod(orgId: string, input: CreatePaymentMethodInput) {
    const now = new Date();
    const rows = await this.db
      .insert(paymentMethod)
      .values({
        id: crypto.randomUUID(),
        organizationId: orgId,
        name: input.name,
        active: input.active,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return rows[0];
  }

  async updatePaymentMethod(orgId: string, input: UpdatePaymentMethodInput) {
    const { id, ...data } = input;
    const rows = await this.db
      .update(paymentMethod)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(eq(paymentMethod.id, id), eq(paymentMethod.organizationId, orgId)),
      )
      .returning();
    return rows[0] ?? null;
  }

  async deletePaymentMethod(orgId: string, id: string) {
    await this.db
      .delete(paymentMethod)
      .where(
        and(eq(paymentMethod.id, id), eq(paymentMethod.organizationId, orgId)),
      );
  }

  // ─── Commission Config ─────────────────────────────────────────────────────

  async listCommissionConfigs(orgId: string) {
    const rows = await this.db
      .select({
        id: commissionConfig.id,
        organizationId: commissionConfig.organizationId,
        professionalId: commissionConfig.professionalId,
        referenceType: commissionConfig.referenceType,
        referenceId: commissionConfig.referenceId,
        commissionType: commissionConfig.commissionType,
        fixedValueInCents: commissionConfig.fixedValueInCents,
        percentageValue: commissionConfig.percentageValue,
        createdAt: commissionConfig.createdAt,
        updatedAt: commissionConfig.updatedAt,
        professionalName: user.name,
      })
      .from(commissionConfig)
      .innerJoin(user, eq(commissionConfig.professionalId, user.id))
      .where(eq(commissionConfig.organizationId, orgId))
      .orderBy(user.name);

    // enrich with reference names
    const enriched = await Promise.all(
      rows.map(async (row) => {
        let referenceName = "";
        if (row.referenceType === "service") {
          const [svcRow] = await this.db
            .select({ name: service.name })
            .from(service)
            .where(eq(service.id, row.referenceId))
            .limit(1);
          referenceName = svcRow?.name ?? "Serviço removido";
        } else {
          const [prodRow] = await this.db
            .select({ name: product.name })
            .from(product)
            .where(eq(product.id, row.referenceId))
            .limit(1);
          referenceName = prodRow?.name ?? "Produto removido";
        }
        return { ...row, referenceName };
      }),
    );

    return enriched;
  }

  async getCommissionConfigsForReference(
    orgId: string,
    referenceType: string,
    referenceId: string,
    professionalIds: string[],
  ) {
    if (!professionalIds.length) return [];
    const rows = await this.db
      .select()
      .from(commissionConfig)
      .where(
        and(
          eq(commissionConfig.organizationId, orgId),
          eq(commissionConfig.referenceType, referenceType),
          eq(commissionConfig.referenceId, referenceId),
          inArray(commissionConfig.professionalId, professionalIds),
        ),
      );
    return rows;
  }

  async upsertCommissionConfig(
    orgId: string,
    input: UpsertCommissionConfigInput,
  ) {
    const now = new Date();
    const rows = await this.db
      .insert(commissionConfig)
      .values({
        id: crypto.randomUUID(),
        organizationId: orgId,
        professionalId: input.professionalId,
        referenceType: input.referenceType,
        referenceId: input.referenceId,
        commissionType: input.commissionType,
        fixedValueInCents: input.fixedValueInCents ?? null,
        percentageValue: input.percentageValue ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [
          commissionConfig.professionalId,
          commissionConfig.referenceType,
          commissionConfig.referenceId,
        ],
        set: {
          commissionType: input.commissionType,
          fixedValueInCents: input.fixedValueInCents ?? null,
          percentageValue: input.percentageValue ?? null,
          updatedAt: now,
        },
      })
      .returning();
    return rows[0];
  }

  async deleteCommissionConfig(orgId: string, id: string) {
    await this.db
      .delete(commissionConfig)
      .where(
        and(
          eq(commissionConfig.id, id),
          eq(commissionConfig.organizationId, orgId),
        ),
      );
  }

  // ─── Service Orders ────────────────────────────────────────────────────────

  async listServiceOrders(
    orgId: string,
    filters?: { status?: string; customerId?: string; from?: Date; to?: Date },
  ): Promise<EnrichedServiceOrder[]> {
    const conditions = [eq(serviceOrder.organizationId, orgId)];
    if (filters?.status) conditions.push(eq(serviceOrder.status, filters.status));
    if (filters?.customerId)
      conditions.push(eq(serviceOrder.customerId, filters.customerId));
    if (filters?.from)
      conditions.push(gte(serviceOrder.createdAt, filters.from));
    if (filters?.to) conditions.push(lte(serviceOrder.createdAt, filters.to));

    const orders = await this.db
      .select({
        id: serviceOrder.id,
        organizationId: serviceOrder.organizationId,
        customerId: serviceOrder.customerId,
        status: serviceOrder.status,
        notes: serviceOrder.notes,
        createdAt: serviceOrder.createdAt,
        updatedAt: serviceOrder.updatedAt,
        customerName: customer.name,
        customerPhone: customer.phone,
      })
      .from(serviceOrder)
      .leftJoin(customer, eq(serviceOrder.customerId, customer.id))
      .where(and(...conditions))
      .orderBy(desc(serviceOrder.createdAt));

    return Promise.all(orders.map((o) => this.enrichOrder(o)));
  }

  async getServiceOrder(
    orgId: string,
    id: string,
  ): Promise<EnrichedServiceOrder | null> {
    const rows = await this.db
      .select({
        id: serviceOrder.id,
        organizationId: serviceOrder.organizationId,
        customerId: serviceOrder.customerId,
        status: serviceOrder.status,
        notes: serviceOrder.notes,
        createdAt: serviceOrder.createdAt,
        updatedAt: serviceOrder.updatedAt,
        customerName: customer.name,
        customerPhone: customer.phone,
      })
      .from(serviceOrder)
      .leftJoin(customer, eq(serviceOrder.customerId, customer.id))
      .where(
        and(eq(serviceOrder.id, id), eq(serviceOrder.organizationId, orgId)),
      )
      .limit(1);

    if (!rows[0]) return null;
    return this.enrichOrder(rows[0]);
  }

  private async enrichOrder(
    order: {
      id: string;
      organizationId: string;
      customerId: string | null;
      status: string;
      notes: string | null;
      createdAt: Date;
      updatedAt: Date;
      customerName: string | null;
      customerPhone: string | null;
    },
  ): Promise<EnrichedServiceOrder> {
    // Fetch items
    const items = await this.db
      .select()
      .from(serviceOrderItem)
      .where(eq(serviceOrderItem.serviceOrderId, order.id))
      .orderBy(serviceOrderItem.createdAt);

    // Fetch professionals for each item
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const professionals = await this.db
          .select({
            id: serviceOrderItemProfessional.id,
            serviceOrderItemId: serviceOrderItemProfessional.serviceOrderItemId,
            professionalId: serviceOrderItemProfessional.professionalId,
            commissionType: serviceOrderItemProfessional.commissionType,
            fixedValueInCents:
              serviceOrderItemProfessional.fixedValueInCents,
            percentageValue: serviceOrderItemProfessional.percentageValue,
            createdAt: serviceOrderItemProfessional.createdAt,
            professionalName: user.name,
          })
          .from(serviceOrderItemProfessional)
          .innerJoin(
            user,
            eq(serviceOrderItemProfessional.professionalId, user.id),
          )
          .where(
            eq(serviceOrderItemProfessional.serviceOrderItemId, item.id),
          );

        return { ...item, professionals };
      }),
    );

    // Fetch payments
    const payments = await this.db
      .select({
        id: serviceOrderPayment.id,
        serviceOrderId: serviceOrderPayment.serviceOrderId,
        paymentMethodId: serviceOrderPayment.paymentMethodId,
        amountInCents: serviceOrderPayment.amountInCents,
        paidAt: serviceOrderPayment.paidAt,
        notes: serviceOrderPayment.notes,
        createdAt: serviceOrderPayment.createdAt,
        paymentMethodName: paymentMethod.name,
      })
      .from(serviceOrderPayment)
      .innerJoin(
        paymentMethod,
        eq(serviceOrderPayment.paymentMethodId, paymentMethod.id),
      )
      .where(eq(serviceOrderPayment.serviceOrderId, order.id))
      .orderBy(serviceOrderPayment.paidAt);

    const totalInCents = enrichedItems.reduce(
      (sum, item) => sum + item.unitPriceInCents * item.quantity,
      0,
    );
    const totalPaidInCents = payments.reduce(
      (sum, p) => sum + p.amountInCents,
      0,
    );

    return {
      ...order,
      items: enrichedItems,
      payments,
      totalInCents,
      totalPaidInCents,
    };
  }

  async createServiceOrder(orgId: string, input: CreateServiceOrderInput) {
    const now = new Date();
    const rows = await this.db
      .insert(serviceOrder)
      .values({
        id: crypto.randomUUID(),
        organizationId: orgId,
        customerId: input.customerId ?? null,
        notes: input.notes ?? null,
        status: "open",
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return rows[0];
  }

  async updateServiceOrder(orgId: string, input: UpdateServiceOrderInput) {
    const { id, ...data } = input;
    const rows = await this.db
      .update(serviceOrder)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(eq(serviceOrder.id, id), eq(serviceOrder.organizationId, orgId)),
      )
      .returning();
    return rows[0] ?? null;
  }

  // ─── Service Order Items ───────────────────────────────────────────────────

  async addServiceOrderItem(input: {
    serviceOrderId: string;
    itemType: "service" | "product";
    referenceId: string;
    name: string;
    quantity: number;
    unitPriceInCents: number;
    notes?: string;
    professionals?: {
      professionalId: string;
      commissionType: string;
      fixedValueInCents?: number | null;
      percentageValue?: number | null;
    }[];
  }) {
    const now = new Date();
    const itemId = crypto.randomUUID();

    const rows = await this.db
      .insert(serviceOrderItem)
      .values({
        id: itemId,
        serviceOrderId: input.serviceOrderId,
        itemType: input.itemType,
        referenceId: input.referenceId ?? null,
        name: input.name,
        quantity: input.quantity,
        unitPriceInCents: input.unitPriceInCents,
        notes: input.notes ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // Add professionals
    if (input.professionals?.length) {
      await this.db.insert(serviceOrderItemProfessional).values(
        input.professionals.map((p) => ({
          id: crypto.randomUUID(),
          serviceOrderItemId: itemId,
          professionalId: p.professionalId,
          commissionType: p.commissionType,
          fixedValueInCents: p.fixedValueInCents ?? null,
          percentageValue: p.percentageValue ?? null,
          createdAt: now,
        })),
      );
    }

    return rows[0];
  }

  async updateServiceOrderItem(input: UpdateServiceOrderItemInput) {
    const { id, professionals, ...data } = input;
    const rows = await this.db
      .update(serviceOrderItem)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(serviceOrderItem.id, id))
      .returning();

    if (!rows[0]) return null;

    // Replace professionals if provided
    if (professionals !== undefined) {
      await this.db
        .delete(serviceOrderItemProfessional)
        .where(eq(serviceOrderItemProfessional.serviceOrderItemId, id));

      if (professionals.length) {
        const now = new Date();
        await this.db.insert(serviceOrderItemProfessional).values(
          professionals.map((p) => ({
            id: crypto.randomUUID(),
            serviceOrderItemId: id,
            professionalId: p.professionalId,
            commissionType: p.commissionType,
            fixedValueInCents: p.fixedValueInCents ?? null,
            percentageValue: p.percentageValue ?? null,
            createdAt: now,
          })),
        );
      }
    }

    return rows[0];
  }

  async removeServiceOrderItem(id: string) {
    await this.db
      .delete(serviceOrderItem)
      .where(eq(serviceOrderItem.id, id));
  }

  // ─── Payments ──────────────────────────────────────────────────────────────

  async addPayment(input: AddPaymentInput) {
    const now = new Date();
    const rows = await this.db
      .insert(serviceOrderPayment)
      .values({
        id: crypto.randomUUID(),
        serviceOrderId: input.serviceOrderId,
        paymentMethodId: input.paymentMethodId,
        amountInCents: input.amountInCents,
        paidAt: input.paidAt ?? now,
        notes: input.notes ?? null,
        createdAt: now,
      })
      .returning();
    return rows[0];
  }

  async removePayment(id: string) {
    await this.db
      .delete(serviceOrderPayment)
      .where(eq(serviceOrderPayment.id, id));
  }

  async listPaymentsByDateRange(orgId: string, from: Date, to: Date) {
    return this.db
      .select({
        id: serviceOrderPayment.id,
        serviceOrderId: serviceOrderPayment.serviceOrderId,
        paymentMethodId: serviceOrderPayment.paymentMethodId,
        amountInCents: serviceOrderPayment.amountInCents,
        paidAt: serviceOrderPayment.paidAt,
        notes: serviceOrderPayment.notes,
        createdAt: serviceOrderPayment.createdAt,
        paymentMethodName: paymentMethod.name,
      })
      .from(serviceOrderPayment)
      .innerJoin(
        paymentMethod,
        eq(serviceOrderPayment.paymentMethodId, paymentMethod.id),
      )
      .innerJoin(
        serviceOrder,
        eq(serviceOrderPayment.serviceOrderId, serviceOrder.id),
      )
      .where(
        and(
          eq(serviceOrder.organizationId, orgId),
          gte(serviceOrderPayment.paidAt, from),
          lte(serviceOrderPayment.paidAt, to),
        ),
      )
      .orderBy(serviceOrderPayment.paidAt);
  }

  // ─── Quick Items ───────────────────────────────────────────────────────────

  async listQuickItems(orgId: string): Promise<EnrichedQuickItem[]> {
    const items = await this.db
      .select()
      .from(quickItem)
      .where(eq(quickItem.organizationId, orgId))
      .orderBy(quickItem.displayOrder);

    const enriched = await Promise.all(
      items.map(async (item) => {
        let referenceName = "";
        let referencePriceInCents = 0;
        if (item.itemType === "service") {
          const [svcRow] = await this.db
            .select({ name: service.name, priceInCents: service.priceInCents })
            .from(service)
            .where(eq(service.id, item.referenceId))
            .limit(1);
          referenceName = svcRow?.name ?? "Serviço removido";
          referencePriceInCents = svcRow?.priceInCents ?? 0;
        } else {
          const [prodRow] = await this.db
            .select({ name: product.name, priceInCents: product.priceInCents })
            .from(product)
            .where(eq(product.id, item.referenceId))
            .limit(1);
          referenceName = prodRow?.name ?? "Produto removido";
          referencePriceInCents = prodRow?.priceInCents ?? 0;
        }
        return { ...item, referenceName, referencePriceInCents };
      }),
    );

    return enriched;
  }

  async createQuickItem(orgId: string, input: CreateQuickItemInput) {
    const now = new Date();
    const rows = await this.db
      .insert(quickItem)
      .values({
        id: crypto.randomUUID(),
        organizationId: orgId,
        itemType: input.itemType,
        referenceId: input.referenceId,
        label: input.label,
        displayOrder: input.displayOrder,
        active: input.active,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return rows[0];
  }

  async updateQuickItem(orgId: string, input: UpdateQuickItemInput) {
    const { id, ...data } = input;
    const rows = await this.db
      .update(quickItem)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(quickItem.id, id), eq(quickItem.organizationId, orgId)))
      .returning();
    return rows[0] ?? null;
  }

  async deleteQuickItem(orgId: string, id: string) {
    await this.db
      .delete(quickItem)
      .where(and(eq(quickItem.id, id), eq(quickItem.organizationId, orgId)));
  }
}

export { ServiceOrderRepository };

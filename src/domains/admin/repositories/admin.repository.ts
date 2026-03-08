import "server-only";
import { inject, injectable } from "inversify";
import { eq, and, count, gte, lte, lt, desc, sql } from "drizzle-orm";
import type { Database } from "@/lib/db";
import { TYPES } from "@/lib/di/types";
import {
  service,
  customer,
  appointment,
  user,
  member,
  serviceOrder,
  serviceOrderItem,
} from "@/db/schema";
import type { IAdminRepository } from "../interfaces/admin.repository.interface";
import type {
  CreateServiceInput,
  UpdateServiceInput,
} from "../schemas/service.schema";
import type {
  CreateCustomerInput,
  UpdateCustomerInput,
} from "../schemas/customer.schema";

@injectable()
class AdminRepository implements IAdminRepository {
  constructor(@inject(TYPES.Database) private readonly db: Database) {}

  // ─── Services ────────────────────────────────────────────────────────────────

  async listServices(orgId: string) {
    return this.db
      .select()
      .from(service)
      .where(eq(service.organizationId, orgId))
      .orderBy(service.name);
  }

  async getService(orgId: string, id: string) {
    const rows = await this.db
      .select()
      .from(service)
      .where(and(eq(service.id, id), eq(service.organizationId, orgId)))
      .limit(1);
    return rows[0] ?? null;
  }

  async createService(orgId: string, input: CreateServiceInput) {
    const now = new Date();
    const rows = await this.db
      .insert(service)
      .values({
        id: crypto.randomUUID(),
        organizationId: orgId,
        name: input.name,
        description: input.description,
        durationMinutes: input.durationMinutes,
        priceInCents: input.priceInCents,
        active: input.active,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return rows[0];
  }

  async updateService(orgId: string, input: UpdateServiceInput) {
    const { id, ...data } = input;
    const rows = await this.db
      .update(service)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(service.id, id), eq(service.organizationId, orgId)))
      .returning();
    return rows[0] ?? null;
  }

  async deleteService(orgId: string, id: string) {
    await this.db
      .delete(service)
      .where(and(eq(service.id, id), eq(service.organizationId, orgId)));
  }

  // ─── Customers ───────────────────────────────────────────────────────────────

  async listCustomers(orgId: string) {
    return this.db
      .select()
      .from(customer)
      .where(eq(customer.organizationId, orgId))
      .orderBy(desc(customer.createdAt));
  }

  async createCustomer(orgId: string, input: CreateCustomerInput) {
    const now = new Date();
    const rows = await this.db
      .insert(customer)
      .values({
        id: crypto.randomUUID(),
        organizationId: orgId,
        name: input.name,
        phone: input.phone,
        email: input.email || null,
        notes: input.notes || null,
        active: true,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return rows[0];
  }

  async updateCustomer(orgId: string, input: UpdateCustomerInput) {
    const { id, ...data } = input;
    const rows = await this.db
      .update(customer)
      .set({ ...data, email: data.email || null, updatedAt: new Date() })
      .where(and(eq(customer.id, id), eq(customer.organizationId, orgId)))
      .returning();
    return rows[0] ?? null;
  }

  // ─── Users ───────────────────────────────────────────────────────────────────

  async toggleUserBan(userId: string, banned: boolean) {
    await this.db
      .update(user)
      .set({ banned, updatedAt: new Date() })
      .where(eq(user.id, userId));
  }

  async listOrgMembers(orgId: string) {
    const rows = await this.db
      .select({
        id: member.id,
        role: member.role,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userImage: user.image,
        banned: user.banned,
      })
      .from(member)
      .innerJoin(user, eq(member.userId, user.id))
      .where(eq(member.organizationId, orgId))
      .orderBy(user.name);
    return rows.map((r) => ({
      ...r,
      banned: r.banned ?? false,
    }));
  }

  // ─── Appointments ────────────────────────────────────────────────────────────

  async listAppointments(
    orgId: string,
    barberId?: string,
    from?: Date,
    to?: Date,
  ) {
    const conditions = [eq(appointment.organizationId, orgId)];
    if (barberId) conditions.push(eq(appointment.barberId, barberId));
    if (from) conditions.push(gte(appointment.startsAt, from));
    if (to) conditions.push(lte(appointment.startsAt, to));

    const rows = await this.db
      .select({
        id: appointment.id,
        organizationId: appointment.organizationId,
        customerId: appointment.customerId,
        barberId: appointment.barberId,
        serviceId: appointment.serviceId,
        startsAt: appointment.startsAt,
        endsAt: appointment.endsAt,
        status: appointment.status,
        type: appointment.type,
        notes: appointment.notes,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
        customerName: customer.name,
        customerPhone: customer.phone,
        barberName: user.name,
        serviceName: service.name,
      })
      .from(appointment)
      .innerJoin(customer, eq(appointment.customerId, customer.id))
      .innerJoin(user, eq(appointment.barberId, user.id))
      .innerJoin(service, eq(appointment.serviceId, service.id))
      .where(and(...conditions))
      .orderBy(desc(appointment.startsAt));

    return rows;
  }

  // ─── Dashboard ───────────────────────────────────────────────────────────────

  async getDashboardStats(orgId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [customersResult] = await this.db
      .select({ count: count() })
      .from(customer)
      .where(eq(customer.organizationId, orgId));

    const [appointmentsResult] = await this.db
      .select({ count: count() })
      .from(appointment)
      .where(eq(appointment.organizationId, orgId));

    const [todayResult] = await this.db
      .select({ count: count() })
      .from(appointment)
      .where(
        and(
          eq(appointment.organizationId, orgId),
          gte(appointment.startsAt, today),
          lt(appointment.startsAt, tomorrow),
        ),
      );

    const [servicesResult] = await this.db
      .select({ count: count() })
      .from(service)
      .where(and(eq(service.organizationId, orgId), eq(service.active, true)));

    const [invoicedResult] = await this.db
      .select({
        total: sql<number>`coalesce(sum(${serviceOrderItem.unitPriceInCents} * ${serviceOrderItem.quantity}), 0)`,
      })
      .from(serviceOrderItem)
      .innerJoin(
        serviceOrder,
        eq(serviceOrderItem.serviceOrderId, serviceOrder.id),
      )
      .where(
        and(
          eq(serviceOrder.organizationId, orgId),
          eq(serviceOrder.status, "completed"),
          gte(serviceOrder.createdAt, today),
          lt(serviceOrder.createdAt, tomorrow),
        ),
      );

    const [completedOrdersResult] = await this.db
      .select({ count: count() })
      .from(serviceOrder)
      .where(
        and(
          eq(serviceOrder.organizationId, orgId),
          eq(serviceOrder.status, "completed"),
          gte(serviceOrder.createdAt, today),
          lt(serviceOrder.createdAt, tomorrow),
        ),
      );

    const totalInvoiced = Number(invoicedResult?.total ?? 0);
    const completedOrders = completedOrdersResult.count;
    const averageTicketInCents =
      completedOrders > 0 ? Math.round(totalInvoiced / completedOrders) : 0;

    return {
      totalCustomers: customersResult.count,
      totalAppointments: appointmentsResult.count,
      todayAppointments: todayResult.count,
      totalServices: servicesResult.count,
      averageTicketInCents,
    };
  }
}

export { AdminRepository };

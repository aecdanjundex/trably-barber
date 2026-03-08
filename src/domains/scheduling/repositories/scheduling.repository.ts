import "server-only";
import { inject, injectable } from "inversify";
import { eq, and, lt, gt, or, desc, notInArray, gte, lte, count, sql, isNull } from "drizzle-orm";
import type { Database } from "@/lib/db";
import { TYPES } from "@/lib/di/types";
import {
  scheduleConfig,
  barberTimeBlock,
  barberDailyBlock,
  customerBlock,
  appointment,
  service,
  organization,
  customer,
  user,
} from "@/db/schema";
import type { ISchedulingRepository } from "../interfaces/scheduling.repository.interface";
import type {
  UpsertScheduleConfigInput,
  CreateBarberTimeBlockInput,
  CreateBarberDailyBlockInput,
  CreateCustomerBlockInput,
} from "../schemas/scheduling.schema";

@injectable()
class SchedulingRepository implements ISchedulingRepository {
  constructor(@inject(TYPES.Database) private readonly db: Database) {}

  // ─── Schedule Config ───────────────────────────────────────────────────────

  async listScheduleConfigs(orgId: string, barberId?: string) {
    const conditions = [eq(scheduleConfig.organizationId, orgId)];
    if (barberId) conditions.push(eq(scheduleConfig.barberId, barberId));

    return this.db
      .select()
      .from(scheduleConfig)
      .where(and(...conditions))
      .orderBy(scheduleConfig.barberId, scheduleConfig.dayOfWeek);
  }

  async getScheduleConfig(barberId: string, dayOfWeek: number) {
    const rows = await this.db
      .select()
      .from(scheduleConfig)
      .where(
        and(
          eq(scheduleConfig.barberId, barberId),
          eq(scheduleConfig.dayOfWeek, dayOfWeek),
        ),
      )
      .limit(1);
    return rows[0] ?? null;
  }

  async upsertScheduleConfig(orgId: string, input: UpsertScheduleConfigInput) {
    const now = new Date();
    const rows = await this.db
      .insert(scheduleConfig)
      .values({
        id: crypto.randomUUID(),
        organizationId: orgId,
        barberId: input.barberId,
        dayOfWeek: input.dayOfWeek,
        startTime: input.startTime,
        endTime: input.endTime,
        slotIntervalMinutes: input.slotIntervalMinutes,
        active: input.active,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [scheduleConfig.barberId, scheduleConfig.dayOfWeek],
        set: {
          startTime: input.startTime,
          endTime: input.endTime,
          slotIntervalMinutes: input.slotIntervalMinutes,
          active: input.active,
          updatedAt: now,
        },
      })
      .returning();
    return rows[0];
  }

  async deleteScheduleConfig(
    orgId: string,
    barberId: string,
    dayOfWeek: number,
  ) {
    await this.db
      .delete(scheduleConfig)
      .where(
        and(
          eq(scheduleConfig.organizationId, orgId),
          eq(scheduleConfig.barberId, barberId),
          eq(scheduleConfig.dayOfWeek, dayOfWeek),
        ),
      );
  }

  // ─── Barber Time Blocks ────────────────────────────────────────────────────

  async listBarberTimeBlocks(orgId: string, barberId?: string) {
    const conditions = [eq(barberTimeBlock.organizationId, orgId)];
    if (barberId) conditions.push(eq(barberTimeBlock.barberId, barberId));

    return this.db
      .select()
      .from(barberTimeBlock)
      .where(and(...conditions))
      .orderBy(desc(barberTimeBlock.startsAt));
  }

  async createBarberTimeBlock(
    orgId: string,
    input: CreateBarberTimeBlockInput,
  ) {
    const rows = await this.db
      .insert(barberTimeBlock)
      .values({
        id: crypto.randomUUID(),
        organizationId: orgId,
        barberId: input.barberId,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        reason: input.reason,
        createdAt: new Date(),
      })
      .returning();
    return rows[0];
  }

  async deleteBarberTimeBlock(orgId: string, id: string) {
    await this.db
      .delete(barberTimeBlock)
      .where(
        and(
          eq(barberTimeBlock.id, id),
          eq(barberTimeBlock.organizationId, orgId),
        ),
      );
  }

  async getBarberTimeBlocksForDate(
    barberId: string,
    dateStart: Date,
    dateEnd: Date,
  ) {
    return this.db
      .select()
      .from(barberTimeBlock)
      .where(
        and(
          eq(barberTimeBlock.barberId, barberId),
          lt(barberTimeBlock.startsAt, dateEnd),
          gt(barberTimeBlock.endsAt, dateStart),
        ),
      );
  }

  // ─── Barber Daily Blocks ──────────────────────────────────────────────────

  async listBarberDailyBlocks(orgId: string, barberId?: string) {
    const conditions = [eq(barberDailyBlock.organizationId, orgId)];
    if (barberId) conditions.push(eq(barberDailyBlock.barberId, barberId));

    return this.db
      .select()
      .from(barberDailyBlock)
      .where(and(...conditions))
      .orderBy(barberDailyBlock.startTime);
  }

  async createBarberDailyBlock(orgId: string, input: CreateBarberDailyBlockInput) {
    const rows = await this.db
      .insert(barberDailyBlock)
      .values({
        id: crypto.randomUUID(),
        organizationId: orgId,
        barberId: input.barberId,
        startTime: input.startTime,
        endTime: input.endTime,
        reason: input.reason,
        createdAt: new Date(),
      })
      .returning();
    return rows[0];
  }

  async deleteBarberDailyBlock(orgId: string, id: string) {
    await this.db
      .delete(barberDailyBlock)
      .where(
        and(
          eq(barberDailyBlock.id, id),
          eq(barberDailyBlock.organizationId, orgId),
        ),
      );
  }

  async getBarberDailyBlocks(barberId: string) {
    return this.db
      .select({
        startTime: barberDailyBlock.startTime,
        endTime: barberDailyBlock.endTime,
      })
      .from(barberDailyBlock)
      .where(eq(barberDailyBlock.barberId, barberId));
  }

  // ─── Customer Blocks ──────────────────────────────────────────────────────

  async listCustomerBlocks(orgId: string, barberId?: string) {
    const conditions = [eq(customerBlock.organizationId, orgId)];
    if (barberId) conditions.push(eq(customerBlock.barberId, barberId));

    return this.db
      .select({
        id: customerBlock.id,
        organizationId: customerBlock.organizationId,
        barberId: customerBlock.barberId,
        customerId: customerBlock.customerId,
        dayOfWeek: customerBlock.dayOfWeek,
        blockedDate: customerBlock.blockedDate,
        startTime: customerBlock.startTime,
        endTime: customerBlock.endTime,
        reason: customerBlock.reason,
        createdAt: customerBlock.createdAt,
        customerName: customer.name,
        customerPhone: customer.phone,
      })
      .from(customerBlock)
      .innerJoin(customer, eq(customerBlock.customerId, customer.id))
      .where(and(...conditions))
      .orderBy(desc(customerBlock.createdAt));
  }

  async createCustomerBlock(orgId: string, input: CreateCustomerBlockInput) {
    const rows = await this.db
      .insert(customerBlock)
      .values({
        id: crypto.randomUUID(),
        organizationId: orgId,
        barberId: input.barberId,
        customerId: input.customerId,
        dayOfWeek: input.dayOfWeek,
        blockedDate: input.blockedDate,
        startTime: input.startTime ?? null,
        endTime: input.endTime ?? null,
        reason: input.reason,
        createdAt: new Date(),
      })
      .returning();
    return rows[0];
  }

  async deleteCustomerBlock(orgId: string, id: string) {
    await this.db
      .delete(customerBlock)
      .where(
        and(eq(customerBlock.id, id), eq(customerBlock.organizationId, orgId)),
      );
  }

  async isCustomerBlocked(
    barberId: string,
    customerId: string,
    dayOfWeek: number,
    dateStr: string,
  ) {
    const rows = await this.db
      .select({ id: customerBlock.id })
      .from(customerBlock)
      .where(
        and(
          eq(customerBlock.barberId, barberId),
          eq(customerBlock.customerId, customerId),
          or(
            eq(customerBlock.dayOfWeek, dayOfWeek),
            eq(customerBlock.blockedDate, dateStr),
          ),
        ),
      )
      .limit(1);
    return rows.length > 0;
  }

  async getCustomerDailyTimeBlocks(barberId: string, customerId: string) {
    return this.db
      .select({
        startTime: customerBlock.startTime,
        endTime: customerBlock.endTime,
      })
      .from(customerBlock)
      .where(
        and(
          eq(customerBlock.barberId, barberId),
          eq(customerBlock.customerId, customerId),
          isNull(customerBlock.dayOfWeek),
          isNull(customerBlock.blockedDate),
        ),
      );
  }

  // ─── Appointments ─────────────────────────────────────────────────────────

  async getAppointmentsForBarberOnDate(
    barberId: string,
    dateStart: Date,
    dateEnd: Date,
  ) {
    return this.db
      .select()
      .from(appointment)
      .where(
        and(
          eq(appointment.barberId, barberId),
          lt(appointment.startsAt, dateEnd),
          gt(appointment.endsAt, dateStart),
          notInArray(appointment.status, ["cancelled"]),
        ),
      );
  }

  async createAppointment(data: {
    organizationId: string;
    customerId: string;
    barberId: string;
    serviceId: string;
    startsAt: Date;
    endsAt: Date;
    status: string;
    type: string;
    notes?: string;
  }) {
    const now = new Date();
    const rows = await this.db
      .insert(appointment)
      .values({
        id: crypto.randomUUID(),
        organizationId: data.organizationId,
        customerId: data.customerId,
        barberId: data.barberId,
        serviceId: data.serviceId,
        startsAt: data.startsAt,
        endsAt: data.endsAt,
        status: data.status,
        type: data.type,
        notes: data.notes,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return rows[0];
  }

  async getAppointmentById(orgId: string, id: string) {
    const rows = await this.db
      .select()
      .from(appointment)
      .where(and(eq(appointment.id, id), eq(appointment.organizationId, orgId)))
      .limit(1);
    return rows[0] ?? null;
  }

  async updateAppointmentStatus(orgId: string, id: string, status: string) {
    const rows = await this.db
      .update(appointment)
      .set({ status, updatedAt: new Date() })
      .where(and(eq(appointment.id, id), eq(appointment.organizationId, orgId)))
      .returning();
    return rows[0] ?? null;
  }

  async markAsWaiting(orgId: string, id: string) {
    const now = new Date();
    const rows = await this.db
      .update(appointment)
      .set({ status: "waiting", arrivedAt: now, updatedAt: now })
      .where(and(eq(appointment.id, id), eq(appointment.organizationId, orgId)))
      .returning();
    return rows[0] ?? null;
  }

  async markAsInService(orgId: string, id: string) {
    const now = new Date();
    const rows = await this.db
      .update(appointment)
      .set({ status: "in_service", updatedAt: now })
      .where(and(eq(appointment.id, id), eq(appointment.organizationId, orgId)))
      .returning();
    return rows[0] ?? null;
  }

  async callCustomer(orgId: string, id: string) {
    const now = new Date();
    const rows = await this.db
      .update(appointment)
      .set({ calledAt: now, updatedAt: now })
      .where(and(eq(appointment.id, id), eq(appointment.organizationId, orgId)))
      .returning();
    return rows[0] ?? null;
  }

  async getLatestCall(orgId: string) {
    const threshold = new Date(Date.now() - 60_000);
    const rows = await this.db
      .select({
        appointmentId: appointment.id,
        customerName: customer.name,
        barberName: user.name,
      })
      .from(appointment)
      .innerJoin(customer, eq(appointment.customerId, customer.id))
      .innerJoin(user, eq(appointment.barberId, user.id))
      .where(
        and(
          eq(appointment.organizationId, orgId),
          gte(appointment.calledAt, threshold),
        ),
      )
      .orderBy(desc(appointment.calledAt))
      .limit(1);
    return rows[0] ?? null;
  }

  // ─── Lookups ──────────────────────────────────────────────────────────────

  async getServiceById(id: string) {
    const rows = await this.db
      .select({
        id: service.id,
        durationMinutes: service.durationMinutes,
        active: service.active,
      })
      .from(service)
      .where(eq(service.id, id))
      .limit(1);
    return rows[0] ?? null;
  }

  async getOrgBySlug(slug: string) {
    const rows = await this.db
      .select({ id: organization.id })
      .from(organization)
      .where(eq(organization.slug, slug))
      .limit(1);
    return rows[0] ?? null;
  }

  async countAppointmentsByDayPerBarber(
    orgId: string,
    from: Date,
    to: Date,
  ): Promise<{ barberId: string; barberName: string; date: string; count: number }[]> {
    const rows = await this.db
      .select({
        barberId: appointment.barberId,
        barberName: user.name,
        date: sql<string>`to_char(date_trunc('day', ${appointment.startsAt}), 'YYYY-MM-DD')`,
        count: count(),
      })
      .from(appointment)
      .innerJoin(user, eq(appointment.barberId, user.id))
      .where(
        and(
          eq(appointment.organizationId, orgId),
          gte(appointment.startsAt, from),
          lte(appointment.startsAt, to),
          notInArray(appointment.status, ["cancelled"]),
        ),
      )
      .groupBy(
        appointment.barberId,
        user.name,
        sql`date_trunc('day', ${appointment.startsAt})`,
      );

    return rows.map((r) => ({ ...r, count: Number(r.count) }));
  }

  async countAppointmentsByMonthPerBarber(
    orgId: string,
    year: number,
  ): Promise<{ barberId: string; barberName: string; month: number; count: number }[]> {
    const rows = await this.db
      .select({
        barberId: appointment.barberId,
        barberName: user.name,
        month: sql<number>`extract(month from ${appointment.startsAt})::int`,
        count: count(),
      })
      .from(appointment)
      .innerJoin(user, eq(appointment.barberId, user.id))
      .where(
        and(
          eq(appointment.organizationId, orgId),
          sql`extract(year from ${appointment.startsAt}) = ${year}`,
          notInArray(appointment.status, ["cancelled"]),
        ),
      )
      .groupBy(
        appointment.barberId,
        user.name,
        sql`extract(month from ${appointment.startsAt})`,
      );

    return rows.map((r) => ({ ...r, month: Number(r.month), count: Number(r.count) }));
  }

  async countAppointmentsByDay(
    orgId: string,
    from: Date,
    to: Date,
    barberId?: string,
  ): Promise<{ date: string; count: number }[]> {
    const conditions = [
      eq(appointment.organizationId, orgId),
      gte(appointment.startsAt, from),
      lte(appointment.startsAt, to),
      notInArray(appointment.status, ["cancelled"]),
    ];
    if (barberId) conditions.push(eq(appointment.barberId, barberId));

    const rows = await this.db
      .select({
        date: sql<string>`to_char(date_trunc('day', ${appointment.startsAt}), 'YYYY-MM-DD')`,
        count: count(),
      })
      .from(appointment)
      .where(and(...conditions))
      .groupBy(sql`date_trunc('day', ${appointment.startsAt})`);

    return rows.map((r) => ({ date: r.date, count: Number(r.count) }));
  }

  async countAppointmentsByMonth(
    orgId: string,
    year: number,
    barberId?: string,
  ): Promise<{ month: number; count: number }[]> {
    const conditions = [
      eq(appointment.organizationId, orgId),
      sql`extract(year from ${appointment.startsAt}) = ${year}`,
      notInArray(appointment.status, ["cancelled"]),
    ];
    if (barberId) conditions.push(eq(appointment.barberId, barberId));

    const rows = await this.db
      .select({
        month: sql<number>`extract(month from ${appointment.startsAt})::int`,
        count: count(),
      })
      .from(appointment)
      .where(and(...conditions))
      .groupBy(sql`extract(month from ${appointment.startsAt})`);

    return rows.map((r) => ({ month: Number(r.month), count: Number(r.count) }));
  }

  async listCustomerAppointments(orgId: string, customerId: string) {
    return this.db
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
        arrivedAt: appointment.arrivedAt,
        calledAt: appointment.calledAt,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
        barberName: user.name,
        serviceName: service.name,
      })
      .from(appointment)
      .innerJoin(user, eq(appointment.barberId, user.id))
      .innerJoin(service, eq(appointment.serviceId, service.id))
      .where(
        and(
          eq(appointment.organizationId, orgId),
          eq(appointment.customerId, customerId),
        ),
      )
      .orderBy(desc(appointment.startsAt));
  }
}

export { SchedulingRepository };

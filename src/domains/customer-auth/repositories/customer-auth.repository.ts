import "server-only";
import { inject, injectable } from "inversify";
import { and, eq, gt } from "drizzle-orm";
import type { Database } from "@/lib/db";
import { TYPES } from "@/lib/di/types";
import {
  customer,
  customerOtp,
  customerSession,
  organization,
} from "@/db/schema";
import type { ICustomerAuthRepository } from "../interfaces/customer-auth.repository.interface";

@injectable()
class CustomerAuthRepository implements ICustomerAuthRepository {
  constructor(@inject(TYPES.Database) private readonly db: Database) {}

  async findOrgBySlug(slug: string) {
    const rows = await this.db
      .select()
      .from(organization)
      .where(eq(organization.slug, slug))
      .limit(1);
    return rows[0] ?? null;
  }

  async findCustomerByPhone(organizationId: string, phone: string) {
    const rows = await this.db
      .select()
      .from(customer)
      .where(
        and(
          eq(customer.organizationId, organizationId),
          eq(customer.phone, phone),
        ),
      )
      .limit(1);
    return rows[0] ?? null;
  }

  async upsertCustomer(organizationId: string, phone: string) {
    const inserted = await this.db
      .insert(customer)
      .values({
        id: crypto.randomUUID(),
        organizationId,
        phone,
        // Placeholder name until the customer fills in their profile
        name: phone,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing()
      .returning();

    if (inserted[0]) return inserted[0];

    // Already existed — return the existing record
    const existing = await this.findCustomerByPhone(organizationId, phone);
    if (!existing) throw new Error("Customer upsert failed unexpectedly");
    return existing;
  }

  async deleteOtpByPhone(organizationId: string, phone: string) {
    await this.db
      .delete(customerOtp)
      .where(
        and(
          eq(customerOtp.organizationId, organizationId),
          eq(customerOtp.phone, phone),
        ),
      );
  }

  async createOtp(
    organizationId: string,
    phone: string,
    code: string,
    expiresAt: Date,
  ) {
    const rows = await this.db
      .insert(customerOtp)
      .values({
        id: crypto.randomUUID(),
        organizationId,
        phone,
        code,
        expiresAt,
        createdAt: new Date(),
      })
      .returning();
    return rows[0];
  }

  async findValidOtp(organizationId: string, phone: string, code: string) {
    const rows = await this.db
      .select()
      .from(customerOtp)
      .where(
        and(
          eq(customerOtp.organizationId, organizationId),
          eq(customerOtp.phone, phone),
          eq(customerOtp.code, code),
          gt(customerOtp.expiresAt, new Date()),
        ),
      )
      .limit(1);
    return rows[0] ?? null;
  }

  async deleteOtp(id: string) {
    await this.db.delete(customerOtp).where(eq(customerOtp.id, id));
  }

  async createSession(
    customerId: string,
    organizationId: string,
    token: string,
    expiresAt: Date,
  ) {
    const rows = await this.db
      .insert(customerSession)
      .values({
        id: crypto.randomUUID(),
        customerId,
        organizationId,
        token,
        expiresAt,
        createdAt: new Date(),
      })
      .returning();
    return rows[0];
  }

  async findSessionByToken(token: string) {
    const rows = await this.db
      .select()
      .from(customerSession)
      .where(
        and(
          eq(customerSession.token, token),
          gt(customerSession.expiresAt, new Date()),
        ),
      )
      .limit(1);
    return rows[0] ?? null;
  }

  async findCustomerById(id: string) {
    const rows = await this.db
      .select()
      .from(customer)
      .where(eq(customer.id, id))
      .limit(1);
    return rows[0] ?? null;
  }

  async updateCustomer(id: string, data: { name: string; email: string }) {
    const rows = await this.db
      .update(customer)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(customer.id, id))
      .returning();
    if (!rows[0]) throw new Error("Customer not found");
    return rows[0];
  }
}

export { CustomerAuthRepository };

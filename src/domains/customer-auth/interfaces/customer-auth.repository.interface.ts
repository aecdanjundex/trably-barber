import type {
  Customer,
  CustomerOtp,
  CustomerSession,
  Organization,
} from "../types";

interface ICustomerAuthRepository {
  findOrgBySlug(slug: string): Promise<Organization | null>;
  findCustomerByPhone(
    organizationId: string,
    phone: string,
  ): Promise<Customer | null>;
  upsertCustomer(organizationId: string, phone: string): Promise<Customer>;
  deleteOtpByPhone(organizationId: string, phone: string): Promise<void>;
  createOtp(
    organizationId: string,
    phone: string,
    code: string,
    expiresAt: Date,
  ): Promise<CustomerOtp>;
  findValidOtp(
    organizationId: string,
    phone: string,
    code: string,
  ): Promise<CustomerOtp | null>;
  deleteOtp(id: string): Promise<void>;
  createSession(
    customerId: string,
    organizationId: string,
    token: string,
    expiresAt: Date,
  ): Promise<CustomerSession>;
  findSessionByToken(token: string): Promise<CustomerSession | null>;
  findCustomerById(id: string): Promise<Customer | null>;
}

export type { ICustomerAuthRepository };

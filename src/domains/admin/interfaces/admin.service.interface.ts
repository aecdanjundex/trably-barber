import type { Service, Customer, Appointment } from "../types";
import type {
  CreateServiceInput,
  UpdateServiceInput,
} from "../schemas/service.schema";
import type {
  CreateCustomerInput,
  UpdateCustomerInput,
} from "../schemas/customer.schema";

interface IAdminService {
  // Services
  listServices(orgId: string): Promise<Service[]>;
  createService(orgId: string, input: CreateServiceInput): Promise<Service>;
  updateService(
    orgId: string,
    input: UpdateServiceInput,
  ): Promise<Service | null>;
  deleteService(orgId: string, id: string): Promise<void>;

  // Customers
  listCustomers(orgId: string): Promise<Customer[]>;
  createCustomer(orgId: string, input: CreateCustomerInput): Promise<Customer>;
  updateCustomer(orgId: string, input: UpdateCustomerInput): Promise<Customer | null>;

  // Users
  toggleUserBan(userId: string, banned: boolean): Promise<void>;
  listOrgMembers(orgId: string): Promise<{
    id: string;
    role: string;
    userId: string;
    userName: string;
    userEmail: string;
    userImage: string | null;
    banned: boolean;
  }[]>;

  // Appointments
  listAppointments(
    orgId: string,
    barberId?: string,
    from?: Date,
    to?: Date,
  ): Promise<
    (Appointment & {
      customerName: string;
      customerPhone: string;
      barberName: string;
      serviceName: string;
    })[]
  >;

  // Dashboard
  getDashboardStats(orgId: string): Promise<{
    totalCustomers: number;
    totalAppointments: number;
    todayAppointments: number;
    totalServices: number;
    averageTicketInCents: number;
  }>;
}

export type { IAdminService };

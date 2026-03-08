import type { Service, Customer, Appointment } from "../types";
import type {
  CreateServiceInput,
  UpdateServiceInput,
} from "../schemas/service.schema";

interface IAdminRepository {
  // Services
  listServices(orgId: string): Promise<Service[]>;
  getService(orgId: string, id: string): Promise<Service | null>;
  createService(orgId: string, input: CreateServiceInput): Promise<Service>;
  updateService(
    orgId: string,
    input: UpdateServiceInput,
  ): Promise<Service | null>;
  deleteService(orgId: string, id: string): Promise<void>;

  // Customers
  listCustomers(orgId: string): Promise<Customer[]>;

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

  // Dashboard stats
  getDashboardStats(orgId: string): Promise<{
    totalCustomers: number;
    totalAppointments: number;
    todayAppointments: number;
    totalServices: number;
  }>;
}

export type { IAdminRepository };

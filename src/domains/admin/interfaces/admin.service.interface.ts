import type { Service, Customer, Appointment } from "../types";
import type {
  CreateServiceInput,
  UpdateServiceInput,
} from "../schemas/service.schema";

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

  // Appointments
  listAppointments(orgId: string): Promise<
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
  }>;
}

export type { IAdminService };

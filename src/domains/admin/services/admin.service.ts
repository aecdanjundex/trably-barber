import "server-only";
import { inject, injectable } from "inversify";
import { TYPES } from "@/lib/di/types";
import type { IAdminRepository } from "../interfaces/admin.repository.interface";
import type { IAdminService } from "../interfaces/admin.service.interface";
import type {
  CreateServiceInput,
  UpdateServiceInput,
} from "../schemas/service.schema";
import type {
  CreateCustomerInput,
  UpdateCustomerInput,
} from "../schemas/customer.schema";

@injectable()
class AdminService implements IAdminService {
  constructor(
    @inject(TYPES.AdminRepository)
    private readonly repository: IAdminRepository,
  ) {}

  async listServices(orgId: string, search?: string) {
    return this.repository.listServices(orgId, search);
  }

  async createService(orgId: string, input: CreateServiceInput) {
    return this.repository.createService(orgId, input);
  }

  async updateService(orgId: string, input: UpdateServiceInput) {
    return this.repository.updateService(orgId, input);
  }

  async deleteService(orgId: string, id: string) {
    return this.repository.deleteService(orgId, id);
  }

  async listCustomers(orgId: string, search?: string) {
    return this.repository.listCustomers(orgId, search);
  }

  async createCustomer(orgId: string, input: CreateCustomerInput) {
    return this.repository.createCustomer(orgId, input);
  }

  async updateCustomer(orgId: string, input: UpdateCustomerInput) {
    return this.repository.updateCustomer(orgId, input);
  }

  async toggleUserBan(userId: string, banned: boolean) {
    return this.repository.toggleUserBan(userId, banned);
  }

  async listOrgMembers(orgId: string) {
    return this.repository.listOrgMembers(orgId);
  }

  async listAppointments(
    orgId: string,
    barberId?: string,
    from?: Date,
    to?: Date,
  ) {
    return this.repository.listAppointments(orgId, barberId, from, to);
  }

  async getDashboardStats(orgId: string) {
    return this.repository.getDashboardStats(orgId);
  }
}

export { AdminService };

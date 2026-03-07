import "server-only";
import { inject, injectable } from "inversify";
import { TYPES } from "@/lib/di/types";
import type { IAdminRepository } from "../interfaces/admin.repository.interface";
import type { IAdminService } from "../interfaces/admin.service.interface";
import type {
  CreateServiceInput,
  UpdateServiceInput,
} from "../schemas/service.schema";

@injectable()
class AdminService implements IAdminService {
  constructor(
    @inject(TYPES.AdminRepository)
    private readonly repository: IAdminRepository,
  ) {}

  async listServices(orgId: string) {
    return this.repository.listServices(orgId);
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

  async listCustomers(orgId: string) {
    return this.repository.listCustomers(orgId);
  }

  async listAppointments(orgId: string) {
    return this.repository.listAppointments(orgId);
  }

  async getDashboardStats(orgId: string) {
    return this.repository.getDashboardStats(orgId);
  }
}

export { AdminService };

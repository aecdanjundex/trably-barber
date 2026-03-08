import "server-only";
import { inject, injectable } from "inversify";
import { TYPES } from "@/lib/di/types";
import type { IServiceOrderRepository } from "../interfaces/service-order.repository.interface";
import type { IServiceOrderService } from "../interfaces/service-order.service.interface";
import type {
  CreateProductInput,
  UpdateProductInput,
  CreatePaymentMethodInput,
  UpdatePaymentMethodInput,
  UpsertCommissionConfigInput,
  CreateServiceOrderInput,
  UpdateServiceOrderInput,
  AddServiceOrderItemInput,
  UpdateServiceOrderItemInput,
  AddPaymentInput,
  CreateQuickItemInput,
  UpdateQuickItemInput,
} from "../schemas/service-order.schema";

@injectable()
class ServiceOrderService implements IServiceOrderService {
  constructor(
    @inject(TYPES.ServiceOrderRepository)
    private readonly repository: IServiceOrderRepository,
  ) {}

  // ─── Products ──────────────────────────────────────────────────────────────

  async listProducts(orgId: string) {
    return this.repository.listProducts(orgId);
  }

  async createProduct(orgId: string, input: CreateProductInput) {
    return this.repository.createProduct(orgId, input);
  }

  async updateProduct(orgId: string, input: UpdateProductInput) {
    return this.repository.updateProduct(orgId, input);
  }

  async deleteProduct(orgId: string, id: string) {
    return this.repository.deleteProduct(orgId, id);
  }

  // ─── Payment Methods ───────────────────────────────────────────────────────

  async listPaymentMethods(orgId: string) {
    return this.repository.listPaymentMethods(orgId);
  }

  async createPaymentMethod(orgId: string, input: CreatePaymentMethodInput) {
    return this.repository.createPaymentMethod(orgId, input);
  }

  async updatePaymentMethod(orgId: string, input: UpdatePaymentMethodInput) {
    return this.repository.updatePaymentMethod(orgId, input);
  }

  async deletePaymentMethod(orgId: string, id: string) {
    return this.repository.deletePaymentMethod(orgId, id);
  }

  // ─── Commission Config ─────────────────────────────────────────────────────

  async listCommissionConfigs(orgId: string) {
    return this.repository.listCommissionConfigs(orgId);
  }

  async upsertCommissionConfig(
    orgId: string,
    input: UpsertCommissionConfigInput,
  ) {
    return this.repository.upsertCommissionConfig(orgId, input);
  }

  async deleteCommissionConfig(orgId: string, id: string) {
    return this.repository.deleteCommissionConfig(orgId, id);
  }

  // ─── Service Orders ────────────────────────────────────────────────────────

  async listServiceOrders(
    orgId: string,
    filters?: { status?: string; customerId?: string; from?: Date; to?: Date },
  ) {
    return this.repository.listServiceOrders(orgId, filters);
  }

  async getServiceOrder(orgId: string, id: string) {
    return this.repository.getServiceOrder(orgId, id);
  }

  async createServiceOrder(orgId: string, input: CreateServiceOrderInput) {
    return this.repository.createServiceOrder(orgId, input);
  }

  async updateServiceOrder(orgId: string, input: UpdateServiceOrderInput) {
    return this.repository.updateServiceOrder(orgId, input);
  }

  // ─── Service Order Items ───────────────────────────────────────────────────

  async addServiceOrderItem(orgId: string, input: AddServiceOrderItemInput) {
    // Resolve name and price from the referenced service/product
    let name: string;
    let unitPriceInCents: number;

    if (input.itemType === "service") {
      const svc = await this.repository.getServiceReference(orgId, input.referenceId);
      if (!svc) throw new Error("Servi\u00e7o n\u00e3o encontrado");
      name = svc.name;
      unitPriceInCents = svc.priceInCents;
    } else {
      const prod = await this.repository.getProduct(orgId, input.referenceId);
      if (!prod) throw new Error("Produto n\u00e3o encontrado");
      name = prod.name;
      unitPriceInCents = prod.priceInCents;
    }

    // Resolve commission configs for each professional
    let professionals:
      | {
          professionalId: string;
          commissionType: string;
          fixedValueInCents?: number | null;
          percentageValue?: number | null;
        }[]
      | undefined;

    if (input.professionalIds?.length) {
      const configs = await this.repository.getCommissionConfigsForReference(
        orgId,
        input.itemType,
        input.referenceId,
        input.professionalIds,
      );

      professionals = input.professionalIds.map((profId) => {
        const config = configs.find((c) => c.professionalId === profId);
        return {
          professionalId: profId,
          commissionType: config?.commissionType ?? "fixed",
          fixedValueInCents: config?.fixedValueInCents ?? null,
          percentageValue: config?.percentageValue ?? null,
        };
      });
    }

    return this.repository.addServiceOrderItem({
      serviceOrderId: input.serviceOrderId,
      itemType: input.itemType,
      referenceId: input.referenceId,
      name,
      quantity: input.quantity,
      unitPriceInCents,
      notes: input.notes,
      professionals,
    });
  }

  async updateServiceOrderItem(input: UpdateServiceOrderItemInput) {
    return this.repository.updateServiceOrderItem(input);
  }

  async removeServiceOrderItem(id: string) {
    return this.repository.removeServiceOrderItem(id);
  }

  // ─── Payments ──────────────────────────────────────────────────────────────

  async addPayment(input: AddPaymentInput) {
    return this.repository.addPayment(input);
  }

  async removePayment(id: string) {
    return this.repository.removePayment(id);
  }

  async listPaymentsByDateRange(orgId: string, from: Date, to: Date) {
    return this.repository.listPaymentsByDateRange(orgId, from, to);
  }

  // ─── Quick Items ───────────────────────────────────────────────────────────

  async listQuickItems(orgId: string) {
    return this.repository.listQuickItems(orgId);
  }

  async createQuickItem(orgId: string, input: CreateQuickItemInput) {
    return this.repository.createQuickItem(orgId, input);
  }

  async updateQuickItem(orgId: string, input: UpdateQuickItemInput) {
    return this.repository.updateQuickItem(orgId, input);
  }

  async deleteQuickItem(orgId: string, id: string) {
    return this.repository.deleteQuickItem(orgId, id);
  }
}

export { ServiceOrderService };

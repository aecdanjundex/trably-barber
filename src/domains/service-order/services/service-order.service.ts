import "reflect-metadata";
import { injectable, inject } from "inversify";
import { TRPCError } from "@trpc/server";
import { TYPES } from "@/lib/di/types";
import type { IServiceOrderRepository } from "../interfaces/service-order.repository.interface";
import type { IServiceOrderService } from "../interfaces/service-order.service.interface";
import type {
  ServiceOrder,
  ServiceOrderItem,
  ServiceOrderPayment,
  ServiceOrderDetail,
  CreateOrderInput,
  UpdateOrderInput,
  AddOrderItemInput,
  AddOrderPaymentInput,
  ListOrdersInput,
} from "../types";

@injectable()
export class ServiceOrderService implements IServiceOrderService {
  constructor(
    @inject(TYPES.ServiceOrderRepository)
    private repo: IServiceOrderRepository,
  ) {}

  list(
    input: ListOrdersInput,
  ): Promise<{ data: ServiceOrder[]; total: number }> {
    return this.repo.list(input);
  }

  async getById(
    id: string,
    organizationId: string,
  ): Promise<ServiceOrderDetail> {
    const result = await this.repo.findById(id, organizationId);
    if (!result) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Ordem de serviço não encontrada",
      });
    }
    return result;
  }

  create(input: CreateOrderInput): Promise<ServiceOrder> {
    return this.repo.create(input);
  }

  update(
    id: string,
    organizationId: string,
    input: UpdateOrderInput,
  ): Promise<ServiceOrder> {
    return this.repo.update(id, organizationId, input);
  }

  delete(id: string, organizationId: string): Promise<void> {
    return this.repo.delete(id, organizationId);
  }

  addItem(input: AddOrderItemInput): Promise<ServiceOrderItem> {
    return this.repo.addItem(input);
  }

  removeItem(
    itemId: string,
    serviceOrderId: string,
    organizationId: string,
  ): Promise<void> {
    return this.repo.removeItem(itemId, serviceOrderId, organizationId);
  }

  addPayment(input: AddOrderPaymentInput): Promise<ServiceOrderPayment> {
    return this.repo.addPayment(input);
  }

  removePayment(
    paymentId: string,
    serviceOrderId: string,
    organizationId: string,
  ): Promise<void> {
    return this.repo.removePayment(paymentId, serviceOrderId, organizationId);
  }
}

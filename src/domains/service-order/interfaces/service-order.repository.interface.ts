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

export interface IServiceOrderRepository {
  list(
    input: ListOrdersInput,
  ): Promise<{ data: ServiceOrder[]; total: number }>;
  findById(id: string, organizationId: string): Promise<ServiceOrderDetail | null>;
  create(input: CreateOrderInput): Promise<ServiceOrder>;
  update(
    id: string,
    organizationId: string,
    input: UpdateOrderInput,
  ): Promise<ServiceOrder>;
  delete(id: string, organizationId: string): Promise<void>;

  addItem(input: AddOrderItemInput): Promise<ServiceOrderItem>;
  removeItem(
    itemId: string,
    serviceOrderId: string,
    organizationId: string,
  ): Promise<void>;

  addPayment(input: AddOrderPaymentInput): Promise<ServiceOrderPayment>;
  removePayment(
    paymentId: string,
    serviceOrderId: string,
    organizationId: string,
  ): Promise<void>;

  nextNumber(organizationId: string): Promise<number>;
}

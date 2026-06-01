export type OrderStatus = "open" | "in_progress" | "completed" | "cancelled";
export type OrderItemType = "service" | "product";

export interface ServiceOrder {
  id: string;
  organizationId: string;
  number: number;
  clientId: string | null;
  clientName: string | null;
  assignedToId: string | null;
  status: OrderStatus;
  discountInCents: number;
  dueDate: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceOrderItem {
  id: string;
  serviceOrderId: string;
  itemType: OrderItemType;
  referenceId: string | null;
  name: string;
  quantity: number;
  unitPriceInCents: number;
  notes: string | null;
  createdAt: Date;
}

export interface ServiceOrderPayment {
  id: string;
  serviceOrderId: string;
  paymentMethodId: string;
  amountInCents: number;
  paidAt: Date;
  notes: string | null;
  createdAt: Date;
}

export interface ServiceOrderDetail extends ServiceOrder {
  clientName: string | null;
  assignedToName: string | null;
  items: ServiceOrderItem[];
  payments: (ServiceOrderPayment & { paymentMethodName: string })[];
  totalInCents: number;
  paidInCents: number;
  balanceInCents: number;
}

export interface CreateOrderInput {
  organizationId: string;
  clientId?: string | null;
  assignedToId?: string | null;
  dueDate?: Date | null;
  notes?: string | null;
  discountInCents?: number;
  items: {
    itemType: OrderItemType;
    referenceId?: string | null;
    name: string;
    quantity: number;
    unitPriceInCents: number;
    notes?: string | null;
  }[];
}

export interface UpdateOrderInput {
  clientId?: string | null;
  assignedToId?: string | null;
  status?: OrderStatus;
  discountInCents?: number;
  dueDate?: Date | null;
  notes?: string | null;
}

export interface AddOrderItemInput {
  serviceOrderId: string;
  itemType: OrderItemType;
  referenceId?: string | null;
  name: string;
  quantity: number;
  unitPriceInCents: number;
  notes?: string | null;
}

export interface AddOrderPaymentInput {
  serviceOrderId: string;
  paymentMethodId: string;
  amountInCents: number;
  paidAt?: Date;
  notes?: string | null;
}

export interface ListOrdersInput {
  organizationId: string;
  status?: OrderStatus;
  clientId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

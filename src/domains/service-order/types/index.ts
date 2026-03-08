import type {
  product,
  paymentMethod,
  commissionConfig,
  serviceOrder,
  serviceOrderItem,
  serviceOrderItemProfessional,
  serviceOrderPayment,
  quickItem,
  customer,
  user,
} from "@/db/schema";

export type Product = typeof product.$inferSelect;
export type ProductInsert = typeof product.$inferInsert;

export type PaymentMethod = typeof paymentMethod.$inferSelect;
export type PaymentMethodInsert = typeof paymentMethod.$inferInsert;

export type CommissionConfig = typeof commissionConfig.$inferSelect;
export type CommissionConfigInsert = typeof commissionConfig.$inferInsert;

export type ServiceOrder = typeof serviceOrder.$inferSelect;
export type ServiceOrderInsert = typeof serviceOrder.$inferInsert;

export type ServiceOrderItem = typeof serviceOrderItem.$inferSelect;
export type ServiceOrderItemInsert = typeof serviceOrderItem.$inferInsert;

export type ServiceOrderItemProfessional =
  typeof serviceOrderItemProfessional.$inferSelect;
export type ServiceOrderItemProfessionalInsert =
  typeof serviceOrderItemProfessional.$inferInsert;

export type ServiceOrderPayment = typeof serviceOrderPayment.$inferSelect;
export type ServiceOrderPaymentInsert =
  typeof serviceOrderPayment.$inferInsert;

export type QuickItem = typeof quickItem.$inferSelect;
export type QuickItemInsert = typeof quickItem.$inferInsert;

export type Customer = typeof customer.$inferSelect;
export type User = typeof user.$inferSelect;

/** Enriched service order with items, payments, and customer info */
export type EnrichedServiceOrder = ServiceOrder & {
  customerName: string | null;
  customerPhone: string | null;
  items: EnrichedServiceOrderItem[];
  payments: EnrichedServiceOrderPayment[];
  totalInCents: number;
  totalPaidInCents: number;
};

export type EnrichedServiceOrderItem = ServiceOrderItem & {
  professionals: (ServiceOrderItemProfessional & {
    professionalName: string;
  })[];
};

export type EnrichedServiceOrderPayment = ServiceOrderPayment & {
  paymentMethodName: string;
};

export type EnrichedQuickItem = QuickItem & {
  referenceName: string;
  referencePriceInCents: number;
};

export type CommissionConfigWithNames = CommissionConfig & {
  professionalName: string;
  referenceName: string;
};

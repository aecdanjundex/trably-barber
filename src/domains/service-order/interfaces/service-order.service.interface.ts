import type {
  Product,
  PaymentMethod,
  CommissionConfig,
  ServiceOrder,
  ServiceOrderItem,
  ServiceOrderPayment,
  QuickItem,
  EnrichedServiceOrder,
  EnrichedQuickItem,
  CommissionConfigWithNames,
  CommissionPayment,
  EnrichedCommissionPayment,
  ReportTotalInvoiced,
  ReportAverageTicket,
  ReportByPaymentMethod,
  ReportByProfessional,
  ReportByProduct,
  ReportByService,
} from "../types";
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
  GenerateCommissionPaymentInput,
} from "../schemas/service-order.schema";

interface IServiceOrderService {
  // ─── Products ──────────────────────────────────────────────────────────────
  listProducts(orgId: string): Promise<Product[]>;
  createProduct(orgId: string, input: CreateProductInput): Promise<Product>;
  updateProduct(
    orgId: string,
    input: UpdateProductInput,
  ): Promise<Product | null>;
  deleteProduct(orgId: string, id: string): Promise<void>;

  // ─── Payment Methods ───────────────────────────────────────────────────────
  listPaymentMethods(orgId: string): Promise<PaymentMethod[]>;
  createPaymentMethod(
    orgId: string,
    input: CreatePaymentMethodInput,
  ): Promise<PaymentMethod>;
  updatePaymentMethod(
    orgId: string,
    input: UpdatePaymentMethodInput,
  ): Promise<PaymentMethod | null>;
  deletePaymentMethod(orgId: string, id: string): Promise<void>;

  // ─── Commission Config ─────────────────────────────────────────────────────
  listCommissionConfigs(orgId: string): Promise<CommissionConfigWithNames[]>;
  upsertCommissionConfig(
    orgId: string,
    input: UpsertCommissionConfigInput,
  ): Promise<CommissionConfig>;
  deleteCommissionConfig(orgId: string, id: string): Promise<void>;

  // ─── Service Orders ────────────────────────────────────────────────────────
  listServiceOrders(
    orgId: string,
    filters?: { status?: string; customerId?: string; from?: Date; to?: Date },
  ): Promise<EnrichedServiceOrder[]>;
  getServiceOrder(
    orgId: string,
    id: string,
  ): Promise<EnrichedServiceOrder | null>;
  createServiceOrder(
    orgId: string,
    input: CreateServiceOrderInput,
  ): Promise<ServiceOrder>;
  updateServiceOrder(
    orgId: string,
    input: UpdateServiceOrderInput,
  ): Promise<ServiceOrder | null>;

  // ─── Service Order Items ───────────────────────────────────────────────────
  addServiceOrderItem(
    orgId: string,
    input: AddServiceOrderItemInput,
  ): Promise<ServiceOrderItem>;
  updateServiceOrderItem(
    input: UpdateServiceOrderItemInput,
  ): Promise<ServiceOrderItem | null>;
  removeServiceOrderItem(id: string): Promise<void>;

  // ─── Payments ──────────────────────────────────────────────────────────────
  addPayment(input: AddPaymentInput): Promise<ServiceOrderPayment>;
  removePayment(id: string): Promise<void>;
  listPaymentsByDateRange(
    orgId: string,
    from: Date,
    to: Date,
  ): Promise<
    (ServiceOrderPayment & {
      paymentMethodName: string;
      serviceOrderId: string;
    })[]
  >;

  // ─── Quick Items ───────────────────────────────────────────────────────────
  listQuickItems(orgId: string): Promise<EnrichedQuickItem[]>;
  createQuickItem(
    orgId: string,
    input: CreateQuickItemInput,
  ): Promise<QuickItem>;
  updateQuickItem(
    orgId: string,
    input: UpdateQuickItemInput,
  ): Promise<QuickItem | null>;
  deleteQuickItem(orgId: string, id: string): Promise<void>;

  // ─── Reports ───────────────────────────────────────────────────────────────
  getReportTotalInvoiced(
    orgId: string,
    from: Date,
    to: Date,
  ): Promise<ReportTotalInvoiced>;
  getReportAverageTicket(
    orgId: string,
    from: Date,
    to: Date,
  ): Promise<ReportAverageTicket>;
  getReportByPaymentMethod(
    orgId: string,
    from: Date,
    to: Date,
  ): Promise<ReportByPaymentMethod[]>;
  getReportByProfessional(
    orgId: string,
    from: Date,
    to: Date,
  ): Promise<ReportByProfessional[]>;
  getReportByProduct(
    orgId: string,
    from: Date,
    to: Date,
  ): Promise<ReportByProduct[]>;
  getReportByService(
    orgId: string,
    from: Date,
    to: Date,
  ): Promise<ReportByService[]>;

  // ─── Commission Payments ───────────────────────────────────────────────────
  listCommissionPayments(
    orgId: string,
    filters?: { professionalId?: string; status?: string },
  ): Promise<EnrichedCommissionPayment[]>;
  getCommissionPayment(
    orgId: string,
    id: string,
  ): Promise<EnrichedCommissionPayment | null>;
  generateCommissionPayment(
    orgId: string,
    input: GenerateCommissionPaymentInput,
  ): Promise<CommissionPayment>;
  updateCommissionPaymentStatus(
    orgId: string,
    id: string,
    status: string,
  ): Promise<CommissionPayment | null>;
}

export type { IServiceOrderService };

import { z } from "zod";

// ─── Products ────────────────────────────────────────────────────────────────

export const createProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  priceInCents: z.number().int().min(0, "Preço inválido"),
  active: z.boolean().default(true),
});

export const updateProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome é obrigatório").optional(),
  priceInCents: z.number().int().min(0, "Preço inválido").optional(),
  active: z.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// ─── Payment Methods ─────────────────────────────────────────────────────────

export const createPaymentMethodSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  active: z.boolean().default(true),
});

export const updatePaymentMethodSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome é obrigatório").optional(),
  active: z.boolean().optional(),
});

export type CreatePaymentMethodInput = z.infer<
  typeof createPaymentMethodSchema
>;
export type UpdatePaymentMethodInput = z.infer<
  typeof updatePaymentMethodSchema
>;

// ─── Commission Config ───────────────────────────────────────────────────────

export const upsertCommissionConfigSchema = z
  .object({
    professionalId: z.string(),
    referenceType: z.enum(["service", "product"]),
    referenceId: z.string(),
    commissionType: z.enum(["fixed", "percentage"]),
    /** Fixed value in cents */
    fixedValueInCents: z.number().int().min(0).optional(),
    /** Percentage in basis points: 1000 = 10.00% */
    percentageValue: z.number().int().min(0).max(10000).optional(),
  })
  .refine(
    (data) => {
      if (data.commissionType === "fixed")
        return data.fixedValueInCents !== undefined;
      return data.percentageValue !== undefined;
    },
    {
      message:
        "Valor fixo ou percentual deve ser informado conforme o tipo de comissão",
    },
  );

export type UpsertCommissionConfigInput = z.infer<
  typeof upsertCommissionConfigSchema
>;

// ─── Service Orders ──────────────────────────────────────────────────────────

export const createServiceOrderSchema = z.object({
  customerId: z.string().optional(),
  notes: z.string().optional(),
});

export const updateServiceOrderSchema = z.object({
  id: z.string(),
  customerId: z.string().nullable().optional(),
  status: z.enum(["open", "completed", "cancelled"]).optional(),
  notes: z.string().optional(),
});

export type CreateServiceOrderInput = z.infer<typeof createServiceOrderSchema>;
export type UpdateServiceOrderInput = z.infer<typeof updateServiceOrderSchema>;

// ─── Service Order Items ─────────────────────────────────────────────────────

export const addServiceOrderItemSchema = z.object({
  serviceOrderId: z.string(),
  itemType: z.enum(["service", "product"]),
  referenceId: z.string().min(1, "Referência é obrigatória"),
  quantity: z.number().int().min(1).default(1),
  notes: z.string().optional(),
  professionalIds: z.array(z.string()).optional(),
});

export const updateServiceOrderItemSchema = z.object({
  id: z.string(),
  quantity: z.number().int().min(1).optional(),
  unitPriceInCents: z.number().int().min(0).optional(),
  notes: z.string().nullable().optional(),
  professionals: z
    .array(
      z.object({
        professionalId: z.string(),
        commissionType: z.enum(["fixed", "percentage"]),
        fixedValueInCents: z.number().int().min(0).optional(),
        percentageValue: z.number().int().min(0).max(10000).optional(),
      }),
    )
    .optional(),
});

export type AddServiceOrderItemInput = z.infer<
  typeof addServiceOrderItemSchema
>;
export type UpdateServiceOrderItemInput = z.infer<
  typeof updateServiceOrderItemSchema
>;

// ─── Payments ────────────────────────────────────────────────────────────────

export const addPaymentSchema = z.object({
  serviceOrderId: z.string(),
  paymentMethodId: z.string(),
  amountInCents: z.number().int().min(1, "Valor deve ser maior que zero"),
  paidAt: z.date().optional(),
  notes: z.string().optional(),
});

export type AddPaymentInput = z.infer<typeof addPaymentSchema>;

// ─── Quick Items ─────────────────────────────────────────────────────────────

export const createQuickItemSchema = z.object({
  itemType: z.enum(["service", "product"]),
  referenceId: z.string(),
  label: z.string().min(1, "Rótulo é obrigatório"),
  displayOrder: z.number().int().default(0),
  active: z.boolean().default(true),
});

export const updateQuickItemSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Rótulo é obrigatório").optional(),
  displayOrder: z.number().int().optional(),
  active: z.boolean().optional(),
});

export type CreateQuickItemInput = z.infer<typeof createQuickItemSchema>;
export type UpdateQuickItemInput = z.infer<typeof updateQuickItemSchema>;

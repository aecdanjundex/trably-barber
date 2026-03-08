import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  notes: z.string().optional(),
});

export const updateCustomerSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome é obrigatório").optional(),
  phone: z.string().min(1, "Telefone é obrigatório").optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")).nullable(),
  notes: z.string().optional().nullable(),
  active: z.boolean().optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;

import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  durationMinutes: z.number().int().min(5, "Mínimo 5 minutos"),
  priceInCents: z.number().int().min(0, "Preço inválido"),
  active: z.boolean().default(true),
});

export const updateServiceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome é obrigatório").optional(),
  description: z.string().optional(),
  durationMinutes: z.number().int().min(5, "Mínimo 5 minutos").optional(),
  priceInCents: z.number().int().min(0, "Preço inválido").optional(),
  active: z.boolean().optional(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;

import { z } from "zod";

const timeRegex = /^\d{2}:\d{2}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// ─── Schedule Config ─────────────────────────────────────────────────────────

export const upsertScheduleConfigSchema = z.object({
  barberId: z.string(),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(timeRegex, "Formato inválido, use HH:mm"),
  endTime: z.string().regex(timeRegex, "Formato inválido, use HH:mm"),
  slotIntervalMinutes: z.number().int().min(5).max(120),
  active: z.boolean().default(true),
});

export type UpsertScheduleConfigInput = z.infer<
  typeof upsertScheduleConfigSchema
>;

export const deleteScheduleConfigSchema = z.object({
  barberId: z.string(),
  dayOfWeek: z.number().int().min(0).max(6),
});

// ─── Barber Time Block ───────────────────────────────────────────────────────

export const createBarberTimeBlockSchema = z.object({
  barberId: z.string(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  reason: z.string().optional(),
});

export type CreateBarberTimeBlockInput = z.infer<
  typeof createBarberTimeBlockSchema
>;

// ─── Barber Daily Block ───────────────────────────────────────────────────────

export const createBarberDailyBlockSchema = z.object({
  barberId: z.string(),
  startTime: z.string().regex(timeRegex, "Formato inválido, use HH:mm"),
  endTime: z.string().regex(timeRegex, "Formato inválido, use HH:mm"),
  reason: z.string().optional(),
});

export type CreateBarberDailyBlockInput = z.infer<
  typeof createBarberDailyBlockSchema
>;

// ─── Customer Block ──────────────────────────────────────────────────────────

export const createCustomerBlockSchema = z.object({
  barberId: z.string(),
  customerId: z.string(),
  dayOfWeek: z.number().int().min(0).max(6).nullable(),
  blockedDate: z
    .string()
    .regex(dateRegex, "Formato inválido, use YYYY-MM-DD")
    .nullable(),
  startTime: z
    .string()
    .regex(timeRegex, "Formato inválido, use HH:mm")
    .optional()
    .nullable(),
  endTime: z
    .string()
    .regex(timeRegex, "Formato inválido, use HH:mm")
    .optional()
    .nullable(),
  reason: z.string().optional(),
});

export type CreateCustomerBlockInput = z.infer<
  typeof createCustomerBlockSchema
>;

// ─── Available Slots ─────────────────────────────────────────────────────────

export const getAvailableSlotsSchema = z.object({
  slug: z.string(),
  barberId: z.string(),
  date: z.string().regex(dateRegex, "Formato inválido, use YYYY-MM-DD"),
  serviceId: z.string(),
});

// ─── Create Appointment ──────────────────────────────────────────────────────

export const createAppointmentSchema = z.object({
  barberId: z.string(),
  serviceId: z.string(),
  startsAt: z.coerce.date(),
  notes: z.string().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

// ─── Squeeze-in Request ──────────────────────────────────────────────────────

export const requestSqueezeInSchema = z.object({
  barberId: z.string(),
  serviceId: z.string(),
  startsAt: z.coerce.date(),
  notes: z.string().optional(),
});

export type RequestSqueezeInInput = z.infer<typeof requestSqueezeInSchema>;

// ─── Create Appointment For Customer (by org member) ─────────────────────────

export const createAppointmentForCustomerSchema = z.object({
  customerId: z.string(),
  barberId: z.string(),
  serviceId: z.string(),
  startsAt: z.coerce.date(),
  notes: z.string().optional(),
});

export type CreateAppointmentForCustomerInput = z.infer<
  typeof createAppointmentForCustomerSchema
>;

// ─── Confirm / Reject ────────────────────────────────────────────────────────

export const appointmentIdSchema = z.object({
  appointmentId: z.string(),
});

export const updateAppointmentStatusSchema = z.object({
  appointmentId: z.string(),
  status: z.enum(["scheduled", "waiting", "in_service", "completed", "cancelled", "no-show"]),
});

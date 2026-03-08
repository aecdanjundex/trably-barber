import type {
  ScheduleConfig,
  BarberTimeBlock,
  CustomerBlock,
  Appointment,
  CustomerAppointment,
} from "../types";
import type {
  UpsertScheduleConfigInput,
  CreateBarberTimeBlockInput,
  CreateCustomerBlockInput,
  CreateAppointmentInput,
  RequestSqueezeInInput,
} from "../schemas/scheduling.schema";

interface ISchedulingService {
  // ─── Schedule Config ─────────────────────────────────────────────────────
  listScheduleConfigs(
    orgId: string,
    barberId?: string,
  ): Promise<ScheduleConfig[]>;

  upsertScheduleConfig(
    orgId: string,
    input: UpsertScheduleConfigInput,
  ): Promise<ScheduleConfig>;

  deleteScheduleConfig(
    orgId: string,
    barberId: string,
    dayOfWeek: number,
  ): Promise<void>;

  // ─── Barber Time Blocks ──────────────────────────────────────────────────
  listBarberTimeBlocks(
    orgId: string,
    barberId?: string,
  ): Promise<BarberTimeBlock[]>;

  createBarberTimeBlock(
    orgId: string,
    input: CreateBarberTimeBlockInput,
  ): Promise<BarberTimeBlock>;

  deleteBarberTimeBlock(orgId: string, id: string): Promise<void>;

  // ─── Customer Blocks ─────────────────────────────────────────────────────
  listCustomerBlocks(
    orgId: string,
    barberId?: string,
  ): Promise<
    (CustomerBlock & { customerName: string; customerPhone: string })[]
  >;

  createCustomerBlock(
    orgId: string,
    input: CreateCustomerBlockInput,
  ): Promise<CustomerBlock>;

  deleteCustomerBlock(orgId: string, id: string): Promise<void>;

  // ─── Available Slots ─────────────────────────────────────────────────────
  getAvailableSlots(
    orgId: string,
    barberId: string,
    dateStr: string,
    serviceId: string,
    customerId?: string,
  ): Promise<string[]>;

  // ─── Appointments ────────────────────────────────────────────────────────
  createAppointment(
    orgId: string,
    customerId: string,
    input: CreateAppointmentInput,
  ): Promise<Appointment>;

  requestSqueezeIn(
    orgId: string,
    customerId: string,
    input: RequestSqueezeInInput,
  ): Promise<Appointment>;

  confirmSqueezeIn(
    orgId: string,
    appointmentId: string,
  ): Promise<Appointment | null>;

  rejectSqueezeIn(
    orgId: string,
    appointmentId: string,
  ): Promise<Appointment | null>;

  updateAppointmentStatus(
    orgId: string,
    appointmentId: string,
    status: string,
  ): Promise<Appointment | null>;

  listCustomerAppointments(
    orgId: string,
    customerId: string,
  ): Promise<CustomerAppointment[]>;
}

export type { ISchedulingService };

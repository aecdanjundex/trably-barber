import type {
  ScheduleConfig,
  BarberTimeBlock,
  BarberDailyBlock,
  CustomerBlock,
  Appointment,
  CustomerAppointment,
} from "../types";
import type {
  UpsertScheduleConfigInput,
  CreateBarberTimeBlockInput,
  CreateBarberDailyBlockInput,
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

  // ─── Barber Daily Blocks ──────────────────────────────────────────────────
  listBarberDailyBlocks(
    orgId: string,
    barberId?: string,
  ): Promise<BarberDailyBlock[]>;

  createBarberDailyBlock(
    orgId: string,
    input: CreateBarberDailyBlockInput,
  ): Promise<BarberDailyBlock>;

  deleteBarberDailyBlock(orgId: string, id: string): Promise<void>;

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

  markAsWaiting(orgId: string, appointmentId: string): Promise<Appointment | null>;

  markAsInService(orgId: string, appointmentId: string): Promise<Appointment | null>;

  callCustomer(orgId: string, appointmentId: string): Promise<Appointment | null>;

  getLatestCall(orgSlug: string): Promise<{
    appointmentId: string;
    customerName: string;
    barberName: string;
  } | null>;

  listCustomerAppointments(
    orgId: string,
    customerId: string,
  ): Promise<CustomerAppointment[]>;

  getAppointmentStatsByDay(
    orgId: string,
    from: Date,
    to: Date,
    barberId?: string,
  ): Promise<{ date: string; count: number }[]>;

  getAppointmentStatsByMonth(
    orgId: string,
    year: number,
    barberId?: string,
  ): Promise<{ month: number; count: number }[]>;

  getAppointmentStatsByDayPerBarber(
    orgId: string,
    from: Date,
    to: Date,
  ): Promise<{ barberId: string; barberName: string; date: string; count: number }[]>;

  getAppointmentStatsByMonthPerBarber(
    orgId: string,
    year: number,
  ): Promise<{ barberId: string; barberName: string; month: number; count: number }[]>;
}

export type { ISchedulingService };

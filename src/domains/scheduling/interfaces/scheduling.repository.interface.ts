import type {
  ScheduleConfig,
  BarberTimeBlock,
  CustomerBlock,
  Appointment,
} from "../types";
import type {
  UpsertScheduleConfigInput,
  CreateBarberTimeBlockInput,
  CreateCustomerBlockInput,
} from "../schemas/scheduling.schema";

interface ISchedulingRepository {
  // ─── Schedule Config ─────────────────────────────────────────────────────
  listScheduleConfigs(
    orgId: string,
    barberId?: string,
  ): Promise<ScheduleConfig[]>;

  getScheduleConfig(
    barberId: string,
    dayOfWeek: number,
  ): Promise<ScheduleConfig | null>;

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

  getBarberTimeBlocksForDate(
    barberId: string,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<BarberTimeBlock[]>;

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

  isCustomerBlocked(
    barberId: string,
    customerId: string,
    dayOfWeek: number,
    dateStr: string,
  ): Promise<boolean>;

  // ─── Appointments ────────────────────────────────────────────────────────
  getAppointmentsForBarberOnDate(
    barberId: string,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<Appointment[]>;

  createAppointment(data: {
    organizationId: string;
    customerId: string;
    barberId: string;
    serviceId: string;
    startsAt: Date;
    endsAt: Date;
    status: string;
    type: string;
    notes?: string;
  }): Promise<Appointment>;

  getAppointmentById(orgId: string, id: string): Promise<Appointment | null>;

  updateAppointmentStatus(
    orgId: string,
    id: string,
    status: string,
  ): Promise<Appointment | null>;

  // ─── Lookups ─────────────────────────────────────────────────────────────
  getServiceById(id: string): Promise<{
    id: string;
    durationMinutes: number;
    active: boolean;
  } | null>;

  getOrgBySlug(slug: string): Promise<{ id: string } | null>;

  countAppointmentsByDayPerBarber(
    orgId: string,
    from: Date,
    to: Date,
  ): Promise<{ barberId: string; barberName: string; date: string; count: number }[]>;

  countAppointmentsByMonthPerBarber(
    orgId: string,
    year: number,
  ): Promise<{ barberId: string; barberName: string; month: number; count: number }[]>;

  countAppointmentsByDay(
    orgId: string,
    from: Date,
    to: Date,
    barberId?: string,
  ): Promise<{ date: string; count: number }[]>;

  countAppointmentsByMonth(
    orgId: string,
    year: number,
    barberId?: string,
  ): Promise<{ month: number; count: number }[]>;

  /** Customer appointments with barber + service names */
  listCustomerAppointments(
    orgId: string,
    customerId: string,
  ): Promise<(Appointment & { barberName: string; serviceName: string })[]>;
}

export type { ISchedulingRepository };

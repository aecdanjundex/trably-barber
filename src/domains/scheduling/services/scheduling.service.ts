import "server-only";
import { inject, injectable } from "inversify";
import { TRPCError } from "@trpc/server";
import { TYPES } from "@/lib/di/types";
import type { ISchedulingRepository } from "../interfaces/scheduling.repository.interface";
import type { ISchedulingService } from "../interfaces/scheduling.service.interface";
import type {
  UpsertScheduleConfigInput,
  CreateBarberTimeBlockInput,
  CreateCustomerBlockInput,
  CreateAppointmentInput,
  RequestSqueezeInInput,
} from "../schemas/scheduling.schema";

@injectable()
class SchedulingService implements ISchedulingService {
  constructor(
    @inject(TYPES.SchedulingRepository)
    private readonly repo: ISchedulingRepository,
  ) {}

  // ─── Schedule Config ───────────────────────────────────────────────────────

  async listScheduleConfigs(orgId: string, barberId?: string) {
    return this.repo.listScheduleConfigs(orgId, barberId);
  }

  async upsertScheduleConfig(orgId: string, input: UpsertScheduleConfigInput) {
    return this.repo.upsertScheduleConfig(orgId, input);
  }

  async deleteScheduleConfig(
    orgId: string,
    barberId: string,
    dayOfWeek: number,
  ) {
    return this.repo.deleteScheduleConfig(orgId, barberId, dayOfWeek);
  }

  // ─── Barber Time Blocks ────────────────────────────────────────────────────

  async listBarberTimeBlocks(orgId: string, barberId?: string) {
    return this.repo.listBarberTimeBlocks(orgId, barberId);
  }

  async createBarberTimeBlock(
    orgId: string,
    input: CreateBarberTimeBlockInput,
  ) {
    return this.repo.createBarberTimeBlock(orgId, input);
  }

  async deleteBarberTimeBlock(orgId: string, id: string) {
    return this.repo.deleteBarberTimeBlock(orgId, id);
  }

  // ─── Customer Blocks ──────────────────────────────────────────────────────

  async listCustomerBlocks(orgId: string, barberId?: string) {
    return this.repo.listCustomerBlocks(orgId, barberId);
  }

  async createCustomerBlock(orgId: string, input: CreateCustomerBlockInput) {
    return this.repo.createCustomerBlock(orgId, input);
  }

  async deleteCustomerBlock(orgId: string, id: string) {
    return this.repo.deleteCustomerBlock(orgId, id);
  }

  // ─── Available Slots ──────────────────────────────────────────────────────

  async getAvailableSlots(
    orgId: string,
    barberId: string,
    dateStr: string,
    serviceId: string,
    customerId?: string,
  ): Promise<string[]> {
    const date = new Date(dateStr + "T00:00:00");
    const dayOfWeek = date.getDay();

    // 1. Schedule config for this day
    const config = await this.repo.getScheduleConfig(barberId, dayOfWeek);
    if (!config || !config.active) return [];

    // 2. Service duration
    const svc = await this.repo.getServiceById(serviceId);
    if (!svc || !svc.active) return [];

    // 3. Customer block check
    if (customerId) {
      const blocked = await this.repo.isCustomerBlocked(
        barberId,
        customerId,
        dayOfWeek,
        dateStr,
      );
      if (blocked) return [];
    }

    // 4. Generate slot grid
    const [startH, startM] = config.startTime.split(":").map(Number);
    const [endH, endM] = config.endTime.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    const slots: { startMin: number; endMin: number }[] = [];
    for (
      let m = startMinutes;
      m + svc.durationMinutes <= endMinutes;
      m += config.slotIntervalMinutes
    ) {
      slots.push({ startMin: m, endMin: m + svc.durationMinutes });
    }

    if (slots.length === 0) return [];

    // 5. Existing appointments for this barber on this date
    const dateStart = new Date(date);
    const dateEnd = new Date(date);
    dateEnd.setDate(dateEnd.getDate() + 1);

    const appointments = await this.repo.getAppointmentsForBarberOnDate(
      barberId,
      dateStart,
      dateEnd,
    );

    // 6. Time blocks
    const blocks = await this.repo.getBarberTimeBlocksForDate(
      barberId,
      dateStart,
      dateEnd,
    );

    // 7. Filter available
    const available = slots.filter((slot) => {
      const slotStart = new Date(date);
      slotStart.setHours(
        Math.floor(slot.startMin / 60),
        slot.startMin % 60,
        0,
        0,
      );
      const slotEnd = new Date(date);
      slotEnd.setHours(Math.floor(slot.endMin / 60), slot.endMin % 60, 0, 0);

      // Skip past slots (if checking today)
      if (slotStart < new Date()) return false;

      // Check appointment conflicts
      for (const apt of appointments) {
        if (slotStart < apt.endsAt && slotEnd > apt.startsAt) {
          return false;
        }
      }

      // Check time block conflicts
      for (const block of blocks) {
        if (slotStart < block.endsAt && slotEnd > block.startsAt) {
          return false;
        }
      }

      return true;
    });

    return available.map((slot) => {
      const h = Math.floor(slot.startMin / 60)
        .toString()
        .padStart(2, "0");
      const m = (slot.startMin % 60).toString().padStart(2, "0");
      return `${h}:${m}`;
    });
  }

  // ─── Appointments ─────────────────────────────────────────────────────────

  async createAppointment(
    orgId: string,
    customerId: string,
    input: CreateAppointmentInput,
  ) {
    const svc = await this.repo.getServiceById(input.serviceId);
    if (!svc || !svc.active) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Serviço não encontrado ou inativo",
      });
    }

    const endsAt = new Date(
      input.startsAt.getTime() + svc.durationMinutes * 60_000,
    );

    // Validate day/time against schedule config
    const dayOfWeek = input.startsAt.getDay();
    const dateStr = input.startsAt.toISOString().split("T")[0];

    const config = await this.repo.getScheduleConfig(input.barberId, dayOfWeek);
    if (!config || !config.active) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Horário não disponível",
      });
    }

    // Check customer block
    const blocked = await this.repo.isCustomerBlocked(
      input.barberId,
      customerId,
      dayOfWeek,
      dateStr,
    );
    if (blocked) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Horário não disponível",
      });
    }

    // Check within schedule hours
    const [startH, startM] = config.startTime.split(":").map(Number);
    const [endH, endM] = config.endTime.split(":").map(Number);
    const scheduleStart = startH * 60 + startM;
    const scheduleEnd = endH * 60 + endM;
    const aptStart =
      input.startsAt.getHours() * 60 + input.startsAt.getMinutes();
    const aptEnd = endsAt.getHours() * 60 + endsAt.getMinutes();

    if (aptStart < scheduleStart || aptEnd > scheduleEnd) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Horário não disponível",
      });
    }

    // Check conflicts with existing appointments
    const dateStart = new Date(input.startsAt);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(dateStart);
    dateEnd.setDate(dateEnd.getDate() + 1);

    const existing = await this.repo.getAppointmentsForBarberOnDate(
      input.barberId,
      dateStart,
      dateEnd,
    );

    for (const apt of existing) {
      if (input.startsAt < apt.endsAt && endsAt > apt.startsAt) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Horário já ocupado",
        });
      }
    }

    // Check time block conflicts
    const blocks = await this.repo.getBarberTimeBlocksForDate(
      input.barberId,
      dateStart,
      dateEnd,
    );
    for (const block of blocks) {
      if (input.startsAt < block.endsAt && endsAt > block.startsAt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Horário não disponível",
        });
      }
    }

    return this.repo.createAppointment({
      organizationId: orgId,
      customerId,
      barberId: input.barberId,
      serviceId: input.serviceId,
      startsAt: input.startsAt,
      endsAt,
      status: "scheduled",
      type: "regular",
      notes: input.notes,
    });
  }

  async requestSqueezeIn(
    orgId: string,
    customerId: string,
    input: RequestSqueezeInInput,
  ) {
    const svc = await this.repo.getServiceById(input.serviceId);
    if (!svc || !svc.active) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Serviço não encontrado ou inativo",
      });
    }

    // Check customer block
    const dayOfWeek = input.startsAt.getDay();
    const dateStr = input.startsAt.toISOString().split("T")[0];

    const blocked = await this.repo.isCustomerBlocked(
      input.barberId,
      customerId,
      dayOfWeek,
      dateStr,
    );
    if (blocked) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Não foi possível solicitar o encaixe",
      });
    }

    const endsAt = new Date(
      input.startsAt.getTime() + svc.durationMinutes * 60_000,
    );

    return this.repo.createAppointment({
      organizationId: orgId,
      customerId,
      barberId: input.barberId,
      serviceId: input.serviceId,
      startsAt: input.startsAt,
      endsAt,
      status: "pending_confirmation",
      type: "squeeze_in",
      notes: input.notes,
    });
  }

  async confirmSqueezeIn(orgId: string, appointmentId: string) {
    const apt = await this.repo.getAppointmentById(orgId, appointmentId);
    if (
      !apt ||
      apt.type !== "squeeze_in" ||
      apt.status !== "pending_confirmation"
    ) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Agendamento não encontrado ou não é um encaixe pendente",
      });
    }
    return this.repo.updateAppointmentStatus(orgId, appointmentId, "scheduled");
  }

  async rejectSqueezeIn(orgId: string, appointmentId: string) {
    const apt = await this.repo.getAppointmentById(orgId, appointmentId);
    if (
      !apt ||
      apt.type !== "squeeze_in" ||
      apt.status !== "pending_confirmation"
    ) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Agendamento não encontrado ou não é um encaixe pendente",
      });
    }
    return this.repo.updateAppointmentStatus(orgId, appointmentId, "cancelled");
  }

  async updateAppointmentStatus(
    orgId: string,
    appointmentId: string,
    status: string,
  ) {
    return this.repo.updateAppointmentStatus(orgId, appointmentId, status);
  }

  async listCustomerAppointments(orgId: string, customerId: string) {
    return this.repo.listCustomerAppointments(orgId, customerId);
  }

  async getAppointmentStatsByDay(
    orgId: string,
    from: Date,
    to: Date,
    barberId?: string,
  ) {
    return this.repo.countAppointmentsByDay(orgId, from, to, barberId);
  }

  async getAppointmentStatsByMonth(
    orgId: string,
    year: number,
    barberId?: string,
  ) {
    return this.repo.countAppointmentsByMonth(orgId, year, barberId);
  }

  async getAppointmentStatsByDayPerBarber(orgId: string, from: Date, to: Date) {
    return this.repo.countAppointmentsByDayPerBarber(orgId, from, to);
  }

  async getAppointmentStatsByMonthPerBarber(orgId: string, year: number) {
    return this.repo.countAppointmentsByMonthPerBarber(orgId, year);
  }
}

export { SchedulingService };

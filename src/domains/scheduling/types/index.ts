import type {
  scheduleConfig,
  barberTimeBlock,
  customerBlock,
  appointment,
} from "@/db/schema";

export type ScheduleConfig = typeof scheduleConfig.$inferSelect;
export type BarberTimeBlock = typeof barberTimeBlock.$inferSelect;
export type CustomerBlock = typeof customerBlock.$inferSelect;
export type Appointment = typeof appointment.$inferSelect;

export type EnrichedAppointment = Appointment & {
  customerName: string;
  customerPhone: string;
  barberName: string;
  serviceName: string;
};

export type CustomerAppointment = Appointment & {
  barberName: string;
  serviceName: string;
};

import type {
  service,
  appointment,
  customer,
  member,
  user,
  organization,
} from "@/db/schema";

export type Service = typeof service.$inferSelect;
export type ServiceInsert = typeof service.$inferInsert;
export type Appointment = typeof appointment.$inferSelect;
export type Customer = typeof customer.$inferSelect;
export type Member = typeof member.$inferSelect;
export type User = typeof user.$inferSelect;
export type Organization = typeof organization.$inferSelect;

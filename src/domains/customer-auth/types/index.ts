import type {
  customer,
  customerOtp,
  customerSession,
  organization,
} from "@/db/schema";

export type Organization = typeof organization.$inferSelect;
export type Customer = typeof customer.$inferSelect;
export type CustomerOtp = typeof customerOtp.$inferSelect;
export type CustomerSession = typeof customerSession.$inferSelect;

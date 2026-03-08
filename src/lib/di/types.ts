export const TYPES = {
  Database: Symbol.for("Database"),
  CustomerAuthRepository: Symbol.for("CustomerAuthRepository"),
  CustomerAuthService: Symbol.for("CustomerAuthService"),
  AdminRepository: Symbol.for("AdminRepository"),
  AdminService: Symbol.for("AdminService"),
  SchedulingRepository: Symbol.for("SchedulingRepository"),
  SchedulingService: Symbol.for("SchedulingService"),
  ServiceOrderRepository: Symbol.for("ServiceOrderRepository"),
  ServiceOrderService: Symbol.for("ServiceOrderService"),
} as const;

export const TYPES = {
  Database: Symbol.for("Database"),
  CustomerAuthRepository: Symbol.for("CustomerAuthRepository"),
  CustomerAuthService: Symbol.for("CustomerAuthService"),
  AdminRepository: Symbol.for("AdminRepository"),
  AdminService: Symbol.for("AdminService"),
  SchedulingRepository: Symbol.for("SchedulingRepository"),
  SchedulingService: Symbol.for("SchedulingService"),
} as const;

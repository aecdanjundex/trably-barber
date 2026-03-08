import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
import { db, type Database } from "@/lib/db";
import { CustomerAuthRepository } from "@/domains/customer-auth/repositories/customer-auth.repository";
import { CustomerAuthService } from "@/domains/customer-auth/services/customer-auth.service";
import type { ICustomerAuthRepository } from "@/domains/customer-auth/interfaces/customer-auth.repository.interface";
import type { ICustomerAuthService } from "@/domains/customer-auth/interfaces/customer-auth.service.interface";
import { AdminRepository } from "@/domains/admin/repositories/admin.repository";
import { AdminService } from "@/domains/admin/services/admin.service";
import type { IAdminRepository } from "@/domains/admin/interfaces/admin.repository.interface";
import type { IAdminService } from "@/domains/admin/interfaces/admin.service.interface";
import { SchedulingRepository } from "@/domains/scheduling/repositories/scheduling.repository";
import { SchedulingService } from "@/domains/scheduling/services/scheduling.service";
import type { ISchedulingRepository } from "@/domains/scheduling/interfaces/scheduling.repository.interface";
import type { ISchedulingService } from "@/domains/scheduling/interfaces/scheduling.service.interface";
import { ServiceOrderRepository } from "@/domains/service-order/repositories/service-order.repository";
import { ServiceOrderService } from "@/domains/service-order/services/service-order.service";
import type { IServiceOrderRepository } from "@/domains/service-order/interfaces/service-order.repository.interface";
import type { IServiceOrderService } from "@/domains/service-order/interfaces/service-order.service.interface";
import { SubscriptionRepository } from "@/domains/subscription/repositories/subscription.repository";
import { SubscriptionService } from "@/domains/subscription/services/subscription.service";
import type { ISubscriptionRepository } from "@/domains/subscription/interfaces/subscription.repository.interface";
import type { ISubscriptionService } from "@/domains/subscription/interfaces/subscription.service.interface";

const container = new Container();

container.bind<Database>(TYPES.Database).toConstantValue(db);

container
  .bind<ICustomerAuthRepository>(TYPES.CustomerAuthRepository)
  .to(CustomerAuthRepository)
  .inSingletonScope();

container
  .bind<ICustomerAuthService>(TYPES.CustomerAuthService)
  .to(CustomerAuthService)
  .inSingletonScope();

container
  .bind<IAdminRepository>(TYPES.AdminRepository)
  .to(AdminRepository)
  .inSingletonScope();

container
  .bind<IAdminService>(TYPES.AdminService)
  .to(AdminService)
  .inSingletonScope();

container
  .bind<ISchedulingRepository>(TYPES.SchedulingRepository)
  .to(SchedulingRepository)
  .inSingletonScope();

container
  .bind<ISchedulingService>(TYPES.SchedulingService)
  .to(SchedulingService)
  .inSingletonScope();

container
  .bind<IServiceOrderRepository>(TYPES.ServiceOrderRepository)
  .to(ServiceOrderRepository)
  .inSingletonScope();

container
  .bind<IServiceOrderService>(TYPES.ServiceOrderService)
  .to(ServiceOrderService)
  .inSingletonScope();

container
  .bind<ISubscriptionRepository>(TYPES.SubscriptionRepository)
  .to(SubscriptionRepository)
  .inSingletonScope();

container
  .bind<ISubscriptionService>(TYPES.SubscriptionService)
  .to(SubscriptionService)
  .inSingletonScope();

export { container };

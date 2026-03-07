import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
import { db, type Database } from "@/lib/db";
import { CustomerAuthRepository } from "@/domains/customer-auth/repositories/customer-auth.repository";
import { CustomerAuthService } from "@/domains/customer-auth/services/customer-auth.service";
import type { ICustomerAuthRepository } from "@/domains/customer-auth/interfaces/customer-auth.repository.interface";
import type { ICustomerAuthService } from "@/domains/customer-auth/interfaces/customer-auth.service.interface";

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

export { container };

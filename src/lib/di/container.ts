import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
import { db, type Database } from "@/lib/db";

import { ClientRepository } from "@/domains/client/repositories/client.repository";
import { ClientService } from "@/domains/client/services/client.service";
import type { IClientRepository } from "@/domains/client/interfaces/client.repository.interface";
import type { IClientService } from "@/domains/client/interfaces/client.service.interface";

import { ServiceOrderRepository } from "@/domains/service-order/repositories/service-order.repository";
import { ServiceOrderService } from "@/domains/service-order/services/service-order.service";
import type { IServiceOrderRepository } from "@/domains/service-order/interfaces/service-order.repository.interface";
import type { IServiceOrderService } from "@/domains/service-order/interfaces/service-order.service.interface";

import { FinancialRepository } from "@/domains/financial/repositories/financial.repository";
import { FinancialService } from "@/domains/financial/services/financial.service";
import type { IFinancialRepository } from "@/domains/financial/interfaces/financial.repository.interface";
import type { IFinancialService } from "@/domains/financial/interfaces/financial.service.interface";

const container = new Container();

container.bind<Database>(TYPES.Database).toConstantValue(db);

container
  .bind<IClientRepository>(TYPES.ClientRepository)
  .to(ClientRepository)
  .inSingletonScope();

container
  .bind<IClientService>(TYPES.ClientService)
  .to(ClientService)
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
  .bind<IFinancialRepository>(TYPES.FinancialRepository)
  .to(FinancialRepository)
  .inSingletonScope();

container
  .bind<IFinancialService>(TYPES.FinancialService)
  .to(FinancialService)
  .inSingletonScope();

export { container };

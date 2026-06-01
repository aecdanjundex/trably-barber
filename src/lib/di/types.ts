export const TYPES = {
  Database: Symbol.for("Database"),
  ClientRepository: Symbol.for("ClientRepository"),
  ClientService: Symbol.for("ClientService"),
  ServiceOrderRepository: Symbol.for("ServiceOrderRepository"),
  ServiceOrderService: Symbol.for("ServiceOrderService"),
  FinancialRepository: Symbol.for("FinancialRepository"),
  FinancialService: Symbol.for("FinancialService"),
  CatalogRepository: Symbol.for("CatalogRepository"),
  CatalogService: Symbol.for("CatalogService"),
} as const;

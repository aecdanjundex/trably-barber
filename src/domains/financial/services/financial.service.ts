import "reflect-metadata";
import { injectable, inject } from "inversify";
import { TYPES } from "@/lib/di/types";
import type { IFinancialRepository } from "../interfaces/financial.repository.interface";
import type { IFinancialService } from "../interfaces/financial.service.interface";
import type {
  Expense,
  FinancialSummary,
  RevenueByPeriod,
  TopService,
  RevenueByPaymentMethod,
  CreateExpenseInput,
  UpdateExpenseInput,
  FinancialReportInput,
} from "../types";

@injectable()
export class FinancialService implements IFinancialService {
  constructor(
    @inject(TYPES.FinancialRepository) private repo: IFinancialRepository,
  ) {}

  listExpenses(organizationId: string, from: Date, to: Date): Promise<Expense[]> {
    return this.repo.listExpenses(organizationId, from, to);
  }

  createExpense(input: CreateExpenseInput): Promise<Expense> {
    return this.repo.createExpense(input);
  }

  updateExpense(
    id: string,
    organizationId: string,
    input: UpdateExpenseInput,
  ): Promise<Expense> {
    return this.repo.updateExpense(id, organizationId, input);
  }

  deleteExpense(id: string, organizationId: string): Promise<void> {
    return this.repo.deleteExpense(id, organizationId);
  }

  getSummary(input: FinancialReportInput): Promise<FinancialSummary> {
    return this.repo.getSummary(input);
  }

  getRevenueByDay(input: FinancialReportInput): Promise<RevenueByPeriod[]> {
    return this.repo.getRevenueByDay(input);
  }

  getTopServices(input: FinancialReportInput, limit?: number): Promise<TopService[]> {
    return this.repo.getTopServices(input, limit);
  }

  getRevenueByPaymentMethod(
    input: FinancialReportInput,
  ): Promise<RevenueByPaymentMethod[]> {
    return this.repo.getRevenueByPaymentMethod(input);
  }
}

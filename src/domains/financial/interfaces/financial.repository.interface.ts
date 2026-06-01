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

export interface IFinancialRepository {
  listExpenses(
    organizationId: string,
    from: Date,
    to: Date,
  ): Promise<Expense[]>;
  createExpense(input: CreateExpenseInput): Promise<Expense>;
  updateExpense(
    id: string,
    organizationId: string,
    input: UpdateExpenseInput,
  ): Promise<Expense>;
  deleteExpense(id: string, organizationId: string): Promise<void>;

  getSummary(input: FinancialReportInput): Promise<FinancialSummary>;
  getRevenueByDay(input: FinancialReportInput): Promise<RevenueByPeriod[]>;
  getTopServices(
    input: FinancialReportInput,
    limit?: number,
  ): Promise<TopService[]>;
  getRevenueByPaymentMethod(
    input: FinancialReportInput,
  ): Promise<RevenueByPaymentMethod[]>;
}

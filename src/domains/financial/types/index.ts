export type ExpenseCategory =
  | "rent"
  | "supplies"
  | "payroll"
  | "marketing"
  | "utilities"
  | "other";

export interface Expense {
  id: string;
  organizationId: string;
  category: ExpenseCategory;
  description: string;
  amountInCents: number;
  date: Date;
  createdById: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RevenueByPeriod {
  date: string;
  revenueInCents: number;
  ordersCount: number;
}

export interface FinancialSummary {
  revenueInCents: number;
  expensesInCents: number;
  profitInCents: number;
  ordersCompleted: number;
  averageOrderValueInCents: number;
}

export interface TopService {
  name: string;
  count: number;
  revenueInCents: number;
}

export interface RevenueByPaymentMethod {
  paymentMethodName: string;
  amountInCents: number;
  percentage: number;
}

export interface CreateExpenseInput {
  organizationId: string;
  category: ExpenseCategory;
  description: string;
  amountInCents: number;
  date: Date;
  createdById?: string;
}

export interface UpdateExpenseInput {
  category?: ExpenseCategory;
  description?: string;
  amountInCents?: number;
  date?: Date;
}

export interface FinancialReportInput {
  organizationId: string;
  from: Date;
  to: Date;
}

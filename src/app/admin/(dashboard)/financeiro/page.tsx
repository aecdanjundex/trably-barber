"use client";

import { useMemo, useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Package, Plus, Trash2 } from "lucide-react";
import { useTRPC } from "@/trpc/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function formatCurrency(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function startOf(period: "month" | "week" | "year"): Date {
  const d = new Date();
  if (period === "month") {
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
  } else if (period === "week") {
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
  } else {
    d.setMonth(0, 1);
    d.setHours(0, 0, 0, 0);
  }
  return d;
}

const EXPENSE_CATEGORIES: Record<string, string> = {
  rent: "Aluguel",
  supplies: "Materiais",
  payroll: "Folha de Pagamento",
  marketing: "Marketing",
  utilities: "Utilidades",
  other: "Outros",
};

function StatCard({
  title,
  value,
  icon: Icon,
  loading,
  variant = "default",
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  loading: boolean;
  variant?: "default" | "success" | "danger";
}) {
  const colorMap = {
    default: "text-muted-foreground",
    success: "text-green-600",
    danger: "text-red-600",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${colorMap[variant]}`} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-28" />
        ) : (
          <div className={`text-2xl font-bold ${colorMap[variant]}`}>
            {formatCurrency(value)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function FinanceiroPage() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);

  const [expenseForm, setExpenseForm] = useState({
    category: "other" as keyof typeof EXPENSE_CATEGORIES,
    description: "",
    amountInCents: 0,
    date: new Date().toISOString().slice(0, 10),
  });

  const from = useMemo(() => startOf(period), [period]);
  const to = useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  }, []);

  const { data: summary, isLoading: summaryLoading } = useQuery(
    trpc.financial.summary.queryOptions({ from, to }),
  );
  const { data: revenueByDay, isLoading: chartLoading } = useQuery(
    trpc.financial.revenueByDay.queryOptions({ from, to }),
  );
  const { data: topServices, isLoading: topLoading } = useQuery(
    trpc.financial.topServices.queryOptions({ from, to, limit: 5 }),
  );
  const { data: byMethod } = useQuery(
    trpc.financial.revenueByPaymentMethod.queryOptions({ from, to }),
  );
  const { data: expenses } = useQuery(
    trpc.financial.listExpenses.queryOptions({ from, to }),
  );

  const createExpenseMutation = useMutation(
    trpc.financial.createExpense.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: trpc.financial.listExpenses.queryKey() });
        qc.invalidateQueries({ queryKey: trpc.financial.summary.queryKey() });
        setAddExpenseOpen(false);
        setExpenseForm({ category: "other", description: "", amountInCents: 0, date: new Date().toISOString().slice(0, 10) });
      },
    }),
  );

  const deleteExpenseMutation = useMutation(
    trpc.financial.deleteExpense.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: trpc.financial.listExpenses.queryKey() });
        qc.invalidateQueries({ queryKey: trpc.financial.summary.queryKey() });
      },
    }),
  );

  const periodLabels = { week: "esta semana", month: "este mês", year: "este ano" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground">Resumo {periodLabels[period]}</p>
        </div>
        <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Esta semana</SelectItem>
            <SelectItem value="month">Este mês</SelectItem>
            <SelectItem value="year">Este ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Receita"
          value={summary?.revenueInCents ?? 0}
          icon={TrendingUp}
          loading={summaryLoading}
          variant="success"
        />
        <StatCard
          title="Despesas"
          value={summary?.expensesInCents ?? 0}
          icon={TrendingDown}
          loading={summaryLoading}
          variant="danger"
        />
        <StatCard
          title="Lucro"
          value={summary?.profitInCents ?? 0}
          icon={DollarSign}
          loading={summaryLoading}
          variant={
            (summary?.profitInCents ?? 0) >= 0 ? "success" : "danger"
          }
        />
        <StatCard
          title="Ticket Médio"
          value={summary?.averageOrderValueInCents ?? 0}
          icon={Package}
          loading={summaryLoading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue by day */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Receita por Dia</CardTitle>
          </CardHeader>
          <CardContent>
            {chartLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : !revenueByDay?.length ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhum dado disponível
              </p>
            ) : (
              <div className="space-y-2">
                {revenueByDay.map((d) => {
                  const maxRevenue = Math.max(...revenueByDay.map((x) => x.revenueInCents));
                  const pct = maxRevenue > 0 ? (d.revenueInCents / maxRevenue) * 100 : 0;
                  return (
                    <div key={d.date} className="flex items-center gap-3 text-sm">
                      <span className="w-20 shrink-0 text-muted-foreground">
                        {new Date(d.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                      </span>
                      <div className="flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-28 text-right font-medium">
                        {formatCurrency(d.revenueInCents)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top services */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Serviços Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            {topLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : !topServices?.length ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhum dado disponível
              </p>
            ) : (
              <div className="space-y-3">
                {topServices.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-3 text-sm">
                    <span className="w-5 text-muted-foreground">{i + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.count} vendas
                      </p>
                    </div>
                    <span className="font-medium">{formatCurrency(s.revenueInCents)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* By payment method */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Receita por Forma de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            {!byMethod?.length ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhum dado disponível
              </p>
            ) : (
              <div className="space-y-3">
                {byMethod.map((m) => (
                  <div key={m.paymentMethodName} className="flex items-center gap-3 text-sm">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{m.paymentMethodName}</span>
                        <span className="text-muted-foreground">{m.percentage}%</span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-muted">
                        <div
                          className="h-1.5 rounded-full bg-primary"
                          style={{ width: `${m.percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-24 text-right font-medium">
                      {formatCurrency(m.amountInCents)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Despesas</CardTitle>
            <Button size="sm" onClick={() => setAddExpenseOpen(true)}>
              <Plus className="mr-1 h-4 w-4" />
              Registrar
            </Button>
          </CardHeader>
          <CardContent>
            {!expenses?.length ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhuma despesa registrada
              </p>
            ) : (
              <div className="space-y-2">
                {expenses.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between rounded-lg border p-3 text-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{e.description}</span>
                        <Badge variant="outline" className="text-xs">
                          {EXPENSE_CATEGORIES[e.category] ?? e.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(e.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-red-600">
                        {formatCurrency(e.amountInCents)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteExpenseMutation.mutate({ id: e.id })}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add expense dialog */}
      <Dialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Registrar Despesa</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm">Categoria</label>
              <Select
                value={expenseForm.category}
                onValueChange={(v) => setExpenseForm((f) => ({ ...f, category: v as keyof typeof EXPENSE_CATEGORIES }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EXPENSE_CATEGORIES).map(([v, l]) => (
                    <SelectItem key={v} value={v}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm">Descrição</label>
              <Input
                value={expenseForm.description}
                onChange={(e) => setExpenseForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Descrição da despesa"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Valor (R$)</label>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={expenseForm.amountInCents / 100 || ""}
                onChange={(e) =>
                  setExpenseForm((f) => ({
                    ...f,
                    amountInCents: Math.round(parseFloat(e.target.value || "0") * 100),
                  }))
                }
                placeholder="0,00"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Data</label>
              <Input
                type="date"
                value={expenseForm.date}
                onChange={(e) => setExpenseForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setAddExpenseOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (!expenseForm.description || expenseForm.amountInCents <= 0) return;
                  createExpenseMutation.mutate({
                    category: expenseForm.category as "rent" | "supplies" | "payroll" | "marketing" | "utilities" | "other",
                    description: expenseForm.description,
                    amountInCents: expenseForm.amountInCents,
                    date: new Date(expenseForm.date + "T12:00:00"),
                  });
                }}
                disabled={
                  createExpenseMutation.isPending ||
                  !expenseForm.description ||
                  expenseForm.amountInCents <= 0
                }
              >
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

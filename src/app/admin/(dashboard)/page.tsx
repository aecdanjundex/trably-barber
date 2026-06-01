"use client";

import { useMemo } from "react";
import {
  Users,
  ClipboardList,
  DollarSign,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { useTRPC } from "@/trpc/utils";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function startOfMonth(): Date {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfToday(): Date {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

function formatCurrency(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function StatCard({
  title,
  value,
  icon: Icon,
  loading,
  format,
  trend,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  loading: boolean;
  format?: "currency";
  trend?: string;
}) {
  const display =
    format === "currency" ? formatCurrency(value) : value.toString();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <div className="text-2xl font-bold">{display}</div>
            {trend && (
              <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

const ORDER_STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  open: { label: "Aberta", variant: "outline" },
  in_progress: { label: "Em andamento", variant: "default" },
  completed: { label: "Concluída", variant: "secondary" },
  cancelled: { label: "Cancelada", variant: "destructive" },
};

export default function AdminDashboardPage() {
  const trpc = useTRPC();
  const from = useMemo(() => startOfMonth(), []);
  const to = useMemo(() => endOfToday(), []);

  const { data: summary, isLoading: summaryLoading } = useQuery(
    trpc.financial.summary.queryOptions({ from, to }),
  );

  const { data: clientsData, isLoading: clientsLoading } = useQuery(
    trpc.client.list.queryOptions({ pageSize: 5 }),
  );

  const { data: ordersData, isLoading: ordersLoading } = useQuery(
    trpc.serviceOrder.list.queryOptions({ pageSize: 5 }),
  );

  const { data: topServices, isLoading: topLoading } = useQuery(
    trpc.financial.topServices.queryOptions({ from, to, limit: 5 }),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumo do mês — {new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Receita no Mês"
          value={summary?.revenueInCents ?? 0}
          icon={DollarSign}
          loading={summaryLoading}
          format="currency"
        />
        <StatCard
          title="Ordens Concluídas"
          value={summary?.ordersCompleted ?? 0}
          icon={ClipboardList}
          loading={summaryLoading}
          trend="no mês atual"
        />
        <StatCard
          title="Ticket Médio"
          value={summary?.averageOrderValueInCents ?? 0}
          icon={TrendingUp}
          loading={summaryLoading}
          format="currency"
        />
        <StatCard
          title="Total de Clientes"
          value={clientsData?.total ?? 0}
          icon={Users}
          loading={clientsLoading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Ordens Recentes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/ordens">
                Ver todas <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : !ordersData?.data.length ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Nenhuma ordem de serviço ainda
              </div>
            ) : (
              <div className="space-y-2">
                {ordersData.data.map((order) => {
                  const statusInfo = ORDER_STATUS_LABELS[order.status] ?? {
                    label: order.status,
                    variant: "outline" as const,
                  };
                  return (
                    <Link
                      key={order.id}
                      href={`/admin/ordens/${order.id}`}
                      className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div>
                        <span className="text-sm font-medium">
                          OS #{order.number}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <Badge variant={statusInfo.variant}>
                        {statusInfo.label}
                      </Badge>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top services */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Top Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            {topLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : !topServices?.length ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Nenhum dado disponível
              </div>
            ) : (
              <div className="space-y-3">
                {topServices.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="w-5 text-sm font-medium text-muted-foreground">
                      {i + 1}.
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.count}x · {formatCurrency(s.revenueInCents)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent clients */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Clientes Recentes</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/clientes">
              Ver todos <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {clientsLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !clientsData?.data.length ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Nenhum cliente cadastrado ainda
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {clientsData.data.map((c) => (
                <Link
                  key={c.id}
                  href={`/admin/clientes/${c.id}`}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.phone ?? c.email ?? "—"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

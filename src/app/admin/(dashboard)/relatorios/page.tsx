"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/utils";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Search, DollarSign, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function getDefaultDateRange() {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { from, to };
}

function toDatetimeLocal(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "A Pagar",
  paid: "Pago",
  cancelled: "Cancelado",
};

const STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "default",
  paid: "secondary",
  cancelled: "destructive",
};

export default function RelatoriosPage() {
  const trpc = useTRPC();
  const router = useRouter();

  const { data: activeMember, isLoading: loadingMember } = useQuery({
    queryKey: ["active-member"],
    queryFn: async () => {
      const result = await authClient.organization.getActiveMember();
      return result.data;
    },
  });

  const { data: planData, isLoading: loadingPlan } = useQuery(
    trpc.subscription.getCurrentPlan.queryOptions(),
  );

  if (loadingMember || loadingPlan) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    );
  }

  if (activeMember?.role === "barber") {
    if (planData?.plan !== "premium") {
      router.replace("/admin/agendamentos");
      return null;
    }
    return <BarberCommissionReport />;
  }


  return <AdminReportsView />;
}

// ─── Barber Commission Report ────────────────────────────────────────────────

function BarberCommissionReport() {
  const trpc = useTRPC();

  const { data: payments, isLoading } = useQuery(
    trpc.serviceOrder.listCommissionPayments.queryOptions({}),
  );

  const totalPaid =
    payments
      ?.filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.totalCommissionInCents, 0) ?? 0;

  const totalPending =
    payments
      ?.filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.totalCommissionInCents, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Relatório de Comissões
        </h1>
        <p className="text-muted-foreground">Resumo das suas comissões</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Total Recebido
            </CardTitle>
            <CardDescription>Comissões já pagas</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-40" />
            ) : (
              <p className="text-3xl font-bold">{formatPrice(totalPaid)}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />A Receber
            </CardTitle>
            <CardDescription>Comissões pendentes de pagamento</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-40" />
            ) : (
              <p className="text-3xl font-bold">{formatPrice(totalPending)}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Comissões</CardTitle>
          <CardDescription>Todas as suas comissões geradas</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          {isLoading ? (
            <div className="space-y-2 px-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !payments?.length ? (
            <p className="px-4 text-muted-foreground">
              Nenhuma comissão encontrada.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Período</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-4">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="pl-4 text-sm">
                      {formatDate(p.periodFrom)} → {formatDate(p.periodTo)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[p.status] ?? "outline"}>
                        {STATUS_LABELS[p.status] ?? p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium pr-4">
                      {formatPrice(p.totalCommissionInCents)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell className="pl-4" colSpan={2}>
                    Total Geral
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    {formatPrice(
                      payments.reduce(
                        (s, p) => s + p.totalCommissionInCents,
                        0,
                      ),
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Admin Reports View ──────────────────────────────────────────────────────

function AdminReportsView() {
  const trpc = useTRPC();
  const defaultRange = getDefaultDateRange();

  const [fromStr, setFromStr] = useState(toDatetimeLocal(defaultRange.from));
  const [toStr, setToStr] = useState(toDatetimeLocal(defaultRange.to));
  const [dateRange, setDateRange] = useState({
    from: defaultRange.from,
    to: defaultRange.to,
  });

  function handleSearch() {
    setDateRange({
      from: new Date(fromStr),
      to: new Date(toStr),
    });
  }

  const { data: totalInvoiced, isLoading: loadingTotal } = useQuery(
    trpc.serviceOrder.reportTotalInvoiced.queryOptions(dateRange),
  );

  const { data: averageTicket, isLoading: loadingAvgTicket } = useQuery(
    trpc.serviceOrder.reportAverageTicket.queryOptions(dateRange),
  );

  const { data: byPaymentMethod, isLoading: loadingPayment } = useQuery(
    trpc.serviceOrder.reportByPaymentMethod.queryOptions(dateRange),
  );

  const { data: byProfessional, isLoading: loadingProfessional } = useQuery(
    trpc.serviceOrder.reportByProfessional.queryOptions(dateRange),
  );

  const { data: byProduct, isLoading: loadingProduct } = useQuery(
    trpc.serviceOrder.reportByProduct.queryOptions(dateRange),
  );

  const { data: byService, isLoading: loadingService } = useQuery(
    trpc.serviceOrder.reportByService.queryOptions(dateRange),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">
          Relatórios de faturamento por período
        </p>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label>De</Label>
              <Input
                type="datetime-local"
                value={fromStr}
                onChange={(e) => setFromStr(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Até</Label>
              <Input
                type="datetime-local"
                value={toStr}
                onChange={(e) => setToStr(e.target.value)}
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Total Invoiced */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Total Faturado
            </CardTitle>
            <CardDescription>
              Soma de todos os itens de ordens concluídas no período
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingTotal ? (
              <Skeleton className="h-10 w-40" />
            ) : (
              <p className="text-3xl font-bold">
                {formatPrice(totalInvoiced?.totalInCents ?? 0)}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Average Ticket */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Ticket Médio
            </CardTitle>
            <CardDescription>
              Valor médio por ordem concluída no período
              {averageTicket?.completedOrders != null &&
                ` (${averageTicket.completedOrders} ordem${averageTicket.completedOrders !== 1 ? "s" : ""})`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingAvgTicket ? (
              <Skeleton className="h-10 w-40" />
            ) : (
              <p className="text-3xl font-bold">
                {formatPrice(averageTicket?.averageTicketInCents ?? 0)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payment-method">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="payment-method">Forma de Pagamento</TabsTrigger>
          <TabsTrigger value="professional">Profissional</TabsTrigger>
          <TabsTrigger value="product">Produto</TabsTrigger>
          <TabsTrigger value="service">Serviço</TabsTrigger>
        </TabsList>

        {/* By Payment Method */}
        <TabsContent value="payment-method">
          <Card>
            <CardHeader>
              <CardTitle>Total Recebido por Forma de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPayment ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : !byPaymentMethod?.length ? (
                <p className="text-muted-foreground">
                  Nenhum pagamento encontrado no período.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Forma de Pagamento</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {byPaymentMethod.map((row) => (
                      <TableRow key={row.paymentMethodId}>
                        <TableCell>{row.paymentMethodName}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatPrice(row.totalInCents)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">
                        {formatPrice(
                          byPaymentMethod.reduce(
                            (s, r) => s + r.totalInCents,
                            0,
                          ),
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Professional */}
        <TabsContent value="professional">
          <Card>
            <CardHeader>
              <CardTitle>Total Faturado por Profissional</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingProfessional ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : !byProfessional?.length ? (
                <p className="text-muted-foreground">
                  Nenhum dado encontrado no período.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profissional</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {byProfessional.map((row) => (
                      <TableRow key={row.professionalId}>
                        <TableCell>{row.professionalName}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatPrice(row.totalInCents)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">
                        {formatPrice(
                          byProfessional.reduce(
                            (s, r) => s + r.totalInCents,
                            0,
                          ),
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Product */}
        <TabsContent value="product">
          <Card>
            <CardHeader>
              <CardTitle>Total Faturado por Produto</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingProduct ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : !byProduct?.length ? (
                <p className="text-muted-foreground">
                  Nenhum produto encontrado no período.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {byProduct.map((row) => (
                      <TableRow key={row.referenceId ?? row.name}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatPrice(row.totalInCents)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">
                        {formatPrice(
                          byProduct.reduce((s, r) => s + r.totalInCents, 0),
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Service */}
        <TabsContent value="service">
          <Card>
            <CardHeader>
              <CardTitle>Total Faturado por Serviço</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingService ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : !byService?.length ? (
                <p className="text-muted-foreground">
                  Nenhum serviço encontrado no período.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serviço</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {byService.map((row) => (
                      <TableRow key={row.referenceId ?? row.name}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatPrice(row.totalInCents)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">
                        {formatPrice(
                          byService.reduce((s, r) => s + r.totalInCents, 0),
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

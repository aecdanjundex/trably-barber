"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import {
  Wallet,
  Plus,
  Eye,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

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

function formatPercentage(basisPoints: number) {
  return `${(basisPoints / 100).toFixed(2)}%`;
}

function toDatetimeLocal(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getDefaultDateRange() {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { from, to };
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

export default function PagamentoComissoesPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [professionalFilter, setProfessionalFilter] = useState<string>("all");
  const [generateOpen, setGenerateOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  // Generate form
  const defaultRange = getDefaultDateRange();
  const [genProfessionalId, setGenProfessionalId] = useState("");
  const [genFrom, setGenFrom] = useState(toDatetimeLocal(defaultRange.from));
  const [genTo, setGenTo] = useState(toDatetimeLocal(defaultRange.to));

  const { data: activeMember } = useQuery({
    queryKey: ["active-member"],
    queryFn: async () => {
      const result = await authClient.organization.getActiveMember();
      return result.data;
    },
  });

  const isBarber = activeMember?.role === "barber";

  const { data: org } = useQuery({
    queryKey: ["active-organization"],
    queryFn: async () => {
      const result = await authClient.organization.getFullOrganization();
      return result.data;
    },
  });

  const members = org?.members ?? [];

  const { data: payments, isLoading } = useQuery(
    trpc.serviceOrder.listCommissionPayments.queryOptions({
      ...(statusFilter !== "all" && { status: statusFilter }),
      ...(professionalFilter !== "all" && {
        professionalId: professionalFilter,
      }),
    }),
  );

  const { data: detail, isLoading: loadingDetail } = useQuery({
    ...trpc.serviceOrder.getCommissionPayment.queryOptions({
      id: detailId ?? "",
    }),
    enabled: !!detailId,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: trpc.serviceOrder.listCommissionPayments.queryKey(),
    });

  const generateMutation = useMutation(
    trpc.serviceOrder.generateCommissionPayment.mutationOptions({
      onSuccess: () => {
        invalidate();
        setGenerateOpen(false);
      },
    }),
  );

  const updateStatusMutation = useMutation(
    trpc.serviceOrder.updateCommissionPaymentStatus.mutationOptions({
      onSuccess: () => {
        invalidate();
        if (detailId) {
          queryClient.invalidateQueries({
            queryKey: trpc.serviceOrder.getCommissionPayment.queryKey(),
          });
        }
      },
    }),
  );

  function handleGenerate() {
    if (!genProfessionalId) return;
    generateMutation.mutate({
      professionalId: genProfessionalId,
      periodFrom: new Date(genFrom),
      periodTo: new Date(genTo),
    });
  }

  // Detail view
  if (detailId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setDetailId(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Detalhes da Comissão
          </h1>
        </div>

        {loadingDetail ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-60 w-full" />
          </div>
        ) : !detail ? (
          <p className="text-muted-foreground">Registro não encontrado.</p>
        ) : (
          <>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{detail.professionalName}</CardTitle>
                    <CardDescription>
                      Período: {formatDate(detail.periodFrom)} até{" "}
                      {formatDate(detail.periodTo)}
                    </CardDescription>
                  </div>
                  <Badge variant={STATUS_VARIANTS[detail.status] ?? "outline"}>
                    {STATUS_LABELS[detail.status] ?? detail.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">
                    {formatPrice(detail.totalCommissionInCents)}
                  </p>
                  {!isBarber && detail.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          updateStatusMutation.mutate({
                            id: detail.id,
                            status: "paid",
                          })
                        }
                        disabled={updateStatusMutation.isPending}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Marcar como Pago
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          updateStatusMutation.mutate({
                            id: detail.id,
                            status: "cancelled",
                          })
                        }
                        disabled={updateStatusMutation.isPending}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
                {detail.paidAt && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Pago em: {formatDate(detail.paidAt)}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Itens</CardTitle>
                <CardDescription>
                  Serviços e produtos incluídos nesta comissão
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-4">Tipo</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Qtd</TableHead>
                      <TableHead>Valor Unitário</TableHead>
                      <TableHead>Comissão</TableHead>
                      <TableHead className="pr-4">Valor Comissão</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detail.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="pl-4">
                          <Badge variant="outline">
                            {item.referenceType === "service"
                              ? "Serviço"
                              : "Produto"}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(item.unitPriceInCents)}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.commissionType === "fixed"
                            ? formatPrice(item.fixedValueInCents ?? 0)
                            : formatPercentage(item.percentageValue ?? 0)}
                        </TableCell>
                        <TableCell className="text-right font-medium pr-4">
                          {formatPrice(item.commissionAmountInCents)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Pagamento de Comissões
          </h1>
          <p className="text-muted-foreground">
            {isBarber
              ? "Visualize seus pagamentos de comissões"
              : "Gerencie pagamentos de comissões dos profissionais"}
          </p>
        </div>
        {!isBarber && (
          <Button onClick={() => setGenerateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Gerar Comissão
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="w-48">
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v ?? "all")}
          >
            <SelectTrigger>
              <SelectValue>
                {statusFilter === "all"
                  ? "Todos"
                  : (STATUS_LABELS[statusFilter] ?? statusFilter)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pending">A Pagar</SelectItem>
              <SelectItem value="paid">Pago</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {!isBarber && (
          <div className="w-48">
            <Select
              value={professionalFilter}
              onValueChange={(v) => setProfessionalFilter(v ?? "all")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Profissional">
                  {professionalFilter === "all"
                    ? "Todos"
                    : (members.find((m) => m.userId === professionalFilter)
                        ?.user.name ?? professionalFilter)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {members.map((m) => (
                  <SelectItem key={m.userId} value={m.userId}>
                    {m.user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !payments?.length ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhum pagamento de comissão encontrado.
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profissional</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.professionalName}</TableCell>
                  <TableCell className="text-sm">
                    {formatDate(p.periodFrom)} → {formatDate(p.periodTo)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANTS[p.status] ?? "outline"}>
                      {STATUS_LABELS[p.status] ?? p.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatPrice(p.totalCommissionInCents)}</TableCell>
                  <TableCell>
                    <div className="flex justify-start gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDetailId(p.id)}
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!isBarber && p.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: p.id,
                                status: "paid",
                              })
                            }
                            title="Marcar como pago"
                            disabled={updateStatusMutation.isPending}
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: p.id,
                                status: "cancelled",
                              })
                            }
                            title="Cancelar"
                            disabled={updateStatusMutation.isPending}
                          >
                            <XCircle className="h-4 w-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Generate Dialog */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerar Pagamento de Comissão</DialogTitle>
            <DialogDescription>
              Selecione o profissional e o período para gerar o pagamento de
              comissão com base nas ordens de serviço concluídas.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Profissional</Label>
              <Select
                value={genProfessionalId}
                onValueChange={(v) => setGenProfessionalId(v ?? "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o profissional">
                    {genProfessionalId
                      ? (members.find((m) => m.userId === genProfessionalId)
                          ?.user.name ?? genProfessionalId)
                      : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {members.map((m) => (
                    <SelectItem key={m.userId} value={m.userId}>
                      {m.user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>De</Label>
              <Input
                type="datetime-local"
                value={genFrom}
                onChange={(e) => setGenFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Até</Label>
              <Input
                type="datetime-local"
                value={genTo}
                onChange={(e) => setGenTo(e.target.value)}
              />
            </div>
          </div>
          {generateMutation.error && (
            <p className="text-sm text-destructive">
              {generateMutation.error.message}
            </p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setGenerateOpen(false)}
              disabled={generateMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!genProfessionalId || generateMutation.isPending}
            >
              {generateMutation.isPending ? "Gerando..." : "Gerar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

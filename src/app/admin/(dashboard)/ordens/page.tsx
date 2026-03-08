"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Eye,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useRouter } from "next/navigation";

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

const STATUS_LABELS: Record<string, string> = {
  open: "Aberta",
  completed: "Concluída",
  cancelled: "Cancelada",
};

const STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  open: "default",
  completed: "secondary",
  cancelled: "destructive",
};

export default function OrdensServicoPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: orders, isLoading } = useQuery(
    trpc.serviceOrder.listServiceOrders.queryOptions(
      statusFilter !== "all" ? { status: statusFilter } : undefined,
    ),
  );

  const createMutation = useMutation(
    trpc.serviceOrder.createServiceOrder.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: trpc.serviceOrder.listServiceOrders.queryKey(),
        });
        router.push(`/admin/ordens/${data.id}`);
      },
    }),
  );

  function handleNew() {
    createMutation.mutate({});
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Ordens de Serviço
          </h1>
          <p className="text-muted-foreground">
            Gerencie ordens de serviço dos seus clientes
          </p>
        </div>
        <Button onClick={handleNew} disabled={createMutation.isPending}>
          <Plus className="mr-2 h-4 w-4" />
          {createMutation.isPending ? "Criando..." : "Nova Ordem"}
        </Button>
      </div>

      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="open">Abertas</SelectItem>
            <SelectItem value="completed">Concluídas</SelectItem>
            <SelectItem value="cancelled">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : !orders?.length ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <p className="text-muted-foreground">
            Nenhuma ordem de serviço encontrada
          </p>
          <Button variant="outline" className="mt-4" onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" />
            Criar primeira ordem
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Total Faturado</TableHead>
                <TableHead>Total Recebido</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-16">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="text-sm">
                    {formatDate(o.createdAt)}
                  </TableCell>
                  <TableCell>
                    {o.customerName ?? (
                      <span className="text-muted-foreground">
                        Sem cliente
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{o.items.length}</TableCell>
                  <TableCell>{formatPrice(o.totalInCents)}</TableCell>
                  <TableCell>
                    <span
                      className={
                        o.totalPaidInCents >= o.totalInCents
                          ? "text-green-600"
                          : o.totalPaidInCents > 0
                            ? "text-yellow-600"
                            : "text-muted-foreground"
                      }
                    >
                      {formatPrice(o.totalPaidInCents)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANTS[o.status] ?? "outline"}>
                      {STATUS_LABELS[o.status] ?? o.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/admin/ordens/${o.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

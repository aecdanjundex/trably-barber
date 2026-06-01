"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Eye, ClipboardList } from "lucide-react";
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
import { useRouter, useSearchParams } from "next/navigation";

function formatCurrency(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  open: { label: "Aberta", variant: "outline" },
  in_progress: { label: "Em andamento", variant: "default" },
  completed: { label: "Concluída", variant: "secondary" },
  cancelled: { label: "Cancelada", variant: "destructive" },
};

export default function OrdensPage() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId") ?? undefined;

  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: ordersData, isLoading } = useQuery(
    trpc.serviceOrder.list.queryOptions({
      status:
        statusFilter !== "all"
          ? (statusFilter as "open" | "in_progress" | "completed" | "cancelled")
          : undefined,
      clientId,
      pageSize: 50,
    }),
  );

  const createMutation = useMutation(
    trpc.serviceOrder.create.mutationOptions({
      onSuccess: (data) => {
        qc.invalidateQueries({ queryKey: trpc.serviceOrder.list.queryKey() });
        router.push(`/admin/ordens/${data.id}`);
      },
    }),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Ordens de Serviço
          </h1>
          <p className="text-muted-foreground">
            {ordersData?.total ?? 0} ordem{(ordersData?.total ?? 0) !== 1 ? "s" : ""}
            {clientId ? " deste cliente" : ""}
          </p>
        </div>
        <Button
          onClick={() => createMutation.mutate({ items: [], clientId: clientId ?? undefined })}
          disabled={createMutation.isPending}
        >
          <Plus className="mr-2 h-4 w-4" />
          {createMutation.isPending ? "Criando…" : "Nova Ordem"}
        </Button>
      </div>

      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="open">Abertas</SelectItem>
            <SelectItem value="in_progress">Em andamento</SelectItem>
            <SelectItem value="completed">Concluídas</SelectItem>
            <SelectItem value="cancelled">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : !ordersData?.data.length ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <ClipboardList className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
          <p className="font-medium">Nenhuma ordem encontrada</p>
          <p className="text-sm text-muted-foreground">
            Crie a primeira ordem clicando em Nova Ordem
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>OS</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersData.data.map((o) => {
                const statusInfo = STATUS_LABELS[o.status] ?? {
                  label: o.status,
                  variant: "outline" as const,
                };
                return (
                  <TableRow key={o.id} className="cursor-pointer" onClick={() => router.push(`/admin/ordens/${o.id}`)}>
                    <TableCell className="font-medium">#{o.number}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(o.createdAt)}
                    </TableCell>
                    <TableCell>
                      {(o as { clientId: string | null }).clientId ? (
                        <span className="text-sm">—</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Sem cliente</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">—</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusInfo.variant}>
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/ordens/${o.id}`);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

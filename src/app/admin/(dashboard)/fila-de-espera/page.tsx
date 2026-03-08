"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Timer, Check, X, RefreshCw, Bell, Scissors } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function waitingMinutes(arrivedAt: Date): number {
  return Math.floor((Date.now() - new Date(arrivedAt).getTime()) / 60_000);
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfToday(): Date {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type PendingAction = "called" | "in_service" | "completed" | "cancelled" | "no-show" | null;

const ACTION_LABELS: Record<
  NonNullable<PendingAction>,
  { title: string; description: string; confirmLabel: string; variant?: "destructive" }
> = {
  called: {
    title: "Chamar cliente",
    description: "Chamar o cliente para atendimento?",
    confirmLabel: "Chamar",
  },
  in_service: {
    title: "Iniciar atendimento",
    description: "Deseja colocar este cliente em atendimento?",
    confirmLabel: "Iniciar",
  },
  completed: {
    title: "Marcar como concluído",
    description: "Deseja marcar este atendimento como concluído?",
    confirmLabel: "Concluído",
  },
  "no-show": {
    title: "Marcar como não compareceu",
    description: "Deseja marcar que o cliente não compareceu?",
    confirmLabel: "Confirmar",
    variant: "destructive",
  },
  cancelled: {
    title: "Cancelar atendimento",
    description: "Deseja cancelar este atendimento?",
    confirmLabel: "Cancelar",
    variant: "destructive",
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FilaDeEsperaPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const queryKey = trpc.admin.listAppointments.queryKey({
    from: startOfToday(),
    to: endOfToday(),
  });

  const { data, isLoading, dataUpdatedAt, refetch, isFetching } = useQuery({
    ...trpc.admin.listAppointments.queryOptions({
      from: startOfToday(),
      to: endOfToday(),
    }),
    refetchInterval: 30_000,
  });

  const waiting = data?.filter((a) => a.status === "waiting") ?? [];

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const updateStatus = useMutation(
    trpc.scheduling.updateAppointmentStatus.mutationOptions({
      onSuccess: invalidate,
    }),
  );
  const callCustomer = useMutation(
    trpc.scheduling.callCustomer.mutationOptions({ onSuccess: invalidate }),
  );
  const markAsInService = useMutation(
    trpc.scheduling.markAsInService.mutationOptions({ onSuccess: invalidate }),
  );

  const isPending = updateStatus.isPending || callCustomer.isPending || markAsInService.isPending;

  const lastUpdated = dataUpdatedAt
    ? new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date(dataUpdatedAt))
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fila de Espera</h1>
          <p className="text-muted-foreground">
            Clientes aguardando atendimento hoje
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Atualizado às {lastUpdated}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : waiting.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <Timer className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="font-medium">Nenhum cliente aguardando</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Os clientes aparecerão aqui quando forem marcados como "Aguardando
            atendimento"
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Barbeiro</TableHead>
                <TableHead>Chegou às</TableHead>
                <TableHead>Aguardando</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waiting
                .sort((a, b) => {
                  const at = a.arrivedAt ? new Date(a.arrivedAt).getTime() : 0;
                  const bt = b.arrivedAt ? new Date(b.arrivedAt).getTime() : 0;
                  return at - bt;
                })
                .map((apt) => {
                  const mins = apt.arrivedAt
                    ? waitingMinutes(apt.arrivedAt)
                    : null;
                  const isLong = mins !== null && mins >= 20;
                  return (
                    <WaitingRow
                      key={apt.id}
                      apt={apt}
                      mins={mins}
                      isLong={isLong}
                      isPending={isPending}
                      onCall={() =>
                        callCustomer.mutate({ appointmentId: apt.id })
                      }
                      onMarkAsInService={() =>
                        markAsInService.mutate({ appointmentId: apt.id })
                      }
                      onAction={(status) =>
                        updateStatus.mutate({ appointmentId: apt.id, status })
                      }
                    />
                  );
                })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─── Waiting Row ──────────────────────────────────────────────────────────────

function WaitingRow({
  apt,
  mins,
  isLong,
  isPending,
  onCall,
  onMarkAsInService,
  onAction,
}: {
  apt: {
    id: string;
    customerName: string;
    customerPhone: string;
    serviceName: string;
    barberName: string;
    arrivedAt: Date | null;
  };
  mins: number | null;
  isLong: boolean;
  isPending: boolean;
  onCall: () => void;
  onMarkAsInService: () => void;
  onAction: (status: "completed" | "cancelled" | "no-show") => void;
}) {
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const actionInfo = pendingAction ? ACTION_LABELS[pendingAction] : null;

  function handleConfirm() {
    if (!pendingAction) return;
    if (pendingAction === "called") onCall();
    else if (pendingAction === "in_service") onMarkAsInService();
    else onAction(pendingAction);
    setPendingAction(null);
  }

  return (
    <>
      <AlertDialog
        open={!!pendingAction}
        onOpenChange={(open) => {
          if (!open) setPendingAction(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{actionInfo?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {actionInfo?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              variant={actionInfo?.variant ?? "default"}
              onClick={handleConfirm}
            >
              {actionInfo?.confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <TableRow>
        <TableCell>
          <div className="font-medium">{apt.customerName}</div>
          <div className="text-xs text-muted-foreground">
            {apt.customerPhone}
          </div>
        </TableCell>
        <TableCell>{apt.serviceName}</TableCell>
        <TableCell>{apt.barberName}</TableCell>
        <TableCell>
          {apt.arrivedAt ? formatTime(apt.arrivedAt) : "—"}
        </TableCell>
        <TableCell>
          {mins !== null ? (
            <Badge variant={isLong ? "destructive" : "secondary"}>
              {mins} min
            </Badge>
          ) : (
            "—"
          )}
        </TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1">
            <Button
              size="sm"
              onClick={() => setPendingAction("called")}
              disabled={isPending}
            >
              <Bell className="mr-1 h-3.5 w-3.5" />
              Chamar
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setPendingAction("in_service")}
              disabled={isPending}
            >
              <Scissors className="mr-1 h-3.5 w-3.5" />
              Em atendimento
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setPendingAction("completed")}
              disabled={isPending}
            >
              <Check className="mr-1 h-3.5 w-3.5" />
              Concluído
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPendingAction("no-show")}
              disabled={isPending}
            >
              Não compareceu
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setPendingAction("cancelled")}
              disabled={isPending}
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Cancelar
            </Button>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
}

"use client";

import { useTRPC } from "@/trpc/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Check, X } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_MAP: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  scheduled: { label: "Agendado", variant: "default" },
  pending_confirmation: { label: "Aguardando confirmação", variant: "outline" },
  completed: { label: "Concluído", variant: "secondary" },
  cancelled: { label: "Cancelado", variant: "destructive" },
  "no-show": { label: "Não compareceu", variant: "outline" },
};

const TYPE_MAP: Record<string, string> = {
  regular: "Agendamento",
  squeeze_in: "Encaixe",
};

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default function AgendamentosPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: appointments, isLoading } = useQuery(
    trpc.admin.listAppointments.queryOptions(),
  );

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: trpc.admin.listAppointments.queryKey(),
    });

  const confirmSqueeze = useMutation(
    trpc.scheduling.confirmSqueezeIn.mutationOptions({ onSuccess: invalidate }),
  );
  const rejectSqueeze = useMutation(
    trpc.scheduling.rejectSqueezeIn.mutationOptions({ onSuccess: invalidate }),
  );
  const updateStatus = useMutation(
    trpc.scheduling.updateAppointmentStatus.mutationOptions({
      onSuccess: invalidate,
    }),
  );

  // Separate pending squeeze-ins for quick access
  const pendingSqueezeIns =
    appointments?.filter(
      (a) => a.type === "squeeze_in" && a.status === "pending_confirmation",
    ) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agendamentos</h1>
        <p className="text-muted-foreground">
          Acompanhe todos os agendamentos da sua barbearia
        </p>
      </div>

      {/* Pending squeeze-in alerts */}
      {pendingSqueezeIns.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-amber-600">
            Encaixes aguardando confirmação ({pendingSqueezeIns.length})
          </h2>
          {pendingSqueezeIns.map((apt) => (
            <div
              key={apt.id}
              className="flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="text-sm">
                <span className="font-medium">{apt.customerName}</span>
                {" · "}
                {apt.serviceName}
                {" · "}
                com {apt.barberName}
                {" · "}
                {formatDateTime(apt.startsAt)}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() =>
                    confirmSqueeze.mutate({ appointmentId: apt.id })
                  }
                  disabled={confirmSqueeze.isPending}
                >
                  <Check className="mr-1 h-4 w-4" />
                  Confirmar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    rejectSqueeze.mutate({ appointmentId: apt.id })
                  }
                  disabled={rejectSqueeze.isPending}
                >
                  <X className="mr-1 h-4 w-4" />
                  Recusar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : !appointments?.length ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <CalendarDays className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Barbeiro</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-36">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((apt) => {
                const status = STATUS_MAP[apt.status] ?? {
                  label: apt.status,
                  variant: "outline" as const,
                };
                const isPendingSqueeze =
                  apt.type === "squeeze_in" &&
                  apt.status === "pending_confirmation";
                return (
                  <TableRow key={apt.id}>
                    <TableCell className="font-medium">
                      {apt.customerName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {apt.customerPhone}
                    </TableCell>
                    <TableCell>{apt.serviceName}</TableCell>
                    <TableCell>{apt.barberName}</TableCell>
                    <TableCell>{formatDateTime(apt.startsAt)}</TableCell>
                    <TableCell>
                      {apt.type === "squeeze_in" ? (
                        <Badge variant="secondary">{TYPE_MAP[apt.type]}</Badge>
                      ) : (
                        (TYPE_MAP[apt.type] ?? apt.type)
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      {isPendingSqueeze ? (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              confirmSqueeze.mutate({ appointmentId: apt.id })
                            }
                            disabled={confirmSqueeze.isPending}
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              rejectSqueeze.mutate({ appointmentId: apt.id })
                            }
                            disabled={rejectSqueeze.isPending}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ) : apt.status === "scheduled" ? (
                        <Select
                          onValueChange={(val) =>
                            updateStatus.mutate({
                              appointmentId: apt.id,
                              status: val as
                                | "completed"
                                | "cancelled"
                                | "no-show",
                            })
                          }
                        >
                          <SelectTrigger className="h-8 w-28 text-xs">
                            <SelectValue placeholder="Atualizar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="completed">Concluído</SelectItem>
                            <SelectItem value="cancelled">Cancelado</SelectItem>
                            <SelectItem value="no-show">
                              Não compareceu
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : null}
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

"use client";

import { useTRPC } from "@/trpc/utils";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";
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

const STATUS_MAP: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  scheduled: { label: "Agendado", variant: "default" },
  completed: { label: "Concluído", variant: "secondary" },
  cancelled: { label: "Cancelado", variant: "destructive" },
  "no-show": { label: "Não compareceu", variant: "outline" },
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
  const { data: appointments, isLoading } = useQuery(
    trpc.admin.listAppointments.queryOptions(),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agendamentos</h1>
        <p className="text-muted-foreground">
          Acompanhe todos os agendamentos da sua barbearia
        </p>
      </div>

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
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((apt) => {
                const status = STATUS_MAP[apt.status] ?? {
                  label: apt.status,
                  variant: "outline" as const,
                };
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
                      <Badge variant={status.variant}>{status.label}</Badge>
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

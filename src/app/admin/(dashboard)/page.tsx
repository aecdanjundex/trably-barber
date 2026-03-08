"use client";

import { useState } from "react";
import { CalendarDays, Scissors, Users, Clock, DollarSign } from "lucide-react";
import { useTRPC } from "@/trpc/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { Check, X } from "lucide-react";
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

// ─── Constants ───────────────────────────────────────────────────────────────

const ORG_ADMIN_ROLES = ["owner", "admin"];

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  icon: Icon,
  loading,
  format,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  loading: boolean;
  format?: "currency";
}) {
  const display =
    format === "currency"
      ? (value / 100).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      : value;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold">{display}</div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const trpc = useTRPC();

  const { data: stats, isLoading: statsLoading } = useQuery(
    trpc.admin.getDashboardStats.queryOptions(),
  );

  const { data: activeMember } = useQuery({
    queryKey: ["active-member-dashboard"],
    queryFn: async () => {
      const result = await authClient.organization.getActiveMember();
      return result.data;
    },
  });

  const { data: orgData } = useQuery({
    queryKey: ["org-members-dashboard"],
    queryFn: async () => {
      const result = await authClient.organization.getFullOrganization();
      return result.data;
    },
  });

  const isAdmin = ORG_ADMIN_ROLES.includes(activeMember?.role ?? "");

  const barbers =
    orgData?.members?.filter(
      (m) => m.role === "barber" || m.role === "owner",
    ) ?? [];

  const [selectedBarberId, setSelectedBarberId] = useState<string>("all");

  const filterBarberId =
    isAdmin && selectedBarberId !== "all" ? selectedBarberId : undefined;

  const { data: appointments, isLoading: aptsLoading } = useQuery(
    trpc.admin.listAppointments.queryOptions({
      from: startOfToday(),
      barberId: filterBarberId,
    }),
  );

  const queryClient = useQueryClient();
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

  // Group appointments by barber
  const grouped = new Map<
    string,
    { barberName: string; appointments: NonNullable<typeof appointments> }
  >();

  for (const apt of appointments ?? []) {
    if (!grouped.has(apt.barberId)) {
      grouped.set(apt.barberId, {
        barberName: apt.barberName,
        appointments: [],
      });
    }
    grouped.get(apt.barberId)!.appointments.push(apt);
  }

  const barberGroups = Array.from(grouped.values());
  const showGrouped = isAdmin && selectedBarberId === "all";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da sua barbearia</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Agendamentos Hoje"
          value={stats?.todayAppointments ?? 0}
          icon={CalendarDays}
          loading={statsLoading}
        />
        <StatCard
          title="Total de Agendamentos"
          value={stats?.totalAppointments ?? 0}
          icon={CalendarDays}
          loading={statsLoading}
        />
        <StatCard
          title="Clientes"
          value={stats?.totalCustomers ?? 0}
          icon={Users}
          loading={statsLoading}
        />
        <StatCard
          title="Serviços Ativos"
          value={stats?.totalServices ?? 0}
          icon={Scissors}
          loading={statsLoading}
        />
        <StatCard
          title="Ticket Médio"
          value={stats?.averageTicketInCents ?? 0}
          icon={DollarSign}
          loading={statsLoading}
          format="currency"
        />
      </div>

      {/* Appointments section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">
              Agendamentos a partir de hoje
            </h2>
            <p className="text-sm text-muted-foreground">
              {aptsLoading
                ? "…"
                : `${appointments?.length ?? 0} agendamento${(appointments?.length ?? 0) !== 1 ? "s" : ""}`}
            </p>
          </div>

          {isAdmin && barbers.length > 1 && (
            <Select
              value={selectedBarberId}
              onValueChange={(v) => setSelectedBarberId(v ?? "all")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar profissional">
                  {selectedBarberId === "all"
                    ? "Todos os profissionais"
                    : (barbers.find((b) => b.userId === selectedBarberId)?.user
                        .name ?? selectedBarberId)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os profissionais</SelectItem>
                {barbers.map((b) => (
                  <SelectItem key={b.userId} value={b.userId}>
                    {b.user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {aptsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : !appointments?.length ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
            <CalendarDays className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">Nenhum agendamento futuro</p>
          </div>
        ) : showGrouped ? (
          /* Owner view: grouped by barber */
          <div className="space-y-5">
            {barberGroups.map(({ barberName, appointments: apts }) => (
              <div key={barberName} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium">{barberName}</span>
                  <span className="text-xs text-muted-foreground">
                    {apts.length} agendamento{apts.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="space-y-2">
                  {apts.map((apt) => (
                    <AppointmentRow
                      key={apt.id}
                      apt={apt}
                      onConfirm={() =>
                        confirmSqueeze.mutate({ appointmentId: apt.id })
                      }
                      onReject={() =>
                        rejectSqueeze.mutate({ appointmentId: apt.id })
                      }
                      onUpdateStatus={(status) =>
                        updateStatus.mutate({ appointmentId: apt.id, status })
                      }
                      isPending={
                        confirmSqueeze.isPending ||
                        rejectSqueeze.isPending ||
                        updateStatus.isPending
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Barber view or filtered by one barber */
          <div className="space-y-2">
            {appointments.map((apt) => (
              <AppointmentRow
                key={apt.id}
                apt={apt}
                onConfirm={() =>
                  confirmSqueeze.mutate({ appointmentId: apt.id })
                }
                onReject={() => rejectSqueeze.mutate({ appointmentId: apt.id })}
                onUpdateStatus={(status) =>
                  updateStatus.mutate({ appointmentId: apt.id, status })
                }
                isPending={
                  confirmSqueeze.isPending ||
                  rejectSqueeze.isPending ||
                  updateStatus.isPending
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Appointment Row ──────────────────────────────────────────────────────────

type Apt = {
  id: string;
  startsAt: Date;
  endsAt: Date;
  status: string;
  type: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  barberName: string;
};

type PendingAction =
  | "confirm"
  | "reject"
  | "completed"
  | "cancelled"
  | "no-show"
  | null;

const ACTION_LABELS: Record<
  NonNullable<PendingAction>,
  { title: string; description: string; confirmLabel: string; variant?: "destructive" }
> = {
  confirm: {
    title: "Confirmar encaixe",
    description: "Deseja confirmar este encaixe?",
    confirmLabel: "Confirmar",
  },
  reject: {
    title: "Recusar encaixe",
    description: "Deseja recusar este encaixe? O cliente será notificado.",
    confirmLabel: "Recusar",
    variant: "destructive",
  },
  completed: {
    title: "Marcar como concluído",
    description: "Deseja marcar este agendamento como concluído?",
    confirmLabel: "Concluído",
  },
  "no-show": {
    title: "Marcar como não compareceu",
    description: "Deseja marcar que o cliente não compareceu?",
    confirmLabel: "Confirmar",
    variant: "destructive",
  },
  cancelled: {
    title: "Cancelar agendamento",
    description: "Deseja cancelar este agendamento?",
    confirmLabel: "Cancelar",
    variant: "destructive",
  },
};

function AppointmentRow({
  apt,
  onConfirm,
  onReject,
  onUpdateStatus,
  isPending,
}: {
  apt: Apt;
  onConfirm: () => void;
  onReject: () => void;
  onUpdateStatus: (status: "completed" | "cancelled" | "no-show") => void;
  isPending: boolean;
}) {
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const status = STATUS_MAP[apt.status] ?? {
    label: apt.status,
    variant: "outline" as const,
  };
  const isPendingSqueeze =
    apt.type === "squeeze_in" && apt.status === "pending_confirmation";

  function handleConfirm() {
    if (!pendingAction) return;
    if (pendingAction === "confirm") onConfirm();
    else if (pendingAction === "reject") onReject();
    else onUpdateStatus(pendingAction);
    setPendingAction(null);
  }

  const actionInfo = pendingAction ? ACTION_LABELS[pendingAction] : null;

  return (
    <>
      <AlertDialog open={!!pendingAction} onOpenChange={(open) => { if (!open) setPendingAction(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{actionInfo?.title}</AlertDialogTitle>
            <AlertDialogDescription>{actionInfo?.description}</AlertDialogDescription>
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

      <div className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center rounded-lg bg-muted px-3 py-2 text-center">
            <span className="text-xs text-muted-foreground">
              {formatDate(apt.startsAt)}
            </span>
            <span className="text-base font-bold tabular-nums">
              {formatTime(apt.startsAt)}
            </span>
          </div>
          <div>
            <div className="font-medium">{apt.customerName}</div>
            <div className="text-sm text-muted-foreground">{apt.serviceName}</div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatTime(apt.startsAt)} – {formatTime(apt.endsAt)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={status.variant}>{status.label}</Badge>

          {isPendingSqueeze ? (
            <div className="flex gap-1">
              <Button size="sm" onClick={() => setPendingAction("confirm")} disabled={isPending}>
                <Check className="mr-1 h-3.5 w-3.5" />
                Confirmar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setPendingAction("reject")}
                disabled={isPending}
              >
                <X className="mr-1 h-3.5 w-3.5" />
                Recusar
              </Button>
            </div>
          ) : apt.status === "scheduled" ? (
            <div className="flex gap-1">
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
          ) : null}
        </div>
      </div>
    </>
  );
}

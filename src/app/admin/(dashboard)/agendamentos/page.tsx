"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  ChevronsUpDown,
} from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_MAP: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  scheduled: { label: "Agendado", variant: "default" },
  pending_confirmation: { label: "Aguardando confirmação", variant: "outline" },
  waiting: { label: "Aguardando atendimento", variant: "outline" },
  in_service: { label: "Em atendimento", variant: "secondary" },
  completed: { label: "Concluído", variant: "secondary" },
  cancelled: { label: "Cancelado", variant: "destructive" },
  "no-show": { label: "Não compareceu", variant: "outline" },
};

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const DAY_ABBR = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const ORG_ADMIN_ROLES = ["owner", "admin"];
const ORG_BARBER_ROLES = ["owner", "admin", "barber"];

// ─── Types ───────────────────────────────────────────────────────────────────

type SelectedPeriod = {
  from: Date;
  to: Date;
  label: string;
  barberId?: string;
};

type StatWithBarber = {
  barberId: string;
  barberName: string;
  date?: string;
  month?: number;
  count: number;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function toLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function groupByBarber(
  data: StatWithBarber[],
): {
  barberId: string;
  barberName: string;
  counts: Map<string | number, number>;
}[] {
  const map = new Map<
    string,
    { barberName: string; counts: Map<string | number, number> }
  >();
  for (const row of data) {
    if (!map.has(row.barberId)) {
      map.set(row.barberId, { barberName: row.barberName, counts: new Map() });
    }
    const key = row.date ?? row.month!;
    map.get(row.barberId)!.counts.set(key, row.count);
  }
  return Array.from(map.entries()).map(([barberId, v]) => ({
    barberId,
    barberName: v.barberName,
    counts: v.counts,
  }));
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AgendamentosPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<SelectedPeriod | null>(
    null,
  );
  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);

  const { data: activeMember } = useQuery({
    queryKey: ["active-member-agendamentos"],
    queryFn: async () => {
      const result = await authClient.organization.getActiveMember();
      return result.data;
    },
  });

  const isAdmin = ORG_ADMIN_ROLES.includes(activeMember?.role ?? "");
  const canBook = ORG_BARBER_ROLES.includes(activeMember?.role ?? "");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agendamentos</h1>
          <p className="text-muted-foreground">
            Acompanhe todos os agendamentos da sua barbearia
          </p>
        </div>
        {canBook && (
          <Button onClick={() => setNewAppointmentOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button>
        )}
      </div>

      <Tabs defaultValue="semana">
        <TabsList>
          <TabsTrigger value="semana">Semana</TabsTrigger>
          <TabsTrigger value="mes">Mês</TabsTrigger>
          <TabsTrigger value="ano">Ano</TabsTrigger>
        </TabsList>

        <TabsContent value="semana" className="mt-4">
          <WeekView isAdmin={isAdmin} onSelectPeriod={setSelectedPeriod} />
        </TabsContent>

        <TabsContent value="mes" className="mt-4">
          <MonthView isAdmin={isAdmin} onSelectPeriod={setSelectedPeriod} />
        </TabsContent>

        <TabsContent value="ano" className="mt-4">
          <YearView isAdmin={isAdmin} onSelectPeriod={setSelectedPeriod} />
        </TabsContent>
      </Tabs>

      <PeriodDetailDialog
        period={selectedPeriod}
        onClose={() => setSelectedPeriod(null)}
      />

      <NewAppointmentDialog
        open={newAppointmentOpen}
        onClose={() => setNewAppointmentOpen(false)}
        isAdmin={isAdmin}
        currentUserId={activeMember?.userId ?? ""}
        currentRole={activeMember?.role ?? ""}
      />
    </div>
  );
}

// ─── Period Detail Dialog ─────────────────────────────────────────────────────

function PeriodDetailDialog({
  period,
  onClose,
}: {
  period: SelectedPeriod | null;
  onClose: () => void;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    ...trpc.admin.listAppointments.queryOptions({
      from: period?.from,
      to: period?.to,
      barberId: period?.barberId,
    }),
    enabled: !!period,
  });

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
  const markAsWaiting = useMutation(
    trpc.scheduling.markAsWaiting.mutationOptions({ onSuccess: invalidate }),
  );

  const isPending =
    confirmSqueeze.isPending ||
    rejectSqueeze.isPending ||
    updateStatus.isPending ||
    markAsWaiting.isPending;

  return (
    <Dialog open={!!period} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{period?.label}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : !appointments?.length ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarDays className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">
              Nenhum agendamento neste período
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
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((apt) => (
                  <AptTableRow
                    key={apt.id}
                    apt={apt}
                    isPending={isPending}
                    onConfirm={() =>
                      confirmSqueeze.mutate({ appointmentId: apt.id })
                    }
                    onReject={() =>
                      rejectSqueeze.mutate({ appointmentId: apt.id })
                    }
                    onUpdateStatus={(status) =>
                      updateStatus.mutate({ appointmentId: apt.id, status })
                    }
                    onMarkAsWaiting={() =>
                      markAsWaiting.mutate({ appointmentId: apt.id })
                    }
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Apt Table Row ────────────────────────────────────────────────────────────

type AptTableRowPendingAction =
  | "confirm"
  | "reject"
  | "waiting"
  | "completed"
  | "cancelled"
  | "no-show"
  | null;

const APT_TABLE_ACTION_LABELS: Record<
  NonNullable<AptTableRowPendingAction>,
  { title: string; description: string; confirmLabel: string; variant?: "destructive" }
> = {
  confirm: {
    title: "Confirmar encaixe",
    description: "Deseja confirmar este encaixe?",
    confirmLabel: "Confirmar",
  },
  reject: {
    title: "Recusar encaixe",
    description: "Deseja recusar este encaixe?",
    confirmLabel: "Recusar",
    variant: "destructive",
  },
  waiting: {
    title: "Cliente chegou",
    description: "Registrar chegada do cliente e colocar na fila de espera?",
    confirmLabel: "Confirmar chegada",
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

function AptTableRow({
  apt,
  isPending,
  onConfirm,
  onReject,
  onUpdateStatus,
  onMarkAsWaiting,
}: {
  apt: {
    id: string;
    status: string;
    type: string;
    startsAt: Date;
    customerName: string;
    customerPhone: string;
    serviceName: string;
    barberName: string;
  };
  isPending: boolean;
  onConfirm: () => void;
  onReject: () => void;
  onUpdateStatus: (status: "completed" | "cancelled" | "no-show") => void;
  onMarkAsWaiting: () => void;
}) {
  const [pendingAction, setPendingAction] =
    useState<AptTableRowPendingAction>(null);

  const statusEntry = STATUS_MAP[apt.status] ?? {
    label: apt.status,
    variant: "outline" as const,
  };
  const isPendingSqueeze =
    apt.type === "squeeze_in" && apt.status === "pending_confirmation";
  const actionInfo = pendingAction ? APT_TABLE_ACTION_LABELS[pendingAction] : null;

  function handleConfirm() {
    if (!pendingAction) return;
    if (pendingAction === "confirm") onConfirm();
    else if (pendingAction === "reject") onReject();
    else if (pendingAction === "waiting") onMarkAsWaiting();
    else onUpdateStatus(pendingAction);
    setPendingAction(null);
  }

  return (
    <>
      <AlertDialog
        open={!!pendingAction}
        onOpenChange={(open) => { if (!open) setPendingAction(null); }}
      >
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

      <TableRow>
        <TableCell>
          <div className="font-medium">{apt.customerName}</div>
          <div className="text-xs text-muted-foreground">{apt.customerPhone}</div>
        </TableCell>
        <TableCell>{apt.serviceName}</TableCell>
        <TableCell>{apt.barberName}</TableCell>
        <TableCell>{formatDateTime(apt.startsAt)}</TableCell>
        <TableCell>
          <Badge variant={statusEntry.variant}>{statusEntry.label}</Badge>
        </TableCell>
        <TableCell>
          {isPendingSqueeze ? (
            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={() => setPendingAction("confirm")}
                disabled={isPending}
              >
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
            <div className="flex flex-wrap gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPendingAction("waiting")}
                disabled={isPending}
              >
                Cliente chegou
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
          ) : apt.status === "waiting" ? (
            <div className="flex flex-wrap gap-1">
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
        </TableCell>
      </TableRow>
    </>
  );
}

// ─── New Appointment Dialog ───────────────────────────────────────────────────

function NewAppointmentDialog({
  open,
  onClose,
  isAdmin,
  currentUserId,
  currentRole,
}: {
  open: boolean;
  onClose: () => void;
  isAdmin: boolean;
  currentUserId: string;
  currentRole: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [customerId, setCustomerId] = useState("");
  const [barberId, setBarberId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [notes, setNotes] = useState("");

  // Combobox open states
  const [customerOpen, setCustomerOpen] = useState(false);
  const [barberOpen, setBarberOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);

  // Search states
  const [customerSearch, setCustomerSearch] = useState("");
  const [barberSearch, setBarberSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");

  const debouncedCustomerSearch = useDebounce(customerSearch);
  const debouncedServiceSearch = useDebounce(serviceSearch);

  const { data: customers } = useQuery(
    trpc.admin.listCustomersBasic.queryOptions({ search: debouncedCustomerSearch || undefined }),
  );
  const { data: services } = useQuery(
    trpc.admin.listServicesBasic.queryOptions({ search: debouncedServiceSearch || undefined }),
  );
  const { data: orgData } = useQuery({
    queryKey: ["org-members-new-apt"],
    queryFn: async () => {
      const result = await authClient.organization.getFullOrganization();
      return result.data;
    },
    enabled: isAdmin,
  });

  const allBarbers =
    orgData?.members?.filter(
      (m) => m.role === "barber" || m.role === "owner",
    ) ?? [];

  const filteredBarbers = barberSearch
    ? allBarbers.filter((b) =>
        b.user.name.toLowerCase().includes(barberSearch.toLowerCase()),
      )
    : allBarbers;

  const effectiveBarberId = isAdmin ? barberId : currentUserId;

  const { data: slots, isLoading: slotsLoading } = useQuery({
    ...trpc.scheduling.getAvailableSlotsForOrg.queryOptions({
      barberId: effectiveBarberId,
      date,
      serviceId,
    }),
    enabled: !!effectiveBarberId && !!date && !!serviceId,
  });

  const createMutation = useMutation(
    trpc.scheduling.createAppointmentForCustomer.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.admin.listAppointments.queryKey(),
        });
        handleClose();
      },
    }),
  );

  function handleClose() {
    setCustomerId("");
    setBarberId("");
    setServiceId("");
    setDate("");
    setSlot("");
    setNotes("");
    setCustomerSearch("");
    setBarberSearch("");
    setServiceSearch("");
    onClose();
  }

  function handleSubmit() {
    if (!customerId || !effectiveBarberId || !serviceId || !date || !slot)
      return;
    const startsAt = new Date(`${date}T${slot}:00`);
    createMutation.mutate({
      customerId,
      barberId: effectiveBarberId,
      serviceId,
      startsAt,
      notes: notes || undefined,
    });
  }

  const activeCustomers = customers?.filter((c) => c.active) ?? [];
  const activeServices = services?.filter((s) => s.active) ?? [];

  const selectedCustomer = activeCustomers.find((c) => c.id === customerId);
  const selectedService = activeServices.find((s) => s.id === serviceId);
  const selectedBarber = allBarbers.find((b) => b.userId === barberId);

  const canSubmit =
    !!customerId &&
    !!effectiveBarberId &&
    !!serviceId &&
    !!date &&
    !!slot &&
    !createMutation.isPending;

  const slotsDisabledReason = !effectiveBarberId
    ? "Selecione um profissional"
    : !serviceId
      ? "Selecione um serviço"
      : !date
        ? "Selecione uma data acima"
        : null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
          <DialogDescription>
            Crie um agendamento para um cliente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer */}
          <div className="space-y-2">
            <Label>Cliente</Label>
            <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between font-normal"
                >
                  {selectedCustomer
                    ? `${selectedCustomer.name} — ${selectedCustomer.phone}`
                    : "Buscar cliente pelo nome..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Buscar por nome..."
                    value={customerSearch}
                    onValueChange={setCustomerSearch}
                  />
                  <CommandList>
                    <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                    <CommandGroup>
                      {activeCustomers.map((c) => (
                        <CommandItem
                          key={c.id}
                          value={c.id}
                          onSelect={() => {
                            setCustomerId(c.id);
                            setCustomerOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              customerId === c.id ? "opacity-100" : "opacity-0",
                            )}
                          />
                          <span className="font-medium">{c.name}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {c.phone}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Barber (admin only) */}
          {isAdmin && (
            <div className="space-y-2">
              <Label>Profissional</Label>
              <Popover open={barberOpen} onOpenChange={setBarberOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    {selectedBarber
                      ? selectedBarber.user.name
                      : "Buscar profissional pelo nome..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Buscar por nome..."
                      value={barberSearch}
                      onValueChange={setBarberSearch}
                    />
                    <CommandList>
                      <CommandEmpty>Nenhum profissional encontrado.</CommandEmpty>
                      <CommandGroup>
                        {filteredBarbers.map((b) => (
                          <CommandItem
                            key={b.userId}
                            value={b.userId}
                            onSelect={() => {
                              setBarberId(b.userId);
                              setSlot("");
                              setBarberOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                barberId === b.userId ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {b.user.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Service */}
          <div className="space-y-2">
            <Label>Serviço</Label>
            <Popover open={serviceOpen} onOpenChange={setServiceOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between font-normal"
                >
                  {selectedService
                    ? selectedService.name
                    : "Buscar serviço pelo nome..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Buscar por nome..."
                    value={serviceSearch}
                    onValueChange={setServiceSearch}
                  />
                  <CommandList>
                    <CommandEmpty>Nenhum serviço encontrado.</CommandEmpty>
                    <CommandGroup>
                      {activeServices.map((s) => (
                        <CommandItem
                          key={s.id}
                          value={s.id}
                          onSelect={() => {
                            setServiceId(s.id);
                            setSlot("");
                            setServiceOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              serviceId === s.id ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {s.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Date & Time Slot */}
          <div className="space-y-2">
            <Label>Data e Hora</Label>
            {currentRole !== "admin" ? (
              <Input
                type="datetime-local"
                value={date && slot ? `${date}T${slot}` : ""}
                onChange={(e) => {
                  const [d, t] = e.target.value.split("T");
                  setDate(d ?? "");
                  setSlot(t ? t.slice(0, 5) : "");
                }}
                min={new Date().toISOString().slice(0, 16)}
              />
            ) : (
              <>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => { setDate(e.target.value); setSlot(""); }}
                  min={new Date().toISOString().split("T")[0]}
                />
                {slotsDisabledReason ? (
                  <p className="text-sm text-muted-foreground">{slotsDisabledReason}</p>
                ) : slotsLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : !slots?.length ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhum horário disponível nesta data
                  </p>
                ) : (
                  <Select value={slot} onValueChange={(v) => setSlot(v ?? "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um horário">
                        {slot
                          ? new Intl.DateTimeFormat("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }).format(new Date(`${date}T${slot}:00`))
                          : undefined}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {slots.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Observações (opcional)</Label>
            <Input
              placeholder="Ex: Cliente prefere corte curto"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {createMutation.error && (
          <p className="text-sm text-destructive">
            {createMutation.error.message}
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button disabled={!canSubmit} onClick={handleSubmit}>
            {createMutation.isPending ? "Salvando..." : "Criar Agendamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Group Toggle ─────────────────────────────────────────────────────────────

function GroupToggle({
  grouped,
  onChange,
}: {
  grouped: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center rounded-lg border p-0.5 text-sm">
      <button
        onClick={() => onChange(false)}
        className={cn(
          "rounded-md px-3 py-1 transition-colors",
          !grouped
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        Todos
      </button>
      <button
        onClick={() => onChange(true)}
        className={cn(
          "rounded-md px-3 py-1 transition-colors",
          grouped
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        Por profissional
      </button>
    </div>
  );
}

// ─── Day Cards ────────────────────────────────────────────────────────────────

function DayCards({
  today,
  countMap,
  onSelectPeriod,
  barberId,
}: {
  today: Date;
  countMap: Map<string | number, number>;
  onSelectPeriod: (p: SelectedPeriod) => void;
  barberId?: string;
}) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i);
    const dateStr = toLocalDateStr(date);
    return {
      date,
      dateStr,
      count: (countMap.get(dateStr) as number) ?? 0,
      isToday: i === 0,
      dayName: DAY_ABBR[date.getDay()],
      dayNum: date.getDate(),
      monthName: MONTH_NAMES[date.getMonth()],
    };
  });

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
      {days.map(
        ({ date, dateStr, count, isToday, dayName, dayNum, monthName }) => (
          <button
            key={dateStr}
            onClick={() =>
              onSelectPeriod({
                from: startOfDay(date),
                to: endOfDay(date),
                label: `${dayName}, ${dayNum} de ${monthName}`,
                barberId,
              })
            }
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-xl border p-3 text-center transition-colors hover:ring-2 hover:ring-primary/50",
              isToday
                ? "border-primary bg-primary text-primary-foreground"
                : count > 0
                  ? "border-muted-foreground/20 bg-muted/40"
                  : "border-dashed bg-background",
            )}
          >
            <span
              className={cn(
                "text-xs font-medium uppercase tracking-wide",
                isToday
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground",
              )}
            >
              {dayName}
            </span>
            <span className="mt-1 text-xl font-bold leading-none">
              {dayNum}
            </span>
            <span
              className={cn(
                "mt-0.5 text-xs",
                isToday
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground",
              )}
            >
              {monthName}
            </span>
            <div
              className={cn(
                "mt-2 rounded-full px-1.5 py-0.5 text-xs font-semibold",
                isToday
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : count > 0
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground",
              )}
            >
              {count}
            </div>
          </button>
        ),
      )}
    </div>
  );
}

// ─── Month Calendar ───────────────────────────────────────────────────────────

function MonthCalendar({
  year,
  month,
  countMap,
  maxCount,
  todayStr,
  onSelectPeriod,
  barberId,
}: {
  year: number;
  month: number;
  countMap: Map<string | number, number>;
  maxCount: number;
  todayStr: string;
  onSelectPeriod: (p: SelectedPeriod) => void;
  barberId?: string;
}) {
  const startDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="grid grid-cols-7 border-b bg-muted/50">
        {DAY_ABBR.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: startDow }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="border-b border-r p-2 last:border-r-0"
          />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const dayNum = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
          const count = (countMap.get(dateStr) as number) ?? 0;
          const isToday = dateStr === todayStr;
          const intensity = count > 0 ? Math.min(count / maxCount, 1) : 0;
          const cellDate = new Date(year, month, dayNum);

          return (
            <button
              key={dateStr}
              onClick={() =>
                onSelectPeriod({
                  from: startOfDay(cellDate),
                  to: endOfDay(cellDate),
                  label: `${dayNum} de ${MONTH_NAMES[month]} de ${year}`,
                  barberId,
                })
              }
              className={cn(
                "relative flex min-h-15 cursor-pointer flex-col items-start border-b border-r p-2 text-left transition-colors last:border-r-0 hover:bg-muted/50",
                isToday && "bg-primary/5",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                  isToday
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground",
                )}
              >
                {dayNum}
              </span>
              {count > 0 && (
                <div className="mt-1 w-full">
                  <div
                    className="h-1.5 rounded-full bg-primary"
                    style={{
                      width: `${Math.max(20, intensity * 100)}%`,
                      opacity: 0.4 + intensity * 0.6,
                    }}
                  />
                  <span className="mt-1 text-xs font-semibold text-primary">
                    {count}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Month Cards ──────────────────────────────────────────────────────────────

function MonthCards({
  year,
  now,
  countMap,
  maxCount,
  onSelectPeriod,
  barberId,
}: {
  year: number;
  now: Date;
  countMap: Map<string | number, number>;
  maxCount: number;
  onSelectPeriod: (p: SelectedPeriod) => void;
  barberId?: string;
}) {
  const currentMonth = now.getMonth() + 1;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {MONTH_NAMES.map((name, i) => {
        const monthNum = i + 1;
        const count = (countMap.get(monthNum) as number) ?? 0;
        const isCurrent =
          year === now.getFullYear() && monthNum === currentMonth;
        const barWidth = count > 0 ? Math.max(15, (count / maxCount) * 100) : 0;

        return (
          <button
            key={name}
            onClick={() =>
              onSelectPeriod({
                from: startOfDay(new Date(year, i, 1)),
                to: endOfDay(new Date(year, i + 1, 0)),
                label: `${name} de ${year}`,
                barberId,
              })
            }
            className={cn(
              "flex cursor-pointer flex-col rounded-xl border p-4 text-left transition-colors hover:ring-2 hover:ring-primary/50",
              isCurrent ? "border-primary bg-primary/5" : "bg-background",
            )}
          >
            <span
              className={cn(
                "text-xs font-medium uppercase tracking-wide",
                isCurrent ? "text-primary" : "text-muted-foreground",
              )}
            >
              {name}
            </span>
            <span
              className={cn(
                "mt-2 text-3xl font-bold",
                count === 0 && "text-muted-foreground/40",
              )}
            >
              {count}
            </span>
            <span className="text-xs text-muted-foreground">
              agendamento{count !== 1 ? "s" : ""}
            </span>
            {count > 0 && (
              <div className="mt-3 h-1.5 w-full rounded-full bg-muted">
                <div
                  className="h-1.5 rounded-full bg-primary"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Week View ───────────────────────────────────────────────────────────────

function WeekView({
  isAdmin,
  onSelectPeriod,
}: {
  isAdmin: boolean;
  onSelectPeriod: (p: SelectedPeriod) => void;
}) {
  const [grouped, setGrouped] = useState(false);
  const trpc = useTRPC();
  const today = startOfDay(new Date());
  const range = { from: today, to: endOfDay(addDays(today, 6)) };

  const allQuery = useQuery(
    trpc.scheduling.getAppointmentStatsByDay.queryOptions(range),
  );
  const groupedQuery = useQuery({
    ...trpc.scheduling.getAppointmentStatsByDayPerBarber.queryOptions(range),
    enabled: isAdmin && grouped,
  });

  const allCountMap = new Map(
    allQuery.data?.map((d) => [d.date, d.count]) ?? [],
  );
  const allTotal = allQuery.data?.reduce((s, d) => s + d.count, 0) ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Próximos 7 dias ·{" "}
          <span className="font-medium text-foreground">
            {allTotal} agendamento{allTotal !== 1 ? "s" : ""} no total
          </span>
        </p>
        {isAdmin && <GroupToggle grouped={grouped} onChange={setGrouped} />}
      </div>

      {!grouped ? (
        allQuery.isLoading ? (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <DayCards
            today={today}
            countMap={allCountMap}
            onSelectPeriod={onSelectPeriod}
          />
        )
      ) : groupedQuery.isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {groupByBarber(groupedQuery.data ?? []).map(
            ({ barberId, barberName, counts }) => {
              const total = Array.from(counts.values()).reduce(
                (s, c) => s + c,
                0,
              );
              return (
                <div key={barberId} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{barberName}</span>
                    <span className="text-xs text-muted-foreground">
                      {total} agendamento{total !== 1 ? "s" : ""} na semana
                    </span>
                  </div>
                  <DayCards
                    today={today}
                    countMap={counts}
                    onSelectPeriod={onSelectPeriod}
                    barberId={barberId}
                  />
                </div>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}

// ─── Month View ───────────────────────────────────────────────────────────────

function MonthView({
  isAdmin,
  onSelectPeriod,
}: {
  isAdmin: boolean;
  onSelectPeriod: (p: SelectedPeriod) => void;
}) {
  const [grouped, setGrouped] = useState(false);
  const trpc = useTRPC();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  }

  const from = startOfDay(new Date(year, month, 1));
  const to = endOfDay(new Date(year, month + 1, 0));
  const todayStr = toLocalDateStr(new Date());

  const allQuery = useQuery(
    trpc.scheduling.getAppointmentStatsByDay.queryOptions({ from, to }),
  );
  const groupedQuery = useQuery({
    ...trpc.scheduling.getAppointmentStatsByDayPerBarber.queryOptions({
      from,
      to,
    }),
    enabled: isAdmin && grouped,
  });

  const allCountMap = new Map(
    allQuery.data?.map((d) => [d.date, d.count]) ?? [],
  );
  const allTotal = allQuery.data?.reduce((s, d) => s + d.count, 0) ?? 0;
  const allMax = Math.max(1, ...(allQuery.data?.map((d) => d.count) ?? [0]));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="w-44 text-center text-base font-semibold">
          {MONTH_NAMES[month]} {year}
        </span>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          {allQuery.isLoading
            ? "…"
            : `${allTotal} agendamento${allTotal !== 1 ? "s" : ""} no mês`}
        </span>
        {isAdmin && <GroupToggle grouped={grouped} onChange={setGrouped} />}
      </div>

      {!grouped ? (
        allQuery.isLoading ? (
          <Skeleton className="h-64 w-full rounded-xl" />
        ) : (
          <MonthCalendar
            year={year}
            month={month}
            countMap={allCountMap}
            maxCount={allMax}
            todayStr={todayStr}
            onSelectPeriod={onSelectPeriod}
          />
        )
      ) : groupedQuery.isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {groupByBarber(groupedQuery.data ?? []).map(
            ({ barberId, barberName, counts }) => {
              const total = Array.from(counts.values()).reduce(
                (s, c) => s + c,
                0,
              );
              const maxCount = Math.max(1, ...Array.from(counts.values()));
              return (
                <div key={barberId} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{barberName}</span>
                    <span className="text-xs text-muted-foreground">
                      {total} agendamento{total !== 1 ? "s" : ""} no mês
                    </span>
                  </div>
                  <MonthCalendar
                    year={year}
                    month={month}
                    countMap={counts}
                    maxCount={maxCount}
                    todayStr={todayStr}
                    onSelectPeriod={onSelectPeriod}
                    barberId={barberId}
                  />
                </div>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}

// ─── Year View ────────────────────────────────────────────────────────────────

function YearView({
  isAdmin,
  onSelectPeriod,
}: {
  isAdmin: boolean;
  onSelectPeriod: (p: SelectedPeriod) => void;
}) {
  const [grouped, setGrouped] = useState(false);
  const trpc = useTRPC();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());

  const allQuery = useQuery(
    trpc.scheduling.getAppointmentStatsByMonth.queryOptions({ year }),
  );
  const groupedQuery = useQuery({
    ...trpc.scheduling.getAppointmentStatsByMonthPerBarber.queryOptions({
      year,
    }),
    enabled: isAdmin && grouped,
  });

  const allCountMap = new Map(
    allQuery.data?.map((d) => [d.month, d.count]) ?? [],
  );
  const allTotal = allQuery.data?.reduce((s, d) => s + d.count, 0) ?? 0;
  const allMax = Math.max(1, ...(allQuery.data?.map((d) => d.count) ?? [0]));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setYear((y) => y - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="w-20 text-center text-base font-semibold">{year}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setYear((y) => y + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          {allQuery.isLoading
            ? "…"
            : `${allTotal} agendamento${allTotal !== 1 ? "s" : ""} no ano`}
        </span>
        {isAdmin && <GroupToggle grouped={grouped} onChange={setGrouped} />}
      </div>

      {!grouped ? (
        allQuery.isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <MonthCards
            year={year}
            now={now}
            countMap={allCountMap}
            maxCount={allMax}
            onSelectPeriod={onSelectPeriod}
          />
        )
      ) : groupedQuery.isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {groupByBarber(groupedQuery.data ?? []).map(
            ({ barberId, barberName, counts }) => {
              const total = Array.from(counts.values()).reduce(
                (s, c) => s + c,
                0,
              );
              const maxCount = Math.max(1, ...Array.from(counts.values()));
              return (
                <div key={barberId} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{barberName}</span>
                    <span className="text-xs text-muted-foreground">
                      {total} agendamento{total !== 1 ? "s" : ""} no ano
                    </span>
                  </div>
                  <MonthCards
                    year={year}
                    now={now}
                    countMap={counts}
                    maxCount={maxCount}
                    onSelectPeriod={onSelectPeriod}
                    barberId={barberId}
                  />
                </div>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/utils";
import { authClient } from "@/lib/auth-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock, Plus, Trash2, CalendarOff, UserX, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

const DAY_NAMES = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default function AgendaPage() {
  // Get org members (barbers) via Better Auth
  const { data: orgData } = useQuery({
    queryKey: ["org-members-agenda"],
    queryFn: async () => {
      const result = await authClient.organization.getFullOrganization();
      return result.data;
    },
  });

  const barbers =
    orgData?.members?.filter(
      (m) => m.role === "barber" || m.role === "owner",
    ) ?? [];

  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);

  // Auto-select first barber
  if (!selectedBarberId && barbers.length > 0) {
    setSelectedBarberId(barbers[0].userId);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
        <p className="text-muted-foreground">
          Configure os horários de atendimento dos profissionais
        </p>
      </div>

      {/* Barber selector */}
      {barbers.length > 1 && (
        <div className="flex items-center gap-3">
          <Label>Profissional:</Label>
          <Select
            value={selectedBarberId ?? ""}
            onValueChange={setSelectedBarberId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um profissional">
                {selectedBarberId
                  ? (barbers.find((b) => b.userId === selectedBarberId)?.user
                      .name ?? selectedBarberId)
                  : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {barbers.map((b) => (
                <SelectItem key={b.userId} value={b.userId}>
                  {b.user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedBarberId && (
        <Tabs defaultValue="horarios">
          <TabsList>
            <TabsTrigger value="horarios">
              <Clock className="mr-2 h-4 w-4" />
              Horários
            </TabsTrigger>
            <TabsTrigger value="bloqueios">
              <CalendarOff className="mr-2 h-4 w-4" />
              Bloqueios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="horarios" className="mt-4">
            <ScheduleConfigSection barberId={selectedBarberId} />
          </TabsContent>

          <TabsContent value="bloqueios" className="mt-4 space-y-6">
            <TimeBlocksSection barberId={selectedBarberId} />
            <BarberDailyBlocksSection barberId={selectedBarberId} />
            <CustomerBlocksSection barberId={selectedBarberId} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

// ─── Schedule Config Section ──────────────────────────────────────────────────

function ScheduleConfigSection({ barberId }: { barberId: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: configs, isLoading } = useQuery(
    trpc.scheduling.listScheduleConfigs.queryOptions({ barberId }),
  );

  const upsertMutation = useMutation(
    trpc.scheduling.upsertScheduleConfig.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: trpc.scheduling.listScheduleConfigs.queryKey({ barberId }),
        }),
    }),
  );

  const deleteMutation = useMutation(
    trpc.scheduling.deleteScheduleConfig.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: trpc.scheduling.listScheduleConfigs.queryKey({ barberId }),
        }),
    }),
  );

  // Build a map of existing configs by day
  const configMap = new Map<number, NonNullable<typeof configs>[number]>();
  configs?.forEach((c) => configMap.set(c.dayOfWeek, c));

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Horários de atendimento</CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure o horário de início, fim e intervalo entre agendamentos para
          cada dia da semana.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {DAY_NAMES.map((dayName, dayOfWeek) => {
          const config = configMap.get(dayOfWeek);
          return (
            <DayConfigRow
              key={`${barberId}-${dayOfWeek}`}
              dayName={dayName}
              dayOfWeek={dayOfWeek}
              barberId={barberId}
              config={config}
              isSaving={upsertMutation.isPending || deleteMutation.isPending}
              onSave={(data) => upsertMutation.mutate(data)}
              onDelete={() => deleteMutation.mutate({ barberId, dayOfWeek })}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}

interface DayConfig {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotIntervalMinutes: number;
  active: boolean;
}

function DayConfigRow({
  dayName,
  dayOfWeek,
  barberId,
  config,
  isSaving,
  onSave,
  onDelete,
}: {
  dayName: string;
  dayOfWeek: number;
  barberId: string;
  config: DayConfig | undefined;
  isSaving: boolean;
  onSave: (data: {
    barberId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotIntervalMinutes: number;
    active: boolean;
  }) => void;
  onDelete: () => void;
}) {
  const [startTime, setStartTime] = useState(config?.startTime ?? "09:00");
  const [endTime, setEndTime] = useState(config?.endTime ?? "18:00");
  const [interval, setInterval] = useState(config?.slotIntervalMinutes ?? 30);
  const [active, setActive] = useState(config?.active ?? false);
  const hasConfig = !!config;

  function handleSave() {
    onSave({
      barberId,
      dayOfWeek,
      startTime,
      endTime,
      slotIntervalMinutes: interval,
      active,
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center">
      <div className="flex w-28 items-center gap-3">
        <Switch
          checked={active}
          onCheckedChange={(checked) => {
            setActive(checked);
            // Auto-save toggle
            if (hasConfig) {
              onSave({
                barberId,
                dayOfWeek,
                startTime,
                endTime,
                slotIntervalMinutes: interval,
                active: checked,
              });
            }
          }}
        />
        <span
          className={`text-sm font-medium ${active ? "" : "text-muted-foreground"}`}
        >
          {dayName}
        </span>
      </div>

      {active && (
        <>
          <div className="flex items-center gap-2">
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-28"
            />
            <span className="text-sm text-muted-foreground">até</span>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-28"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground whitespace-nowrap">
              Intervalo:
            </Label>
            <Select
              value={String(interval)}
              onValueChange={(v) => setInterval(Number(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[15, 20, 30, 45, 60].map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    {m} min
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            size="sm"
            variant="outline"
            disabled={isSaving}
            onClick={handleSave}
          >
            Salvar
          </Button>

          {hasConfig && (
            <Button
              size="sm"
              variant="ghost"
              disabled={isSaving}
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </>
      )}
    </div>
  );
}

// ─── Confirm Delete Dialog ────────────────────────────────────────────────────

function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Remover bloqueio</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover este bloqueio? Esta ação não pode ser
            desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? "Removendo..." : "Remover"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Barber Daily Blocks Section ──────────────────────────────────────────────

function BarberDailyBlocksSection({ barberId }: { barberId: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: blocks, isLoading } = useQuery(
    trpc.scheduling.listBarberDailyBlocks.queryOptions({ barberId }),
  );

  const createMutation = useMutation(
    trpc.scheduling.createBarberDailyBlock.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.scheduling.listBarberDailyBlocks.queryKey({ barberId }),
        });
        setDialogOpen(false);
      },
    }),
  );

  const deleteMutation = useMutation(
    trpc.scheduling.deleteBarberDailyBlock.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.scheduling.listBarberDailyBlocks.queryKey({ barberId }),
        });
        setDeleteId(null);
      },
    }),
  );

  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("14:00");
  const [reason, setReason] = useState("");

  function handleCreate() {
    if (!startTime || !endTime) return;
    createMutation.mutate({ barberId, startTime, endTime, reason: reason || undefined });
  }

  function resetForm() {
    setStartTime("12:00");
    setEndTime("14:00");
    setReason("");
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Intervalos diários</CardTitle>
          <p className="text-sm text-muted-foreground">
            Horários bloqueados todos os dias (ex: horário de almoço)
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo intervalo
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !blocks?.length ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
            <Clock className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nenhum intervalo diário cadastrado
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Início</TableHead>
                  <TableHead>Fim</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead className="w-16">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blocks.map((block) => (
                  <TableRow key={block.id}>
                    <TableCell>{block.startTime}</TableCell>
                    <TableCell>{block.endTime}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {block.reason ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(block.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo intervalo diário</DialogTitle>
            <DialogDescription>
              Este horário ficará bloqueado para agendamentos todos os dias,
              independentemente do cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="daily-start">Início</Label>
                <Input
                  id="daily-start"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="daily-end">Fim</Label>
                <Input
                  id="daily-end"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="daily-reason">Motivo (opcional)</Label>
              <Input
                id="daily-reason"
                placeholder="Ex: Horário de almoço"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>
          {createMutation.error && (
            <p className="text-sm text-destructive">
              {createMutation.error.message}
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!startTime || !endTime || createMutation.isPending}
              onClick={handleCreate}
            >
              {createMutation.isPending ? "Salvando..." : "Criar intervalo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate({ id: deleteId })}
        isPending={deleteMutation.isPending}
      />
    </Card>
  );
}

// ─── Customer Blocks Section ──────────────────────────────────────────────────

const DAY_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function CustomerBlocksSection({ barberId }: { barberId: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: blocks, isLoading } = useQuery(
    trpc.scheduling.listCustomerBlocks.queryOptions({ barberId }),
  );

  const createMutation = useMutation(
    trpc.scheduling.createCustomerBlock.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.scheduling.listCustomerBlocks.queryKey({ barberId }),
        });
      },
    }),
  );

  const deleteMutation = useMutation(
    trpc.scheduling.deleteCustomerBlock.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.scheduling.listCustomerBlocks.queryKey({ barberId }),
        });
        setDeleteId(null);
      },
    }),
  );

  const [deleteId, setDeleteId] = useState<string | null>(null);

  // List filter
  const [filterName, setFilterName] = useState("");

  // Form state
  const [blockMode, setBlockMode] = useState<"weekday" | "date">("weekday");
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerOpen, setCustomerOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [blockedDate, setBlockedDate] = useState("");
  const [reason, setReason] = useState("");

  const debouncedSearch = useDebounce(customerSearch, 300);

  const { data: customers } = useQuery(
    trpc.admin.listCustomersBasic.queryOptions({ search: debouncedSearch }),
  );

  const filteredBlocks = blocks?.filter((b) =>
    filterName
      ? b.customerName.toLowerCase().includes(filterName.toLowerCase())
      : true,
  );

  function toggleDay(day: number) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }

  const isFormValid =
    !!selectedCustomerId &&
    (blockMode === "weekday" ? selectedDays.length > 0 : !!blockedDate);

  async function handleCreate() {
    if (!isFormValid) return;
    if (blockMode === "weekday") {
      for (const day of selectedDays) {
        await createMutation.mutateAsync({
          barberId,
          customerId: selectedCustomerId,
          dayOfWeek: day,
          blockedDate: null,
          reason: reason || undefined,
        });
      }
    } else {
      await createMutation.mutateAsync({
        barberId,
        customerId: selectedCustomerId,
        dayOfWeek: null,
        blockedDate,
        reason: reason || undefined,
      });
    }
    resetForm();
    setDialogOpen(false);
  }

  function resetForm() {
    setBlockMode("weekday");
    setCustomerSearch("");
    setSelectedCustomerId("");
    setSelectedCustomerName("");
    setSelectedDays([]);
    setBlockedDate("");
    setReason("");
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Bloqueios por cliente</CardTitle>
          <p className="text-sm text-muted-foreground">
            Impeça que um cliente agende em dias da semana ou datas específicas
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo bloqueio
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Search filter */}
        <Input
          placeholder="Filtrar por cliente..."
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="max-w-xs"
        />
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !filteredBlocks?.length ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
            <UserX className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {filterName
                ? "Nenhum bloqueio encontrado para este cliente"
                : "Nenhum bloqueio por cliente cadastrado"}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Restrição</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead className="w-16">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlocks.map((block) => (
                  <TableRow key={block.id}>
                    <TableCell className="font-medium">
                      {block.customerName}
                    </TableCell>
                    <TableCell>
                      {block.dayOfWeek !== null
                        ? DAY_NAMES[block.dayOfWeek]
                        : block.blockedDate
                          ? new Intl.DateTimeFormat("pt-BR").format(
                              new Date(block.blockedDate + "T12:00:00"),
                            )
                          : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {block.reason ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(block.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Create Block Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo bloqueio por cliente</DialogTitle>
            <DialogDescription>
              Selecione o cliente e defina a restrição de agendamento.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Customer selector */}
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={customerOpen}
                    className="w-full justify-between font-normal"
                  >
                    {selectedCustomerName || "Buscar cliente..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Nome ou telefone..."
                      value={customerSearch}
                      onValueChange={setCustomerSearch}
                    />
                    <CommandList>
                      <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                      <CommandGroup>
                        {customers?.map((c) => (
                          <CommandItem
                            key={c.id}
                            value={c.id}
                            onSelect={() => {
                              setSelectedCustomerId(c.id);
                              setSelectedCustomerName(c.name);
                              setCustomerOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCustomerId === c.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            <span>{c.name}</span>
                            {c.phone && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                {c.phone}
                              </span>
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Mode selector */}
            <div className="space-y-2">
              <Label>Tipo de bloqueio</Label>
              <div className="flex gap-2">
                {(
                  [
                    { value: "weekday", label: "Dia da semana" },
                    { value: "date", label: "Data específica" },
                  ] as const
                ).map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setBlockMode(value)}
                    className={cn(
                      "flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                      blockMode === value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background text-foreground hover:bg-muted",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Day of week multi-select */}
            {blockMode === "weekday" && (
              <div className="space-y-2">
                <Label>Dias da semana</Label>
                <div className="flex flex-wrap gap-2">
                  {DAY_SHORT.map((name, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleDay(idx)}
                      className={cn(
                        "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                        selectedDays.includes(idx)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-background text-foreground hover:bg-muted",
                      )}
                    >
                      {name}
                    </button>
                  ))}
                </div>
                {selectedDays.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {selectedDays.length} dia{selectedDays.length > 1 ? "s" : ""}{" "}
                    selecionado{selectedDays.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            )}

            {/* Specific date */}
            {blockMode === "date" && (
              <div className="space-y-2">
                <Label htmlFor="customer-block-date">Data</Label>
                <Input
                  id="customer-block-date"
                  type="date"
                  value={blockedDate}
                  onChange={(e) => setBlockedDate(e.target.value)}
                />
              </div>
            )}

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="customer-block-reason">Motivo (opcional)</Label>
              <Input
                id="customer-block-reason"
                placeholder="Ex: Cliente problemático"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>
          {createMutation.error && (
            <p className="text-sm text-destructive">
              {createMutation.error.message}
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!isFormValid || createMutation.isPending}
              onClick={handleCreate}
            >
              {createMutation.isPending ? "Salvando..." : "Criar bloqueio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate({ id: deleteId })}
        isPending={deleteMutation.isPending}
      />
    </Card>
  );
}

// ─── Time Blocks Section ──────────────────────────────────────────────────────

function TimeBlocksSection({ barberId }: { barberId: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: blocks, isLoading } = useQuery(
    trpc.scheduling.listBarberTimeBlocks.queryOptions({ barberId }),
  );

  const createMutation = useMutation(
    trpc.scheduling.createBarberTimeBlock.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.scheduling.listBarberTimeBlocks.queryKey({ barberId }),
        });
        setDialogOpen(false);
      },
    }),
  );

  const deleteMutation = useMutation(
    trpc.scheduling.deleteBarberTimeBlock.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.scheduling.listBarberTimeBlocks.queryKey({ barberId }),
        });
        setDeleteId(null);
      },
    }),
  );

  // Form state
  const [blockDate, setBlockDate] = useState("");
  const [blockStartTime, setBlockStartTime] = useState("08:00");
  const [blockEndTime, setBlockEndTime] = useState("18:00");
  const [blockReason, setBlockReason] = useState("");

  function handleCreate() {
    if (!blockDate) return;
    const startsAt = new Date(`${blockDate}T${blockStartTime}:00`);
    const endsAt = new Date(`${blockDate}T${blockEndTime}:00`);
    createMutation.mutate({
      barberId,
      startsAt,
      endsAt,
      reason: blockReason || undefined,
    });
  }

  function resetForm() {
    setBlockDate("");
    setBlockStartTime("08:00");
    setBlockEndTime("18:00");
    setBlockReason("");
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Bloqueios de horário</CardTitle>
          <p className="text-sm text-muted-foreground">
            Períodos em que o profissional não estará disponível
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo bloqueio
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !blocks?.length ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
            <CalendarOff className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nenhum bloqueio cadastrado
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Início</TableHead>
                  <TableHead>Fim</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead className="w-16">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blocks.map((block) => (
                  <TableRow key={block.id}>
                    <TableCell>{formatDateTime(block.startsAt)}</TableCell>
                    <TableCell>{formatDateTime(block.endsAt)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {block.reason ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(block.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Create Block Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo bloqueio de horário</DialogTitle>
            <DialogDescription>
              Defina o período em que o profissional não poderá receber
              agendamentos.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="block-date">Data</Label>
              <Input
                id="block-date"
                type="date"
                value={blockDate}
                onChange={(e) => setBlockDate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="block-start">Início</Label>
                <Input
                  id="block-start"
                  type="time"
                  value={blockStartTime}
                  onChange={(e) => setBlockStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="block-end">Fim</Label>
                <Input
                  id="block-end"
                  type="time"
                  value={blockEndTime}
                  onChange={(e) => setBlockEndTime(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="block-reason">Motivo (opcional)</Label>
              <Input
                id="block-reason"
                placeholder="Ex: Consulta médica"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
              />
            </div>
          </div>
          {createMutation.error && (
            <p className="text-sm text-destructive">
              {createMutation.error.message}
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!blockDate || createMutation.isPending}
              onClick={handleCreate}
            >
              {createMutation.isPending ? "Salvando..." : "Criar bloqueio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate({ id: deleteId })}
        isPending={deleteMutation.isPending}
      />
    </Card>
  );
}

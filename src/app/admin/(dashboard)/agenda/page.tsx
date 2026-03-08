"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/utils";
import { authClient } from "@/lib/auth-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock, Plus, Trash2, CalendarOff } from "lucide-react";
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
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Selecione um profissional" />
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

          <TabsContent value="bloqueios" className="mt-4">
            <TimeBlocksSection barberId={selectedBarberId} />
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
              key={dayOfWeek}
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
              <SelectTrigger className="w-24">
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

// ─── Time Blocks Section ──────────────────────────────────────────────────────

function TimeBlocksSection({ barberId }: { barberId: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

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
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: trpc.scheduling.listBarberTimeBlocks.queryKey({ barberId }),
        }),
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
                        onClick={() => deleteMutation.mutate({ id: block.id })}
                        disabled={deleteMutation.isPending}
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
    </Card>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  LogOut,
  Scissors,
  Package,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  CalendarCheck,
  X,
} from "lucide-react";
import { useTRPC } from "@/trpc/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";

interface Org {
  id: string;
  name: string;
  slug: string | null;
  logo: string | null;
}

interface Props {
  org: Org;
  onSignOut: () => void;
  customerName?: string;
}

const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getWeekDays() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      date: d,
      dateStr: toLocalDateStr(d),
      dayName: DAY_NAMES[d.getDay()],
      dayNum: d.getDate(),
      isToday: i === 0,
    };
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

type ViewMode = "booking" | "appointments";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  scheduled: { label: "Agendado", color: "bg-amber-400/20 text-amber-400" },
  pending_confirmation: {
    label: "Aguardando confirmação",
    color: "bg-blue-400/20 text-blue-400",
  },
  completed: { label: "Concluído", color: "bg-green-400/20 text-green-400" },
  cancelled: { label: "Cancelado", color: "bg-red-400/20 text-red-400" },
  "no-show": {
    label: "Não compareceu",
    color: "bg-zinc-400/20 text-zinc-400",
  },
};

export function BookingScreen({ org, onSignOut, customerName }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("booking");

  return viewMode === "appointments" ? (
    <MyAppointments
      org={org}
      onSignOut={onSignOut}
      onBack={() => setViewMode("booking")}
    />
  ) : (
    <BookingFlow
      org={org}
      onSignOut={onSignOut}
      onViewAppointments={() => setViewMode("appointments")}
      customerName={customerName}
    />
  );
}

// ─── Booking Flow ─────────────────────────────────────────────────────────────

function BookingFlow({
  org,
  onSignOut,
  onViewAppointments,
  customerName,
}: Props & { onViewAppointments: () => void }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const slug = org.slug ?? "";

  const { data: barbers = [], isLoading: loadingBarbers } = useQuery(
    trpc.customerBooking.getBarbers.queryOptions({ slug }),
  );
  const { data: services = [], isLoading: loadingServices } = useQuery(
    trpc.customerBooking.getServices.queryOptions({ slug }),
  );

  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  );
  const [selectedDateIdx, setSelectedDateIdx] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [squeezeInOpen, setSqueezeInOpen] = useState(false);
  const [squeezeInTime, setSqueezeInTime] = useState("");
  const [squeezeInNotes, setSqueezeInNotes] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const weekDays = useMemo(() => getWeekDays(), []);
  const selectedDate =
    selectedDateIdx !== null ? weekDays[selectedDateIdx].dateStr : null;

  // Fetch real available slots
  const canFetchSlots =
    !!selectedBarberId && !!selectedServiceId && selectedDateIdx !== null;
  const {
    data: availableSlots = [],
    isLoading: loadingSlots,
    error: slotsError,
  } = useQuery({
    ...trpc.customerBooking.getAvailableSlots.queryOptions({
      slug,
      barberId: selectedBarberId!,
      date: selectedDate!,
      serviceId: selectedServiceId!,
    }),
    enabled: canFetchSlots,
    retry: 1,
  });

  const createAppointmentMutation = useMutation(
    trpc.customerBooking.createAppointment.mutationOptions({
      onSuccess: () => {
        setConfirmOpen(false);
        setSuccessMessage("Agendamento confirmado com sucesso!");
        setSuccessOpen(true);
        resetSelections();
        queryClient.invalidateQueries({
          queryKey: trpc.customerBooking.myAppointments.queryKey(),
        });
      },
    }),
  );

  const squeezeInMutation = useMutation(
    trpc.customerBooking.requestSqueezeIn.mutationOptions({
      onSuccess: () => {
        setSqueezeInOpen(false);
        setSuccessMessage(
          "Pedido de encaixe enviado! Aguarde a confirmação do profissional.",
        );
        setSuccessOpen(true);
        resetSelections();
        queryClient.invalidateQueries({
          queryKey: trpc.customerBooking.myAppointments.queryKey(),
        });
      },
    }),
  );

  function resetSelections() {
    setSelectedBarberId(null);
    setSelectedServiceId(null);
    setSelectedDateIdx(null);
    setSelectedSlot(null);
    setNotes("");
    setSqueezeInTime("");
    setSqueezeInNotes("");
  }

  function handleConfirmBooking() {
    if (
      !selectedBarberId ||
      !selectedServiceId ||
      !selectedSlot ||
      !selectedDate
    )
      return;
    const [hours, minutes] = selectedSlot.split(":").map(Number);
    const startsAt = new Date(selectedDate + "T00:00:00");
    startsAt.setHours(hours, minutes, 0, 0);
    createAppointmentMutation.mutate({
      barberId: selectedBarberId,
      serviceId: selectedServiceId,
      startsAt,
      notes: notes || undefined,
    });
  }

  function handleSqueezeIn() {
    if (
      !selectedBarberId ||
      !selectedServiceId ||
      !squeezeInTime ||
      !selectedDate
    )
      return;
    const [hours, minutes] = squeezeInTime.split(":").map(Number);
    const startsAt = new Date(selectedDate + "T00:00:00");
    startsAt.setHours(hours, minutes, 0, 0);
    squeezeInMutation.mutate({
      barberId: selectedBarberId,
      serviceId: selectedServiceId,
      startsAt,
      notes: squeezeInNotes || undefined,
    });
  }

  const canBook =
    selectedBarberId !== null &&
    selectedServiceId !== null &&
    selectedDateIdx !== null &&
    selectedSlot !== null;
  const selectedBarber = barbers.find((b) => b.id === selectedBarberId);
  const selectedService = services.find((s) => s.id === selectedServiceId);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <Avatar className="size-10 ring-1 ring-amber-400/30">
            {org.logo && <AvatarImage src={org.logo} alt={org.name} />}
            <AvatarFallback className="bg-card text-sm font-bold text-amber-400">
              {getInitials(org.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Agendamento
            </p>
            <h1 className="text-sm font-semibold">{org.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAppointments}
            className="text-muted-foreground hover:text-foreground"
          >
            <CalendarCheck className="size-3.5" />
            Meus
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="size-3.5" />
            Sair
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <Separator />

      {/* ── Scrollable content ─────────────────────────────────────── */}
      <div className="flex-1 space-y-6 overflow-y-auto px-6 pb-40 pt-6">
        {/* Hero */}
        <div>
          {customerName && (
            <p className="mb-1 text-sm text-muted-foreground">
              Olá,{" "}
              <span className="font-medium text-foreground">
                {customerName.split(" ")[0]}
              </span>
            </p>
          )}
          <h2 className="text-2xl font-bold">
            Agende seu <span className="text-amber-400">horário</span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Escolha o profissional, data, serviço e horário.
          </p>
        </div>

        {/* ── Professionals ────────────────────────────────────────── */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <Scissors className="size-4 text-amber-400" />
              Profissional
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingBarbers ? (
              <div className="flex gap-5">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex flex-col items-center gap-2">
                    <Skeleton className="size-16 rounded-full" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                ))}
              </div>
            ) : barbers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum profissional cadastrado ainda.
              </p>
            ) : (
              <div className="flex gap-5 overflow-x-auto px-1 pb-2 pt-1">
                {barbers.map((barber) => {
                  const isSelected = selectedBarberId === barber.id;
                  return (
                    <button
                      key={barber.id}
                      onClick={() => {
                        setSelectedBarberId(barber.id);
                        setSelectedDateIdx(null);
                        setSelectedServiceId(null);
                        setSelectedSlot(null);
                      }}
                      className="flex shrink-0 cursor-pointer flex-col items-center gap-2 outline-none"
                    >
                      <Avatar
                        className={`size-16 transition-all ${
                          isSelected
                            ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-background"
                            : "ring-1 ring-border hover:ring-ring"
                        }`}
                      >
                        {barber.image && (
                          <AvatarImage src={barber.image} alt={barber.name} />
                        )}
                        <AvatarFallback
                          className={
                            isSelected
                              ? "bg-amber-400 text-base font-bold text-zinc-950"
                              : "bg-muted text-base font-bold text-muted-foreground"
                          }
                        >
                          {getInitials(barber.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`max-w-16 truncate text-xs font-medium ${
                          isSelected
                            ? "text-amber-400"
                            : "text-muted-foreground"
                        }`}
                      >
                        {barber.name.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Date strip ───────────────────────────────────────────── */}
        {selectedBarberId && (
          <Card className="border-border bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <Calendar className="size-4 text-amber-400" />
                Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {weekDays.map((day, i) => {
                  const isSelected = selectedDateIdx === i;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedDateIdx(selectedDateIdx === i ? null : i);
                        setSelectedServiceId(null);
                        setSelectedSlot(null);
                      }}
                      className={`flex shrink-0 cursor-pointer flex-col items-center rounded-xl px-4 py-3 transition-all ${
                        isSelected
                          ? "bg-amber-400 text-zinc-950"
                          : "bg-muted text-muted-foreground hover:bg-muted/70"
                      }`}
                    >
                      <span className="text-xs font-medium">{day.dayName}</span>
                      <span className="mt-1 text-lg font-bold">{day.dayNum}</span>
                      {day.isToday && (
                        <Badge
                          variant="secondary"
                          className={`mt-1 h-auto px-1.5 py-0 text-[10px] ${
                            isSelected
                              ? "bg-zinc-950/20 text-zinc-950"
                              : "bg-amber-400/20 text-amber-400"
                          }`}
                        >
                          Hoje
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Services ─────────────────────────────────────────────── */}
        {selectedBarberId && selectedDateIdx !== null && (
          <Card className="border-border bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <Package className="size-4 text-amber-400" />
                Serviço
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingServices ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((n) => (
                    <Skeleton key={n} className="h-16 w-full" />
                  ))}
                </div>
              ) : services.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum serviço disponível.
                </p>
              ) : (
                <div className="space-y-2">
                  {services.map((svc) => {
                    const isSelected = selectedServiceId === svc.id;
                    return (
                      <button
                        key={svc.id}
                        onClick={() => {
                          setSelectedServiceId(svc.id);
                          setSelectedSlot(null);
                        }}
                        className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left transition-all ${
                          isSelected
                            ? "bg-amber-400/10 ring-1 ring-amber-400"
                            : "bg-muted hover:bg-muted/70"
                        }`}
                      >
                        <div>
                          <p
                            className={`text-sm font-medium ${isSelected ? "text-amber-400" : "text-foreground"}`}
                          >
                            {svc.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {svc.durationMinutes} min
                            {svc.description ? ` · ${svc.description}` : ""}
                          </p>
                        </div>
                        <span
                          className={`text-sm font-semibold ${isSelected ? "text-amber-400" : "text-muted-foreground"}`}
                        >
                          {formatPrice(svc.priceInCents)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── Time slots ───────────────────────────────────────────── */}
        {canFetchSlots && (
          <Card className="border-border bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <Clock className="size-4 text-amber-400" />
                Horários disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSlots ? (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-10" />
                  ))}
                </div>
              ) : slotsError ? (
                <div className="space-y-2 py-4 text-center">
                  <p className="text-sm text-red-400">
                    Erro ao buscar horários. Tente novamente.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {slotsError.message}
                  </p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="space-y-4 py-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Nenhum horário disponível neste dia.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSqueezeInOpen(true)}
                    className="border-amber-400/30 text-amber-400 hover:bg-amber-400/10 hover:text-amber-300"
                  >
                    <AlertTriangle className="mr-2 size-4" />
                    Solicitar encaixe
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {availableSlots.map((time) => {
                      const isSelected = selectedSlot === time;
                      return (
                        <Button
                          key={time}
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => setSelectedSlot(time)}
                          className={
                            isSelected
                              ? "border-amber-400 bg-amber-400 font-semibold text-zinc-950 hover:bg-amber-300"
                              : undefined
                          }
                        >
                          {time}
                        </Button>
                      );
                    })}
                  </div>
                  <Separator className="my-4" />
                  <div className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSqueezeInOpen(true)}
                      className="text-muted-foreground hover:text-amber-400"
                    >
                      <AlertTriangle className="mr-2 size-3.5" />
                      Precisa de outro horário? Solicite um encaixe
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* ── Sticky book button ─────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-background via-background/95 to-transparent px-6 pb-10 pt-6">
        {canBook && selectedService && (
          <p className="mb-3 text-center text-xs text-muted-foreground">
            {selectedService.name} ·{" "}
            {selectedDate
              ? new Date(selectedDate + "T12:00:00").toLocaleDateString(
                  "pt-BR",
                  { weekday: "short", day: "2-digit", month: "short" },
                )
              : ""}{" "}
            às{" "}
            <span className="font-medium text-amber-400">{selectedSlot}</span>{" "}
            com{" "}
            <span className="text-foreground">
              {selectedBarber?.name.split(" ")[0]}
            </span>
          </p>
        )}
        <Button
          disabled={!canBook}
          onClick={() => setConfirmOpen(true)}
          className="h-12 w-full bg-amber-400 text-sm font-semibold text-zinc-950 hover:bg-amber-300"
          size="lg"
        >
          {canBook
            ? `Confirmar · ${selectedService ? formatPrice(selectedService.priceInCents) : ""}`
            : "Selecione profissional, data, serviço e horário"}
        </Button>
      </div>

      {/* ── Confirm Dialog ─────────────────────────────────────────── */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar agendamento</DialogTitle>
            <DialogDescription>
              Revise os detalhes do seu agendamento.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 rounded-lg bg-muted p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Serviço</span>
              <span className="font-medium">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Profissional</span>
              <span className="font-medium">{selectedBarber?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data</span>
              <span className="font-medium">
                {selectedDate
                  ? new Date(selectedDate + "T12:00:00").toLocaleDateString(
                      "pt-BR",
                      { day: "2-digit", month: "long", year: "numeric" },
                    )
                  : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Horário</span>
              <span className="font-medium text-amber-400">{selectedSlot}</span>
            </div>
            {selectedService && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor</span>
                <span className="font-medium">
                  {formatPrice(selectedService.priceInCents)}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">
              Observações (opcional)
            </Label>
            <Textarea
              placeholder="Alguma observação para o profissional?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          {createAppointmentMutation.error && (
            <p className="text-sm text-red-400">
              {createAppointmentMutation.error.message}
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmBooking}
              disabled={createAppointmentMutation.isPending}
              className="bg-amber-400 text-zinc-950 hover:bg-amber-300"
            >
              {createAppointmentMutation.isPending
                ? "Agendando..."
                : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Squeeze-in Dialog ──────────────────────────────────────── */}
      <Dialog open={squeezeInOpen} onOpenChange={setSqueezeInOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-400" />
              Solicitar encaixe
            </DialogTitle>
            <DialogDescription>
              Solicite um horário fora da agenda. O profissional precisará
              confirmar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Serviço</span>
                <span className="font-medium">
                  {selectedService?.name ?? "Selecione um serviço"}
                </span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="text-muted-foreground">Profissional</span>
                <span className="font-medium">
                  {selectedBarber?.name ?? "Selecione um profissional"}
                </span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="text-muted-foreground">Data</span>
                <span className="font-medium">
                  {selectedDate
                    ? new Date(selectedDate + "T12:00:00").toLocaleDateString(
                        "pt-BR",
                        { day: "2-digit", month: "long" },
                      )
                    : ""}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Horário desejado</Label>
              <Input
                type="time"
                value={squeezeInTime}
                onChange={(e) => setSqueezeInTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">
                Observações (opcional)
              </Label>
              <Textarea
                placeholder="Explique o motivo do encaixe..."
                value={squeezeInNotes}
                onChange={(e) => setSqueezeInNotes(e.target.value)}
              />
            </div>
          </div>
          {squeezeInMutation.error && (
            <p className="text-sm text-red-400">
              {squeezeInMutation.error.message}
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSqueezeInOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSqueezeIn}
              disabled={
                !selectedBarberId ||
                !selectedServiceId ||
                !squeezeInTime ||
                squeezeInMutation.isPending
              }
              className="bg-amber-400 text-zinc-950 hover:bg-amber-300"
            >
              {squeezeInMutation.isPending
                ? "Enviando..."
                : "Solicitar encaixe"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Success Dialog ─────────────────────────────────────────── */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="text-center">
          <div className="flex flex-col items-center gap-4 py-4">
            <CheckCircle2 className="size-16 text-green-400" />
            <DialogTitle className="text-xl">{successMessage}</DialogTitle>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── My Appointments ──────────────────────────────────────────────────────────

function MyAppointments({
  org,
  onSignOut,
  onBack,
}: Props & { onBack: () => void }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading } = useQuery(
    trpc.customerBooking.myAppointments.queryOptions(),
  );

  const cancelMutation = useMutation(
    trpc.customerBooking.cancelAppointment.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: trpc.customerBooking.myAppointments.queryKey(),
        }),
    }),
  );

  const [cancelId, setCancelId] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Meus agendamentos
            </p>
            <h1 className="text-sm font-semibold">{org.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="size-3.5" />
            Sair
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <Separator />

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-24" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CalendarCheck className="mb-4 size-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              Você ainda não tem agendamentos.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="mt-4"
            >
              Fazer um agendamento
            </Button>
          </div>
        ) : (
          appointments.map((apt) => {
            const statusInfo = STATUS_MAP[apt.status] ?? {
              label: apt.status,
              color: "bg-muted-foreground/20 text-muted-foreground",
            };
            const canCancel =
              apt.status === "scheduled" ||
              apt.status === "pending_confirmation";
            return (
              <div
                key={apt.id}
                className="rounded-xl border border-border bg-card/50 p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{apt.serviceName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      com {apt.barberName}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {new Date(apt.startsAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {new Date(apt.startsAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {apt.type === "squeeze_in" && (
                    <Badge
                      variant="secondary"
                      className="bg-amber-400/20 text-amber-400"
                    >
                      Encaixe
                    </Badge>
                  )}
                </div>
                {canCancel && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCancelId(apt.id)}
                    className="mt-2 text-xs text-red-400 hover:bg-red-400/10 hover:text-red-300"
                  >
                    <X className="mr-1 size-3" />
                    Cancelar
                  </Button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Cancel confirmation dialog */}
      <Dialog
        open={!!cancelId}
        onOpenChange={(open) => !open && setCancelId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar agendamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar este agendamento?
            </DialogDescription>
          </DialogHeader>
          {cancelMutation.error && (
            <p className="text-sm text-red-400">
              {cancelMutation.error.message}
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelId(null)}>
              Voltar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (cancelId)
                  cancelMutation.mutate(
                    { appointmentId: cancelId },
                    { onSuccess: () => setCancelId(null) },
                  );
              }}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? "Cancelando..." : "Sim, cancelar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

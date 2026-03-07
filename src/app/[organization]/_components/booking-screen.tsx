"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, LogOut, Scissors } from "lucide-react";
import { useTRPC } from "@/trpc/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface Org {
  id: string;
  name: string;
  slug: string | null;
  logo: string | null;
}

interface Props {
  org: Org;
  onSignOut: () => void;
}

const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function getWeekDays() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      date: d,
      dayName: DAY_NAMES[d.getDay()],
      dayNum: d.getDate(),
      isToday: i === 0,
    };
  });
}

function buildTimeSlots(barberIndex: number, dateOffset: number) {
  const bookedSet = new Set(
    [
      (barberIndex + dateOffset) % 2,
      (barberIndex + dateOffset + 3) % 18,
      7,
      12,
    ].map(String),
  );
  const slots: { time: string; available: boolean }[] = [];
  let i = 0;
  for (let h = 9; h < 18; h++) {
    for (const m of [0, 30]) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      slots.push({ time: `${hh}:${mm}`, available: !bookedSet.has(String(i)) });
      i++;
    }
  }
  return slots;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function BookingScreen({ org, onSignOut }: Props) {
  const trpc = useTRPC();
  const { data: barbers = [], isLoading: loadingBarbers } = useQuery(
    trpc.customerBooking.getBarbers.queryOptions({ slug: org.slug ?? "" }),
  );

  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const weekDays = useMemo(() => getWeekDays(), []);

  const barberIdx = barbers.findIndex((b) => b.id === selectedBarberId);
  const timeSlots = useMemo(
    () => buildTimeSlots(barberIdx < 0 ? 0 : barberIdx, selectedDateIdx),
    [barberIdx, selectedDateIdx],
  );

  const canBook = selectedBarberId !== null && selectedSlot !== null;
  const selectedBarberName = barbers
    .find((b) => b.id === selectedBarberId)
    ?.name.split(" ")[0];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <Avatar className="size-10 ring-1 ring-amber-400/30">
            {org.logo && <AvatarImage src={org.logo} alt={org.name} />}
            <AvatarFallback className="bg-zinc-900 text-sm font-bold text-amber-400">
              {getInitials(org.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-zinc-600">
              Agendamento
            </p>
            <h1 className="text-sm font-semibold text-white">{org.name}</h1>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onSignOut}
          className="text-zinc-500 hover:text-zinc-300"
        >
          <LogOut className="size-3.5" />
          Sair
        </Button>
      </header>

      <Separator className="bg-zinc-800" />

      {/* ── Scrollable content ───────────────────────────────────────── */}
      <div className="flex-1 space-y-6 overflow-y-auto px-6 pb-40 pt-6">
        {/* Hero */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            Agende seu <span className="text-amber-400">horário</span>
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            Escolha o profissional, a data e o horário.
          </p>
        </div>

        {/* ── Professionals ────────────────────────────────────────── */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              <Scissors className="size-4 text-amber-400" />
              Profissional
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingBarbers ? (
              <div className="flex gap-5">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex flex-col items-center gap-2">
                    <Skeleton className="size-16 rounded-full bg-zinc-800" />
                    <Skeleton className="h-3 w-12 bg-zinc-800" />
                  </div>
                ))}
              </div>
            ) : barbers.length === 0 ? (
              <p className="text-sm text-zinc-700">
                Nenhum profissional cadastrado ainda.
              </p>
            ) : (
              <div className="flex gap-5 overflow-x-auto pb-2">
                {barbers.map((barber) => {
                  const isSelected = selectedBarberId === barber.id;
                  return (
                    <button
                      key={barber.id}
                      onClick={() => {
                        setSelectedBarberId(barber.id);
                        setSelectedSlot(null);
                      }}
                      className="flex shrink-0 flex-col items-center gap-2 outline-none"
                    >
                      <Avatar
                        className={`size-16 transition-all ${
                          isSelected
                            ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-zinc-950"
                            : "ring-1 ring-zinc-700 hover:ring-zinc-500"
                        }`}
                      >
                        {barber.image && (
                          <AvatarImage src={barber.image} alt={barber.name} />
                        )}
                        <AvatarFallback
                          className={
                            isSelected
                              ? "bg-amber-400 text-base font-bold text-zinc-950"
                              : "bg-zinc-800 text-base font-bold text-zinc-400"
                          }
                        >
                          {getInitials(barber.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`max-w-16 truncate text-xs font-medium ${
                          isSelected ? "text-amber-400" : "text-zinc-500"
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
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
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
                      setSelectedDateIdx(i);
                      setSelectedSlot(null);
                    }}
                    className={`flex shrink-0 flex-col items-center rounded-xl px-4 py-3 transition-all ${
                      isSelected
                        ? "bg-amber-400 text-zinc-950"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
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

        {/* ── Time slots ───────────────────────────────────────────── */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              <Clock className="size-4 text-amber-400" />
              Horários disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {timeSlots.map((slot) => {
                const isSelected = selectedSlot === slot.time;
                return (
                  <Button
                    key={slot.time}
                    variant={isSelected ? "default" : "outline"}
                    disabled={!slot.available}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={
                      !slot.available
                        ? "border-zinc-800/50 bg-zinc-900/30 text-zinc-800 line-through hover:bg-zinc-900/30"
                        : isSelected
                          ? "border-amber-400 bg-amber-400 font-semibold text-zinc-950 hover:bg-amber-300"
                          : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                    }
                  >
                    {slot.time}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Sticky book button ───────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-zinc-950 via-zinc-950/95 to-transparent px-6 pb-10 pt-6">
        {canBook && (
          <p className="mb-3 text-center text-xs text-zinc-500">
            {weekDays[selectedDateIdx].dayName},{" "}
            {weekDays[selectedDateIdx].date.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
            })}{" "}
            às{" "}
            <span className="font-medium text-amber-400">{selectedSlot}</span>{" "}
            com <span className="text-zinc-300">{selectedBarberName}</span>
          </p>
        )}
        <Button
          disabled={!canBook}
          className="h-12 w-full bg-amber-400 text-sm font-semibold text-zinc-950 hover:bg-amber-300"
          size="lg"
        >
          {canBook
            ? "Confirmar agendamento"
            : "Selecione profissional e horário"}
        </Button>
      </div>
    </div>
  );
}

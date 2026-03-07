"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Scissors } from "lucide-react";
import { useTRPC } from "@/trpc/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Org {
  id: string;
  name: string;
  slug: string | null;
  logo: string | null;
}

interface Props {
  org: Org;
  onOtpSent: (phone: string) => void;
}

/** Formats numeric digits as (11) 9 9999-9999 */
function formatPhone(digits: string): string {
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 11)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function AuthScreen({ org, onOtpSent }: Props) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const trpc = useTRPC();
  const requestOtp = useMutation(
    trpc.customerAuth.requestOtp.mutationOptions(),
  );

  const rawDigits = phone.replace(/\D/g, "");
  const isValid = rawDigits.length >= 10;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isValid) {
      setError("Informe um número de telefone válido com DDD.");
      return;
    }

    try {
      const fullPhone = `+55${rawDigits}`;
      await requestOtp.mutateAsync({ slug: org.slug ?? "", phone: fullPhone });
      onOtpSent(fullPhone);
    } catch {
      setError("Não foi possível enviar o código. Tente novamente.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6">
      <Card className="w-full max-w-sm border-zinc-800 bg-zinc-900/50">
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="mb-2 size-20 ring-2 ring-amber-400/30">
            {org.logo && <AvatarImage src={org.logo} alt={org.name} />}
            <AvatarFallback className="bg-zinc-800 text-2xl font-bold text-amber-400">
              {getInitials(org.name)}
            </AvatarFallback>
          </Avatar>
          <Badge
            variant="outline"
            className="border-amber-400/30 text-amber-400/60"
          >
            <Scissors className="size-3" />
            Barbearia
          </Badge>
          <CardTitle className="mt-2 text-2xl text-white">{org.name}</CardTitle>
          <CardDescription className="text-zinc-500">
            Entre para agendar seu horário
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-xs uppercase tracking-widest text-zinc-500"
              >
                Telefone
              </Label>
              <div className="flex overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 transition-all focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                <span className="flex items-center border-r border-zinc-800 px-3 text-sm font-medium text-zinc-500">
                  +55
                </span>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="(11) 9 9999-9999"
                  value={phone}
                  onChange={(e) =>
                    setPhone(formatPhone(e.target.value.replace(/\D/g, "")))
                  }
                  className="h-11 rounded-none border-0 bg-transparent text-white ring-0 focus-visible:ring-0 focus-visible:border-transparent"
                />
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>

            <Button
              type="submit"
              disabled={!isValid || requestOtp.isPending}
              className="h-11 w-full rounded-lg bg-amber-400 text-sm font-semibold text-zinc-950 hover:bg-amber-300"
              size="lg"
            >
              {requestOtp.isPending ? "Enviando..." : "Receber código SMS"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
